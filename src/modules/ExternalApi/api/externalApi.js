// Servicio API del módulo API externa.
//
// Administración (sesión de Reconecta):
//   GET    /apiTokens          → tokens de la cooperativa, sin el secreto
//   GET    /apiTokens/scopes   → permisos disponibles para el alta
//   POST   /apiTokens          → alta; la respuesta trae el secreto UNA sola vez
//   DELETE /apiTokens/:id      → revoca
//
// API externa (token de API, no la sesión):
//   GET /v1/external/openapi.json → especificación pública, arma la documentación
//   GET /v1/external/...          → lo que se prueba desde la documentación
import axios from 'axios'
import { request } from '../../../utils/js/request'
import { backend } from '../../../utils/routes/app.routes'

export const EXTERNAL_BASE = `${backend.Reconecta}/v1/external`

export const externalApi = {
	listTokens: async () => {
		const { data } = await request(`${backend.Reconecta}/apiTokens`, 'GET')
		return data
	},

	getScopes: async () => {
		const { data } = await request(`${backend.Reconecta}/apiTokens/scopes`, 'GET')
		return data
	},

	/**
	 * @param {{ name: string, scopes: string[], expires_in_days: number|null }} body
	 * @returns {Promise<{ token: string, data: Object }>}
	 */
	createToken: async (body) => {
		const { data } = await request(`${backend.Reconecta}/apiTokens`, 'POST', body)
		return data
	},

	revokeToken: async (id) => {
		const { data } = await request(`${backend.Reconecta}/apiTokens/${id}`, 'DELETE')
		return data
	},

	getSpec: async () => {
		const { data } = await axios.get(`${EXTERNAL_BASE}/openapi.json`)
		return data
	},

	/**
	 * Pedido de prueba desde la documentación, con el token que pega el usuario.
	 * No pasa por `request` porque ese agrega el token de la sesión, y acá hay
	 * que probar exactamente lo que va a mandar el integrador. Nunca lanza: la
	 * respuesta de error también es lo que se quiere ver.
	 *
	 * @returns {Promise<{ status: number, ms: number, data: any, headers: Object }>}
	 */
	tryRequest: async (path, token) => {
		const start = performance.now()
		try {
			const response = await axios.get(`${EXTERNAL_BASE}${path}`, {
				headers: { Authorization: `Bearer ${token}` },
				validateStatus: () => true,
			})
			return {
				status: response.status,
				ms: Math.round(performance.now() - start),
				data: response.data,
				headers: response.headers,
			}
		} catch (error) {
			return { status: 0, ms: Math.round(performance.now() - start), data: { error: error.message }, headers: {} }
		}
	},
}
