import { Fab } from '@mui/material'
import { FaBell, FaBellSlash } from 'react-icons/fa'
import Swal from 'sweetalert2'

/*
 * Campana de un equipo. Prendida (por defecto) el equipo notifica; apagada, sus
 * alarmas se siguen registrando pero no llegan como notificacion a este usuario.
 *
 * Va como Fab y no como icono suelto para que el area de toque sea la misma que
 * tenian los botones de la tabla: es el unico control que queda dentro de una
 * fila que abre el detalle, asi que tiene que ser facil de acertar. Justamente
 * por eso pide confirmacion: un toque de mas no tiene que cambiar en silencio a
 * quien le llegan las alarmas.
 */
export default function AlarmBell({ bells, id, label, className = '', size = 18 }) {
	// Sin preferencias cargadas (o sin equipo detras) no hay campana que dibujar.
	if (!bells.ready || !id) return null

	const active = bells.isActive(id)
	const equipo = label || 'este equipo'

	const confirmar = async (event) => {
		// La fila entera abre el detalle: la campana no tiene que arrastrarlo.
		event.stopPropagation()

		const { isConfirmed } = await Swal.fire({
			icon: active ? 'warning' : 'question',
			title: active ? '¿Silenciar las alarmas?' : '¿Activar las alarmas?',
			text: active
				? `No vas a recibir notificaciones de ${equipo}. Las alarmas se siguen registrando y llegando a Discord.`
				: `Vas a volver a recibir las notificaciones de ${equipo}.`,
			showCancelButton: true,
			confirmButtonText: active ? 'Silenciar' : 'Activar',
			cancelButtonText: 'Cancelar',
			confirmButtonColor: active ? '#d33' : '#3085d6',
		})
		if (!isConfirmed) return

		bells.toggle(id)
	}

	return (
		<Fab
			size='small'
			disabled={bells.busy === Number(id)}
			className={`${active ? '!bg-amber-400' : '!bg-gray-300'} !z-0 !shrink-0 ${className}`}
			onClick={confirmar}
			title={active ? 'Notificaciones activadas: tocar para silenciar este equipo' : 'Equipo silenciado: tocar para volver a recibir sus alarmas'}
			aria-label={active ? 'Silenciar notificaciones del equipo' : 'Activar notificaciones del equipo'}
		>
			{active ? <FaBell size={size} className='text-amber-900' /> : <FaBellSlash size={size} className='text-gray-600' />}
		</Fab>
	)
}
