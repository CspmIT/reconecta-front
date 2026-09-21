/*
 * Resolución de acciones por tenant para eventos concluidos.
 * La configuración la elige cada cooperativa (tabla ConcludedEventConfig); catalogo_concluidos.json solo aporta los valores sugeridos.
 *
 *   config = { [codigoOEtiqueta]: { prioridad: 'info'|'baja'|'alta', destello: bool, discord: bool, push: bool } }
 *   resolverAccion(evento, config) → { prioridad, destello, discord, push, origen: [claves que aportaron] }
 *
 * Regla: prioridad efectiva = la mayor entre el código y las etiquetas presentes; destello/discord/push = OR.
 * PROVISIONAL nunca notifica. Si un código no está configurado se usa el valor sugerido del catálogo; si tampoco, 'info'.
 */
import catalogo from './catalogo_concluidos.json';

const ORDEN = { info: 0, baja: 1, alta: 2 };

/** Configuración sugerida (semilla) derivada del catálogo. */
export function configSugerida() {
  const c = {};
  for (const g of catalogo.grupos) for (const e of g.codigos) c[e.codigo] = { prioridad: e.prioridad, destello: !!e.destello, discord: !!e.notificar, push: !!e.notificar };
  for (const e of catalogo.etiquetas) c[e.etiqueta] = { prioridad: e.prioridad, destello: !!e.destello, discord: !!e.notificar, push: !!e.notificar };
  return c;
}

const SEMILLA = configSugerida();

export function resolverAccion(ev, config) {
  const cfg = config || SEMILLA;
  const claves = [ev.codigo, ...(ev.etiquetas || [])];
  const res = { prioridad: 'info', destello: false, discord: false, push: false, origen: [] };
  for (const k of claves) {
    const c = cfg[k] || SEMILLA[k];
    if (!c) continue;
    if (ORDEN[c.prioridad] > ORDEN[res.prioridad]) res.prioridad = c.prioridad;
    res.destello = res.destello || !!c.destello;
    res.discord = res.discord || !!c.discord;
    res.push = res.push || !!c.push;
    res.origen.push(k);
  }
  if ((ev.etiquetas || []).includes('PROVISIONAL') || ev.provisional) { res.discord = false; res.push = false; }
  return res;
}

/** Color de texto por prioridad (misma paleta ISA-101 del header: rojo, naranja #DE6B00, neutro). */
export const COLOR_PRIORIDAD = { alta: '#B3261E', baja: '#DE6B00', info: null };
