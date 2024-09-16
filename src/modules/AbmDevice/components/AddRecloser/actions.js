import { request } from '../../../../utils/js/request'
import { backend } from '../../../../utils/routes/app.routes'

export const getRecloser = async (id) => {
	const recloser = await request(`${backend[`${import.meta.env.VITE_APP_NAME}`]}/getDataRecloser?id=${id}`, 'GET')
	return recloser.data.recloser
}

// export const getVersions = async () => {
// 	const versions = await request(`${backend[`${import.meta.env.VITE_APP_NAME}`]}/getVersions`, 'GET')

// 	return versions.data
// }
export const getNode = async (id) => {
	const node = await request(`${backend[`${import.meta.env.VITE_APP_NAME}`]}/getNodexId?id=${id}`, 'GET')

	return node.data
}
