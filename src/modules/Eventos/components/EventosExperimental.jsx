/*
 * Solapa "Experimental" — Eventos concluidos
 * Tablero individual del reconectador → Eventos → Experimental
 *
 * Props
 *   registros : filas crudas del mismo rango, Registros + Avanzados juntos
 *               { fecha: Date|string, idEvento: number, idDnp3?: number|string, descripcion?: string, info?: string }
 *               idEvento = id_event_influx (fila de Events). idDnp3 = índice DNP3 del usuario (solo se muestra).
 *               info = "Información adicional" de Avanzados (corrientes, hora anterior): el motor la interpreta.
 *   version   : id_version del modelo (2 NOJA RC10 · 4 Cooper F5 · 5 Cooper F6)
 *   equipo    : nombre del reconectador (para el portapapeles)
 *   gapInicial: segundos entre registros para encadenar un paquete (default 2)
 *   config    : configuración de la cooperativa { codigo|etiqueta → {prioridad, destello, discord, push} } (ConcludedEventConfig).
 *               El color del veredicto sale de la PRIORIDAD configurada, no de la severidad técnica del motor.
 *               Sin config se usan los valores sugeridos del catálogo.
 *
 * Todo corre en el cliente. Orden: más reciente arriba; los eventos de las últimas 24 h van en un bloque separado.
 */
import { useMemo, useState } from 'react'
import {
	FaRegClock, FaLock, FaLockOpen, FaCarBattery, FaBatteryHalf, FaExclamationTriangle, FaBell, FaBellSlash,
	FaPlug, FaTools, FaSlidersH, FaCheckCircle, FaQuestionCircle, FaTerminal, FaExchangeAlt, FaFlask, FaUnlink,
	FaBolt, FaMapMarkerAlt, FaPaperPlane,
} from 'react-icons/fa'
import { procesar } from '../../../utils/eventosConcluidos/motor'
import { resolverAccion } from '../../../utils/eventosConcluidos/acciones'

// Color por prioridad configurada por la cooperativa (alta / baja / información).
const PRIO = {
	alta: { barra: 'bg-[#B3261E]', texto: 'text-[#B3261E] dark:text-[#F28B82]', nombre: 'alta prioridad' },
	baja: { barra: 'bg-[#DE6B00]', texto: 'text-[#DE6B00] dark:text-[#F5A25A]', nombre: 'baja prioridad' },
	info: { barra: 'bg-[#B9BEC5] dark:bg-zinc-500', texto: 'text-gray-900 dark:text-zinc-100', nombre: 'información' },
}

const pad = (n) => String(n).padStart(2, '0')
const fFecha = (d) => `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`
const fHora = (d) => `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
const H24 = 24 * 60 * 60 * 1000

/** LED con la convención de campo: verde = abierto, rojo = cerrado. */
function Led({ abierto }) {
	return (
		<span
			className={`inline-block h-3.5 w-3.5 rounded-full ring-2 ring-offset-1 ring-offset-white dark:ring-offset-zinc-700 ${
				abierto ? 'bg-emerald-500 ring-emerald-200' : 'bg-red-600 ring-red-200'
			}`}
			title={abierto ? 'Reconectador abierto' : 'Reconectador cerrado'}
		/>
	)
}

/** Ícono por código de evento concluido. */
function IconoEvento({ ev }) {
	const c = ev.codigo || ''
	const cls = 'h-5 w-5 text-gray-500 dark:text-zinc-300'
	if (c.startsWith('AP_')) return <Led abierto />
	if (c.startsWith('CI_')) return <Led abierto={false} />
	if (c === 'PK_DESESTIMADO' || c === 'PK_EN_CURSO') return <FaExclamationTriangle className={`${cls} text-amber-500`} title='Pickup de protección' />
	if (c === 'SEQ_FIN') return <FaCheckCircle className={`${cls} text-emerald-600`} title='Secuencia finalizada' />
	if (c.startsWith('SEQ_')) return <FaBolt className={cls} title='Secuencia de protección' />
	if (c === 'BL_REPUESTO' || c === 'BL_MECANICO_REPUESTO') return <FaLockOpen className={cls} title='Bloqueo repuesto' />
	if (c.startsWith('BL_')) return <FaLock className={`${cls} text-[#B3261E]`} title='Bloqueo' />
	if (c === 'AL_PROT_REPUESTA') return <FaBellSlash className={cls} title='Alarma repuesta' />
	if (c.startsWith('AL_')) return <FaBell className={`${cls} text-amber-500`} title='Alarma de protección' />
	if (c.startsWith('AC_')) return <FaPlug className={`${cls} ${c === 'AC_PERDIDA' ? 'text-[#DE6B00]' : ''}`} title='Alimentación AC' />
	if (c.startsWith('BAT_')) return <FaCarBattery className={`${cls} text-[#DE6B00]`} title='Batería' />
	if (c.startsWith('BT_')) return <FaBatteryHalf className={cls} title='Prueba de batería' />
	if (c.startsWith('EQ_')) return <FaTools className={`${cls} ${c === 'EQ_REPUESTA' ? '' : 'text-[#B3261E]'}`} title='Estado del equipo' />
	if (c.startsWith('MD_')) return <FaSlidersH className={cls} title='Modo / ajuste' />
	if (c === 'RJ_HORA') return <FaRegClock className={cls} title='Reloj del control' />
	if (c === 'IO_CAMBIO') return <FaExchangeAlt className={cls} title='Entradas / lógica' />
	if (c === 'CMD_RECIBIDO') return <FaTerminal className={cls} title='Comando' />
	if (c.startsWith('TS_')) return <FaFlask className={cls} title='Modo prueba' />
	if (c.startsWith('WR_')) return <FaExclamationTriangle className={cls} title='Advertencia' />
	return <FaQuestionCircle className={cls} title='Sin regla' />
}

