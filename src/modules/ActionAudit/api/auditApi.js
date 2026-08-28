// Servicio API del módulo de Auditoría.
//
// Endpoints:
//   GET /audit/dashboard?days=7            → KPIs, series, rankings y errores
//   GET /audit/movements?from&to&search…   → listado paginado de acciones
import { request } from '../../../utils/js/request'
import { backend } from '../../../utils/routes/app.routes'

export const auditApi = {
	/**
	 * Trae todo el dashboard en una sola llamada.
	 *
	 * @param {number} days - 7, 30 o 90.
	 * @returns {Promise<Object>}
	 */
	getDashboard: async (days) => {
		const { data } = await request(`${backend.Reconecta}/audit/dashboard?days=${days}`, 'GET')
		return data
	},

	/**
	 * Listado de movimientos con filtros.
	 *
	 * @param {Object} filters - from, to, search, page y limit.
	 * @returns {Promise<{ rows: Array, count: number }>}
	 */
	getMovements: async (filters = {}) => {
		const query = new URLSearchParams(
			Object.entries(filters).filter(([, value]) => value !== '' && value !== undefined && value !== null)
		).toString()
		const { data } = await request(`${backend.Reconecta}/audit/movements?${query}`, 'GET')
		return data
	},
}
