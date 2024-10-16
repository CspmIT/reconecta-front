import Swal from 'sweetalert2'
import { sendAction } from '../utils/js/Controls'

function ControlCircle({ control, enabled, contador, info }) {
	const setCircleValue = (field, value) => {
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
		}).then(async (result) => {
			if (result.isConfirmed) {
				const status = await sendAction(field, value, contador, info)
				if (status) {
					control.status = status
				}
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
							if (control.status != 'sin Datos') setCircleValue(control.field, i + 1)
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
