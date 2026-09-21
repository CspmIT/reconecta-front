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
 * Visual deliberadamente austera (pedido de operación): ícono, fecha, veredicto, detalle y cantidad de registros.
 * Código, etiquetas, duplicados y la explicación del método viven en la capacitación y en el botón "Copiar para reportar".
 */
import { useMemo, useState } from 'react'
import {
	FaRegClock, FaLock, FaLockOpen, FaCarBattery, FaBatteryHalf, FaExclamationTriangle, FaBell, FaBellSlash,
	FaTools, FaSlidersH, FaCheckCircle, FaQuestionCircle, FaTerminal, FaExchangeAlt, FaFlask,
	FaBolt,
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

/** Símbolo de interruptor con la convención de campo: cuadro verde con contacto abierto = abierto, cuadro rojo con contacto cerrado = cerrado. */
function Interruptor({ abierto }) {
	const color = abierto ? '#22A447' : '#E4232B'
	return (
		<svg viewBox='0 0 32 40' className='h-7 w-6' aria-hidden='true' title={abierto ? 'Reconectador abierto' : 'Reconectador cerrado'}>
			<line x1='16' y1='0' x2='16' y2='40' stroke='currentColor' strokeWidth='2' className='text-gray-800 dark:text-zinc-200' />
			<rect x='4' y='10' width='24' height='20' fill={color} stroke='currentColor' strokeWidth='1.5' className='text-gray-900 dark:text-zinc-100' />
			{abierto ? (
				<line x1='16' y1='26' x2='25' y2='16' stroke='#111' strokeWidth='2.5' strokeLinecap='round' />
			) : (
				<line x1='16' y1='14' x2='16' y2='26' stroke='#111' strokeWidth='2.5' />
			)}
			<circle cx='16' cy='14' r='2.3' fill='#111' />
			<circle cx='16' cy='26' r='2.3' fill='#111' />
		</svg>
	)
}

/** Símbolos IEC de corriente: DC (línea y trazos) cuando el control queda a batería, AC (senoide) cuando vuelve la red. */
function Corriente({ dc }) {
	const color = dc ? '#DE6B00' : 'currentColor'
	return (
		<svg viewBox='0 0 32 32' className='h-6 w-6 text-gray-700 dark:text-zinc-200' aria-hidden='true' title={dc ? 'Alimentación por batería (DC)' : 'Alimentación de red (AC)'}>
			<circle cx='16' cy='16' r='13.5' fill='none' stroke={color} strokeWidth='2.5' />
			{dc ? (
				<>
					<line x1='9' y1='13' x2='23' y2='13' stroke={color} strokeWidth='2.5' strokeLinecap='round' />
					<line x1='9' y1='19' x2='12.5' y2='19' stroke={color} strokeWidth='2.5' strokeLinecap='round' />
					<line x1='14.5' y1='19' x2='17.5' y2='19' stroke={color} strokeWidth='2.5' strokeLinecap='round' />
					<line x1='19.5' y1='19' x2='23' y2='19' stroke={color} strokeWidth='2.5' strokeLinecap='round' />
				</>
			) : (
				<path d='M8 17 C 11 11, 14 11, 16 16 S 21 21, 24 15' fill='none' stroke={color} strokeWidth='2.5' strokeLinecap='round' />
			)}
		</svg>
	)
}

/** Ícono por código de evento concluido. */
function IconoEvento({ ev }) {
	const c = ev.codigo || ''
	const cls = 'h-5 w-5 text-gray-500 dark:text-zinc-300'
	if (c.startsWith('AP_')) return <Interruptor abierto />
	if (c.startsWith('CI_')) return <Interruptor abierto={false} />
	if (c === 'PK_DESESTIMADO' || c === 'PK_EN_CURSO') return <FaExclamationTriangle className={`${cls} text-amber-500`} title='Pickup de protección' />
	if (c === 'SEQ_FIN') return <FaCheckCircle className={`${cls} text-emerald-600`} title='Secuencia finalizada' />
	if (c.startsWith('SEQ_')) return <FaBolt className={cls} title='Secuencia de protección' />
	if (c === 'BL_REPUESTO' || c === 'BL_MECANICO_REPUESTO') return <FaLockOpen className={cls} title='Bloqueo repuesto' />
	if (c.startsWith('BL_')) return <FaLock className={`${cls} text-[#B3261E]`} title='Bloqueo' />
	if (c === 'AL_PROT_REPUESTA') return <FaBellSlash className={cls} title='Alarma repuesta' />
	if (c.startsWith('AL_')) return <FaBell className={`${cls} text-amber-500`} title='Alarma de protección' />
	if (c === 'AC_PERDIDA') return <Corriente dc />
	if (c === 'AC_RESTABLECIDA') return <Corriente dc={false} />
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
	const [abiertos, setAbiertos] = useState(() => new Set())
	const [copiado, setCopiado] = useState(null)

	// Procesa en orden cronológico (el motor lo necesita para la pila de posición) y luego invierte para mostrar.
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
		return procesar(filas, { gapSegundos: gap })
			.map((ev) => ({ ...ev, accion: resolverAccion(ev, config) }))
			.reverse()
	}, [registros, version, equipo, gap, config])

	// Los informativos (actualización de hora, etc.) no se muestran; siguen disponibles en Registros/Avanzados.
	const visibles = useMemo(() => eventos.filter((e) => !e.informativo), [eventos])
	// Detalles de diagnóstico interno (duplicados) no se muestran; quedan en el portapapeles al copiar.
	const detalleVisible = (ev) => ev.detalle.filter((d) => !/duplicado/.test(d))
	const ahora = Date.now()
	const recientes = visibles.filter((e) => ahora - e.fin.getTime() <= H24)
	const anteriores = visibles.filter((e) => ahora - e.fin.getTime() > H24)
	const ultimo = visibles[0] || null // el más reciente (la lista ya viene invertida)

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
					<h3 className={`m-0 text-sm font-semibold ${sev.texto}`}>{ev.veredicto}</h3>
					{detalleVisible(ev).length > 0 && <p className='mt-0.5 text-gray-600 dark:text-zinc-300'>{detalleVisible(ev).join(' · ')}</p>}
				</div>
				<div className='flex items-start gap-1.5 px-3 py-2.5 text-xs'>
					<button type='button' onClick={() => toggle(k)} className='rounded border border-gray-300 px-2 py-0.5 text-gray-600 hover:bg-gray-50 dark:border-zinc-500 dark:text-zinc-200 dark:hover:bg-zinc-600'>
						{ev.crudos.length} registro{ev.crudos.length === 1 ? '' : 's'}
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
						<div className='mt-1.5 text-right'>
							<button type='button' onClick={() => copiar(ev, k)} title='Copia veredicto, código y crudos con sus IDs, para reportar un veredicto incorrecto' className='rounded border border-gray-300 px-2 py-0.5 text-[11px] text-gray-500 hover:bg-gray-100 dark:border-zinc-500 dark:text-zinc-300 dark:hover:bg-zinc-700'>
								{copiado === k ? 'Copiado' : 'Copiar para reportar'}
							</button>
						</div>
					</div>
				)}
			</li>
		)
	}

	return (
		<div className='text-sm text-gray-900 dark:text-zinc-100'>
			<div className='mb-3 flex items-center justify-end'>
				<label className='flex items-center gap-2 text-gray-600 dark:text-zinc-300'>
					Gap máx. (s)
					<input type='number' min='0' step='0.5' value={gap} onChange={(e) => setGap(parseFloat(e.target.value) || 0)}
						className='w-20 rounded border border-gray-300 px-2 py-1 text-gray-900 dark:border-zinc-500 dark:bg-zinc-800 dark:text-zinc-100' />
				</label>
			</div>

			{visibles.length === 0 ? (
				<p className='py-8 text-center text-gray-500 dark:text-zinc-400'>No hay registros en el rango seleccionado.</p>
			) : (
				<>
					<section className='mb-6 rounded-lg border-2 border-sky-300 bg-sky-50/70 p-3 dark:border-sky-700 dark:bg-sky-950/40'>
						<h4 className='mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-sky-900 dark:text-sky-200'>
							<FaRegClock className='h-4 w-4' />
							Últimas 24 horas
							<span className='rounded-full bg-sky-700 px-2 py-0.5 text-xs font-semibold text-white dark:bg-sky-500'>{recientes.length}</span>
						</h4>
						{recientes.length > 0 ? (
							<ul className='m-0 flex list-none flex-col gap-1.5 p-0'>
								{recientes.map((ev, i) => <Evento key={'r' + i} ev={ev} k={'r' + i} />)}
							</ul>
						) : (
							<p className='m-0 rounded border border-dashed border-sky-300 bg-white/60 px-3 py-3 text-center text-sky-900/80 dark:border-sky-700 dark:bg-zinc-800/60 dark:text-sky-200/80'>
								Sin eventos en las últimas 24 horas{ultimo ? ` · el último fue el ${fFecha(ultimo.fin)} a las ${fHora(ultimo.fin)}` : ''}
							</p>
						)}
					</section>
					{anteriores.length > 0 && (
						<section>
							<h4 className='mb-2 text-sm font-bold uppercase tracking-wide text-gray-500 dark:text-zinc-400'>
								Anteriores <span className='ml-1 rounded-full bg-gray-300 px-2 py-0.5 text-xs font-semibold text-gray-800 dark:bg-zinc-600 dark:text-zinc-100'>{anteriores.length}</span>
							</h4>
							<ul className='m-0 flex list-none flex-col gap-1.5 p-0'>
								{anteriores.map((ev, i) => <Evento key={'a' + i} ev={ev} k={'a' + i} />)}
							</ul>
						</section>
					)}
				</>
			)}
		</div>
	)
}
