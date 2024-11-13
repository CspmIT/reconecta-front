import { request } from '../../../../../../utils/js/request'
import { backend } from '../../../../../../utils/routes/app.routes'

export const getVersions = async () => {
	const versions = await request(`${backend[`${import.meta.env.VITE_APP_NAME}`]}/getVersionsMeter`, 'GET')
	return versions.data
}

export const saveMeter = async (data) => {
	const dataMeter = {
		id: parseFloat(data.id),
		serial: data.serial,
		status: 1,
		version: data.version,
	}
	const recloser = await request(`${backend[`${import.meta.env.VITE_APP_NAME}`]}/addMeter`, 'POST', dataMeter)
	return recloser
}
