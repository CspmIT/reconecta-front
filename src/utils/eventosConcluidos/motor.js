/*
 * Reconecta — Motor de eventos concluidos (MVP) — módulo ES
 * ------------------------------------------------
 * Entrada : filas crudas del log DNP3 ya mapeadas a id_event_influx
 *           { ts: Date|string|number, version: 2|4|5, id: number, equipo?: string }
 * Salida  : eventos concluidos
 *           { equipo, version, inicio, fin, veredicto, detalle, severidad(1..4), categoria,
 *             provisional, crudos: [...filas con su entrada de catálogo] }
 *
 * Pipeline: ordenar → encadenar por gap (≤ 2 s con el anterior) → resolver estado final de
 * cada señal dentro del paquete → aplicar reglas por versión → post-proceso (pickups).
 *
 * Severidad sigue la escala del header de Reconecta: 1 rojo, 2 naranja, 3 amarillo, 4 neutro.
 */

  let CATALOGO = {};
  /** Carga el catálogo normalizado (catalogo.json). Llamar una vez al iniciar la app. */
  export function setCatalogo(c) { CATALOGO = c || {}; }
  const CAT = () => CATALOGO;

  // -------------------------------------------------------------- utilidades
  const toMs = (ts) => (ts instanceof Date ? ts.getTime() : typeof ts === 'number' ? ts : Date.parse(ts));

  const FASE_ES = { A: 'fase A', B: 'fase B', C: 'fase C', N: 'neutro' };

  const ELEM = {
    OC: 'sobrecorriente de fase', EF: 'falla a tierra', SEF: 'falla a tierra sensible',
    NPS: 'secuencia negativa', UV: 'subtensión', OV: 'sobretensión', UF: 'subfrecuencia',
    OF: 'sobrefrecuencia', Yn: 'admitancia', 'I2/I1': 'desbalance I2/I1',
    OCLL: 'sobrecorriente de fase (línea viva)', NPSLL: 'secuencia negativa (línea viva)',
    EFLL: 'falla a tierra (línea viva)', SEFLL: 'falla a tierra sensible (línea viva)',
    LSD: 'pérdida de suministro', ROCOF: 'variación de frecuencia (ROCOF)', VVS: 'salto de vector',
    PDOP: 'sobrepotencia direccional', PDUP: 'subpotencia direccional', CBF: 'falla de interruptor',
    'UV4 Sag': 'hueco de tensión (Sag)', 'UV4 Sag Mid': 'hueco de tensión (Sag, punto medio)',
    'Any HRM': 'armónicos', Prot: 'protección',
  };
  const GENERICOS = new Set(['Prot', 'OC', 'EF', 'SEF', 'NPS', 'UV', 'OV', 'Any', 'Any HRM', 'Pickup']);
  const COMANDOS = new Set(['Remote', 'SCADA', 'IO', 'Local', 'Logic', 'HMI', 'PC', 'Manual']);
  const PRIORIDAD_CMD = ['SCADA', 'HMI', 'PC', 'IO', 'Logic', 'Local', 'Manual', 'Remote']; // 'Remote' es el modo, no la fuente
  const elegirComando = (lista) => PRIORIDAD_CMD.find((c) => lista.includes(c));
  const COMANDO_ES = { Remote: 'remoto', SCADA: 'SCADA (Reconecta)', IO: 'entrada digital', Local: 'local',
    Logic: 'lógica programada', HMI: 'panel HMI', PC: 'PC de configuración', Manual: 'manual (sin origen detectado)' };
  const AUTOMATISMOS = new Set(['LSRM', 'ABR AutoOpen', 'ACO', 'Sectionaliser', 'AR', 'AR OC/NPS/EF/SEF', 'AR VE',
    'ABR', 'UV3 AutoClose', 'Auto-Sync']);
  const AUTOM_ES = { LSRM: 'LSRM', 'ABR AutoOpen': 'ABR (apertura automática)', ACO: 'transferencia automática (ACO)',
    Sectionaliser: 'modo seccionalizador', AR: 'recierre automático', 'AR OC/NPS/EF/SEF': 'recierre automático',
    'AR VE': 'recierre por tensión (AR VE)', ABR: 'restauración por retroalimentación (ABR)',
    'UV3 AutoClose': 'cierre automático UV3', 'Auto-Sync': 'sincronización automática' };

  /** "OC1+" → "sobrecorriente de fase OC1+ (etapa 1, directa)" */
  function descElemento(e) {
    if (!e) return '';
    if (/^Ph[ABCN]$/.test(e)) return FASE_ES[e[2]];
    if (/^U(abc|rst|a|b|c|r|s|t)/.test(e)) return 'tensión ' + e;
    const m = e.match(/^([A-Za-z\/ ]+?)(\d*)([+-]?)$/);
    if (!m) return ELEM[e] || e;
    const base = m[1].trim(), etapa = m[2], dir = m[3];
    const nombre = ELEM[base] || ELEM[e] || base;
    const extras = [];
    if (etapa) extras.push('etapa ' + etapa);
    if (dir === '+') extras.push('directa');
    if (dir === '-') extras.push('inversa');
    return nombre + ' ' + e + (extras.length ? ' (' + extras.join(', ') + ')' : '');
  }

  /** Elige los elementos más específicos: descarta agregadores si hay uno concreto. */
  function especificos(elems) {
    const set = Array.from(new Set(elems.filter(Boolean)));
    const concretos = set.filter((e) => !GENERICOS.has(e));
    return concretos.length ? concretos : set;
  }

  // ------------------------------------------------------------ agrupamiento
  function agrupar(filas, gapSeg) {
    const gap = (gapSeg == null ? 2 : gapSeg) * 1000;
    const ordenadas = filas.map((f) => ({ ...f, _ms: toMs(f.ts) })).sort((a, b) => a._ms - b._ms);
    const grupos = [];
    let actual = null;
    for (const f of ordenadas) {
      if (!actual || f._ms - actual[actual.length - 1]._ms > gap) { actual = []; grupos.push(actual); }
      actual.push(f);
    }
    return grupos;
  }

  /** Estado final por señal dentro del paquete + accesos rápidos. */
  function resolver(grupo, version) {
    const cat = CAT()[String(version)] || {};
    const S = new Map();     // senal → {estado, entradas[], rol, elemento, fase, oscilo}
    const eventos = [];      // Cooper F5: registros autocontenidos (tipo Event)
    const crudos = [];
    let ultimaPos = null;   // último cambio de posición dentro del paquete (para disparo+recierre rápido)
    // Duplicados: el orden dentro de un mismo segundo no es confiable, así que no se mira la secuencia sino el conteo.
    // Una señal binaria solo puede repetir un estado si en el medio pasó por el opuesto: el estado x admite count(¬x)+1 apariciones.
    let duplicados = 0;
    const conteo = new Map();
    for (const f of grupo) { const c = cat[String(f.id)]; if (c && c.estado != null) { const k = c.senal + '|' + c.estado; conteo.set(k, (conteo.get(k) || 0) + 1); } }
    const admitidos = new Map();
    for (const f of grupo) {
      const c = cat[String(f.id)];
      if (c && c.estado != null) {
        const k = c.senal + '|' + c.estado, kOp = c.senal + '|' + (1 - c.estado);
        const usados = (admitidos.get(k) || 0) + 1; admitidos.set(k, usados);
        if (usados > (conteo.get(kOp) || 0) + 1) { duplicados++; crudos.push({ ...f, cat: c, duplicado: true }); continue; }
      }
      crudos.push({ ...f, cat: c || null });
      if (!c) continue;
      if (c.rol === 'EVENTO') { eventos.push({ ...c, info: f.info || null, ms: f._ms }); continue; }
      if (c.rol === 'POSICION' && c.estado === 1 && /^(Open|Closed)(\(Any\)|\(all phases\)|\(All phases\))?$/.test(c.senal)) {
        ultimaPos = { abierto: c.senal.startsWith('Open'), ms: f._ms };
      }
      if ((c.senal === 'Recloser Open' || c.senal === 'Recloser (or A Phase) open') && c.estado === 1) ultimaPos = { abierto: true, ms: f._ms };
      if ((c.senal === 'Recloser Closed' || c.senal === 'Recloser (or A Phase) closed') && c.estado === 1) ultimaPos = { abierto: false, ms: f._ms };
      const prev = S.get(c.senal);
      if (!prev) S.set(c.senal, { estado: c.estado, entradas: [c], rol: c.rol, elemento: c.elemento, fase: c.fase, oscilo: false, vioOn: c.estado === 1, vioOff: c.estado === 0, cat: c });
      else { prev.oscilo = prev.oscilo || prev.estado !== c.estado; prev.estado = c.estado; prev.vioOn = prev.vioOn || c.estado === 1; prev.vioOff = prev.vioOff || c.estado === 0; prev.entradas.push(c); prev.cat = c; }
    }
    const on = (s) => S.has(s) && S.get(s).estado === 1;
    const off = (s) => S.has(s) && S.get(s).estado === 0;
    const conRol = (rol, estado) => Array.from(S.entries()).filter(([, v]) => v.rol === rol && (estado == null || v.estado === estado));
    return { S, eventos, crudos, on, off, conRol, ultimaPos, duplicados };
  }

  const nuevoCtx = () => ({ secuencia: { activa: false, disparos: 0 }, pickupPendiente: null, bloqueado: false, abierto: false, vistos: 0 });

  // ------------------------------------------------------- reglas RC10 (v2)
  function reglasRC10(r, ctx) {
    const { S, on, off, conRol } = r;
    const res = { categoria: null, veredicto: null, detalle: [], severidad: 4 };

    const origenesAp = conRol('ORIGEN_APERTURA', 1).map(([, v]) => v.elemento);
    const origenesCi = conRol('ORIGEN_CIERRE', 1).map(([, v]) => v.elemento);
    const abrio = on('Open(Any)') || on('Open') || on('Open(all phases)') || origenesAp.length > 0;
    const cerro = on('Closed(Any)') || on('Closed') || on('Closed(All phases)') || origenesCi.length > 0;
    const bloqueo = on('Lockout (Any)') || on('79 Lockout (Any)') || on('Lockout (All Phases)');
    const pk = Array.from(S.values()).filter((v) => v.rol === 'PICKUP' && v.elemento && v.elemento !== 'Pickup');
    const pickupsOn = pk.filter((v) => v.vioOn).map((v) => v.elemento);
    const pickupsOff = pk.filter((v) => v.vioOff).map((v) => v.elemento);
    const protOscilo = S.has('Prot initiated') && S.get('Prot initiated').oscilo;
    const fasesAb = ['A', 'B', 'C'].filter((f) => on('Open(SW Phase ' + f + ')'));

    // ---- APERTURA (+ recierre rápido en el mismo paquete)
    const recierreRapido = abrio && cerro && r.ultimaPos && !r.ultimaPos.abierto && origenesCi.some((e) => e && e.startsWith('AR'));
    if (abrio) {
      res.categoria = 'APERTURA';
      ctx.abierto = !recierreRapido;
      const esp = especificos(origenesAp);
      const cmd = elegirComando(esp);
      const aut = esp.find((e) => AUTOMATISMOS.has(e));
      const prot = esp.filter((e) => !COMANDOS.has(e) && !AUTOMATISMOS.has(e) && e !== 'Undefined');

      if (cmd) {
        res.veredicto = 'Apertura por comando ' + COMANDO_ES[cmd] + (bloqueo ? ' — equipo en bloqueo' : '');
        res.severidad = 3;
        ctx.secuencia = { activa: false, disparos: 0 };
      } else if (aut) {
        res.veredicto = 'Apertura por ' + (AUTOM_ES[aut] || aut) + (bloqueo ? ' — equipo en bloqueo' : '');
        res.severidad = 2;
      } else if (esp.includes('Undefined')) {
        res.veredicto = 'Apertura reconocida al reinicio del control (origen indeterminado)' + (bloqueo ? ' — equipo en bloqueo' : '');
        res.severidad = 3;
      } else if (prot.length || on('Open(Prot)')) {
        const lista = prot.length ? prot.map(descElemento).join(' + ') : 'protección (elemento no reportado)';
        res.veredicto = 'Apertura por protección: ' + lista;
        if (!ctx.secuencia.activa) ctx.secuencia = { activa: true, disparos: 0 };
        ctx.secuencia.disparos += 1;
        res.detalle.push('Disparo ' + ctx.secuencia.disparos + ' de la secuencia');
        if (bloqueo) { res.veredicto += ' — BLOQUEO (lockout)'; res.severidad = 1; ctx.secuencia.activa = false; ctx.bloqueado = true; }
        else if (recierreRapido) { res.veredicto += ' — recierre automático inmediato (intento ' + ctx.secuencia.disparos + ')'; res.severidad = 2; }
        else if (on('AR initiated')) { res.veredicto += ' — recierre automático pendiente'; res.severidad = 2; }
        else { res.veredicto += ' — sin recierre'; res.severidad = 1; }
      } else {
        res.veredicto = 'Apertura — origen no reportado' + (bloqueo ? ' — equipo en bloqueo' : '');
        res.severidad = 2;
      }
      if (bloqueo) ctx.bloqueado = true;
      if (fasesAb.length && fasesAb.length < 3 && !on('Open(all phases)')) res.detalle.push('Monofásica: ' + fasesAb.map((f) => FASE_ES[f]).join(', '));
      else if (!recierreRapido && (on('Open(all phases)') || fasesAb.length === 3)) res.detalle.push('Las tres fases abiertas');
      if (recierreRapido && on('Closed(All phases)')) res.detalle.push('Las tres fases cerradas nuevamente');
      const pk = especificos(pickupsOn.length ? pickupsOn : (ctx.pickupPendiente ? ctx.pickupPendiente.elems : [])).filter((e) => !prot.includes(e));
      if (pk.length) res.detalle.push('Precedida por pickup de ' + pk.map(descElemento).join(', '));
      ctx.pickupPendiente = null;
      if (on('MNT Exceeded')) res.detalle.push('Máximo número de disparos excedido');
      anexarAlimentacion(r, res);
      return res;
    }

    // ---- CIERRE
    if (cerro) {
      res.categoria = 'CIERRE';
      const esp = especificos(origenesCi);
      const cmd = elegirComando(esp);
      const ar = esp.find((e) => e.startsWith('AR'));
      const aut = esp.find((e) => AUTOMATISMOS.has(e) && !e.startsWith('AR'));
      if (ar) {
        res.veredicto = 'Recierre automático' + (ctx.secuencia.activa ? ' (intento ' + ctx.secuencia.disparos + ')' : '');
        res.severidad = 2; // la secuencia sigue abierta hasta "Prot initiated OFF"
      } else if (cmd) {
        res.veredicto = 'Cierre por comando ' + COMANDO_ES[cmd];
        res.severidad = 4;
        ctx.secuencia = { activa: false, disparos: 0 };
      } else if (aut) {
        res.veredicto = 'Cierre por ' + (AUTOM_ES[aut] || aut);
        res.severidad = 4;
      } else if (esp.includes('Undefined')) {
        res.veredicto = 'Cierre reconocido al reinicio del control (origen indeterminado)';
        res.severidad = 3;
      } else {
        res.veredicto = 'Cierre — origen no reportado';
        res.severidad = 3;
      }
      if (on('Closed(All phases)')) res.detalle.push('Las tres fases cerradas');
      if (ctx.bloqueado) { res.detalle.push('Bloqueo repuesto'); }
      else if (ctx.vistos && !ctx.abierto) {
        // Pila de posición: cada apertura se cancela con un cierre. Un cierre sin apertura pendiente = registros perdidos.
        res.detalle.push(off('Lockout (Any)') ? 'El equipo venía de BLOQUEO, pero el registro del bloqueo y de la apertura no fue recibido (hueco en el log)' : 'La apertura previa no fue recibida (hueco en el log)');
        res.severidad = Math.min(res.severidad, 3);
      }
      ctx.bloqueado = false; ctx.abierto = false;
      const pkCierre = especificos(pickupsOn);
      if (pkCierre.length && !on('Open(Any)')) res.detalle.push('Pickup de ' + pkCierre.map(descElemento).join(', ') + ' al cerrar (corriente de inserción), sin operación');
      if (on('Close Req. Blocked')) { res.veredicto = 'Cierre BLOQUEADO (LLB / UV4 Sag / Hot Line Tag)'; res.severidad = 1; }
      ctx.pickupPendiente = null;
      anexarAlimentacion(r, res);
      return res;
    }

    // ---- PICKUP que empieza y termina en el mismo paquete (el orden dentro del segundo no es confiable)
    if (protOscilo && !bloqueo) {
      res.categoria = 'PICKUP';
      const elems = especificos(pickupsOn.length ? pickupsOn : pickupsOff);
      res.veredicto = 'Evaluación de protección (pickup ' + (elems.length ? elems.map(descElemento).join(', ') : 'sin elemento reportado') + ') desestimada, sin provocar apertura';
      res.severidad = 3; res.cierraPickup = true; ctx.pickupPendiente = null; return res;
    }

    // ---- FIN DE SECUENCIA
    if (off('Prot initiated') || (off('AR initiated') && !on('Prot initiated'))) {
      res.categoria = 'SECUENCIA';
      res.veredicto = 'Secuencia de protección finalizada — estado normal de operación';
      if (ctx.secuencia.disparos) res.detalle.push('Tras ' + ctx.secuencia.disparos + ' disparo(s)');
      ctx.secuencia = { activa: false, disparos: 0 };
      res.severidad = 4;
      anexarAlimentacion(r, res);
      return res;
    }
    if (on('Prot initiated')) {
      res.categoria = 'SECUENCIA'; res.veredicto = 'Secuencia de protección iniciada'; res.severidad = 2; return res;
    }

    // ---- BLOQUEO aislado
    if (bloqueo) {
      res.categoria = 'BLOQUEO';
      res.veredicto = on('79 Lockout (Any)') ? 'Bloqueo (lockout) por operación de protección' : 'Bloqueo (lockout)';
      res.severidad = 1; ctx.secuencia.activa = false; ctx.bloqueado = true; return res;
    }
    if (off('Lockout (Any)') || off('79 Lockout (Any)')) {
      res.categoria = 'BLOQUEO'; res.veredicto = 'Bloqueo repuesto'; res.severidad = 4; ctx.bloqueado = false; return res;
    }
    if (on('Mechanically Locked')) { res.categoria = 'BLOQUEO'; res.veredicto = 'Bloqueo mecánico: anillo de disparo bajado'; res.severidad = 1; return res; }
    if (off('Mechanically Locked')) { res.categoria = 'BLOQUEO'; res.veredicto = 'Bloqueo mecánico repuesto'; res.severidad = 4; return res; }

    // ---- PICKUP sin apertura
    if (pickupsOn.length || pickupsOff.length) {
      res.categoria = 'PICKUP';
      const elems = especificos(pickupsOn.length ? pickupsOn : (ctx.pickupPendiente ? ctx.pickupPendiente.elems : pickupsOff));
      const lista = elems.map(descElemento).join(', ');
      const todosRepuestos = (pickupsOn.length && pickupsOn.every((e) => pickupsOff.includes(e))) || (!pickupsOn.length && pickupsOff.length);
      if (todosRepuestos) {
        res.veredicto = 'Evaluación de protección (pickup ' + lista + ') desestimada, sin provocar apertura';
        res.severidad = 3; res.cierraPickup = true; ctx.pickupPendiente = null;
      } else {
        res.veredicto = 'Evaluación de protección en curso (pickup ' + lista + ')';
        res.severidad = 2; res.provisional = true; ctx.pickupPendiente = { elems };
      }
      return res;
    }

    // ---- ALARMA de elemento de protección (modo alarma)
    const alOn = especificos(conRol('ALARMA_PROT', 1).map(([, v]) => v.elemento));
    const alOff = especificos(conRol('ALARMA_PROT', 0).map(([, v]) => v.elemento));
    if (alOn.length) { res.categoria = 'ALARMA'; res.veredicto = 'Alarma de protección: ' + alOn.map(descElemento).join(', ') + ' (sin disparo)'; res.severidad = 2; return res; }
    if (alOff.length) { res.categoria = 'ALARMA'; res.veredicto = 'Alarma de protección repuesta: ' + alOff.map(descElemento).join(', '); res.severidad = 4; return res; }

    // ---- ALIMENTACIÓN
    if (anexarAlimentacion(r, res, true)) return res;

    // ---- SALUD del equipo
    const saludOn = conRol('SALUD', 1).filter(([s]) => s !== 'Warning' && s !== 'Malfunction' && s !== 'Alarm(Any)');
    const saludOff = conRol('SALUD', 0).filter(([s]) => s !== 'Warning' && s !== 'Malfunction');
    if (saludOn.length) {
      res.categoria = 'FALLA_EQUIPO';
      res.veredicto = 'Falla de equipo: ' + saludOn.map(([, v]) => v.cat.es.split(/[.:]/)[0]).join('; ');
      res.severidad = saludOn.some(([, v]) => v.cat.prioridad <= 2) ? 1 : 2; return res;
    }
    if (saludOff.length) {
      res.categoria = 'FALLA_EQUIPO'; res.veredicto = 'Condición de equipo repuesta: ' + saludOff.map(([, v]) => v.cat.es.split(/[.:]/)[0]).join('; '); res.severidad = 4; return res;
    }

    // ---- MODO / AJUSTE
    const modos = [...conRol('MODO'), ...conRol('AJUSTE')];
    if (modos.length) {
      res.categoria = 'MODO';
      const txt = modos.map(([s, v]) => textoModo(s, v.estado, v.cat)).filter(Boolean);
      res.veredicto = txt.length === 1 ? txt[0] : 'Cambio de modo/ajuste: ' + txt.join('; ');
      const anormal = modos.some(([s, v]) => (s === 'AR On' && v.estado === 0) || (s === 'Remote Control' && v.estado === 0) || (s === 'Prot On' && v.estado === 0) || (s === 'Hot Line Tag On' && v.estado === 1) || (s === 'Sectionaliser Mode On' && v.estado === 1) || (/^(EF|SEF|NPS|UV|OV|UF|OF) On$/.test(s) && v.estado === 0));
      res.severidad = anormal ? 3 : 4; return res;
    }

    // ---- entradas / lógica / ruido
    if (conRol('ENTRADA').length || conRol('LOGICA').length) { res.categoria = 'IO'; res.veredicto = 'Entradas / lógica programada: ' + [...conRol('ENTRADA'), ...conRol('LOGICA')].map(([s, v]) => s + '=' + v.estado).join(', '); res.severidad = 4; return res; }
    if (on('Warning')) { res.categoria = 'ADVERTENCIA'; res.veredicto = 'Advertencia genérica activada (sin detalle)'; res.severidad = 3; return res; }
    if (off('Warning')) { res.categoria = 'ADVERTENCIA'; res.veredicto = 'Advertencias limpiadas'; res.severidad = 4; return res; }
    if (on('Test Mode') || on('Dummy Control')) { res.categoria = 'PRUEBA'; res.veredicto = 'Equipo en modo prueba / control simulado'; res.severidad = 3; return res; }
    if (off('Test Mode') || off('Dummy Control')) { res.categoria = 'PRUEBA'; res.veredicto = 'Fin de modo prueba'; res.severidad = 4; return res; }
    return null;
  }

  function textoModo(s, estado, c) {
    const ON = estado === 1;
    switch (s) {
      case 'Remote Control': return ON ? 'Control conmutado a REMOTO' : 'Control conmutado a LOCAL';
      case 'AR On': return ON ? 'Recierre automático HABILITADO' : 'Recierre automático DESHABILITADO';
      case 'Prot On': return ON ? 'Protección habilitada' : 'Protección DESHABILITADA';
      case 'Hot Line Tag On': return ON ? 'Trabajo con línea viva (Hot Line Tag) ACTIVADO' : 'Hot Line Tag desactivado';
      case 'Sectionaliser Mode On': return ON ? 'Modo seccionalizador ACTIVADO' : 'Modo seccionalizador desactivado';
    }
    const el = s.match(/^(EF|SEF|NPS|UV|OV|UF|OF|Yn|LL|HRM|CLP|UV4 Sag|OV3|ABR|ROCOF|VVS|PDOP|PDUP) On$/);
    if (el) return 'Protección ' + (ELEM[el[1]] || el[1]) + ' (' + el[1] + ') ' + (ON ? 'HABILITADA' : 'DESHABILITADA');
    const g = s.match(/^Group(\d) On$/);
    if (g) return ON ? 'Grupo de protección ' + g[1] + ' activo' : null; // el OFF del grupo anterior es redundante
    if (/Trips to\s+Lockout/.test(s)) return ON ? s.replace(/79-(\d).*/, 'Disparos a bloqueo: $1') : null;
    if (/Trip \/ .*Lockout On$/.test(s)) return ON ? 'Modo ' + s.replace(' On', '') : null;
    return (c && c.es ? c.es.split(/[.:]/)[0] : s + (ON ? ' habilitado' : ' deshabilitado'));
  }

  const S_has = (r, senal) => r.S.has(senal);

  /** "45.35 A, 45.76 A, 16.82 A, 0.12 A" → "I: A 45,4 · B 45,8 · C 16,8 · tierra 0,1 A" (Cooper F5, info adicional del SOE). */
  function corrientesDe(eventos) {
    for (const e of eventos) {
      const m = e.info && e.info.match(/([\d.]+)\s*A\s*,\s*([\d.]+)\s*A\s*,\s*([\d.]+)\s*A(?:\s*,\s*([\d.]+)\s*A)?/);
      if (m) {
        const f = (x) => (+x).toFixed(1).replace('.', ',');
        return 'I: A ' + f(m[1]) + ' · B ' + f(m[2]) + ' · C ' + f(m[3]) + (m[4] != null ? ' · tierra ' + f(m[4]) : '') + ' A';
      }
    }
    return null;
  }

  /** Pila de posición (cerrado → abierto → cerrado): un cierre cancela la apertura pendiente; sin apertura pendiente, hay hueco. */
  function cerrarPila(ctx, res, lockoutOff) {
    if (ctx.bloqueado) res.detalle.push('Bloqueo repuesto');
    else if (ctx.vistos && !ctx.abierto) {
      res.detalle.push(lockoutOff ? 'El equipo venía de BLOQUEO, pero el registro del bloqueo y de la apertura no fue recibido (hueco en el log)' : 'La apertura previa no fue recibida (hueco en el log)');
      res.severidad = Math.min(res.severidad, 3);
    }
    ctx.bloqueado = false; ctx.abierto = false;
  }

  /** Alimentación AC: como veredicto propio (solo=true) o como detalle anexado. */
  function anexarAlimentacion(r, res, solo) {
    const { on, off } = r;
    const perdio = on('AC Off (On Battery Supply)') || off('Battery Off (On AC Supply)') || off('AC power present') || on('No AC Power');
    const volvio = off('AC Off (On Battery Supply)') || on('Battery Off (On AC Supply)') || on('AC power present') || off('No AC Power');
    const critica = on('Critical Battery Level');
    if (solo) {
      const RUN0 = ['Battery Test Running', 'Battery test active', 'Battery Test in Progress']; const runOff = RUN0.some(off);
      if (critica) { res.categoria = 'ALIMENTACION'; res.veredicto = 'Nivel crítico de batería — apagado del control en menos de 5 min'; res.severidad = 1; return true; }
      if (perdio) { res.categoria = 'ALIMENTACION'; res.veredicto = 'Pérdida de alimentación AC — operando a batería'; res.severidad = 2; return true; }
      if (volvio) { res.categoria = 'ALIMENTACION'; res.veredicto = 'Alimentación AC restablecida'; res.severidad = 4; return true; }
      if ((on('Battery Status Abnormal') || on('Check Battery') || on('Battery Alarm')) && !runOff) { res.categoria = 'ALIMENTACION'; res.veredicto = 'Estado anormal de batería — revisar'; res.severidad = 2; return true; }
      if (on('Battery Test Circuit Fault')) { res.categoria = 'ALIMENTACION'; res.veredicto = 'Falla en el circuito de prueba de batería — la prueba no pudo realizarse'; res.severidad = 2; return true; }
      // Señal "prueba en curso" según familia: RC10 'Battery Test Running', F5 'Battery test active', F6 'Battery Test in Progress'
      const RUN = ['Battery Test Running', 'Battery test active', 'Battery Test in Progress'];
      const runOn = RUN.some(on);
      const esRC10 = S_has(r, 'Battery Test Running') || S_has(r, 'Battery Test Passed') || S_has(r, 'Battery Test Not Performed');
      const testFin = runOff || S_has(r, 'Battery Test Passed') || on('Battery Test Not Performed');
      if (runOn && !testFin) { res.categoria = 'PRUEBA_BATERIA'; res.veredicto = 'Prueba de batería en curso (el control descarga la batería unos segundos para medirla)'; res.severidad = 4; res.provisional = true; return true; }
      if (testFin) {
        res.categoria = 'PRUEBA_BATERIA'; res.cierraPruebaBateria = true;
        if (on('Battery Test Passed')) { res.veredicto = 'Prueba de batería finalizada: aprobada'; res.severidad = 4; }
        else if (off('Battery Test Passed') || on('Check Battery')) { res.veredicto = 'Prueba de batería finalizada: NO aprobada — revisar batería'; res.severidad = 2; }
        else if (on('Battery Test Not Performed')) { res.veredicto = 'Prueba de batería no efectuada'; res.severidad = 3; }
        else if (!esRC10) { res.veredicto = 'Prueba de batería finalizada: sin observaciones'; res.severidad = 4; }
        else { res.veredicto = 'Prueba de batería finalizada (resultado no reportado)'; res.severidad = 4; }
        return true;
      }
      return false;
    }
    if (perdio) res.detalle.push('Sin alimentación AC (a batería)');
    else if (volvio) res.detalle.push('Alimentación AC restablecida');
    return false;
  }

  // ------------------------------------------------- reglas Cooper F5 (v4)
  const CAUSA_ES = {
    'Phase Fault': 'falla de fase', 'Gnd Fault': 'falla a tierra', 'Sensitive Gnd Fault': 'falla a tierra sensible',
    'Adaptive Gnd Fault': 'falla a tierra adaptativa', 'Directional Sensitive Gnd Fault': 'falla a tierra sensible direccional',
    'High-Current-Trip Phase Fault': 'falla de fase por alta corriente (HCT)', 'High-Current-Trip Gnd Fault': 'falla a tierra por alta corriente (HCT)',
    'Low-Current-Trip Phase Fault': 'falla de fase por baja corriente (LCT)', 'Fault': 'falla',
    'Manual or SCADA': 'comando (manual o SCADA)', 'Over-Current Protection': 'protección de sobrecorriente',
    'High-Current-Lockout': 'bloqueo por alta corriente (HCL)', 'Non-Reclose': 'modo sin recierre',
    'Yellow Handle': 'palanca amarilla', 'Inconsistent switch State Check': 'estado de interruptor inconsistente',
    'Under or Over Voltage': 'sub/sobretensión', 'Under or Over Frequency': 'sub/sobrefrecuencia',
    'Voltage-and-Frequency Auto-restore': 'restauración automática por tensión/frecuencia',
    'Close Retry successful': 'reintento de cierre exitoso', 'Close Retry failure.  3-ph Lockout': 'falla en reintento de cierre',
    'Close Retry failure': 'falla en reintento de cierre', 'Trip Failure': 'falla al abrir', 'Close Failure': 'falla al cerrar',
    'Trip Failure. Current with open interrupter': 'falla al abrir (corriente con interruptor abierto)',
    'LS Trip': 'esquema de lazo (LS)', 'LS Close': 'esquema de lazo (LS)', 'LS Auto Close On LS Reset': 'esquema de lazo (cierre automático)',
    'Fault, Switch Mode': 'falla en modo seccionador', 'Gnd Fault, Switch Mode': 'falla a tierra en modo seccionador',
    'Phase Sequence Coordination': 'coordinación de secuencia de fase', 'Gnd Sequence Coordination': 'coordinación de secuencia de tierra',
    'Over-Current Protection Reset': 'reposición de protección de sobrecorriente',
    'Attempt to close was prevented by Hot Line Tag': 'cierre impedido por Hot Line Tag',
    'Low Voltage For Trip and Close': 'baja tensión para operar', 'Triple-Single 3-ph lockout mode': 'modo triple-single (bloqueo trifásico)',
    'Triple-Single Dynamic Phase Lockout': 'bloqueo dinámico de fase (triple-single)',
  };
  const causaES = (c) => CAUSA_ES[c] || CAUSA_ES[Object.keys(CAUSA_ES).find((k) => c.startsWith(k)) || ''] || c;

  function reglasF5(r, ctx) {
    const { on, off, conRol, eventos } = r;
    const res = { categoria: null, veredicto: null, detalle: [], severidad: 4 };
    const fases = (e) => (e.fase ? ' (' + FASE_ES[e.fase] + ')' : '');
    const targets = ['Phase 1-2 fault target', 'Phase 3-4 fault target', 'Phase 5-6 fault target'].filter(on).map((s) => ({ 'Phase 1-2 fault target': 'A', 'Phase 3-4 fault target': 'B', 'Phase 5-6 fault target': 'C' }[s]));
    const tierra = on('Ground fault target'), sgf = on('SGF target');

    if (eventos.length) {
      const trips = eventos.filter((e) => e.accion === 'Trip' || e.accion === 'Trip&Lockout');
      const locksCmd = eventos.filter((e) => e.accion === 'Lockout' && /Manual or SCADA/.test(e.causa));
      const locks = eventos.filter((e) => /Lockout/.test(e.accion || '') && !locksCmd.includes(e));
      const closes = eventos.filter((e) => e.accion === 'Close');
      const fails = eventos.filter((e) => /Failure/.test(e.accion || ''));
      const advances = eventos.filter((e) => e.accion === 'Advance');
      const resets = eventos.filter((e) => /Protection Reset/.test(e.causa || ''));
      const reloj = eventos.filter((e) => /Clock has been set/.test(e.causa || ''));
      const powerUp = eventos.filter((e) => /power-up reset/.test(e.causa || ''));
      const settings = eventos.filter((e) => (e.accion === 'Setting' || e.accion === 'Other') && !resets.includes(e) && !reloj.includes(e) && !powerUp.includes(e));
      const I = corrientesDe(eventos);
      const conI = () => { if (I) res.detalle.push(I); };
      // Apertura manual: el F5 la registra como "Lockout - Manual or SCADA", no como Trip
      if (locksCmd.length && !trips.length) {
        res.categoria = 'APERTURA'; res.veredicto = 'Apertura por comando (manual o SCADA) — equipo en bloqueo' + fases(locksCmd[0]);
        res.severidad = 3; ctx.abierto = true; ctx.bloqueado = true; ctx.secuencia = { activa: false, disparos: 0 }; conI(); return res;
      }
      if (trips.length) {
        res.categoria = 'APERTURA'; ctx.abierto = true;
        const t = trips[0];
        const esCmd = /Manual or SCADA/.test(t.causa);
        res.veredicto = esCmd ? 'Apertura por comando (manual o SCADA)' : 'Apertura por protección: ' + causaES(t.causa) + fases(t);
        if (esCmd) { res.severidad = 3; ctx.secuencia = { activa: false, disparos: 0 }; }
        else {
          if (!ctx.secuencia.activa) ctx.secuencia = { activa: true, disparos: 0 };
          ctx.secuencia.disparos += 1; res.detalle.push('Disparo ' + ctx.secuencia.disparos + ' de la secuencia');
          if (locks.length || on('Control (or A Phase) lockout')) { const lk = locks.find((e) => e.accion === 'Lockout') || locks[0]; res.veredicto += ' — BLOQUEO (' + causaES(lk ? lk.causa : 'Over-Current Protection') + ')'; res.severidad = 1; ctx.secuencia.activa = false; ctx.bloqueado = true; }
          else if (closes.length && r.ultimaPos && !r.ultimaPos.abierto) { res.veredicto += ' — recierre automático inmediato (intento ' + ctx.secuencia.disparos + ')'; res.severidad = 2; }
          else if (on('Non reclosing active')) { res.veredicto += ' — sin recierre (modo no-recierre)'; res.severidad = 1; }
          else { res.veredicto += ' — recierre pendiente'; res.severidad = 2; }
        }
        if (targets.length) res.detalle.push('Fases con target: ' + targets.map((f) => FASE_ES[f]).join(', '));
        if (tierra) res.detalle.push('Target de tierra');
        if (sgf) res.detalle.push('Target de tierra sensible');
        if (ctx.pickupPendiente) { res.detalle.push('Precedida por corriente sobre mínimo de disparo'); ctx.pickupPendiente = null; }
        conI(); return res;
      }
      if (locks.length) { res.categoria = 'BLOQUEO'; res.veredicto = 'Bloqueo (lockout): ' + causaES(locks[0].causa) + fases(locks[0]); res.severidad = 1; ctx.secuencia.activa = false; ctx.bloqueado = true; conI(); return res; }
      if (fails.length) { res.categoria = 'FALLA_EQUIPO'; res.veredicto = 'Falla de operación: ' + causaES(fails[0].causa) + fases(fails[0]); res.severidad = 1; return res; }
      if (closes.length) {
        res.categoria = 'CIERRE'; const c = closes[0];
        if (/Manual or SCADA/.test(c.causa)) { res.veredicto = 'Cierre por comando (manual o SCADA)' + fases(c); res.severidad = 4; ctx.secuencia = { activa: false, disparos: 0 }; }
        else if (/Auto-restore|LS/.test(c.causa)) { res.veredicto = 'Cierre por ' + causaES(c.causa); res.severidad = 4; }
        else { res.veredicto = 'Cierre: ' + causaES(c.causa) + fases(c); res.severidad = 3; }
        cerrarPila(ctx, res, off('Control (or A Phase) lockout'));
        if (advances.length) { res.detalle.push('Al cerrar, la protección de ' + (/Gnd/.test(advances[0].causa) ? 'tierra' : 'sobrecorriente') + ' vio corriente de inserción y avanzó una etapa por coordinación de secuencia, sin disparar'); ctx.secuencia = { activa: true, disparos: 0, coordinacion: true }; }
        conI(); return res;
      }
      if (advances.length) {
        res.categoria = 'SECUENCIA';
        res.veredicto = 'Disparo por ' + (/Gnd/.test(advances[0].causa) ? 'falla a tierra' : 'sobrecorriente') + ' NO efectuado: la etapa avanzó por coordinación de secuencia' + fases(advances[0]);
        res.severidad = 3; ctx.secuencia = { activa: true, disparos: ctx.secuencia.disparos, coordinacion: true }; conI(); return res;
      }
      if (resets.length) {
        res.categoria = 'SECUENCIA';
        res.veredicto = 'Secuencia de protección finalizada — estado normal de operación';
        if (ctx.secuencia.disparos) res.detalle.push('Tras ' + ctx.secuencia.disparos + ' disparo(s)');
        else if (ctx.secuencia.coordinacion) res.detalle.push('La etapa avanzada por coordinación volvió a su valor inicial sin que hubiera disparo');
        ctx.secuencia = { activa: false, disparos: 0 }; conI(); return res;
      }
      if (reloj.length) {
        res.categoria = 'RELOJ'; res.informativo = true; res.severidad = 4;
        const m = reloj[0].info && reloj[0].info.match(/\d{1,2}\/\d{1,2}\/\d{4}\s+\d{1,2}:\d{2}/);
        res.veredicto = 'Hora interna del control actualizada' + (m ? ' (anterior: ' + m[0] + ')' : ''); return res;
      }
      if (powerUp.length) { res.categoria = 'FALLA_EQUIPO'; res.veredicto = 'Reinicio del control (power-up reset)'; res.severidad = 2; return res; }
      if (eventos.some((e) => e.accion === 'Target')) { res.categoria = 'ALARMA'; res.veredicto = 'Target de falla (modo seccionador, sin apertura): ' + causaES(eventos[0].causa); res.severidad = 2; return res; }
      if (settings.length) { res.categoria = 'MODO'; res.veredicto = settings.map((e) => e.es.split(/[.:]/)[0]).join('; '); res.severidad = 4; return res; }
      res.categoria = 'OTRO'; res.veredicto = eventos.map((e) => e.es).join('; '); return res;
    }

    // Sin registros tipo Event: inferir por bits de estado
    const abrio = on('Recloser (or A Phase) open') || on('B Phase Open') || on('C Phase Open');
    const cerro = on('Recloser (or A Phase) closed') || on('B Phase Closed') || on('C Phase Closed');
    if (abrio) {
      res.categoria = 'APERTURA'; ctx.abierto = true;
      const causa = tierra ? 'falla a tierra' : sgf ? 'falla a tierra sensible' : targets.length ? 'falla de fase' : null;
      res.veredicto = causa ? 'Apertura por protección: ' + causa + (targets.length ? ' (' + targets.map((f) => FASE_ES[f]).join(', ') + ')' : '') : 'Apertura — origen no reportado';
      if (on('Control (or A Phase) lockout')) { res.veredicto += ' — BLOQUEO (lockout)'; res.severidad = 1; ctx.bloqueado = true; } else res.severidad = 2;
      return res;
    }
    if (cerro) { res.categoria = 'CIERRE'; cerrarPila(ctx, res, off('Control (or A Phase) lockout')); if (on('Close')) { res.veredicto = 'Cierre por comando'; ctx.secuencia = { activa: false, disparos: 0 }; } else if (ctx.secuencia.activa) { res.veredicto = 'Recierre automático (intento ' + ctx.secuencia.disparos + ')'; res.severidad = 2; } else res.veredicto = 'Cierre — origen no reportado'; if (off('Control (or A Phase) lockout')) res.detalle.push('Bloqueo repuesto'); return res; }
    if (on('Control (or A Phase) lockout')) { res.categoria = 'BLOQUEO'; res.veredicto = 'Bloqueo (lockout)'; res.severidad = 1; return res; }
    if (off('Control (or A Phase) lockout')) { res.categoria = 'BLOQUEO'; res.veredicto = 'Bloqueo repuesto'; return res; }
    if (on('Above minimum trip')) { res.categoria = 'PICKUP'; if (off('Above minimum trip') && r.S.get('Above minimum trip').oscilo) { res.veredicto = 'Evaluación de protección (corriente sobre mínimo de disparo) desestimada, sin provocar apertura'; res.severidad = 3; res.cierraPickup = true; } else { res.veredicto = 'Evaluación de protección en curso (corriente sobre mínimo de disparo)'; res.severidad = 2; res.provisional = true; ctx.pickupPendiente = { elems: [] }; } return res; }
    if (off('Above minimum trip')) { res.categoria = 'PICKUP'; res.veredicto = 'Evaluación de protección (corriente sobre mínimo de disparo) desestimada, sin provocar apertura'; res.severidad = 3; res.cierraPickup = true; ctx.pickupPendiente = null; return res; }
    if (anexarAlimentacion(r, res, true)) return res;
    const salud = conRol('SALUD', 1).filter(([s]) => s !== 'Active alarms present');
    if (on('Control OK') === false && off('Control OK')) { res.categoria = 'FALLA_EQUIPO'; res.veredicto = 'Falla de equipo: control (CPU) no OK'; res.severidad = 1; return res; }
    if (salud.length) { res.categoria = 'FALLA_EQUIPO'; res.veredicto = 'Falla de equipo: ' + salud.map(([, v]) => v.cat.es.split(/[.:]/)[0]).join('; '); res.severidad = 1; return res; }
    const cmds = conRol('COMANDO', 1);
    if (cmds.length) { res.categoria = 'COMANDO'; res.veredicto = 'Comando recibido: ' + cmds.map(([, v]) => v.cat.es.split(/[.:]/)[0]).join('; '); res.severidad = 4; return res; }
    const modos = conRol('MODO');
    if (modos.length) { res.categoria = 'MODO'; const t = modos.map(([, v]) => v.cat.es.split(/[.:]/)[0]); res.veredicto = t.length === 1 ? t[0] : 'Cambio de modo/ajuste: ' + t.join('; '); res.severidad = modos.some(([s, v]) => (s === 'Non reclosing active' && v.estado === 1) || (s === 'Supervisory off' && v.estado === 1) || (s === 'Hot line tag active' && v.estado === 1)) ? 3 : 4; return res; }
    return null;
  }

  // ------------------------------------------------- reglas Cooper F6 (v5)
  function reglasF6(r, ctx) {
    const { on, off, conRol } = r;
    const res = { categoria: null, veredicto: null, detalle: [], severidad: 4 };
    const trips = conRol('ORIGEN_APERTURA', 1).map(([s, v]) => ({ s, ...v }));
    const abrio = on('Recloser Open') || off('Recloser Closed') || trips.length > 0;
    const cerro = on('Recloser Closed');
    const recierreRapido = abrio && cerro && r.ultimaPos && !r.ultimaPos.abierto && !on('ci2:SClose (TB1:5-6)');
    if (abrio) {
      res.categoria = 'APERTURA'; ctx.abierto = true;
      if (trips.length) {
        const txt = trips.map((t) => (t.elemento === 'SEF' ? 'falla a tierra sensible' : t.elemento === 'EF' ? 'falla a tierra' : 'falla de fase' + (t.fase ? ' (' + FASE_ES[t.fase] + ')' : ''))).join(' + ');
        res.veredicto = 'Apertura por protección: ' + txt;
        if (!ctx.secuencia.activa) ctx.secuencia = { activa: true, disparos: 0 };
        ctx.secuencia.disparos += 1; res.detalle.push('Disparo ' + ctx.secuencia.disparos + ' de la secuencia');
        if (on('Control is Locked Out')) { res.veredicto += ' — BLOQUEO (lockout)'; res.severidad = 1; ctx.secuencia.activa = false; ctx.bloqueado = true; }
        else if (recierreRapido) { res.veredicto += ' — recierre automático inmediato (intento ' + ctx.secuencia.disparos + ')'; res.severidad = 2; }
        else if (on('Non-Reclosing')) { res.veredicto += ' — sin recierre (modo no-recierre)'; res.severidad = 1; }
        else { res.veredicto += ' — recierre pendiente'; res.severidad = 2; }
      } else if (on('ci3:STrip (TB1:7-8)') || on('ci1:RTrip (TB1:3-4)')) { res.veredicto = 'Apertura por comando (entrada supervisoria/remota)'; res.severidad = 3; ctx.secuencia = { activa: false, disparos: 0 }; }
      else { res.veredicto = 'Apertura — origen no reportado' + (on('Control is Locked Out') ? ' — BLOQUEO (lockout)' : ''); res.severidad = on('Control is Locked Out') ? 1 : 2; }
      if (on('Control is Locked Out')) ctx.bloqueado = true;
      if (ctx.pickupPendiente) { res.detalle.push('Precedida por corriente sobre mínimo de disparo'); ctx.pickupPendiente = null; }
      anexarAlimentacion(r, res); return res;
    }
    if (cerro) {
      res.categoria = 'CIERRE';
      if (on('ci2:SClose (TB1:5-6)')) { res.veredicto = 'Cierre por comando (entrada supervisoria)'; ctx.secuencia = { activa: false, disparos: 0 }; }
      else if (ctx.secuencia.activa) { res.veredicto = 'Recierre automático (intento ' + ctx.secuencia.disparos + ')'; res.severidad = 2; }
      else res.veredicto = 'Cierre';
      cerrarPila(ctx, res, off('Control is Locked Out'));
      anexarAlimentacion(r, res); return res;
    }
    if (on('Control is Locked Out')) { res.categoria = 'BLOQUEO'; res.veredicto = 'Bloqueo (lockout)'; res.severidad = 1; ctx.secuencia.activa = false; return res; }
    if (off('Control is Locked Out')) { res.categoria = 'BLOQUEO'; res.veredicto = 'Bloqueo repuesto'; return res; }
    const amt = r.S.get('Above Minimum Trip');
    if (amt) {
      res.categoria = 'PICKUP';
      if (amt.estado === 0) { res.veredicto = 'Evaluación de protección (corriente sobre mínimo de disparo) desestimada, sin provocar apertura'; res.severidad = 3; res.cierraPickup = true; ctx.pickupPendiente = null; }
      else { res.veredicto = 'Evaluación de protección en curso (corriente sobre mínimo de disparo)'; res.severidad = 2; res.provisional = true; ctx.pickupPendiente = { elems: [] }; }
      return res;
    }
    const alOn = conRol('ALARMA_PROT', 1);
    if (alOn.length) { res.categoria = 'ALARMA'; res.veredicto = 'Alarma de protección: ' + alOn.map(([, v]) => v.cat.es.split(/[.:]/)[0]).join('; '); res.severidad = 2; return res; }
    if (conRol('ALARMA_PROT', 0).length) { res.categoria = 'ALARMA'; res.veredicto = 'Alarma de protección repuesta'; return res; }
    if (anexarAlimentacion(r, res, true)) return res;
    const salud = conRol('SALUD', 1);
    if (salud.length) { res.categoria = 'FALLA_EQUIPO'; res.veredicto = 'Falla de equipo: ' + salud.map(([, v]) => v.cat.es.split(/[.:]/)[0]).join('; '); res.severidad = 1; return res; }
    if (conRol('SALUD', 0).length) { res.categoria = 'FALLA_EQUIPO'; res.veredicto = 'Condición de equipo repuesta'; return res; }
    const modos = conRol('MODO');
    if (modos.length) { res.categoria = 'MODO'; const t = modos.map(([, v]) => v.cat.es.split(/[.:]/)[0]); res.veredicto = t.length === 1 ? t[0] : 'Cambio de modo/ajuste: ' + t.join('; '); res.severidad = modos.some(([s, v]) => v.estado === 1 && /Non-Reclosing|Supervisory Off|Hot Line Tag|Blocked/.test(s)) ? 3 : 4; return res; }
    const ent = conRol('ENTRADA');
    if (ent.length) { res.categoria = 'IO'; res.veredicto = 'Entradas: ' + ent.map(([s, v]) => s.split(' ')[0] + '=' + v.estado).join(', '); return res; }
    if (conRol('SALIDA').length) { res.categoria = 'IO'; res.veredicto = 'Cambio en salidas del control'; return res; }
    return null;
  }


  // ------------------------------------------------------------ códigos estables
  // Cada evento concluido lleva un `codigo` de una lista cerrada (ver catalogo_concluidos.json) sobre el que
  // se configuran prioridad, destello y notificaciones, y `etiquetas` con condiciones adicionales.
  const CODIGOS = [
    ['APERTURA', /BLOQUEO/, 'AP_PROT_BLOQUEO'],
    ['APERTURA', /^Apertura por protección.*recierre automático/, 'AP_PROT_RECIERRE'],
    ['APERTURA', /^Apertura por protección.*sin recierre/, 'AP_PROT_SIN_RECIERRE'],
    ['APERTURA', /^Apertura por protección/, 'AP_PROT_RECIERRE'],
    ['APERTURA', /^Apertura por comando/, 'AP_COMANDO'],
    ['APERTURA', /reinicio del control/, 'AP_REINICIO'],
    ['APERTURA', /origen no reportado/, 'AP_ORIGEN_DESCONOCIDO'],
    ['APERTURA', /^Apertura por /, 'AP_AUTOMATISMO'],
    ['CIERRE', /^Cierre BLOQUEADO/, 'CI_BLOQUEADO'],
    ['CIERRE', /^Recierre automático/, 'CI_RECIERRE_AUTO'],
    ['CIERRE', /^Cierre por comando/, 'CI_COMANDO'],
    ['CIERRE', /reinicio del control/, 'CI_REINICIO'],
    ['CIERRE', /origen no reportado|^Cierre$/, 'CI_ORIGEN_DESCONOCIDO'],
    ['CIERRE', /^Cierre por |^Cierre: /, 'CI_AUTOMATISMO'],
    ['SECUENCIA', /finalizada/, 'SEQ_FIN'],
    ['SECUENCIA', /coordinación/, 'SEQ_COORDINACION'],
    ['SECUENCIA', /iniciada/, 'SEQ_INICIO'],
    ['PICKUP', /desestimada/, 'PK_DESESTIMADO'],
    ['PICKUP', /en curso/, 'PK_EN_CURSO'],
    ['BLOQUEO', /mecánico repuesto/, 'BL_MECANICO_REPUESTO'],
    ['BLOQUEO', /mecánico/, 'BL_MECANICO'],
    ['BLOQUEO', /repuesto/, 'BL_REPUESTO'],
    ['BLOQUEO', /./, 'BL_BLOQUEO'],
    ['ALARMA', /repuesta/, 'AL_PROT_REPUESTA'],
    ['ALARMA', /Target/, 'AL_TARGET'],
    ['ALARMA', /./, 'AL_PROT'],
    ['ALIMENTACION', /crítico/, 'BAT_CRITICA'],
    ['ALIMENTACION', /Pérdida de alimentación/, 'AC_PERDIDA'],
    ['ALIMENTACION', /restablecida/, 'AC_RESTABLECIDA'],
    ['ALIMENTACION', /circuito de prueba/, 'BAT_CIRCUITO_FALLA'],
    ['ALIMENTACION', /./, 'BAT_ANORMAL'],
    ['PRUEBA_BATERIA', /NO aprobada/, 'BT_NO_APROBADA'],
    ['PRUEBA_BATERIA', /aprobada/, 'BT_APROBADA'],
    ['PRUEBA_BATERIA', /no efectuada/, 'BT_NO_EFECTUADA'],
    ['PRUEBA_BATERIA', /en curso/, 'BT_EN_CURSO'],
    ['PRUEBA_BATERIA', /sin observaciones/, 'BT_APROBADA'],
    ['PRUEBA_BATERIA', /./, 'BT_SIN_RESULTADO'],
    ['FALLA_EQUIPO', /Reinicio del control/, 'EQ_REINICIO_CONTROL'],
    ['FALLA_EQUIPO', /repuesta/, 'EQ_REPUESTA'],
    ['FALLA_EQUIPO', /Falla de operación/, 'EQ_FALLA_OPERACION'],
    ['FALLA_EQUIPO', /./, 'EQ_FALLA'],
    ['MODO', /Recierre automático DESHABILITADO|Recierre DESHABILITADO|Non.?reclos.*(activ|set)/i, 'MD_RECIERRE_OFF'],
    ['MODO', /Recierre automático HABILITADO|Recierre HABILITADO/i, 'MD_RECIERRE_ON'],
    ['MODO', /a LOCAL|Supervisory off.*set|Supervisorio.*(desactiv|OFF)/i, 'MD_LOCAL'],
    ['MODO', /a REMOTO|Supervisorio.*(activ|ON)/i, 'MD_REMOTO'],
    ['MODO', /Protección DESHABILITADA|\) DESHABILITADA|bloqueada|blocked.*set/i, 'MD_PROT_OFF'],
    ['MODO', /\) HABILITADA|Protección habilitada/i, 'MD_PROT_ON'],
    ['MODO', /Hot Line Tag|línea viva/i, 'MD_HOT_LINE_TAG'],
    ['MODO', /Grupo de protección|Perfil|profile/i, 'MD_GRUPO'],
    ['MODO', /./, 'MD_OTRO'],
    ['ADVERTENCIA', /limpiadas/, 'WR_OFF'],
    ['ADVERTENCIA', /./, 'WR_ON'],
    ['PRUEBA', /Fin/, 'TS_OFF'],
    ['PRUEBA', /./, 'TS_ON'],
    ['RELOJ', /./, 'RJ_HORA'],
    ['IO', /./, 'IO_CAMBIO'],
    ['COMANDO', /./, 'CMD_RECIBIDO'],
  ];
  function codigoDe(res) {
    for (const [cat, re, cod] of CODIGOS) if (res.categoria === cat && re.test(res.veredicto)) return cod;
    return 'OTRO';
  }
  function etiquetasDe(res) {
    const e = [];
    if (res.detalle.some((d) => /hueco en el log/.test(d))) e.push('HUECO_LOG');
    if (res.detalle.some((d) => /al cerrar \(corriente de inserción\)|corriente de inserción/.test(d))) e.push('INRUSH_AL_CERRAR');
    if (res.detalle.some((d) => /duplicado/.test(d))) e.push('DUPLICADOS');
    if (res.detalle.some((d) => /Monofásica/.test(d))) e.push('MONOFASICA');
    if (res.detalle.some((d) => /Sin alimentación AC/.test(d))) e.push('SIN_AC');
    if (res.detalle.some((d) => /Máximo número de disparos/.test(d))) e.push('MNT_EXCEDIDO');
    if (res.provisional) e.push('PROVISIONAL');
    return e;
  }

  // ------------------------------------------------------------ orquestación
  function concluir(grupo, ctx) {
    const version = grupo[0].version;
    const r = resolver(grupo, version);
    const reglas = { 2: reglasRC10, 4: reglasF5, 5: reglasF6 }[version];
    let res = reglas ? reglas(r, ctx) : null;
    ctx.vistos = (ctx.vistos || 0) + 1;
    if (!res) {
      const nombres = Array.from(r.S.entries()).map(([s, v]) => s + (v.estado === 1 ? ' ON' : ' OFF'));
      res = { categoria: 'OTRO', veredicto: nombres.length ? 'Cambio de estado: ' + nombres.join(', ') : 'Registros sin catálogo', detalle: [], severidad: 4 };
    }
    res.detalle = res.detalle || [];
    if (r.duplicados) res.detalle = [...res.detalle, r.duplicados + ' registro' + (r.duplicados === 1 ? '' : 's') + ' duplicado' + (r.duplicados === 1 ? '' : 's') + ' descartado' + (r.duplicados === 1 ? '' : 's')];
    const ev = {
      equipo: grupo[0].equipo || null, version,
      inicio: new Date(grupo[0]._ms), fin: new Date(grupo[grupo.length - 1]._ms),
      ...res, crudos: r.crudos,
    };
    ev.codigo = codigoDe(ev); ev.etiquetas = etiquetasDe(ev);
    return ev;
  }

  const refrescar = (ev) => { ev.codigo = codigoDe(ev); ev.etiquetas = etiquetasDe(ev); return ev; };

  /** Une "evaluación en curso" + "desestimada" consecutivas en un solo evento concluido. */
  function postProceso(lista) {
    const out = [];
    for (const ev of lista) {
      const prev = out[out.length - 1];
      if (prev && prev.provisional && prev.categoria === 'PRUEBA_BATERIA' && ev.cierraPruebaBateria) {
        const dur = Math.round((ev.fin - prev.inicio) / 1000);
        out[out.length - 1] = refrescar({ ...ev, inicio: prev.inicio, provisional: false, detalle: ['Duración ' + dur + ' s', ...(prev.crudos.concat(ev.crudos).some((c) => c.duplicado) ? [prev.crudos.concat(ev.crudos).filter((c) => c.duplicado).length + ' registros duplicados descartados'] : [])], crudos: prev.crudos.concat(ev.crudos) });
        continue;
      }
      if (prev && prev.provisional && ev.categoria === 'PICKUP' && ev.cierraPickup) {
        out[out.length - 1] = refrescar({ ...ev, inicio: prev.inicio, provisional: false, crudos: prev.crudos.concat(ev.crudos) });
        continue;
      }
      out.push(ev);
    }
    return out;
  }

  /**
   * procesar(filas, opciones)
   *   opciones.gapSegundos (default 2)  — encadena mientras la diferencia con el registro anterior sea ≤ gap
   *   opciones.ctxPorEquipo             — opcional, Map equipo→ctx para continuar secuencias entre lotes
   */
  function procesar(filas, opciones) {
    opciones = opciones || {};
    const porEquipo = new Map();
    for (const f of filas) { const k = f.equipo || '_'; if (!porEquipo.has(k)) porEquipo.set(k, []); porEquipo.get(k).push(f); }
    const ctxs = opciones.ctxPorEquipo || new Map();
    let salida = [];
    for (const [k, lista] of porEquipo) {
      if (!ctxs.has(k)) ctxs.set(k, nuevoCtx());
      const ctx = ctxs.get(k);
      const eventos = agrupar(lista, opciones.gapSegundos).map((g) => concluir(g, ctx));
      salida = salida.concat(postProceso(eventos));
    }
    return salida.sort((a, b) => a.inicio - b.inicio);
  }

  export const LISTA_CODIGOS = CODIGOS.map((c) => c[2]).filter((v, i, a) => a.indexOf(v) === i).concat(['OTRO']);
  export { procesar, agrupar, resolver, descElemento, nuevoCtx };
