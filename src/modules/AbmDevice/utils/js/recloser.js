import { request } from '../../../../utils/js/request'
import { backend } from '../../../../utils/routes/app.routes'

export const getRecloser = async (id) => {
	const recloser = await request(`${backend[`${import.meta.env.VITE_APP_NAME}`]}/getDataRecloser?id=${id}`, 'GET')
	return recloser.data.recloser
}

export const getVersions = async () => {
	const versions = await request(`${backend[`${import.meta.env.VITE_APP_NAME}`]}/getVersions`, 'GET')

	return versions.data
}

export const saveRecloser = async (data) => {
	const dataRecloser = {
		id: data.id,
		serial: data.serial,
		status: 1,
		status_recloser: 3,
		config: data.config,
		version: data.version,
	}
	const recloser = await request(`${backend[`${import.meta.env.VITE_APP_NAME}`]}/addRecloser`, 'POST', dataRecloser)
	return recloser
}
export const saveMeter = async (data) => {
	console.log(data)
}
export const saveAnalyzer = async (data) => {
	console.log(data)
}
export const saveStationRural = async (data) => {
	console.log(data)
}
export const saveStationUrban = async (data) => {
	console.log(data)
}
