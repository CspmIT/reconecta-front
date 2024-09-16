import { request } from '../../../../utils/js/request'
import { backend } from '../../../../utils/routes/app.routes'

export const saveRecloser = async (data) => {
	const dataRecloser = {
		id: data.id_recloser,
		name: data.name_node,
		number: data.number_node,
		description: data.description_node,
		lat_location: data.lat_marker,
		lng_location: data.lng_marker,
		serial: data.Nro_Serie,
		status: 1,
		status_recloser: 3,
		config: data.config,
		version: data.version,
		NodeId: data.NodeId || null,
	}
	console.log(dataRecloser)
	return
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
