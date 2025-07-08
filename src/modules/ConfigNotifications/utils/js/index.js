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

export const generateFileEvent = async (data, nameFile) => {
	try {
		const idEventActive = data.filter((item) => item.priority < 3)

		const textEvent = idEventActive.map((item) => `${item.id},${item.priority}`).join('\n')

		const file = new Blob([textEvent], { type: 'text/plain' })

		const formData = new FormData()
		formData.append('file', file, `Event${nameFile}`)
		return formData
	} catch (error) {
		throw error
	}
}

export const downloadFromFormData = async (formData) => {
	if (!formData) {
		alert('Primero debes generar el FormData.')
		return
	}

	// Extraer el archivo del FormData
	const file = formData.get('file')

	// Crear URL y descargar
	const url = URL.createObjectURL(file)
	const a = document.createElement('a')
	a.href = url
	a.download = 'output.txt'
	a.click()
	URL.revokeObjectURL(url) // Liberar memoria
}
export const generateFileAlarm = async (data, nameFile) => {
	try {
		const idAlarm = data.filter((item) => item.alarm)
		const textAlarm = idAlarm.map((item) => `${item.id},${item.alarm}\n`).join('\n')
		const file = new Blob([textAlarm], { type: 'text/plain' })
		// Crear FormData para enviarlo al backend
		const formData = new FormData()
		formData.append('file', file, `Alarm${nameFile}`)
		return formData
	} catch (error) {
		throw error
	}
}

// esta funcion no se esta utilizando pero se habiar echo para formatear los datos de las alarmas activas y luego enviar todo por mqtt
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
