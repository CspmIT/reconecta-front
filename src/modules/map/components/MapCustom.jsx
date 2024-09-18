import { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, LayersControl } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import '../utils/css/marker.modules.css'
import 'leaflet-draw/dist/leaflet.draw.css'
import 'leaflet-draw'
import DrawControl from './DrawControl'
import 'react-toastify/dist/ReactToastify.css'
import '../utils/css/toastCustom.modules.css'
import '../utils/css/AlertSwal.modules.css'

function MapCustom({ center, id, zoom, activeZoom = true, markers, polylines, editor = false, getLatLngMarker = false }) {
	const mapRef = useRef(null)

	useEffect(() => {
		if (mapRef.current) {
			const map = mapRef.current // Accedemos al mapa
			if (activeZoom) {
				// Si el zoom está activo, deshabilitamos interacciones
				map.scrollWheelZoom.disable()
				map.dragging.disable()
				map.doubleClickZoom.disable()
			} else {
				// Si el zoom no está activo, habilitamos interacciones
				map.scrollWheelZoom.enable()
				map.dragging.enable()
				map.doubleClickZoom.enable()
			}
		}
	}, [activeZoom]) // Escuchamos cambios en activeZoom
	return (
		<MapContainer
			ref={mapRef}
			center={center}
			preferCanvas={true}
			zoom={zoom}
			wheelPxPerZoomLevel={500}
			zoomSnap={0.1}
			dragging={!activeZoom}
			zoomControl={false}
			maxZoom={activeZoom ? 100 : zoom}
			minZoom={activeZoom ? 0 : zoom}
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
			<DrawControl polylines={polylines} markers={markers} editor={editor} getLatLngMarker={getLatLngMarker} />
		</MapContainer>
	)
}

export default MapCustom
