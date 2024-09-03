import Swal from 'sweetalert2'

function ControlCircle({ control, enabled, contador }) {
	const setCircleValue = (id, value) => {
		if (!enabled) {
			Swal.fire({
				title: 'Atención!',
				text: 'Debe desbloquear el tablero para ejecutar funciones...',
				icon: 'warning',
			})
			return
		}
		Swal.fire({
			title: 'Atención!',
			text: `Estas por ejecutarcambio de grupo. ¿Deseas Ejecutarlo?`,
			icon: 'question',
			allowOutsideClick: false,
			showDenyButton: true,
			confirmButtonText: 'Si',
		}).then((result) => {
			if (result.isConfirmed) {
				contador()
				control.status = value
			}
		})
	}
	return (
		<>
			<label>
				<b className='mr-2'>{control.title}</b>
			</label>
			<div className='flex flex-row justify-center'>
				{Array.from({ length: 4 }, (_, i) => (
					<span
						className={`${i + 1 === control.status && control.enabled ? 'bg-blue-600' : 'bg-slate-400'} ${
							control.status == 'sin Datos' ? 'cursor-default' : 'cursor-pointer'
						} mx-2 text-white rounded-[50%] w-[28px] h-[27px] flex pl-[10px] pt-[3px] `}
						key={i}
						onClick={() => {
							if (control.status != 'sin Datos') setCircleValue(control.id, i + 1)
						}}
					>
						{i + 1}
					</span>
				))}
			</div>
		</>
	)
}

export default ControlCircle
