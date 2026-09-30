import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import LoaderComponent from '../../../components/Loader'
import DevicePanel from '../components/DevicePanel'
import EquipmentPicker from '../components/EquipmentPicker'
import LineEditor from '../components/LineEditor'
import LupaGuides from '../components/LupaGuides'
import LupaWindow from '../components/LupaWindow'
import MapSetup from '../components/MapSetup'
import MapTools from '../components/MapTools'
import OperationalMap from '../components/OperationalMap'
import { MapProvider, useMapContext } from '../context/MapContext'
import '../utils/css/operational.css'

/*
 * Mapa operativo. La vista solo compone: el estado compartido vive en
 * MapContext y cada mapa (el principal y el de cada lupa) se maneja con
 * Leaflet puro.
 *
 * Fase pendiente del rediseno: editor de tramos con snapping sobre /map/lines.
 */
function MapLayout({ onCreated }) {
	const { loading, error, config, setup, toast, lupas, armed, rootRef, cardRef, lineMode } = useMapContext()

	if (loading) {
		return (
			<div className='w-full'>
				<LoaderComponent />
			</div>
		)
	}

	if (setup) return <MapSetup elements={setup.elements} onCreated={onCreated} />

	if (!config) {
		return <div className='rc-empty'>{error || 'No hay una vista de mapa configurada.'}</div>
	}

	// rootRef marca el elemento que se pide a pantalla completa: panel incluido
	return (
		<div className='rc-map' ref={rootRef}>
			<div className='rc-mapcard' ref={cardRef}>
				<OperationalMap />
				{/* En modo edicion las lupas estorban: se ocultan sin cerrarlas */}
				{!lineMode && (
					<>
						<LupaGuides />
						{lupas.map((lupa) => (
							<LupaWindow key={lupa.id} lupa={lupa} />
						))}
					</>
				)}
				<MapTools />
				<LineEditor />
				{armed && (
					<div className='rc-hint show'>
						<svg width='15' height='15' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
							<rect x='3' y='5' width='18' height='14' rx='2' strokeDasharray='3 3' />
						</svg>
						Dibujá un recuadro sobre la zona que querés ampliar
						<span className='sep'>·</span>
						<b>Esc</b> para cancelar
					</div>
				)}
				<div className={`rc-toast${toast ? ' show' : ''}`}>{toast}</div>
			</div>
			<DevicePanel />
			<EquipmentPicker />
		</div>
	)
}

function Map() {
	const navigate = useNavigate()
	const { state } = useLocation()
	// Tras dar de alta la vista se remonta el provider: vuelve a hacer la carga
	// inicial completa (vista, tipos, tramos, filtros y preferencias).
	const [carga, setCarga] = useState(0)
	// Si se llego desde otra pantalla que necesitaba el mapa (el alta de
	// elementos), se vuelve ahi en lugar de quedarse en el mapa vacio
	const onCreated = () => (state?.volver ? navigate(state.volver, { replace: true }) : setCarga((n) => n + 1))
	return (
		<MapProvider key={carga}>
			<MapLayout onCreated={onCreated} />
		</MapProvider>
	)
}

export default Map
