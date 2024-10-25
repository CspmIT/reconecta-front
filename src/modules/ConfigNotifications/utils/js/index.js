import { request } from '../../../../utils/js/request'
import { backend } from '../../../../utils/routes/app.routes'

export const getConfigNotify = async () => {
	const config = await request(`${backend[`${import.meta.env.VITE_APP_NAME}`]}/getConfigNotify`, 'GET')
	console.log(config)
	return config.data
}

export const formatterConfig = async (data) => {
	const resultados = []
	for (const device in data) {
		const nivel1 = data[device]
		for (const brand in nivel1) {
			const nivel2 = nivel1[brand]
			for (const version in nivel2) {
				const objets = nivel2[version]
				const router = { device, brand, version }
				resultados.push({ router, objets })
			}
		}
	}
	console.log(resultados)
	return resultados
}
