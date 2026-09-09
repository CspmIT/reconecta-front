// Servicio API del módulo de Auditoría.
//
// Reconecta:
//   GET /audit/dashboard?days=7&schema=…     → KPIs, series, rankings y errores
//   GET /audit/movements?from&to&search…     → listado de acciones
//   GET /audit/organizations                 → si el usuario puede cambiar de
//                                              cooperativa y cuáles tienen datos
// Cooptech:
//   GET /getClientsxProduct?id_product=2     → nombre visible de cada cooperativa
import { request } from '../../../utils/js/request'
import { requestAuth } from '../../LoginApp/utils/requesLogin'
import { backend } from '../../../utils/routes/app.routes'

// Id del producto Reconecta en Cooptech.
const ID_PRODUCT_RECONECTA = 2

// 'all' es la vista global: el backend la reserva al perfil Super Admin.
export const ALL_SCHEMAS = 'all'

const buildQuery = (params) =>
	new URLSearchParams(
		Object.entries(params).filter(([, value]) => value !== '' && value !== undefined && value !== null)
	).toString()

export const auditApi = {
	/**
	 * Trae todo el dashboard en una sola llamada.
	 *
	 * @param {number} days - 7, 30 o 90.
	 * @param {string} [schema] - Cooperativa a mirar, o 'all' para todas.
	 * @returns {Promise<Object>}
	 */
	getDashboard: async (days, schema) => {
		const { data } = await request(`${backend.Reconecta}/audit/dashboard?${buildQuery({ days, schema })}`, 'GET')
		return data
	},

	/**
	 * Listado de movimientos con filtros.
	 *
	 * @param {Object} filters - from, to, search, page, limit y schema.
	 * @returns {Promise<{ rows: Array, count: number }>}
	 */
	getMovements: async (filters = {}) => {
		const { data } = await request(`${backend.Reconecta}/audit/movements?${buildQuery(filters)}`, 'GET')
		return data
	},

	/**
	 * Cooperativas consultables y si el usuario tiene permiso para cambiar de
	 * cooperativa. El permiso lo decide el backend, así el front no necesita
	 * conocer el número de perfil.
	 *
	 * @returns {Promise<{ superadmin: boolean, own: string, schemas: string[] }>}
	 */
	getOrganizations: async () => {
		const { data } = await request(`${backend.Reconecta}/audit/organizations`, 'GET')
		return data
	},

	/**
	 * Nombres visibles de las cooperativas, que los tiene Cooptech y no
	 * Reconecta. Si falla (por ejemplo, una sesión sin datos de Cooptech) el
	 * selector sigue funcionando con el nombre del schema.
	 *
	 * @returns {Promise<Map<string, string>>} schema_name → name.
	 */
	getOrganizationNames: async () => {
		try {
			const response = await requestAuth(
				`${backend.Cooptech}/getClientsxProduct?id_product=${ID_PRODUCT_RECONECTA}`,
				'GET'
			)
			const list = response?.data || response || []
			return new Map(list.filter((item) => item.schema_name).map((item) => [item.schema_name, item.name]))
		} catch (error) {
			console.error('No se pudieron traer los nombres de las cooperativas:', error?.message || error)
			return new Map()
		}
	},
}
