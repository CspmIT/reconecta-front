import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, LayersControl } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import '../utils/css/marker.modules.css'
import 'leaflet-draw/dist/leaflet.draw.css'
import 'leaflet-draw'
import DrawControl from './DrawControl'
import 'react-toastify/dist/ReactToastify.css'
import '../utils/css/toastCustom.modules.css'
import '../utils/css/AlertSwal.modules.css'

function MapCustom({
	center,
	id,
	zoom,
	activeZoom = true,
	markers,
	polylines,
	editor = false,
	getLatLngMarker = false,
}) {
	const [mapKey, setMapKey] = useState(id)
	useEffect(() => {
		setMapKey(`${id}-${Date.now()}`)
	}, [markers, id])

	return (
		<>
			<MapContainer
				key={mapKey}
				center={center}
				preferCanvas={true}
				zoom={zoom}
				wheelPxPerZoomLevel={500}
				zoomSnap={0.1}
				maxZoom={!activeZoom ? zoom : 100}
				minZoom={!activeZoom ? zoom : 0}
				fullscreenControl={activeZoom}
				zoomControl={activeZoom}
				touchZoom={activeZoom}
				scrollWheelZoom={activeZoom}
				dragging={activeZoom}
				doubleClickZoom={activeZoom}
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
				<DrawControl
					polylines={polylines}
					markers={markers}
					editor={editor}
					getLatLngMarker={getLatLngMarker}
				/>
			</MapContainer>
		</>
	)
}

export default MapCustom
