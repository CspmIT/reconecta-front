// MarkerOptions.js
import L from 'leaflet'

export const redIcon = (nro) =>
	new L.divIcon({
		iconSize: [25, 41],
		iconAnchor: [12, 41],
		popupAnchor: [1, -34],
		shadowSize: [41, 41],
		className: 'leaflet-marker-icon-blue',
		html: `<span class="marcador_ubicacion_map" style="background: red;" ><span class="interior_marcador_map" ><a class="icono_marcador_user_map" style="font-size: 14px;"><i class="fas fa-wrench" style="color: black; font-size: 14px; margin-left: 4px;">${nro}</i></a></span></span>`,
	})
export const workIcon = () =>
	new L.divIcon({
		iconSize: [25, 41],
		iconAnchor: [12, 41],
		popupAnchor: [1, -34],
		shadowSize: [41, 41],
		className: 'leaflet-marker-icon-blue',
		html: `<span class="marcador_working" ><span class="interior_working" ></span></span>`,
	})

export const blueIcon = (nro) =>
	new L.divIcon({
		iconSize: [25, 41],
		iconAnchor: [12, 41],
		popupAnchor: [1, -34],
		shadowSize: [41, 41],
		className: 'leaflet-marker-icon-blue',
		html: `<span class="marcador_ubicacion_map" style="background: blue;" ><span class="interior_marcador_map" ><a class="icono_marcador_user_map" style="font-size: 14px;"><i class="fas fa-wrench" style="color: black; font-size: 14px; margin-left: 4px;">${nro}</i></a></span></span>`,
	})
export const greenIcon = (nro) =>
	new L.divIcon({
		iconSize: [25, 41],
		iconAnchor: [12, 41],
		popupAnchor: [1, -34],
		shadowSize: [41, 41],
		className: 'leaflet-marker-icon-green',
		html: `<span class="marcador_ubicacion_map" style="background: green;" ><span class="interior_marcador_map" ><a class="icono_marcador_user_map" style="font-size: 14px;"><i class="fas fa-wrench" style="color: black; font-size: 14px; margin-left: 4px;">${nro}</i></a></span></span>`,
	})
export const yellowIcon = (nro) =>
	new L.divIcon({
		iconSize: [25, 41],
		iconAnchor: [12, 41],
		popupAnchor: [1, -34],
		shadowSize: [41, 41],
		className: 'leaflet-marker-icon-green',
		html: `<span class="marcador_ubicacion_map" style="background: yellow;" ><span class="interior_marcador_map" ><a class="icono_marcador_user_map" style="font-size: 14px;"><i class="fas fa-wrench" style="color: black; font-size: 14px; margin-left: 4px;">${nro}</i></a></span></span>`,
	})

const getIcon = (type, nro) => {
	switch (type) {
		case 1:
			//Reconectador
			return redIcon(nro)
		case 2:
			//Sub Estacion
			return blueIcon(nro)
		case 3:
			//Medidor
			return greenIcon(nro)
		case 4:
			//marcador con icono de trabajador
			return workIcon()
		default:
			return redIcon(nro) // valor predeterminado
	}
}
class markerCustom {
	constructor(
		id = false,
		lat,
		lng,
		type = 1,
		info = {
			name: 'nuevo',
		}
	) {
		this.id = id || 0
		this.lat = lat
		this.lng = lng
		this.info = info
		this.icon = getIcon(type, this.id)
	}
}

export default markerCustom
