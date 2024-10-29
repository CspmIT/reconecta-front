import { request } from '../../../../utils/js/request'
import { backend } from '../../../../utils/routes/app.routes'

export const getConfigNotify = async () => {
	const config = await request(`${backend[`${import.meta.env.VITE_APP_NAME}`]}/getConfigNotify`, 'GET')
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
	return resultados
}

export const generateSources = async (data, dataModify, cantReg) => {
	try {
		const mqttconfig = data.map((item) => {
			const modifiedConfig = dataModify.find((info) => info.id === item.id)
			return modifiedConfig ? modifiedConfig : item
		})
		const maxIdEvent = mqttconfig.reduce((acc, val) => Math.max(acc, val.id_event_influx), 0)
		const groups = {}
		for (let i = 0; i < Math.ceil(maxIdEvent / cantReg); i++) {
			groups[i] = mqttconfig.filter(
				(item, index) => item.alarm && index >= cantReg * i && index < cantReg * (i + 1)
			)
		}
		const sources = Object.values(groups).reduce((acc, group) => {
			const alarmIds = group.map((val) => val.id_event_influx)
			// Agregar el array, aunque esté vacío
			acc.push(alarmIds)
			return acc
		}, [])
		return sources
	} catch (error) {
		throw error
	}
}

const routesDevice = {
	Reconectador: { getAll: 'getAllReclosers', topic: 'coop/energia/Reconectadores/' },
}

export const sendConfigMqtt = async (sources, device, version) => {
	try {
		const listDevice = await request(
			`${backend[`${import.meta.env.VITE_APP_NAME}`]}/${routesDevice[device].getAll}`,
			'GET'
		)
		const SendDevice = listDevice.data.filter((item) => item.id_version == version)

		const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
		for (let i = 0; i < sources.length; i++) {
			for (let f = 0; f < SendDevice.length; f++) {
				const topic = `${routesDevice[device].topic}${SendDevice[f].brand}/${SendDevice[f].serial}/action`
				// const topic = `${routesDevice[device].topic}NOJA/0310123456789/action`
				const data = { ['source_' + i]: sources[i] }
				await request(`${backend[`${import.meta.env.VITE_APP_NAME}`]}/sendConfigMQTT`, 'POST', {
					topic: topic,
					data: data,
				})
			}
			await sleep(500)
		}
		return true
	} catch (error) {
		throw error
	}
}
