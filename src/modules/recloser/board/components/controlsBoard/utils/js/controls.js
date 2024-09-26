import Swal from 'sweetalert2'

export const enableControl = (contador, enabled, setEnabled) => {
	if (!enabled) {
		Swal.fire({
			title: 'Ingrese su contraseña',
			input: 'password',
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
				if (login === '1234') {
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
