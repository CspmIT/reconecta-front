import Swal from 'sweetalert2'

export const enableControl = (contador, enabled, setEnabled) => {
	if (!enabled) {
		Swal.fire({
			title: 'Ingrese su contraseña',
			input: 'text',
			inputAttributes: {
				autocapitalize: 'off',
				onkeydown: 'this.type="password"',
				placeholder: 'ingrese su contraseña',
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
		})
	} else {
		setEnabled(!enabled)
	}
}
