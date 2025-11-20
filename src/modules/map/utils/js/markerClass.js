// MarkerOptions.js
import L from 'leaflet'
import { request } from '../../../../utils/js/request'
import { backend } from '../../../../utils/routes/app.routes'

export const redIcon = (nro) =>
	new L.divIcon({
		iconSize: [25, 41],
		iconAnchor: [10, 20],
		popupAnchor: [1, -34],
		shadowSize: [41, 41],
		className: 'leaflet-marker-icon-blue',
		html: `<div style="min-width: 3rem;min-height: 3rem;display: block;position: relative; color:black;font-size:15px;">
		<span class="marcador_ubicacion_map" style="background: red;border: 1px solid #00000069;box-shadow: 3px 1px 3px #000000a1;" >
			<a class="icono_marcador_user_map" style="font-size: 14px;"></a>
		</span>
			<p class="sing">
				${nro}
			</p>
		</div>`,
	})
export const workIcon = () =>
	new L.divIcon({
		iconSize: [25, 41],
		iconAnchor: [10, 20],
		popupAnchor: [1, -34],
		shadowSize: [41, 41],
		className: 'leaflet-marker-icon-blue',
		html: `<span class="marcador_working" ><span class="interior_working" ></span></span>`,
	})

export const blueIcon = (nro) =>
	new L.divIcon({
		iconSize: [25, 41],
		iconAnchor: [10, 20],
		popupAnchor: [1, -34],
		shadowSize: [41, 41],
		className: 'leaflet-marker-icon-blue',
		html: `<div style="min-width: 3rem;min-height: 3rem;display: block;position: relative; color:black;font-size:15px;">
		<span class="marcador_ubicacion_map" style="background: blue;border: 1px solid #00000069;box-shadow: 3px 1px 3px #000000a1;" >
			<a class="icono_marcador_user_map" style="font-size: 14px;"></a>
		</span>
		${nro ? `<p class="sing">${nro}</p>` : ''}
		</div>`,
	})
export const greenIcon = (nro) =>
	new L.divIcon({
		iconSize: [25, 41],
		iconAnchor: [10, 20],
		popupAnchor: [1, -34],
		shadowSize: [41, 41],
		className: 'leaflet-marker-icon-green',
		html: `<div style="min-width: 3rem;min-height: 3rem;display: block;position: relative; color:black;font-size:15px;">
		<span class="marcador_ubicacion_map" style="background: green;border: 1px solid #00000069;box-shadow: 3px 1px 3px #000000a1;" >
			<a class="icono_marcador_user_map" style="font-size: 14px;"></a>
		</span>
		${nro ? `<p class="sing">${nro}</p>` : ''}
		</div>`,
		// html: `<span class="marcador_ubicacion_map" style="background: green;" ><span class="interior_marcador_map" ><a class="icono_marcador_user_map" style="font-size: 14px;"><i class="fas fa-wrench" style="color: black; font-size: 14px; margin-left: 4px;">${nro}</i></a></span></span>`,
	})
export const yellowIcon = (nro, open) =>
	new L.divIcon({
		iconSize: [25, 41],
		iconAnchor: [10, 20],
		popupAnchor: [1, -34],
		shadowSize: [41, 41],
		className: 'leaflet-marker-icon-green',
		html: `<div style="min-width: 3rem;min-height: 3rem;display: block;position: relative; color:black;font-size:15px;">
				<span class="marcador_ubicacion_map ${
					open ? 'greenblink' : 'blink'
				}" style="background: yellow;border: 1px solid #00000069;box-shadow: 3px 1px 3px #000000a1;" >
					<a class="icono_marcador_user_map" style="font-size: 14px;"></a>
				</span>
				${nro ? `<p class="sing">${nro}</p>` : ''}
				</div>`,
	})
export const grayIcon = (nro) =>
	new L.divIcon({
		iconSize: [25, 41],
		iconAnchor: [10, 20],
		popupAnchor: [1, -34],
		shadowSize: [41, 41],
		className: 'leaflet-marker-icon-blue',
		html: `<div style="min-width: 3rem;min-height: 3rem;display: block;position: relative; color:black;font-size:15px;">
				<span class="marcador_ubicacion_map" style="background: gray;border: 1px solid #00000069;box-shadow: 3px 1px 3px #000000a1;" >
					<a class="icono_marcador_user_map" style="font-size: 14px;"></a>
				</span>
					${nro ? `<p class="sing">${nro}</p>` : ''}
				</div>`,
	})

export const getIcon = (status, nro) => {
	switch (status) {
		case 1:
			// Cerrado
			return redIcon(nro)
		case 2:
			// Abierto
			return greenIcon(nro)

		case 3:
			// Sin Relacion
			return grayIcon(nro)
		case 4:
			// Alerta
			return yellowIcon(nro, false)
		case 5:
			// En Mantenimiento
			return workIcon()
		case 6:
			// Alerta en abierto
			return yellowIcon(nro, true)
		default:
			return blueIcon(nro) // valor predeterminado
	}
}
class markerCustom {
	constructor(
		id = false,
		number = '',
		lat,
		lng,
		status = 3,
		info = {
			name: 'nuevo',
			data: [],
		},
		alert = false,
		recloser = [],
		equipments = []
	) {
		this.id = id || ''
		this.lat = lat
		this.lng = lng
		this.info = info
		this.alert = alert
		this.number = number
		this.icon = getIcon(status, number)
		this.recloser = recloser
		this.equipments = equipments
	}
	async fetchInfo() {
		try {
			/* if (this.recloser.length > 0) {
				// Reemplaza la URL con la API o endpoint que necesites
				const response = await request(
					`${backend[`${import.meta.env.VITE_APP_NAME}`]}/metrologiaIntantanea?id=${
						this.recloser[0].id_device
					}`,
					'GET'
				)
				if (response.status !== 200) {
					throw new Error('Error al obtener la información')
				}
				const data = {
					VL1: response.data.I_f_0?.[0].value || '',
					VL2: response.data.I_f_1?.[0].value || '',
					VL3: response.data.I_f_2?.[0].value || '',
				}
				this.info = { ...this.info, data: data }
				const recloser = await request(
					`${backend[`${import.meta.env.VITE_APP_NAME}`]}/getDataRecloser?id=${this.recloser[0].id_device}`,
					'GET'
				)
				if (recloser.status !== 200) {
					throw new Error('Error al obtener la información')
				}
				const status = recloser.data?.instantaneo?.['ac']?.[0]?.value
					? 1
					: recloser.data?.instantaneo?.['ac']
					? 2
					: 3
				this.icon = getIcon(status, this.number)
				this.alert = recloser?.data?.alarm || false
			} */
		} catch (error) {
			console.error('Error al obtener la información del marcador:', error)
		}
	}
}
export default markerCustom
