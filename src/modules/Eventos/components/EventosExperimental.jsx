/*
 * Solapa "Experimental" — Eventos concluidos
 * Tablero individual del reconectador → Eventos → Experimental
 *
 * Props
 *   registros : array de filas crudas del mismo rango que "Registros"
 *               { fecha: Date|string, idEvento: number, idDnp3?: number, descripcion?: string }
 *               idEvento = id_event_influx (fila del catálogo). idDnp3 es el índice que ve el usuario, solo para mostrar.
 *   version   : id_version del modelo (2 = NOJA RC10, 4 = Cooper F5, 5 = Cooper F6)
 *   equipo    : nombre del reconectador (para el clipboard)
 *   gapInicial: segundos (default 2)
 *
 * Sin estado de servidor: recibe lo que ya tiene la solapa Registros y procesa en el cliente.
 */
import { useMemo, useState } from 'react';
import { procesar } from '../../../utils/eventosConcluidos/motor';

const SEV = {
  1: { barra: 'bg-[#B3261E]', texto: 'text-[#B3261E]', nombre: 'rojo' },
  2: { barra: 'bg-[#DE6B00]', texto: 'text-[#DE6B00]', nombre: 'naranja' },
  3: { barra: 'bg-[#E5C100]', texto: 'text-[#8A6800]', nombre: 'amarillo' },
  4: { barra: 'bg-[#B9BEC5]', texto: 'text-gray-900', nombre: 'neutro' },
};
const pad = (n) => String(n).padStart(2, '0');
const fFecha = (d) => `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
const fHora = (d) => `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;

