/*
 * Servicio API del modulo de Notificaciones.
 *
 *   GET  /push/publicKey      → clave VAPID y si el servidor tiene push activo
 *   GET  /push/devices        → dispositivos suscritos del usuario
 *   POST /push/subscribe      → alta de este dispositivo
 *   POST /push/unsubscribe    → baja de este dispositivo
 *   POST /push/test           → notificacion de prueba (ignora el silencio)
 *   GET  /notificationPref    → preferencias del usuario
 *   PUT  /notificationPref    → guarda (merge) las preferencias
 *   GET  /notificationPref/options → tipos de alarma y de equipo validos
 *   GET  /Equipments          → equipos, para silenciar de a uno
 */
import { request } from '../../../utils/js/request'
import { backend } from '../../../utils/routes/app.routes'

export const notificationApi = {
	getPublicKey: async () => {
		const { data } = await request(`${backend.Reconecta}/push/publicKey`, 'GET')
		return data
	},

	getDevices: async () => {
		const { data } = await request(`${backend.Reconecta}/push/devices`, 'GET')
		return data
	},

	/** @param {Object} subscription - PushSubscription.toJSON() del navegador. */
	subscribe: async (subscription) => {
		const { data } = await request(`${backend.Reconecta}/push/subscribe`, 'POST', { subscription })
		return data
	},

	unsubscribe: async (endpoint) => {
		const { data } = await request(`${backend.Reconecta}/push/unsubscribe`, 'POST', { endpoint })
		return data
	},

	sendTest: async () => {
		const { data } = await request(`${backend.Reconecta}/push/test`, 'POST')
		return data
	},

	/** Valores validos (tipos de alarma y de equipo) para armar la pantalla. */
	getOptions: async () => {
		const { data } = await request(`${backend.Reconecta}/notificationPref/options`, 'GET')
		return data
	},

	getPreferences: async () => {
		const { data } = await request(`${backend.Reconecta}/notificationPref`, 'GET')
		return data
	},

	/** @param {Object} changes - Solo los campos a cambiar: el backend hace merge. */
	savePreferences: async (changes) => {
		const { data } = await request(`${backend.Reconecta}/notificationPref`, 'PUT', changes)
		return data
	},

	/** Equipos, para silenciar uno puntual. */
	getEquipments: async () => {
		const { data } = await request(`${backend.Reconecta}/Equipments`, 'GET')
		return (Array.isArray(data) ? data : []).map((equipment) => ({
			id: equipment.id,
			name: [equipment.observation, equipment.serial].filter(Boolean).join(' - ') || `Equipo ${equipment.id}`,
			type: equipment.equipmentmodels?.type || null,
		}))
	},
}
