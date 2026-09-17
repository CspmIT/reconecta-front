// Servicio API del módulo AutonomIA (aprovisionamiento Multivac).
//
// Reconecta:
//   GET  /autonomia/firmwares          → catálogo de releases APROBADOS para
//                                        Reconecta/General (lo filtra el backend)
//   GET  /autonomia/bin?key=           → binario del release, servido por el
//                                        backend (las credenciales del storage
//                                        quedan en el servidor, no en el bundle)
//   GET  /autonomia/eventos?limit=     → últimas programaciones/configuraciones
//   POST /autonomia/eventos            → registrar una programación/configuración
import axios from 'axios'
import { request } from '../../../utils/js/request'
import { backend } from '../../../utils/routes/app.routes'
import { storage } from '../../../storage/storage'
import { getData } from '../../../storage/cookies-store'

const BASE = `${backend.Reconecta}/autonomia`

const token = async () => (await getData('token')) || storage.get('tokenCooptech')

export const autonomiaApi = {
	/**
	 * Catálogo filtrado: solo releases aprobados y de producto Reconecta/General.
	 * @returns {Promise<{ firmwares: Array, origen: string }>}
	 */
	getFirmwares: async () => {
		const { data } = await request(`${BASE}/firmwares`, 'GET')
		return data
	},

	/**
	 * Descarga un binario del release como ArrayBuffer. El backend valida que
	 * la key pertenezca a un release del catálogo antes de servirla.
	 * @param {string} key - key del segmento / merged en el manifiesto.
	 * @returns {Promise<ArrayBuffer>}
	 */
	getBinario: async (key) => {
		const response = await axios({
			method: 'GET',
			url: `${BASE}/bin?key=${encodeURIComponent(key)}`,
			responseType: 'arraybuffer',
			withCredentials: true,
			headers: { Authorization: 'Bearer ' + (await token()) },
		})
		return response.data
	},

	/**
	 * Últimos eventos (programaciones / configuraciones) de la cooperativa.
	 * @param {number} limit
	 */
	getEventos: async (limit = 20) => {
		const { data } = await request(`${BASE}/eventos?limit=${limit}`, 'GET')
		return data
	},

	/**
	 * Registra un evento. Nunca frena el flujo de campo: los errores se
	 * loguean y se sigue (la placa ya quedó programada).
	 * @param {Object} evento - { tipo, modelo, version, modo, chip, mac, nombre_equipo, resultado, detalle }
	 */
	registrarEvento: async (evento) => {
		try {
			const { data } = await request(`${BASE}/eventos`, 'POST', evento)
			return data
		} catch (error) {
			console.error('AutonomIA: no se pudo registrar el evento', error?.message || error)
			return null
		}
	},
}
