import { request, requestAuth } from './requesLogin'

import Swal from 'sweetalert2'
import { storage } from './storage'

export const logeoApp = async (usuarioId, schema) => {
	try {
		const urlUser = import.meta.env.VITE_APP_BACK_COOPTECH + `/getUser?id=${usuarioId}`
		const user = await requestAuth(urlUser, 'GET')
		const urlToken = import.meta.env.VITE_APP_BACK_RECONECTA + '/generateTokenCooptech'
		const token = await request(urlToken, 'POST', {
			email: user.data.email,
			tokenCooptech: user.data.token_apps,
			schemaName: schema,
		})
		return token.data
	} catch (error) {
		Swal.fire({
			title: 'Atención',
			text: 'Hubo un problema al querer entrar a la Oficina Virtual',
			icon: 'warning',
		})
	}
}
export const schemaName = async (clientId, productId) => {
	try {
		const urlUser =
			import.meta.env.VITE_APP_BACK_COOPTECH + `/getSchemaProduct?clientId=${clientId}&productId=${productId}`
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
			const url =
				import.meta.env.VITE_APP_BACK_COOPTECH +
				`/listProductxUserxClient?id_user=${usuarioId}&id_client=${clientID}`
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
		console.log(error)
		console.error(error)
	}
}

export const getProductActive = async () => {
	try {
		const tokencooptech = storage.get('usuarioCooptech')
		const url =
			import.meta.env.VITE_APP_BACK_COOPTECH +
			`/listProductxUserxClient?id_user=${tokencooptech.id_user}&id_client=${tokencooptech.cliente.id}`
		const product = await requestAuth(url, 'GET').then((data) => {
			return data.data
		})
		return product
	} catch (error) {
		console.log(error)
		console.error(error)
	}
}
