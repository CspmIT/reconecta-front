import { backend } from '../../../utils/routes/app.routes'
import { request, requestAuth } from './requesLogin'

import { storage } from './storage'

export const logeoApp = async (usuarioId, schema) => {
	try {
		const urlUser = backend.Cooptech + `/getUser?id=${usuarioId}`
		const user = await requestAuth(urlUser, 'GET')
		const urlToken = backend[`${import.meta.env.VITE_APP_NAME}`] + '/loginCooptech'
		const info = {
			email: user.data.email,
			tokenCooptech: user.data.token_apps,
			schemaName: schema,
		}
		const token = await request(urlToken, 'POST', info)

		return token.data
	} catch (error) {
		return { error: error }
	}
}
export const schemaName = async (clientId, productId) => {
	try {
		const urlUser = backend.Cooptech + `/getSchemaProduct?clientId=${clientId}&productId=${productId}`
		const Response = await requestAuth(urlUser, 'GET')
		return Response.data[0].schema_name
	} catch (error) {
		throw new Error('errores')
	}
}

export const getProduct = async (productName, clientID, usuarioId) => {
	try {
		if (usuarioId) {
			let response = {}
			const url = backend.Cooptech + `/listProductxUserxClient?id_user=${usuarioId}&id_client=${clientID}`
			const respuesta = await requestAuth(url, 'GET').then((data) => {
				return data.data
			})
			for (const product of respuesta) {
				if (product.name === productName) {
					response = product
				}
			}
			return response
		}
	} catch (error) {
		console.error(error)
	}
}

export const getProductActive = async () => {
	try {
		const tokencooptech = storage.get('usuarioCooptech')
		const url =
			backend.Cooptech +
			`/listProductxUserxClient?id_user=${tokencooptech.id_user}&id_client=${tokencooptech.cliente.id}`
		const product = await requestAuth(url, 'GET').then((data) => {
			return data.data
		})
		return product
	} catch (error) {
		console.error(error)
	}
}
