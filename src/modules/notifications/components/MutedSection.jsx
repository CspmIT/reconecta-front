import { Autocomplete, Chip, TextField } from '@mui/material'

import Card from './Card'

// Etiquetas para los enums que devuelve el backend. Deadman va tal cual: es el
// termino que ya usan en el equipo y en las alertas de Discord.
const ALARM_TYPE_LABELS = {
	Evento: 'Eventos del equipo',
	Deadman: 'Deadman',
}

const toggle = (list, value) => (list.includes(value) ? list.filter((item) => item !== value) : [...list, value])

/*
 * Silenciados del usuario: por tipo de alarma, por tipo de equipo y por equipo
 * puntual. El backend tambien soporta silenciar eventos sueltos y filtrar por
 * prioridad minima, pero no se exponen: la granularidad util es el equipo.
 */
const MutedSection = ({ pref, options, equipments, onChange }) => {
	const alarmTypes = Array.isArray(pref.muted_alarm_types) ? pref.muted_alarm_types : []
	const deviceTypes = Array.isArray(pref.muted_device_types) ? pref.muted_device_types : []
	const mutedDevices = Array.isArray(pref.muted_devices) ? pref.muted_devices : []

	return (
		<Card
			title='Alarmas silenciadas'
			description='Lo que se marca aca no genera notificacion en ningun horario. La alarma se sigue registrando y llega a Discord.'
		>
			<p className='text-sm font-medium text-slate-700 dark:text-gray-200 mb-2'>Por tipo de alarma</p>
			<div className='flex flex-wrap gap-2'>
				{(options.alarm_types || []).map((type) => (
					<Chip
						key={type}
						label={ALARM_TYPE_LABELS[type] || type}
						variant={alarmTypes.includes(type) ? 'filled' : 'outlined'}
						color={alarmTypes.includes(type) ? 'warning' : 'default'}
						onClick={() => onChange({ muted_alarm_types: toggle(alarmTypes, type) })}
					/>
				))}
			</div>

			<p className='text-sm font-medium text-slate-700 dark:text-gray-200 mt-5 mb-2'>Por tipo de equipo</p>
			<div className='flex flex-wrap gap-2'>
				{(options.device_types || []).map((type) => (
					<Chip
						key={type}
						label={type}
						variant={deviceTypes.includes(type) ? 'filled' : 'outlined'}
						color={deviceTypes.includes(type) ? 'warning' : 'default'}
						onClick={() => onChange({ muted_device_types: toggle(deviceTypes, type) })}
					/>
				))}
			</div>

			<div className='mt-6'>
				<Autocomplete
					multiple
					size='small'
					options={equipments}
					getOptionLabel={(option) => option.name}
					isOptionEqualToValue={(option, value) => option.id === value.id}
					value={equipments.filter((equipment) => mutedDevices.includes(equipment.id))}
					onChange={(_, value) => onChange({ muted_devices: value.map((equipment) => equipment.id) })}
					renderInput={(params) => (
						<TextField {...params} label='Equipos silenciados' placeholder='Buscar equipo' />
					)}
				/>
			</div>
		</Card>
	)
}

export default MutedSection
