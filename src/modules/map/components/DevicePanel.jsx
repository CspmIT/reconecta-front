import { useEffect, useRef, useState } from 'react'
import { useMapContext } from '../context/MapContext'
import { fmtI, fmtV, iSobrecargada, vFueraDeRango } from '../utils/js/format'
import { shapeOf, stateClass, STATE_LABEL } from '../utils/js/pins'
import TypeFilterPop from './TypeFilterPop'

/*
 * Panel lateral: busqueda, filtros y la tabla de equipos con las mediciones que
 * llegan de /map/live. Las tensiones vienen en volts desde el equipo, el
 * formateo a kV se hace aca.
 */

const CHIPS = [
	{ f: 'todos', label: 'Todos', color: null },
	// Cerrado = rojo, abierto = verde: convencion de los operadores
	{ f: 'cerrado', label: 'Cerrados', color: 'var(--rc-rojo)' },
	{ f: 'abierto', label: 'Abiertos', color: 'var(--rc-verde)' },
	{ f: 'sincom', label: 'S/com', color: 'var(--rc-gris)' },
]

function DeviceRow({ device }) {
	const { selected, setSelected, setHovered } = useMapContext()
	const sinDatos = device.st === 'sincom'

	return (
		<div
			className={`rc-row${selected === device.id ? ' sel' : ''}`}
			onClick={() => setSelected(device.id)}
			onMouseEnter={() => setHovered(device.id)}
			onMouseLeave={() => setHovered(null)}
		>
			<div className='rc-row-h'>
				<span className={`rc-shape sh-${shapeOf(device.type)} ${stateClass(device.st)}`} />
				<span className='rc-row-tag'>{device.name}</span>
				<span className='rc-row-loc'>{device.description || ''}</span>
				{device.alarm && <span className='rc-alarm-chip'>ALARMA</span>}
				<span className={`rc-state rc-${device.st ? `st-${device.st}` : 'st-nodev'}`}>
					{device.st ? STATE_LABEL[device.st] : 'Sin equipo'}
				</span>
			</div>
			<div className='rc-meas'>
				<b>kV</b>
				{device.v.map((v, idx) => (
					<span key={idx} className={sinDatos ? 'off' : vFueraDeRango(v) ? 'warn' : ''}>
						{fmtV(v)}
					</span>
				))}
			</div>
			<div className='rc-meas'>
				<b>A</b>
				{device.i.map((i, idx) => (
					<span key={idx} className={sinDatos ? 'off' : iSobrecargada(i, device.type) ? 'warn' : ''}>
						{fmtI(i)}
					</span>
				))}
			</div>
		</div>
	)
}

/*
 * Acceso al tablero del equipo. Va aca, en una barra propia del equipo
 * seleccionado, y no como un boton en cada fila: repetido 13 veces no cabe con
 * nombre, y escondido hasta el hover no se encuentra. Como seleccionar desde el
 * mapa ya trae la fila a la vista, la barra aparece donde el operador esta
 * mirando.
 */
function SelectedBar() {
	const { devices, selected, setSelected, abrirTablero, openingId } = useMapContext()
	const device = devices.find((d) => d.id === selected)
	if (!device) return null
	const abriendo = openingId === device.id

	return (
		<div className='rc-selbar'>
			<div className='rc-selbar-h'>
				<span className={`rc-shape sh-${shapeOf(device.type)} ${stateClass(device.st)}`} />
				<b>{device.name}</b>
				<span className='rc-selbar-loc'>{device.description || ''}</span>
				<button type='button' className='rc-selbar-x' title='Quitar la selección' onClick={() => setSelected(null)}>
					×
				</button>
			</div>
			<button
				type='button'
				className={`rc-selbar-go${abriendo ? ' loading' : ''}`}
				disabled={abriendo}
				onClick={() => abrirTablero(device)}
			>
				<svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.2'>
					<path d='M14 4h6v6M20 4l-8 8M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5' />
				</svg>
				{abriendo ? 'Buscando equipos…' : 'Ver tablero'}
			</button>
		</div>
	)
}

