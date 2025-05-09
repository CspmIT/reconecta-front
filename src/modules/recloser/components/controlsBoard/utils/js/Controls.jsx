import Swal from 'sweetalert2'
import { request } from '../../../../../../utils/js/request'
import { backend } from '../../../../../../utils/routes/app.routes'
import { storage } from '../../../../../../storage/storage'
import SwalLoader from '../../../../../../components/SwalLoader/SwalLoader'

export const enableControl = async (enabled) => {
	if (!enabled) {
		const pass = await request(
			`${backend[`${import.meta.env.VITE_APP_NAME}`]}/userPass?id_user=${storage.get('usuario').sub}`,
			'GET'
		)
		if (!pass?.data?.password) {
			Swal.fire('Error', 'No tienes permiso/contraseña de ejecución', 'error')
			return false
		}
		let response = false
		await Swal.fire({
			title: 'Ingrese su contraseña',
			input: 'text',
			inputAttributes: {
				autocapitalize: 'off',
				autocomplete: 'off',
				placeholder: 'Ingrese su contraseña',
				form: {
					autocomplete: 'off',
				},
			},
			showCancelButton: true,
			confirmButtonText: 'Autentificar',
			showLoaderOnConfirm: true,
			preConfirm: (login) => {
				if (login === pass.data.password) {
					Swal.fire('Perfecto!', 'Se habilito correctamente los controles', 'success')
					response = true
				} else {
					Swal.fire('Error', 'Contraseña incorrecta', 'error')
				}
			},
			didOpen: () => {
				const inputField = Swal.getInput()
				inputField.setAttribute('autocomplete', 'new-password')
			},
		})
		return response
	} else {
		return false
	}
}

export const sendAction = async (field, action, contador, info) => {
	try {
		if (contador) {
			contador()
		}
		SwalLoader()
		const dataSend = {
			action: `${field.toUpperCase()}${field === 'grp' ? action : !action ? '_ON' : '_OFF'}`,
			brand: info.recloser.brand,
			serial: info.recloser.number,
			id_recloser: info.recloser.id,
		}
		await request(`${backend.Reconecta}/sendMQTT`, 'POST', dataSend)

		const dataControl = {
			action: field === 'grp' ? action : !action ? 1 : 0,
			field: field,
			brand: info.recloser.brand,
			serial: info.recloser.number,
		}
		await request(`${backend.Reconecta}/controlAction`, 'POST', dataControl)
		Swal.fire({ title: 'Perfecto!', text: 'La acción se ejecutó correctamente', icon: 'success' })
		return field === 'grp' ? action : !action
	} catch (error) {
		console.log(error)
		Swal.fire({ title: 'Atención!', text: error.message, icon: 'error' })
	}
}
