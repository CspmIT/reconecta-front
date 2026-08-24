import LoaderComponent from '../../../components/Loader'
import DevicePanel from '../components/DevicePanel'
import EquipmentPicker from '../components/EquipmentPicker'
import LineEditor from '../components/LineEditor'
import LupaGuides from '../components/LupaGuides'
import LupaWindow from '../components/LupaWindow'
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
function MapLayout() {
	const { loading, error, config, toast, lupas, armed, rootRef, cardRef, lineMode } = useMapContext()

	if (loading) {
		return (
			<div className='w-full'>
				<LoaderComponent />
			</div>
		)
	}

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
	return (
		<MapProvider>
			<MapLayout />
		</MapProvider>
	)
}

export default Map
