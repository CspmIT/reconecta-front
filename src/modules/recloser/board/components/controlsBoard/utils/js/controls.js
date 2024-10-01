import Swal from 'sweetalert2'
import { request } from '../../../../../../../utils/js/request'
import { backend } from '../../../../../../../utils/routes/app.routes'
import { storage } from '../../../../../../../storage/storage'

export const enableControl = async (contador, enabled, setEnabled) => {
	if (!enabled) {
		const pass = await request(
			`${backend[`${import.meta.env.VITE_APP_NAME}`]}/userPass?id_user=${storage.get('usuario').sub}`,
			'GET'
		)
		if (!pass?.data?.password) {
			Swal.fire('Error', 'No tienes permiso/contraseña de ejecución', 'error')
			return false
		}
		Swal.fire({
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
					contador()
					setEnabled(!enabled)
				} else {
					Swal.fire('Error', 'Contraseña incorrecta', 'error')
				}
			},
			didOpen: () => {
				const inputField = Swal.getInput()
				inputField.setAttribute('autocomplete', 'new-password')
			},
		})
	} else {
		setEnabled(!enabled)
	}
}
