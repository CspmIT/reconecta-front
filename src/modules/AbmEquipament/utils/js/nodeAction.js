import { request } from '../../../../utils/js/request'
import { backend } from '../../../../utils/routes/app.routes'

export const saveNode = async (data) => {
	const dataNode = {
		id: data.id_node || 0,
		name: data.name,
		number: data.number,
		description: data.description,
		lat_location: data.lat_marker,
		lng_location: data.lng_marker,
		status: 1,
		devices: data.devices,
		type: data.type,
	}
	const recloser = await request(`${backend[`${import.meta.env.VITE_APP_NAME}`]}/saveNode`, 'POST', dataNode)
	return recloser
}
