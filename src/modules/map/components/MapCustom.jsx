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
import { map } from 'leaflet'

function MapCustom({
	abm = false,
	center,
	zoom,
	activeMove = true,
	activeZoom = false,
	markers,
	polylines,
	editor = false,
	getLatLngMarker = false,
	filters = {}
}) {
	const mapRef = useRef(null)
	useEffect(() => {
		if (mapRef.current) {
			const map = mapRef.current // Accedemos al mapa
			if (activeZoom) {
				// Si el zoom no está activo, habilitamos interacciones
				map.scrollWheelZoom.enable()
				map.dragging.enable()
				map.maxZoom = 18
				map.minZoom = 0
				map.doubleClickZoom.enable()
			} else {
				// Si el zoom está activo, deshabilitamos interacciones
				map.scrollWheelZoom.disable()
				map.dragging.disable()
				map.maxZoom = zoom
				map.minZoom = zoom
				map.doubleClickZoom.disable()
			}
		}
	}, [activeZoom]) // Escuchamos cambios en activeZoom
	useEffect(() => {
		console.log(center)
		if (mapRef.current) {
			mapRef.current.setView(center)
		}
	}, [center])
	return (
		<MapContainer
			ref={mapRef}
			center={center}
			preferCanvas={true}
			zoom={zoom}
			wheelPxPerZoomLevel={500}
			zoomSnap={0.1}
			dragging={activeMove}
			zoomControl={false}
			maxZoom={activeZoom ? 18 : zoom}
			minZoom={activeZoom ? zoom : zoom}
			style={{ minHeight: '100%', width: '100%', borderRadius: '10px' }}
			whenCreated={(mapInstance) => {
				mapRef.current = mapInstance;
			}}
		>
			<LayersControl position='topright'>
				<LayersControl.BaseLayer checked name='Street'>
					<TileLayer url='https://wms.ign.gob.ar/geoserver/gwc/service/tms/1.0.0/capabaseargenmap@EPSG%3A3857@png/{z}/{x}/{-y}.png' />
				</LayersControl.BaseLayer>
				<LayersControl.BaseLayer name='Satelital'>
					<TileLayer url='https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}' />
				</LayersControl.BaseLayer>
			</LayersControl>
			{markers && (
				<DrawControl abm={abm} polylines={polylines} markers={markers} editor={editor} getLatLngMarker={getLatLngMarker} filters={filters} />
			)}
		</MapContainer>
	)
}

export default MapCustom
