# Eventos concluidos — caminos del MVP

Pipeline: ordenar por fecha → **descartar duplicados** (una señal binaria solo puede repetir un estado si pasó por el opuesto; el sobrante se marca y se cuenta en el detalle) → **encadenar mientras el registro siguiente esté a ≤ 2 s del anterior** → resolver el estado final de cada señal dentro del paquete (los flags que oscilan, como Warning, se leen por su último valor) → aplicar la primera regla que matchee, en el orden de la tabla → post-proceso que une "evaluación en curso" + "desestimada" en un solo evento.

Severidad = escala del header de Reconecta: **1 rojo · 2 naranja · 3 amarillo · 4 neutro**.

Normalización del catálogo (`catalogo.js`, generado desde `Events.csv`): cada fila queda como `senal` + `estado` (ON/set = 1, OFF/clear = 0) + `rol`. Los roles son la base de las reglas:

| Rol | RC10 (id_event_influx) | Cooper F5 | Cooper F6 |
|---|---|---|---|
| POSICION | 192–203 (Open…), 504–515 (Closed…) | Recloser open/closed, B/C Phase | Recloser Open / Closed |
| ORIGEN_APERTURA | 204–347 `Open(X)` | fault targets (1-2=A, 3-4=B, 5-6=C, Ground, SGF) | A/B/C Phase Fault Trip, Ground, SEF |
| ORIGEN_CIERRE | 516–547 `Closed(X)` | — (viene en el registro tipo Event) | entrada ci2:SClose |
| PICKUP | 46–191 `P(X)` | Above minimum trip | Above Minimum Trip |
| ALARMA_PROT | 348–503 `A(X)`, 554–559 | — | Overcurrent Alarm (fase/tierra/NPS) |
| BLOQUEO | 4–15 Lockout | Control lockout | Control is Locked Out |
| SECUENCIA | 18–21 (AR/Prot initiated), 24–33 | Event "Protection Reset" | (se infiere del contexto) |
| MODO / AJUSTE | 16–17, 22–23, 548–667 | Non reclosing, Supervisory, HLT, perfiles… | idem |
| SALUD / ALIMENTACION | 668–821 | AC power, Control OK, malfunction… | No AC Power, Control Circuit Interrupted… |
| EVENTO (autocontenido) | — | 256–422 `3-ph/PhA Trip - causa` | — |

---

## Caminos comunes a las tres familias

| # | Condición del paquete | Veredicto | Sev |
|---|---|---|---|
| A1 | Abrió + origen de protección + **bloqueo** en el mismo paquete | Apertura por protección: *elemento* — BLOQUEO (lockout) | 1 |
| A2 | Abrió + protección + **cerró de nuevo dentro del paquete** por AR (recierre rápido, dead-time ≤ 2 s) | Apertura por protección: *elemento* — recierre automático inmediato (intento N) | 2 |
| A3 | Abrió + protección + `AR initiated` ON (RC10) / sin bloqueo ni non-reclose (Cooper) | Apertura por protección: *elemento* — recierre automático pendiente | 2 |
| A4 | Abrió + protección, sin AR ni bloqueo | Apertura por protección: *elemento* — sin recierre | 1 |
| A5 | Abrió + origen de comando (SCADA > HMI > PC > IO > Logic > Local > Manual > Remote) | Apertura por comando *origen* (reinicia la secuencia) | 3 |
| A6 | Abrió + automatismo (LSRM, ABR, ACO, seccionalizador) | Apertura por *automatismo* | 2 |
| A7 | Abrió + `Undefined` | Apertura reconocida al reinicio del control | 3 |
| A8 | Abrió sin origen | Apertura — origen no reportado | 2 |
| C1 | Cerró + `Closed(AR…)` / secuencia activa | Recierre automático (intento N) | 2 |
| C2 | Cerró + comando | Cierre por comando *origen* (reinicia la secuencia) | 4 |
| C3 | Cerró + automatismo (ABR, ACO, UV3 AutoClose, Auto-Sync, LS) | Cierre por *automatismo* | 4 |
| C4 | `Close Req. Blocked` ON | Cierre BLOQUEADO (LLB / UV4 Sag / Hot Line Tag) | 1 |
| S1 | `Prot initiated` OFF (RC10) / "Over-Current Protection Reset" (F5) | Secuencia de protección finalizada — estado normal (tras N disparos) | 4 |
| P1 | Pickup ON y OFF en el mismo paquete, sin apertura | Evaluación de protección (pickup *elementos*) desestimada, sin provocar apertura | 3 |
| P2 | Pickup ON sin OFF ni apertura | Evaluación en curso (*provisional*; se fusiona con el siguiente paquete: apertura → detalle "precedida por pickup"; OFF → P1) | 2 |
| L1 / L2 | Lockout ON / OFF aislado | Bloqueo (lockout) / Bloqueo repuesto | 1 / 4 |
| L3 | `Mechanically Locked` ON | Bloqueo mecánico: anillo de disparo bajado | 1 |
| E1 / E2 | AC Off ON / OFF (o `AC power present`, `No AC Power`) | Pérdida de alimentación AC — a batería / AC restablecida (si viene dentro de otro evento, va como detalle) | 2 / 4 |
| B1 | `Battery Test Running` ON | Prueba de batería en curso (*provisional*; se fusiona con el paquete que traiga el resultado, con la duración) | 4 |
| B2 | `Battery Test Running` OFF + `Passed` ON / OFF / `Not Performed` | Prueba de batería finalizada: aprobada / NO aprobada — revisar / no efectuada | 4 / 2 / 3 |
| E3 | `Critical Battery Level` ON | Nivel crítico de batería — apagado en < 5 min | 1 |
| F1 | Cualquier señal SALUD ON (OSM Fault, Excessive To/Tc, Coil OC/SC, Controller Fault, Comms…) | Falla de equipo: *lista* | 1–2 según prioridad |
| M1 | Señales MODO/AJUSTE | Texto específico (Recierre HABILITADO/DESHABILITADO, Control REMOTO/LOCAL, Grupo N activo, Hot Line Tag…) o "Cambio de modo/ajuste: …" | 3 si el nuevo estado es anormal, 4 si no |
| R1 | Solo `Warning` ON / OFF | Advertencia genérica / Advertencias limpiadas | 3 / 4 |
| Z | Nada matchea | "Cambio de estado: señal ON/OFF, …" (fallback para detectar caminos faltantes) | 4 |

