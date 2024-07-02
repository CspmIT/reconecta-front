import { MapContainer, TileLayer, LayersControl } from 'react-leaflet'

import 'leaflet/dist/leaflet.css'
import 'leaflet.fullscreen/Control.FullScreen.js'
import 'leaflet.fullscreen/Control.FullScreen.css'
import '../utils/css/marker.modules.css'
import 'leaflet-draw/dist/leaflet.draw.css'
import 'leaflet-draw'
import { markersRecloser } from '../utils/js/markers'
import FullScreenControl from './FullScreen'
import { polylines } from '../utils/js/polilines'
import DrawControl from './DrawControl'

function MapPrueba() {
	const center = [-30.709865, -62.011055]
	return (
		<MapContainer
			center={center}
			preferCanvas={true}
			zoom={11.5}
			maxZoom={11.5}
			minZoom={11.5}
			touchZoom={false}
			scrollWheelZoom={false}
			dragging={false}
			doubleClickZoom={false}
			style={{ minHeight: '100%', width: '100%', borderRadius: '10px' }}
		>
			<LayersControl position='topright'>
				<LayersControl.BaseLayer checked name='Street'>
					{/* <TileLayer url='https://tile.openstreetmap.org/{z}/{x}/{y}.png?{foo}' foo='bar' /> */}
					<TileLayer
						url='https://wms.ign.gob.ar/geoserver/gwc/service/tms/1.0.0/capabaseargenmap@EPSG%3A3857@png/{z}/{x}/{-y}.png'
						foo='bar'
					/>
				</LayersControl.BaseLayer>
				<LayersControl.BaseLayer name='Satelital'>
					<TileLayer url='https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}' />
				</LayersControl.BaseLayer>
			</LayersControl>
			<DrawControl polylines={polylines} markers={markersRecloser} />
			<FullScreenControl />
		</MapContainer>
	)
}

export default MapPrueba