export default function EventosExperimental({ registros = [], version, equipo = '', gapInicial = 2, config }) {
	const [gap, setGap] = useState(gapInicial)
	const [orden, setOrden] = useState('desc')
	const [abiertos, setAbiertos] = useState(() => new Set())
	const [copiado, setCopiado] = useState(null)
	const [verInformativos, setVerInformativos] = useState(false)

	// Procesa en orden cronológico (el motor lo necesita para la pila de posición) y después ordena para mostrar.
	const eventos = useMemo(() => {
		const filas = registros
			.filter((r) => r && r.idEvento != null && r.fecha)
			.map((r) => ({
				ts: r.fecha,
				id: Number(r.idEvento),
				version,
				equipo,
				idDnp3: r.idDnp3 != null && r.idDnp3 !== '-' ? r.idDnp3 : undefined,
				descripcion: r.descripcion,
				info: r.info && r.info !== '-' ? r.info : undefined,
			}))
		// `_i` = indice original del motor: identifica la fila de forma estable, asi ni
		// cambiar el orden ni mostrar los informativos mueve cual evento esta desplegado.
		return procesar(filas, { gapSegundos: gap })
			.map((ev, i) => ({ ...ev, _i: i, accion: resolverAccion(ev, config) }))
			.sort((a, b) => (orden === 'asc' ? a.inicio - b.inicio : b.inicio - a.inicio))
	}, [registros, version, equipo, gap, config, orden])

	const visibles = useMemo(() => (verInformativos ? eventos : eventos.filter((e) => !e.informativo)), [eventos, verInformativos])
	const nInformativos = eventos.length - visibles.length
	const ahora = Date.now()
	const recientes = visibles.filter((e) => ahora - e.fin.getTime() <= H24)
	const anteriores = visibles.filter((e) => ahora - e.fin.getTime() > H24)
	const cuenta = (p) => eventos.filter((e) => e.accion.prioridad === p).length

	const toggle = (k) => setAbiertos((prev) => { const n = new Set(prev); n.has(k) ? n.delete(k) : n.add(k); return n })

	const copiar = async (ev, k) => {
		const lineas = [
			`Equipo: ${equipo} · versión ${version} · gap ${gap}s`,
			`Código: ${ev.codigo}${ev.etiquetas.length ? ' +' + ev.etiquetas.join(' +') : ''} · prioridad ${ev.accion.prioridad}`,
			`Veredicto: ${ev.veredicto}${ev.detalle.length ? ' | ' + ev.detalle.join('; ') : ''}`,
			'Crudos (fecha hora ; ID Reconecta=id_event_influx ; ID DNP3 ; descripción ; info):',
			...ev.crudos.map((c) => `${fFecha(new Date(c._ms))} ${fHora(new Date(c._ms))} ; ${c.id} ; ${c.idDnp3 ?? ''} ; ${c.cat ? c.cat.es : c.descripcion ?? ''}${c.info ? ' ; ' + c.info : ''}${c.duplicado ? ' ; (duplicado)' : ''}`),
		]
		try {
			await navigator.clipboard.writeText(lineas.join('\n'))
			setCopiado(k)
			setTimeout(() => setCopiado(null), 1500)
		} catch (_) { /* portapapeles no disponible */ }
	}

	const Evento = ({ ev, k }) => {
		const sev = PRIO[ev.accion.prioridad] || PRIO.info
		const abierto = abiertos.has(k)
		return (
			<li className='grid grid-cols-[6px_44px_120px_1fr_auto] overflow-hidden rounded border border-gray-300 bg-white dark:border-zinc-600 dark:bg-zinc-700'>
				<div className={sev.barra} />
				<div className='flex items-start justify-center pt-3'><IconoEvento ev={ev} /></div>
				<div className='py-2.5 font-mono text-xs leading-relaxed text-gray-600 dark:text-zinc-300'>
					<span className='block text-gray-900 dark:text-zinc-100'>{fFecha(ev.inicio)}</span>
					{fHora(ev.inicio)}{ev.fin - ev.inicio > 0 && <> → {fHora(ev.fin)}</>}
				</div>
				<div className='py-2.5 pr-2'>
					<h3 className={`m-0 text-sm font-semibold ${sev.texto}`}>
						{ev.veredicto}
						{ev.accion.destello && <FaMapMarkerAlt className='ml-1.5 inline h-3 w-3 align-middle text-gray-400' title='Destello en mapa' />}
						{(ev.accion.discord || ev.accion.push) && <FaPaperPlane className='ml-1 inline h-3 w-3 align-middle text-gray-400' title='Notifica' />}
						{ev.etiquetas.includes('HUECO_LOG') && <FaUnlink className='ml-1 inline h-3 w-3 align-middle text-[#8A6800]' title='Hueco en el log' />}
						<span className='ml-1.5 align-middle font-mono text-[11px] font-normal text-gray-400 dark:text-zinc-400' title='Código del evento concluido (configuración de alarmas)'>
							{ev.codigo}{ev.etiquetas.map((e) => ' +' + e).join('')}
						</span>
					</h3>
					{ev.detalle.length > 0 && <p className='mt-0.5 text-gray-600 dark:text-zinc-300'>{ev.detalle.join(' · ')}</p>}
				</div>
				<div className='flex items-start gap-1.5 px-3 py-2.5 text-xs'>
					<button type='button' onClick={() => toggle(k)} className='rounded border border-gray-300 px-2 py-0.5 text-gray-600 hover:bg-gray-50 dark:border-zinc-500 dark:text-zinc-200 dark:hover:bg-zinc-600'>
						{ev.crudos.length} registro{ev.crudos.length === 1 ? '' : 's'}
					</button>
					<button type='button' onClick={() => copiar(ev, k)} title='Copiar veredicto y crudos para reportar un veredicto incorrecto' className='rounded border border-gray-300 px-2 py-0.5 text-gray-600 hover:bg-gray-50 dark:border-zinc-500 dark:text-zinc-200 dark:hover:bg-zinc-600'>
						{copiado === k ? 'Copiado' : 'Copiar'}
					</button>
				</div>
				{abierto && (
					<div className='col-span-5 border-t border-dashed border-gray-300 bg-gray-50 px-3 py-1.5 pl-14 dark:border-zinc-600 dark:bg-zinc-800'>
						<table className='w-full border-collapse text-xs'>
							<thead>
								<tr className='text-left text-[11px] font-normal text-gray-500 dark:text-zinc-400'>
									<th className='py-0.5 pr-3 font-normal'>Hora</th>
									<th className='py-0.5 pr-3 font-normal'>ID DNP3</th>
									<th className='py-0.5 pr-3 font-normal' title='id_event_influx: fila de la tabla Events, para consultar InfluxDB'>ID Reconecta</th>
									<th className='py-0.5 pr-3 font-normal'>Rol</th>
									<th className='py-0.5 font-normal'>Descripción</th>
								</tr>
							</thead>
							<tbody>
								{ev.crudos.map((c, j) => (
									<tr key={j} className={`border-b border-gray-200 last:border-0 dark:border-zinc-700 ${c.duplicado ? 'line-through opacity-40' : ''}`} title={c.duplicado ? 'Registro duplicado, descartado' : undefined}>
										<td className='whitespace-nowrap py-0.5 pr-3 font-mono text-gray-600 dark:text-zinc-300'>{fHora(new Date(c._ms))}</td>
										<td className='whitespace-nowrap py-0.5 pr-3 font-mono text-gray-600 dark:text-zinc-300'>{c.idDnp3 != null ? `#${c.idDnp3}` : '—'}</td>
										<td className='whitespace-nowrap py-0.5 pr-3 font-mono text-gray-400 dark:text-zinc-500'>ev {c.id}</td>
										<td className='whitespace-nowrap py-0.5 pr-3'>
											<span className='rounded border border-gray-300 px-1 text-[11px] text-gray-600 dark:border-zinc-500 dark:text-zinc-300'>{c.cat ? c.cat.rol : 'sin catálogo'}</span>
										</td>
										<td className='py-0.5 text-gray-700 dark:text-zinc-200'>
											{c.cat ? c.cat.es : c.descripcion || '—'}
											{c.info ? <span className='ml-2 text-gray-500 dark:text-zinc-400'>{c.info}</span> : null}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</li>
		)
	}

	return (
		<div className='text-sm text-gray-900 dark:text-zinc-100'>
			<p className='mb-3 rounded border border-gray-300 bg-gray-50 px-3 py-2 text-gray-600 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300'>
				Vista experimental: cada evento resume un paquete de registros del equipo (los que llegan con ≤ {gap} s entre sí).
				Es un derivado de las solapas Registros y Avanzados y no reemplaza su lectura ni la información del CMS.
			</p>

			<div className='mb-3 flex flex-wrap items-center gap-4'>
				<p className='m-0 font-medium'>
					{registros.length} registros → {eventos.length} eventos concluidos
					{eventos.length > 0 && (
						<span className='font-normal text-gray-600 dark:text-zinc-300'>
							{' · '}{cuenta('alta')} de alta prioridad, {cuenta('baja')} de baja, {cuenta('info')} informativos
						</span>
					)}
				</p>
				<div className='ml-auto flex flex-wrap items-center gap-4'>
					{nInformativos > 0 && (
						<label className='flex items-center gap-1.5 text-gray-600 dark:text-zinc-300'>
							<input type='checkbox' checked={verInformativos} onChange={(e) => setVerInformativos(e.target.checked)} />
							mostrar {nInformativos} informativo{nInformativos === 1 ? '' : 's'} (reloj, etc.)
						</label>
					)}
					<label className='flex items-center gap-2 text-gray-600 dark:text-zinc-300'>
						Orden
						<select value={orden} onChange={(e) => setOrden(e.target.value)}
							className='rounded border border-gray-300 px-2 py-1 text-gray-900 dark:border-zinc-500 dark:bg-zinc-800 dark:text-zinc-100'>
							<option value='desc'>Más recientes primero</option>
							<option value='asc'>Más antiguos primero</option>
						</select>
					</label>
					<label className='flex items-center gap-2 text-gray-600 dark:text-zinc-300'>
						Gap máx. (s)
						<input type='number' min='0' step='0.5' value={gap} onChange={(e) => setGap(parseFloat(e.target.value) || 0)}
							className='w-20 rounded border border-gray-300 px-2 py-1 text-gray-900 dark:border-zinc-500 dark:bg-zinc-800 dark:text-zinc-100' />
					</label>
				</div>
			</div>

			{visibles.length === 0 ? (
				<p className='py-8 text-center text-gray-500 dark:text-zinc-400'>No hay registros en el rango seleccionado.</p>
			) : (
				<>
					{recientes.length > 0 && (
						<section className='mb-5'>
							<h4 className='mb-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-zinc-400'>
								Últimas 24 horas <span className='font-normal normal-case tracking-normal'>· {recientes.length}</span>
							</h4>
							<ul className='m-0 flex list-none flex-col gap-1.5 p-0'>
								{recientes.map((ev) => <Evento key={'e' + ev._i} ev={ev} k={'e' + ev._i} />)}
							</ul>
						</section>
					)}
					{anteriores.length > 0 && (
						<section className={recientes.length ? 'border-t border-gray-300 pt-4 dark:border-zinc-600' : ''}>
							{recientes.length > 0 && (
								<h4 className='mb-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-zinc-400'>
									Anteriores <span className='font-normal normal-case tracking-normal'>· {anteriores.length}</span>
								</h4>
							)}
							<ul className='m-0 flex list-none flex-col gap-1.5 p-0'>
								{anteriores.map((ev) => <Evento key={'e' + ev._i} ev={ev} k={'e' + ev._i} />)}
							</ul>
						</section>
					)}
				</>
			)}
		</div>
	)
}
