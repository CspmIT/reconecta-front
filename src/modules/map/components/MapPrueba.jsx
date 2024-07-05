import { MapContainer, TileLayer, LayersControl } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
// import 'leaflet.fullscreen/Control.FullScreen.js'
// import 'leaflet.fullscreen/Control.FullScreen.css'
import '../utils/css/marker.modules.css'
import 'leaflet-draw/dist/leaflet.draw.css'
import 'leaflet-draw'
import { markersRecloser } from '../utils/js/markers'
// import FullScreenControl from './FullScreen'
import { polylines } from '../utils/js/polilines'
import DrawControl from './DrawControl'
import 'react-toastify/dist/ReactToastify.css'
import '../utils/css/toastCustom.modules.css'
import '../utils/css/AlertSwal.modules.css'
function MapPrueba({ center, id, zoom }) {
	return (
		<>
			<MapContainer
				key={id}
				center={center}
				preferCanvas={true}
				zoom={zoom}
				wheelPxPerZoomLevel={500}
				zoomSnap={0.1}
				maxZoom={zoom}
				minZoom={zoom}
				fullscreenControl={false}
				zoomControl={false}
				touchZoom={false}
				scrollWheelZoom={false}
				dragging={false}
				doubleClickZoom={false}
				style={{ minHeight: '100%', width: '100%', borderRadius: '10px' }}
			>
				<LayersControl position='topright'>
					<LayersControl.BaseLayer checked name='Street'>
						<TileLayer url='https://wms.ign.gob.ar/geoserver/gwc/service/tms/1.0.0/capabaseargenmap@EPSG%3A3857@png/{z}/{x}/{-y}.png' />
					</LayersControl.BaseLayer>
					<LayersControl.BaseLayer name='Satelital'>
						<TileLayer url='https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}' />
					</LayersControl.BaseLayer>
				</LayersControl>
				<DrawControl polylines={polylines} markers={markersRecloser} />
			</MapContainer>
		</>
	)
}

export default MapPrueba
