import { MapContainer, TileLayer, LayersControl, Marker, LayerGroup, useMap } from 'react-leaflet'
import { useState, useEffect } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet.fullscreen/Control.FullScreen.js'
import 'leaflet.fullscreen/Control.FullScreen.css'
import '../../utils/css/marker.modules.css'
// Definimos los iconos personalizados
const redIcon = new L.divIcon({
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41],
	className: 'leaflet-marker-icon-blue',
	html: `<spam class="marcador_ubicacion_map" style="background: red;" ><spam class="interior_marcador_map" ><a class="icono_marcador_user_map" style="font-size: 14px;"><i class="fas fa-wrench"  style="color: black; font-size: 14px; margin-left: 4px;"></i></a></spam></spam>`,
})

const blueIcon = new L.divIcon({
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41],
	className: 'leaflet-marker-icon-blue',
	html: `<spam class="marcador_ubicacion_map" style="background: blue;" ><spam class="interior_marcador_map" ><a class="icono_marcador_user_map" style="font-size: 14px;"><i class="fas fa-wrench"  style="color: black; font-size: 14px; margin-left: 4px;"></i></a></spam></spam>`,
})
const FullScreenControl = () => {
	const [isFullScreenControlAdded, setIsFullScreenControlAdded] = useState(false)
	const map = useMap()

	useEffect(() => {
		if (!isFullScreenControlAdded) {
			L.control.fullscreen().addTo(map)
			setIsFullScreenControlAdded(true)
		}
		const handleOverlayAdd = (event) => {
			if (event.name === 'Reconectadores') {
				console.log('Markers layer added')
			}
		}
		const handleOverlayRemove = (event) => {
			if (event.name === 'Reconectadores') {
				console.log('Markers layer removed')
			}
		}
		map.on('overlayadd', handleOverlayAdd)
		map.on('overlayremove', handleOverlayRemove)
		return () => {
			map.off('overlayadd', handleOverlayAdd)
			map.off('overlayremove', handleOverlayRemove)
		}
	}, [isFullScreenControlAdded, map])

	return null
}

function MapPrueba() {
	const center = [-30.709565, -62.011055]
	const marker1 = [-30.709, -62.011]
	const marker2 = [-30.71, -62.012]
	const marker3 = [-30.709, -62.021]
	const marker4 = [-30.71, -62.022]

	return (
		<MapContainer center={center} zoom={15} style={{ minHeight: '100%', width: '100%' }}>
			<LayersControl position='topright'>
				<LayersControl.BaseLayer checked name='Street'>
					<TileLayer url='https://tile.openstreetmap.org/{z}/{x}/{y}.png?{foo}' foo='bar' />
				</LayersControl.BaseLayer>
				<LayersControl.BaseLayer name='Satelital'>
					<TileLayer url='https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}' />
				</LayersControl.BaseLayer>
			</LayersControl>
			<LayersControl position='topright'>
				<LayersControl.Overlay checked name='Reconectadores'>
					<LayerGroup>
						<Marker position={marker1} icon={redIcon} />
						<Marker position={marker2} icon={redIcon} />
					</LayerGroup>
				</LayersControl.Overlay>
				<LayersControl.Overlay checked name='Sub-Estaciones rurales'>
					<LayerGroup>
						<Marker position={marker3} icon={blueIcon} />
						<Marker position={marker4} icon={blueIcon} />
					</LayerGroup>
				</LayersControl.Overlay>
			</LayersControl>
			<FullScreenControl />
		</MapContainer>
	)
}

export default MapPrueba
