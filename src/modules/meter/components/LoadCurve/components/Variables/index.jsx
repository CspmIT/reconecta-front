import { Checkbox, FormControlLabel } from '@mui/material'
import { CURVA_CATALOG } from '../../utils/curvaConfig'

/*
 * Selección de variables de la curva de carga (fields del topic /status/curva),
 * agrupadas por naturaleza como el mockup. Se guarda por medidor (serial) y
 * define las columnas de la tabla. Cada grupo tiene un check general.
 */
function Variables({ serial, enabled, onChange }) {
	const apply = (next) => {
		if (!next.length) return // al menos una variable seleccionada
		onChange(next)
	}

	const toggle = (key) => {
		apply(enabled.includes(key) ? enabled.filter((item) => item !== key) : [...enabled, key])
	}

	// Check general del grupo: tilda/destilda todas sus variables
	const toggleGroup = (variables, allChecked) => {
		const keys = variables.map((variable) => variable.key)
		apply(
			allChecked
				? enabled.filter((key) => !keys.includes(key))
				: [...new Set([...enabled, ...keys])]
		)
	}

	const groups = CURVA_CATALOG.reduce((acc, variable) => {
		;(acc[variable.group] = acc[variable.group] ?? []).push(variable)
		return acc
	}, {})

	return (
		<div className='w-full'>
			<p className='text-sm text-gray-600 dark:text-zinc-300 mb-4'>
				Variables capturadas por <b>{serial}</b> — tildá las que aplican a este medidor. La
				selección se guarda <b>por medidor</b> y define las columnas de la tabla de curva.
			</p>
			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-4'>
				{Object.entries(groups).map(([group, variables]) => {
					const checkedCount = variables.filter((variable) =>
						enabled.includes(variable.key)
					).length
					const allChecked = checkedCount === variables.length
					return (
						<div key={group}>
							<FormControlLabel
								className='!-my-1'
								control={
									<Checkbox
										size='small'
										checked={allChecked}
										indeterminate={checkedCount > 0 && !allChecked}
										onChange={() => toggleGroup(variables, allChecked)}
									/>
								}
								label={
									<span className='text-xs font-bold uppercase tracking-wide text-blue-600 dark:text-blue-300'>
										{group}
									</span>
								}
							/>
							<div className='flex flex-col pl-5 border-l border-gray-200 dark:border-zinc-500 ml-2'>
								{variables.map((variable) => (
									<FormControlLabel
										key={variable.key}
										className='!-my-1'
										control={
											<Checkbox
												size='small'
												checked={enabled.includes(variable.key)}
												onChange={() => toggle(variable.key)}
											/>
										}
										label={<span className='text-sm'>{variable.label}</span>}
									/>
								))}
							</div>
						</div>
					)
				})}
			</div>
		</div>
	)
}

export default Variables
