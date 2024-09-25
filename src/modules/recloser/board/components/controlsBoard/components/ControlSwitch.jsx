import Swal from 'sweetalert2'

function ControlSwitch({ control, contador, enabled }) {
	const toggleCheck = (field) => {
		if (!enabled) {
			Swal.fire({
				title: 'Atención!',
				text: 'Debe desbloquear el tablero para ejecutar funciones...',
				icon: 'warning',
			})
			return
		}
		contador()
		Swal.fire({
			title: 'Atención!',
			text: `Estas por ejecutar ${field}. ¿Deseas Ejecutarlo?`,
			icon: 'question',
			allowOutsideClick: false,
			showDenyButton: true,
			confirmButtonText: 'Si',
		}).then((result) => {
			if (result.isConfirmed) {
				control.status = !control.status
			}
		})
	}
	return (
		<>
			<label>
				<b className='mr-2'>{control.title}</b>
			</label>
			<label
				className={`inline-flex items-center ${
					control.status === 'sin Datos' ? 'cursor-default' : 'cursor-pointer'
				} relative`}
			>
				<input
					disabled={!control.enabled}
					type='checkbox'
					checked={control.status === 'sin Datos' ? false : control.status}
					id={control.id}
					onChange={() => {}}
					onClick={() => {
						if (control.status !== 'sin Datos') toggleCheck(control.field)
					}}
					className='sr-only peer'
				/>
				<div className="relative w-14 h-7 bg-gray-400 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
			</label>
		</>
	)
}

export default ControlSwitch