export default function EventosExperimental({ registros = [], version, equipo = '', gapInicial = 2 }) {
  const [gap, setGap] = useState(gapInicial);
  const [orden, setOrden] = useState('desc');
  const [abiertos, setAbiertos] = useState(() => new Set());
  const [copiado, setCopiado] = useState(null);

  const eventos = useMemo(() => {
    const filas = registros
      .filter((r) => r && r.idEvento != null && r.fecha)
      .map((r) => ({ ts: r.fecha, id: Number(r.idEvento), version, equipo, idDnp3: r.idDnp3, descripcion: r.descripcion }));
    return procesar(filas, { gapSegundos: gap });
  }, [registros, version, equipo, gap]);

  // Se ordena una copia con el indice original a cuestas: `abiertos` y `copiado` se
  // guardan por indice, asi que cambiar el orden no debe mover que fila esta abierta.
  const eventosOrdenados = useMemo(
    () =>
      eventos
        .map((ev, idx) => ({ ev, idx }))
        .sort((a, b) => (orden === 'asc' ? a.ev.inicio - b.ev.inicio : b.ev.inicio - a.ev.inicio)),
    [eventos, orden]
  );

  const cuenta = (s) => eventos.filter((e) => e.severidad === s).length;

  const toggle = (i) => setAbiertos((prev) => { const n = new Set(prev); n.has(i) ? n.delete(i) : n.add(i); return n; });

  const copiar = async (ev, i) => {
    const lineas = [
      `Equipo: ${equipo} · versión ${version} · gap ${gap}s`,
      `Veredicto: ${ev.veredicto}${ev.detalle.length ? ' | ' + ev.detalle.join('; ') : ''}`,
      'Crudos (hora ; id_event_influx ; idDnp3 ; descripción):',
      ...ev.crudos.map((c) => `${fFecha(new Date(c._ms))} ${fHora(new Date(c._ms))} ; ${c.id} ; ${c.idDnp3 ?? ''} ; ${c.cat ? c.cat.es : c.descripcion ?? ''}`),
    ];
    try { await navigator.clipboard.writeText(lineas.join('\n')); setCopiado(i); setTimeout(() => setCopiado(null), 1500); } catch (_) { /* portapapeles no disponible */ }
  };

  return (
    <div className="text-sm text-gray-900">
      <p className="mb-3 rounded border border-gray-300 bg-gray-50 px-3 py-2 text-gray-600">
        Vista experimental: cada evento resume un paquete de registros del equipo (los que llegan con ≤ {gap} s entre sí).
        Es un derivado de la solapa Registros y no reemplaza su lectura ni la información del CMS.
      </p>

      <div className="mb-3 flex flex-wrap items-center gap-4">
        <p className="m-0 font-medium">
          {registros.length} registros → {eventos.length} eventos concluidos
          {eventos.length > 0 && (
            <span className="font-normal text-gray-600">
              {' · '}{cuenta(1)} en rojo, {cuenta(2)} en naranja, {cuenta(3)} en amarillo, {cuenta(4)} neutros
            </span>
          )}
        </p>
        <div className="ml-auto flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 text-gray-600">
            Orden
            <select value={orden} onChange={(e) => setOrden(e.target.value)}
              className="rounded border border-gray-300 px-2 py-1 text-gray-900">
              <option value="desc">Más recientes primero</option>
              <option value="asc">Más antiguos primero</option>
            </select>
          </label>
          <label className="flex items-center gap-2 text-gray-600">
            Gap máx. (s)
            <input type="number" min="0" step="0.5" value={gap} onChange={(e) => setGap(parseFloat(e.target.value) || 0)}
              className="w-20 rounded border border-gray-300 px-2 py-1 text-gray-900" />
          </label>
        </div>
      </div>

      {eventos.length === 0 ? (
        <p className="py-8 text-center text-gray-500">No hay registros en el rango seleccionado.</p>
      ) : (
        <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
          {eventosOrdenados.map(({ ev, idx }) => {
            const sev = SEV[ev.severidad] || SEV[4];
            const abierto = abiertos.has(idx);
            return (
              <li key={idx} className="grid grid-cols-[6px_130px_1fr_auto] overflow-hidden rounded border border-gray-300 bg-white">
                <div className={sev.barra} />
                <div className="py-2.5 pl-2 font-mono text-xs leading-relaxed text-gray-600">
                  <span className="block text-gray-900">{fFecha(ev.inicio)}</span>
                  {fHora(ev.inicio)}{ev.fin - ev.inicio > 0 && <> → {fHora(ev.fin)}</>}
                </div>
                <div className="py-2.5">
                  <h3 className={`m-0 text-sm font-semibold ${sev.texto}`}>{ev.veredicto}</h3>
                  {ev.detalle.length > 0 && <p className="mt-0.5 text-gray-600">{ev.detalle.join(' · ')}</p>}
                </div>
                <div className="flex items-start gap-1.5 px-3 py-2.5 text-xs">
                  <button type="button" onClick={() => toggle(idx)}
                    className="rounded border border-gray-300 px-2 py-0.5 text-gray-600 hover:bg-gray-50">
                    {ev.crudos.length} registro{ev.crudos.length === 1 ? '' : 's'}
                  </button>
                  <button type="button" onClick={() => copiar(ev, idx)} title="Copiar crudos para reportar un veredicto incorrecto"
                    className="rounded border border-gray-300 px-2 py-0.5 text-gray-600 hover:bg-gray-50">
                    {copiado === idx ? 'Copiado' : 'Copiar'}
                  </button>
                </div>
                {abierto && (
                  <div className="col-span-4 border-t border-dashed border-gray-300 bg-gray-50 px-3 py-1.5 pl-5">
                    <table className="w-full border-collapse text-xs">
                      <tbody>
                        {ev.crudos.map((c, j) => (
                          <tr key={j} className={`border-b border-gray-200 last:border-0 ${c.duplicado ? 'opacity-40 line-through' : ''}`} title={c.duplicado ? 'Registro duplicado, descartado' : undefined}>
                            <td className="whitespace-nowrap py-0.5 pr-3 font-mono text-gray-600">{fHora(new Date(c._ms))}</td>
                            <td className="whitespace-nowrap py-0.5 pr-3 font-mono text-gray-600">{c.idDnp3 != null ? `#${c.idDnp3}` : c.id}</td>
                            <td className="whitespace-nowrap py-0.5 pr-3">
                              <span className="rounded border border-gray-300 px-1 text-[11px] text-gray-600">{c.cat ? c.cat.rol : 'sin catálogo'}</span>
                            </td>
                            <td className="py-0.5 text-gray-700">{c.cat ? c.cat.es : c.descripcion || '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
