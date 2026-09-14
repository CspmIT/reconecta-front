import { Chip } from '@mui/material'

import Card from './Card'

// Etiquetas para los enums que devuelve el backend. Deadman va tal cual: es el
// termino que ya usan en el equipo y en las alertas de Discord.
const ALARM_TYPE_LABELS = {
	Evento: 'Eventos del equipo',
	Deadman: 'Deadman',
}

const toggle = (list, value) => (list.includes(value) ? list.filter((item) => item !== value) : [...list, value])

/*
 * Alarmas activas del usuario: se marca lo que SI se quiere recibir, por tipo de
 * alarma y por tipo de equipo. Lo que queda sin marcar no notifica.
 *
 * La seleccion por equipo puntual no esta aca: vive en la campana de cada fila
 * de la tabla general, donde todos los equipos arrancan activos y se apagan de a
 * uno. El backend tambien soporta silenciar eventos sueltos y filtrar por
 * prioridad minima, pero no se exponen.
 */
const ActiveAlarmsSection = ({ pref, options, onChange }) => {
	const alarmTypes = Array.isArray(pref.alarm_types) ? pref.alarm_types : []
	const deviceTypes = Array.isArray(pref.device_types) ? pref.device_types : []

	const group = (field, values, selected, label) => (
		<div className='flex flex-wrap gap-2'>
			{values.map((value) => {
				const active = selected.includes(value)
				return (
					<Chip
						key={value}
						label={label ? label(value) : value}
						variant={active ? 'filled' : 'outlined'}
						color={active ? 'success' : 'default'}
						onClick={() => onChange({ [field]: toggle(selected, value) })}
					/>
				)
			})}
		</div>
	)

	const nothingSelected = !alarmTypes.length || !deviceTypes.length

	return (
		<Card
			title='Alarmas activas'
			description='Marca lo que queres recibir. Lo que quede sin marcar no genera notificacion en ningun horario; la alarma se sigue registrando y llega a Discord.'
		>
			<p className='text-sm font-medium text-slate-700 dark:text-gray-200 mb-2'>Por tipo de alarma</p>
			{group('alarm_types', options.alarm_types || [], alarmTypes, (type) => ALARM_TYPE_LABELS[type] || type)}

			<p className='text-sm font-medium text-slate-700 dark:text-gray-200 mt-5 mb-2'>Por tipo de equipo</p>
			{group('device_types', options.device_types || [], deviceTypes)}

			{/* Los dos filtros se cruzan: si un eje queda vacio no llega nada. */}
			{nothingSelected && (
				<p className='text-sm text-amber-600 dark:text-amber-400 mt-5'>
					Con esta seleccion no vas a recibir ninguna notificacion.
				</p>
			)}

			<p className='text-xs text-gray-500 dark:text-gray-400 mt-5'>
				Para dejar de recibir alarmas de un equipo puntual, apaga su campana en la tabla general del inicio.
			</p>
		</Card>
	)
}

export default ActiveAlarmsSection
