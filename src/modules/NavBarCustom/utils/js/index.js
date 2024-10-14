import { storage } from '../../../../storage/storage'
import { request } from '../../../../utils/js/request'
import { backend } from '../../../../utils/routes/app.routes'

export const getPermissionDb = async () => {
	let usuario = storage.get('usuario')
	const permissiondata = await request(
		`${backend[`${import.meta.env.VITE_APP_NAME}`]}/getPermission?id=${usuario.sub}&type=id_user&profile=${
			usuario.profile
		}`,
		'GET'
	)
	const combinedPermissions = permissiondata.data.reduce((acc, current) => {
		const existingIndex = acc.findIndex((item) => item.id_menu === current.id_menu)
		if (existingIndex === -1) {
			acc.push({ ...current })
		} else {
			acc[existingIndex].status = acc[existingIndex].status || current.status
		}
		return acc
	}, [])
	const menus = await request(`${backend[`${import.meta.env.VITE_APP_NAME}`]}/getAllMenu`, 'GET')
	const permisos = menus.data
		.map((item) => {
			const findPermissions = Object.values(combinedPermissions).find((perm) => perm.id_menu == item.id)
			item.status = findPermissions?.status || 0
			return item
		})
		.filter((item) => item.status)
	return permisos
}
