import { useRef, useState } from 'react'
import { BASE_LAYERS, useMapContext } from '../context/MapContext'
import { networkBounds } from '../utils/js/bounds'
import TypeFilterPop from './TypeFilterPop'

/*
 * Herramientas sobre el mapa. El editor de tramos llega en la fase 3.
 */
function MapTools() {
	const {
		locked,
		setLocked,
		baseKey,
		cycleBase,
		types,
		visibleTypes,
		panelCollapsed,
		setPanelCollapsed,
		armed,
		setArmed,
		showGuides,
		setShowGuides,
		lupas,
		config,
		mainMapRef,
		onMap,
		lineMode,
		toggleLineMode,
		lines,
		fullscreen,
		toggleFullscreen,
	} = useMapContext()
	const typeBtnRef = useRef(null)
	const [typeOpen, setTypeOpen] = useState(false)

	const filtrado = visibleTypes && visibleTypes.size !== types.length

	const encuadrar = () => {
		const map = mainMapRef.current
		if (!map) return
		// Marcadores visibles Y vertices de los tramos: los tramos se extienden
		// mas alla del ultimo equipo y quedarian fuera de pantalla
		const caja = networkBounds(onMap, lines)
		if (!caja) {
			if (config) map.setView(config.center, config.zoom)
			return
		}
		// maxZoom: con un solo punto fitBounds se iria al zoom maximo
		map.fitBounds([caja.sw, caja.ne], { padding: [40, 40], maxZoom: 16 })
	}

	return (
		<>
			<div className='rc-tools'>
				<button
					type='button'
					className={`rc-tool${locked ? ' on' : ''}`}
					title={locked ? 'Desbloquear la vista' : 'Bloquear la vista'}
					onClick={() => setLocked(!locked)}
				>
					<svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8'>
						<rect x='4' y='10' width='16' height='11' rx='2' />
						{locked ? <path d='M8 10V7a4 4 0 0 1 8 0v3' /> : <path d='M8 10V7a4 4 0 0 1 7.9-.7' />}
					</svg>
				</button>
				<button
					type='button'
					ref={typeBtnRef}
					className={`rc-tool${filtrado ? ' on' : ''}`}
					title='Tipos de equipo visibles'
					onClick={() => setTypeOpen((v) => !v)}
				>
					<svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8'>
						<path d='m3 7 2 2 3-3M3 17l2 2 3-3M12 8h9M12 18h9' />
					</svg>
				</button>
				<button
					type='button'
					className='rc-tool'
					title={`Capa base: ${BASE_LAYERS[baseKey].label}`}
					onClick={cycleBase}
				>
					<svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8'>
						<path d='M12 3 2 8l10 5 10-5z' />
						<path d='M2 13l10 5 10-5M2 18l10 5 10-5' />
					</svg>
				</button>
				<button
					type='button'
					className='rc-tool'
					title='Encuadrar toda la red'
					disabled={locked}
					onClick={encuadrar}
				>
					<svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8'>
						<path d='M3 9V4h5M21 9V4h-5M3 15v5h5M21 15v5h-5' />
					</svg>
				</button>
				<button
					type='button'
					className={`rc-tool${showGuides ? ' on' : ''}`}
					title={showGuides ? 'Ocultar guías de lupa' : 'Mostrar guías de lupa'}
					onClick={() => setShowGuides(!showGuides)}
				>
					<svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8'>
						<path d='M4 4h4M4 4v4M20 4h-4M20 4v4M4 20h4M4 20v-4M20 20h-4M20 20v-4' />
						<path d='M9 12h6' strokeDasharray='2 2' />
					</svg>
				</button>

				<div className='rc-sep' />

				<button
					type='button'
					className={`rc-tool${armed ? ' armed' : ''}`}
					title={locked ? 'Desbloqueá la vista para crear lupas' : 'Nueva lupa'}
					disabled={locked}
					onClick={() => setArmed(!armed)}
				>
					<svg width='19' height='19' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8'>
						<circle cx='10.5' cy='10.5' r='6.5' />
						<path d='M20.5 20.5 15.2 15.2M10.5 7.8v5.4M7.8 10.5h5.4' />
					</svg>
				</button>
				<button
					type='button'
					className={`rc-tool${lineMode ? ' on' : ''}`}
					title={locked ? 'Desbloqueá la vista para editar la red' : 'Editar tramos de la red'}
					disabled={locked}
					onClick={() => toggleLineMode()}
				>
					<svg
						width='19'
						height='19'
						viewBox='0 0 24 24'
						fill='none'
						stroke='currentColor'
						strokeWidth='1.8'
						strokeLinejoin='round'
						strokeLinecap='round'
					>
						<path d='M3 19 8 9l5 4 3-6 5 8' />
						<circle cx='8' cy='9' r='1.6' fill='currentColor' stroke='none' />
						<circle cx='13' cy='13' r='1.6' fill='currentColor' stroke='none' />
						<circle cx='16' cy='7' r='1.6' fill='currentColor' stroke='none' />
					</svg>
				</button>
			</div>

			<div className='rc-tools-r'>
				{lupas.length > 0 && (
					<div className='rc-lupachip'>
						<b>{lupas.length}</b> {lupas.length === 1 ? 'lupa' : 'lupas'}
					</div>
				)}
				<button
					type='button'
					className={`rc-tool${fullscreen ? ' on' : ''}`}
					title={fullscreen ? 'Salir de pantalla completa (Esc)' : 'Pantalla completa'}
					onClick={toggleFullscreen}
				>
					<svg
						width='18'
						height='18'
						viewBox='0 0 24 24'
						fill='none'
						stroke='currentColor'
						strokeWidth='1.8'
						strokeLinecap='round'
						strokeLinejoin='round'
					>
						{fullscreen ? (
							<path d='M4 14h6v6M20 10h-6V4M14 10l7-7M3 21l7-7' />
						) : (
							<path d='M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7' />
						)}
					</svg>
				</button>
				{/*
				 * Azul cuando la tabla ESTA visible, igual que el boton de guias:
				 * en esta barra el azul significa "esto esta activo", no "esto es
				 * lo que va a pasar si lo toco".
				 */}
				<button
					type='button'
					className={`rc-tool${panelCollapsed ? '' : ' on'}`}
					title={panelCollapsed ? 'Mostrar tabla' : 'Ocultar tabla'}
					onClick={() => setPanelCollapsed(!panelCollapsed)}
				>
					<svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8'>
						<rect x='3' y='4' width='18' height='16' rx='2' />
						<path d='M14 4v16' />
						<path d={panelCollapsed ? 'm9.5 10-2.5 2 2.5 2' : 'm7 10 2.5 2L7 14'} />
					</svg>
				</button>
			</div>

			<TypeFilterPop anchorRef={typeBtnRef} open={typeOpen} onClose={() => setTypeOpen(false)} side='right' />
		</>
	)
}

export default MapTools