Los detalles que se anexan al veredicto cuando corresponden: *Disparo N de la secuencia*, *Monofásica: fase X* / *Las tres fases abiertas*, *Precedida por pickup de …*, *Bloqueo repuesto* (solo si había bloqueo previo), *Sin alimentación AC* / *AC restablecida*, *Máximo número de disparos excedido*.

## Particularidades por familia

**RC10.** Cuando hay agregador y específico en el mismo paquete (`Open(Prot)` + `Open(OC)` + `Open(OC1+)`) gana el específico. Los `Open(SW Phase X)` sirven para distinguir monofásico de trifásico. `Open(Any)` OFF / `Open(SW Phase A)` OFF / `Lockout(Any)` OFF dentro de un cierre son eco de estado, no se mencionan.

**Cooper F5.** Si el paquete trae registros tipo *Event* (256+), ellos mandan y los bits de estado solo complementan (fase por target, tierra, SGF). Trip + Lockout en el mismo paquete → A1 con la causa del *Lockout*. "Manual or SCADA" no distingue origen: queda como "comando (manual o SCADA)". Sin registros Event, se infiere por bits (targets → causa; `Above minimum trip` → pickup).

**Cooper F6.** Solo bits. El origen de comando se toma de las entradas `ci1:RTrip`, `ci3:STrip`, `ci2:SClose`; sin ellas, un cierre durante secuencia activa se interpreta como recierre. Las salidas `co*` no generan evento salvo que vengan solas.

## Decisiones tomadas y límites conocidos

- **Gap ≤ 2 s encadenado** (no ventana fija desde el primero). Consecuencia: un disparo con recierre rápido cae en el mismo paquete → se resuelve por el **último cambio de posición** dentro del paquete (A2).
- **Las maniobras humanas quedan separadas** (deshabilitar recierre → cerrar → habilitar) como pidió Leonardo; el motor no las colapsa.
- El **contador de disparos** vive en un contexto por equipo (`ctxPorEquipo`) que se puede persistir entre lotes; se reinicia con bloqueo, cierre por comando o "secuencia finalizada".
- El ID que se ve en pantalla es el índice DNP3 que el usuario asignó; el motor trabaja con `id_event_influx`. Falta el mapeo índice-usuario → `id_event_influx`, que está en la base de Reconecta.
- La tabla origen tiene un error en RC10 id 6 (`Lockout (SW Phase A) ON: … not locked out`): el generador lo corrige a OFF.
- No cubierto aún: ROCOF/VVS/PDOP/PDUP y armónicos solo pasan por A4/A8 con su nombre; ACO y Auto-Sync como estados intermedios (health, release); eventos LS (loop scheme) de F5 más allá de trip/close.

## Validación con log real (reconectador Blangetti, jul–sep 2026)

95 registros de Reconecta → 19 eventos concluidos. Contrastado con el log del CMS del mismo equipo:

| Fecha | CMS | Reconecta (motor) | Coincide |
|---|---|---|---|
| 03/07, 31/07, 04/08, 06/08 | AC Off inicio/fin + arranque LSD | Pérdida de AC / AC restablecida | sí |
| 09/07, 18/07 22:48, 15/08 (×3), 04/09 | Arranque OC1+/EF1+/EF3+ → Reinicio (sin operación) | Evaluación de protección desestimada, sin apertura | sí (falta la corriente máxima, que solo está en CMS) |
| **18/07 13:13:38–39** | Disparo OC3+ (A,C) → AR → recierre a 1 s → disparo OC3+ (B,C) → **BLOQUEO** | **nada** | **no: hueco de datos** |
| 18/07 14:23:06 | Cierre SCADA | Cierre por comando SCADA · *venía de BLOQUEO, registro no recibido* | sí, y el motor infiere el hueco |
| 10/08 11:15 y 12:05 | Apagar → Reinicio alimentación → OSM cerrado → calibración | solo "Prueba de batería aprobada" ×2 | parcial |
| 16/08 17:48 / 18:00 | Estado de protección cambió (SCADA): Prot AR → Prot AR EF | Protección EF DESHABILITADA / HABILITADA | sí (CMS aporta el origen SCADA) |

Lectura del hueco del 18/07: los puntos DNP3 #0 (Closed Any), #11 (Open Any) y #12 (Lockout Any) sí están en el subconjunto, porque su transición a OFF/ON llegó a las 14:23:06. Sus transiciones opuestas a las 13:13:38 nunca llegaron. Es pérdida de eventos entre el disparo y el cierre manual, no falta de puntos configurados. Hipótesis a verificar: el equipo de comunicaciones se quedó sin alimentación al caer la línea y el buffer de eventos DNP3 no se recuperó al reconectar (o Reconecta no relee clases 1/2/3 tras una reconexión).

Errata adicional de la tabla origen: RC10 id 86 (`P(EF3+) OFF`) tiene el texto en español de EF1+; el mapeo por texto lo desambigua por el ID DNP3 del usuario.
