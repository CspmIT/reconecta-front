import { Checkbox, FormControlLabel } from '@mui/material'
import { CURVA_GROUPS } from '../../utils/curvaConfig'

/*
 * Selección de variables de la curva de carga. Se guarda por medidor (serial)
 * y afecta las columnas de la tabla "Curva 1" y los gráficos.
 */
function Variables({ serial, enabled, onChange }) {
	const toggle = (key) => {
		const next = enabled.includes(key)
			? enabled.filter((item) => item !== key)
			: [...enabled, key]
		if (!next.length) return // al menos una variable seleccionada
		onChange(next)
	}

	return (
		<div className='w-full'>
			<p className='text-sm text-gray-600 dark:text-zinc-300 mb-4'>
				Variables capturadas por <b>{serial}</b> — tildá las que aplican a este medidor. La
				selección se guarda <b>por medidor</b> y afecta la tabla y los gráficos de la curva.
			</p>
			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2'>
				{CURVA_GROUPS.map((group) => (
					<FormControlLabel
						key={group.key}
						control={
							<Checkbox
								checked={enabled.includes(group.key)}
								onChange={() => toggle(group.key)}
							/>
						}
						label={group.label}
					/>
				))}
			</div>
		</div>
	)
}

export default Variables