function DevicePanel() {
	const {
		devices,
		listed,
		alarmCount,
		alarmHidden,
		types,
		visibleTypes,
		query,
		setQuery,
		statusFilter,
		setStatusFilter,
		selected,
		panelCollapsed,
		stamp,
		stale,
		error,
	} = useMapContext()

	const typeBtnRef = useRef(null)
	const [typeOpen, setTypeOpen] = useState(false)
	const rowsRef = useRef(null)

	// Si la seleccion vino del mapa, se trae la fila a la vista
	useEffect(() => {
		if (selected === null || !rowsRef.current) return
		const row = rowsRef.current.querySelector('.rc-row.sel')
		row?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
	}, [selected])

	const filtradoPorTipo = visibleTypes && visibleTypes.size !== types.length
	const etiquetaTipos = !visibleTypes
		? 'Cargando tipos…'
		: visibleTypes.size === types.length
			? 'Todos los tipos'
			: visibleTypes.size === 0
				? 'Ningún tipo'
				: `${visibleTypes.size} de ${types.length} tipos`

	return (
		<aside className={`rc-panel${panelCollapsed ? ' collapsed' : ''}`}>
			<div className='rc-panel-top'>
				<div className='rc-panel-title'>
					<h2>Equipos monitoreados</h2>
					<span>{listed.length === devices.length ? listed.length : `${listed.length} / ${devices.length}`}</span>
				</div>
				<input
					className='rc-search'
					placeholder='Buscar equipo o ubicación'
					value={query}
					onChange={(e) => setQuery(e.target.value)}
				/>
				<div className='rc-chips'>
					{CHIPS.map((c) => (
						<button
							type='button'
							key={c.f}
							className={`rc-chip${statusFilter === c.f ? ' on' : ''}`}
							onClick={() => setStatusFilter(c.f)}
						>
							{c.color && <i style={{ background: c.color }} />}
							{c.label}
						</button>
					))}
				</div>

				{/*
				 * Fila aparte y no un chip mas: la alarma es otra dimension, no un
				 * estado excluyente con los de arriba. Ademas asi el badge de dos o
				 * tres digitos no aprieta los chips de estado (medido: desbordaba).
				 * Solo aparece si hay algo en alarma.
				 */}
				{alarmCount > 0 && (
					<button
						type='button'
						className={`rc-alarmbar${statusFilter === 'alarma' ? ' on' : ''}`}
						title={
							statusFilter === 'alarma'
								? 'Quitar el filtro de alarma'
								: `Ver solo ${alarmCount === 1 ? 'el equipo' : `los ${alarmCount} equipos`} en alarma` +
									(alarmHidden > 0
										? ` (${alarmHidden} en ${alarmHidden === 1 ? 'un tipo oculto' : 'tipos ocultos'})`
										: '')
						}
						onClick={() => setStatusFilter(statusFilter === 'alarma' ? 'todos' : 'alarma')}
					>
						<svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
							<path d='M12 3 1.8 20h20.4z' />
							<path d='M12 9v5M12 17.2v.1' />
						</svg>
						{/* El numero lo lleva el badge, la etiqueta queda fija: si el
						    texto trajera el singular/plural sin el numero, leido de
						    corrido queda incompleto */}
						<span className='grow'>
							En alarma
							{/* Aviso de que parte de las alarmas esta fuera de lo visible.
							    Al tocar el boton se muestran igual. */}
							{alarmHidden > 0 && statusFilter !== 'alarma' && (
								<em className='rc-alarmhidden'>
									{alarmHidden} fuera del filtro
								</em>
							)}
						</span>
						<span className='rc-badge'>{alarmCount}</span>
					</button>
				)}
				<button
					type='button'
					ref={typeBtnRef}
					className={`rc-typebtn${filtradoPorTipo ? ' filtered' : ''}`}
					onClick={() => setTypeOpen((v) => !v)}
				>
					<svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
						<path d='m3 7 2 2 3-3M3 17l2 2 3-3M12 8h9M12 18h9' />
					</svg>
					<span className='grow'>{etiquetaTipos}</span>
					<svg width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.4'>
						<path d='m6 9 6 6 6-6' />
					</svg>
				</button>

				<SelectedBar />
			</div>

			<div className='rc-rows' ref={rowsRef}>
				{listed.length === 0 ? (
					<div className='rc-empty'>Ningún equipo coincide con los filtros activos.</div>
				) : (
					listed.map((d) => <DeviceRow key={d.id} device={d} />)
				)}
			</div>

			<div className='rc-panel-foot'>
				<div className={`rc-live${stale || error ? ' stale' : ''}`}>
					<i />
					{error ? 'Sin conexión con el servidor' : stale ? 'Datos desactualizados' : 'Datos en vivo · InfluxDB'}
				</div>
				<span>{stamp ? new Date(stamp).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '—'}</span>
			</div>

			<TypeFilterPop anchorRef={typeBtnRef} open={typeOpen} onClose={() => setTypeOpen(false)} />
		</aside>
	)
}

export default DevicePanel
