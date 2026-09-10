import { FormControlLabel, Switch, TextField, ToggleButton, ToggleButtonGroup } from '@mui/material'

import Card from './Card'

// Se muestran de lunes a domingo, pero el valor guardado es el dia de la semana
// de JavaScript (0 = domingo), igual que en el backend.
const DAYS = [
	{ value: 1, label: 'Lun' },
	{ value: 2, label: 'Mar' },
	{ value: 3, label: 'Mie' },
	{ value: 4, label: 'Jue' },
	{ value: 5, label: 'Vie' },
	{ value: 6, label: 'Sab' },
	{ value: 0, label: 'Dom' },
]

// El input type=time trabaja con HH:MM y la base guarda HH:MM:SS.
const toInput = (time) => (time ? String(time).slice(0, 5) : '')
const fromInput = (value) => (value ? `${value}:00` : null)

/*
 * Ventana en la que el usuario no quiere recibir notificaciones. Se evalua en su
 * zona horaria y admite cruzar la medianoche (22:00 a 07:00).
 */
const QuietHoursSection = ({ pref, onChange }) => {
	// null o vacio significa "todos los dias".
	const days = Array.isArray(pref.quiet_days) ? pref.quiet_days : []
	const crossesMidnight =
		pref.quiet_start && pref.quiet_end && toInput(pref.quiet_start) > toInput(pref.quiet_end)

	return (
		<Card
			title='Horario de silencio'
			description={`Dentro de la ventana no llegan notificaciones. Se calcula con la zona ${pref.timezone}.`}
			right={
				<Switch
					checked={Boolean(pref.quiet_enabled)}
					onChange={(event) => onChange({ quiet_enabled: event.target.checked })}
				/>
			}
		>
			<div className={pref.quiet_enabled ? '' : 'opacity-50 pointer-events-none'}>
				<div className='flex flex-wrap items-center gap-4'>
					<TextField
						label='Desde'
						type='time'
						size='small'
						value={toInput(pref.quiet_start)}
						onChange={(event) => onChange({ quiet_start: fromInput(event.target.value) })}
						InputLabelProps={{ shrink: true }}
					/>
					<TextField
						label='Hasta'
						type='time'
						size='small'
						value={toInput(pref.quiet_end)}
						onChange={(event) => onChange({ quiet_end: fromInput(event.target.value) })}
						InputLabelProps={{ shrink: true }}
					/>
					{crossesMidnight ? (
						<span className='text-xs text-slate-500 dark:text-gray-400'>
							La ventana cruza la medianoche.
						</span>
					) : null}
				</div>

				<p className='text-sm font-medium text-slate-700 dark:text-gray-200 mt-5 mb-2'>
					Dias en los que aplica
				</p>
				<ToggleButtonGroup
					size='small'
					value={days}
					onChange={(_, value) => onChange({ quiet_days: value.length ? value : null })}
				>
					{DAYS.map((day) => (
						<ToggleButton key={day.value} value={day.value} sx={{ textTransform: 'none', px: 1.5 }}>
							{day.label}
						</ToggleButton>
					))}
				</ToggleButtonGroup>
				{days.length === 0 ? (
					<p className='text-xs text-slate-500 dark:text-gray-400 mt-2'>
						Sin dias seleccionados el silencio aplica todos los dias.
					</p>
				) : null}

				<FormControlLabel
					className='mt-4'
					control={
						<Switch
							checked={Boolean(pref.quiet_allow_critical)}
							onChange={(event) => onChange({ quiet_allow_critical: event.target.checked })}
						/>
					}
					label='Dejar pasar las alarmas de prioridad 1 durante el silencio'
				/>
			</div>
		</Card>
	)
}

export default QuietHoursSection
