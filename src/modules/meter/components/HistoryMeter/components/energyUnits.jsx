import { MenuItem, Select } from '@mui/material'
import { isInvalidEnergy, SIN_INFO } from '../../../utils/format'

/*
 * Submúltiplo de energía compartido por las sub-tabs de la pestaña Energía (EOB).
 * Los valores llegan en kilo (kWh/kVArh/kVAh); Auto elige k/M/G según magnitud.
 * Aplica SOLO a energías (la demanda queda en kW).
 */
export const UNIT_SUFFIX = { W: 'Wh', VAr: 'VArh', VA: 'VAh' }
const SCALES = { k: { div: 1, prefix: 'k' }, M: { div: 1000, prefix: 'M' }, G: { div: 1e6, prefix: 'G' } }

const scaleFor = (num, selected) => {
	if (selected !== 'auto') return selected
	const abs = Math.abs(num)
	if (abs >= 1e6) return 'G'
	if (abs >= 1e3) return 'M'
	return 'k'
}

export const fmtEnergyValue = (value, kind = 'W', unit = 'auto') => {
	if (value === undefined || value === null) return null
	if (isInvalidEnergy(value)) return SIN_INFO
	const num = parseFloat(value)
	if (isNaN(num)) return null
	const { div, prefix } = SCALES[scaleFor(num, unit)]
	return `${(num / div).toLocaleString('es-AR', { maximumFractionDigits: 3 })} ${prefix}${UNIT_SUFFIX[kind]}`
}

export function EnergyUnitSelect({ value, onChange }) {
	return (
		<Select
			size='small'
			value={value}
			onChange={(e) => onChange(e.target.value)}
			title='Submúltiplo de energía (aplica a todo el panel)'
		>
			<MenuItem value='auto'>Auto</MenuItem>
			<MenuItem value='k'>kWh</MenuItem>
			<MenuItem value='M'>MWh</MenuItem>
			<MenuItem value='G'>GWh</MenuItem>
		</Select>
	)
}
