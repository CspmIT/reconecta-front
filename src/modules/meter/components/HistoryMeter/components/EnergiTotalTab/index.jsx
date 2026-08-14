import { useEffect, useMemo, useState } from 'react'
import { request } from '../../../../../../utils/js/request'
import { backend } from '../../../../../../utils/routes/app.routes'
import LoaderComponent from '../../../../../../components/Loader'
import { isInvalidEnergy } from '../../../../utils/format'
import { EnergyUnitSelect, fmtEnergyValue } from '../energyUnits'

/*
 * Sub-tab "Energía total" (mockup): mini-cards de totales, energía por tarifa
 * con diferencia del período, energía por fase (activa/aparente/reactiva,
 * importada/exportada), reactiva por cuadrante y validador cruzado.
 * Fuente: getEobEnergyTotal -> EOB/main + EOB/react (último cierre, last)
 * y status/E_tar (acumulado vivo). Mapeo: back-reconecta/docs/eob-energia-total.json
 */

const toNumber = (value) => {
	if (value === undefined || value === null) return null
	const num = parseFloat(value)
	return isNaN(num) ? null : num
}

// Códigos OBIS COSEM (mockup) para el tooltip de cada valor
const OBIS = {
	ai: { l1: '1.1.21.8.0.255', l2: '1.1.41.8.0.255', l3: '1.1.61.8.0.255', total: '1.1.1.8.0.255' },
	ae: { l1: '1.1.22.8.0.255', l2: '1.1.42.8.0.255', l3: '1.1.62.8.0.255', total: '1.1.2.8.0.255' },
	ap_i: { l1: '1.1.29.8.0.255', l2: '1.1.49.8.0.255', l3: '1.1.69.8.0.255', total: '1.1.9.8.0.255' },
	ap_e: { l1: '1.1.30.8.0.255', l2: '1.1.50.8.0.255', l3: '1.1.70.8.0.255', total: '1.1.10.8.0.255' },
	ri: { l1: '1.1.23.8.0.255', l2: '1.1.43.8.0.255', l3: '1.1.63.8.0.255', total: '1.1.3.8.0.255' },
	re: { l1: '1.1.24.8.0.255', l2: '1.1.44.8.0.255', l3: '1.1.64.8.0.255', total: '1.1.4.8.0.255' },
	q1: { l1: '1.1.5.8.1.255', l2: '1.1.5.8.2.255', l3: '1.1.5.8.3.255', total: '1.1.5.8.0.255' },
	q2: { l1: '1.1.6.8.1.255', l2: '1.1.6.8.2.255', l3: '1.1.6.8.3.255', total: '1.1.6.8.0.255' },
	q3: { l1: '1.1.7.8.1.255', l2: '1.1.7.8.2.255', l3: '1.1.7.8.3.255', total: '1.1.7.8.0.255' },
	q4: { l1: '1.1.8.8.1.255', l2: '1.1.8.8.2.255', l3: '1.1.8.8.3.255', total: '1.1.8.8.0.255' },
	tarifa: ['1.1.1.8.1.255', '1.1.1.8.2.255', '1.1.1.8.3.255'],
}

function Val({ value, obis, bold }) {
	if (value === null || value === undefined) {
		return <span className='italic text-gray-400 dark:text-zinc-400'>sin datos</span>
	}
	return (
		<span
			className={`${bold ? 'font-bold' : ''} ${obis ? 'cursor-help' : ''} whitespace-nowrap`}
			title={obis ? `OBIS ${obis}` : undefined}
		>
			{value}
		</span>
	)
}

function SectionTitle({ children }) {
	return (
		<p className='text-xs uppercase tracking-wide text-gray-600 dark:text-zinc-300 font-semibold mt-1'>
			{children}
		</p>
	)
}

const CELL = 'px-3 py-1.5 border-b border-gray-200 dark:border-zinc-600'
const HEAD = 'px-3 py-2 text-left text-xs uppercase tracking-wide bg-gray-200 dark:bg-zinc-700'

function EnergyTable({ headers, rows }) {
	return (
		<div className='w-full overflow-x-auto'>
			<table className='w-full text-sm border border-gray-300 dark:border-zinc-500 rounded-lg overflow-hidden'>
				<thead>
					<tr>
						{headers.map((header, index) => (
							<th key={index} className={HEAD} style={index ? { width: `${56 / (headers.length - 1)}%` } : undefined}>
								{header}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{rows.map((row, index) => (
						<tr key={index} className={row.bold ? 'bg-gray-50 dark:bg-zinc-700/40' : ''}>
							<td className={`${CELL} ${row.bold ? 'font-bold' : ''}`}>{row.label}</td>
							{row.cells.map((cell, cellIndex) => (
								<td key={cellIndex} className={CELL}>
									<Val value={cell.value} obis={cell.obis} bold={row.bold} />
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}

function EnergiTotalTab({ info, unit = 'auto', onUnitChange }) {
	const [isLoading, setIsLoading] = useState(true)
	const [loadError, setLoadError] = useState(false)
	const [data, setData] = useState(null)

	const getData = async () => {
		try {
			setIsLoading(true)
			setLoadError(false)
			const response = await request(
				`${backend[`${import.meta.env.VITE_APP_NAME}`]}/getEobEnergyTotal`,
				'POST',
				{
					serial: info.serial,
					version: info.version,
					brand: info.brand,
				}
			)
			setData(response.data ?? null)
		} catch (error) {
			console.error(error)
			setLoadError(true)
			setData(null)
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		if (info) getData()
	}, [info])

	// Último valor publicado de un field (el backend ya hace last())
	const pick = (group, field) => {
		const serie = data?.[group]?.[field]
		if (!Array.isArray(serie) || !serie.length) return undefined
		return serie.at(-1).value
	}

	const fmtEnergy = (value, kind = 'W') => fmtEnergyValue(value, kind, unit)

	// Valor numérico válido (descarta 0xFFFFFFFF) para cálculos
	const numOf = (group, field) => {
		const value = pick(group, field)
		if (value === undefined || isInvalidEnergy(value)) return null
		return toNumber(value)
	}

	const model = useMemo(() => {
		if (!data) return null
		const hasClose = ['main', 'react'].some((group) => data[group] && Object.keys(data[group]).length)
		const hasLive = data.E_tar && Object.keys(data.E_tar).length
		if (!hasClose && !hasLive) return null

		// Diferencia del período: acumulado vivo (E_tar) - acumulado al cierre (ai_tN)
		const tarifas = [
			{ label: 'Activa importada — Resto', live: 'IAcE_Tar_0', close: 'ai_t1', obis: OBIS.tarifa[0] },
			{ label: 'Activa importada — Pico', live: 'IAcE_Tar_2', close: 'ai_t2', obis: OBIS.tarifa[1] },
			{ label: 'Activa importada — Valle', live: 'IAcE_Tar_4', close: 'ai_t3', obis: OBIS.tarifa[2] },
		].map((tarifa) => {
			const liveNum = numOf('E_tar', tarifa.live)
			const closeNum = numOf('main', tarifa.close)
			return {
				...tarifa,
				liveNum,
				diff: liveNum !== null && closeNum !== null ? liveNum - closeNum : null,
			}
		})

		// Validador cruzado: suma por tarifa vs acumulado activa del MISMO cierre
		const closeTarifas = ['ai_t1', 'ai_t2', 'ai_t3'].map((field) => numOf('main', field))
		const closeTotal = numOf('main', 'ai_tot')
		let validator = null
		if (closeTotal && !closeTarifas.some((value) => value === null)) {
			const sum = closeTarifas.reduce((acc, value) => acc + value, 0)
			const pct = (sum / closeTotal) * 100
			validator = { sum, total: closeTotal, pct, ok: pct >= 99 && pct <= 101 }
		}

		const closeDate = pick('main', 'rst') // DD/MM/YYYY HH:mm:ss
		return { tarifas, validator, closeDate: closeDate?.split(' ')[0] ?? null }
	}, [data])

	if (isLoading) return <LoaderComponent image={false} />
	if (loadError) {
		return (
			<p className='w-full text-center italic text-red-600 dark:text-red-400 py-8'>
				No se pudo cargar la energía total. Intente nuevamente.
			</p>
		)
	}
	if (!model) {
		return (
			<p className='w-full text-center italic text-gray-500 dark:text-zinc-300 py-8'>
				Sin datos de energía (EOB) para este medidor.
			</p>
		)
	}

	const miniCards = [
		{ label: 'Activa importada total', value: fmtEnergy(pick('main', 'ai_tot')), obis: OBIS.ai.total, accent: 'border-l-emerald-500' },
		{ label: 'Activa exportada total', value: fmtEnergy(pick('main', 'ae_tot')), obis: OBIS.ae.total, accent: 'border-l-sky-500' },
		{ label: 'Reactiva importada', value: fmtEnergy(pick('react', 'ri_tot'), 'VAr'), obis: OBIS.ri.total, accent: 'border-l-sky-500' },
		{ label: 'Aparente acumulada', value: fmtEnergy(pick('main', 'ap_i_tot'), 'VA'), obis: OBIS.ap_i.total, accent: 'border-l-sky-500' },
	]

	// Fila Importada/Exportada de la tabla por fase
	const phaseRow = (label, impKey, expKey, phase, kind, bold = false) => {
		const group = kind === 'VAr' ? 'react' : 'main'
		const obisKey = phase === 'tot' ? 'total' : phase
		return {
			label,
			bold,
			cells: [
				{ value: fmtEnergy(pick(group, `${impKey}_${phase}`), kind), obis: OBIS[impKey][obisKey] },
				{ value: fmtEnergy(pick(group, `${expKey}_${phase}`), kind), obis: OBIS[expKey][obisKey] },
			],
		}
	}

	const phaseRows = [
		phaseRow('Fase 1 activa', 'ai', 'ae', 'l1', 'W'),
		phaseRow('Fase 2 activa', 'ai', 'ae', 'l2', 'W'),
		phaseRow('Fase 3 activa', 'ai', 'ae', 'l3', 'W'),
		phaseRow('Acumulado activa', 'ai', 'ae', 'tot', 'W', true),
		phaseRow('Fase 1 aparente', 'ap_i', 'ap_e', 'l1', 'VA'),
		phaseRow('Fase 2 aparente', 'ap_i', 'ap_e', 'l2', 'VA'),
		phaseRow('Fase 3 aparente', 'ap_i', 'ap_e', 'l3', 'VA'),
		phaseRow('Acumulado aparente', 'ap_i', 'ap_e', 'tot', 'VA', true),
		phaseRow('Fase 1 reactiva', 'ri', 're', 'l1', 'VAr'),
		phaseRow('Fase 2 reactiva', 'ri', 're', 'l2', 'VAr'),
		phaseRow('Fase 3 reactiva', 'ri', 're', 'l3', 'VAr'),
		phaseRow('Acumulado reactiva', 'ri', 're', 'tot', 'VAr', true),
	]

	const quadrantRows = [
		{ key: 'q1', label: 'Q1 — Inductiva importada (+P, +Q)' },
		{ key: 'q2', label: 'Q2 — (−P, +Q)' },
		{ key: 'q3', label: 'Q3 — (−P, −Q)' },
		{ key: 'q4', label: 'Q4 — Capacitiva (+P, −Q)' },
	].map(({ key, label }) => ({
		label,
		cells: ['l1', 'l2', 'l3', 'tot'].map((phase, index) => ({
			value: fmtEnergy(pick('react', `${key}_${phase}`), 'VAr'),
			obis: OBIS[key][['l1', 'l2', 'l3', 'total'][index]],
		})),
	}))

	return (
		<div className='w-full flex flex-col gap-4'>
			{/* Selector de submúltiplo (aplica a todo el panel) */}
			<div className='w-full flex justify-end'>
				<EnergyUnitSelect value={unit} onChange={onUnitChange} />
			</div>

			<div className='w-full grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3'>
				{miniCards.map((card) => (
					<div
						key={card.label}
						className={`border border-gray-300 dark:border-zinc-500 border-l-4 ${card.accent} rounded-lg px-4 py-3 bg-gray-100 dark:bg-zinc-600 shadow-sm`}
					>
						<p className='text-[11px] uppercase tracking-wide text-gray-600 dark:text-zinc-300'>
							{card.label}
						</p>
						<p className='text-lg'>
							<Val value={card.value} obis={card.obis} bold />
						</p>
					</div>
				))}
			</div>

			<SectionTitle>Energía por tarifa</SectionTitle>
			<EnergyTable
				headers={[
					'Descripción',
					'Acumulado',
					`Diferencia del período${model.closeDate ? ` (desde ${model.closeDate})` : ''}`,
				]}
				rows={model.tarifas.map((tarifa) => ({
					label: tarifa.label,
					cells: [
						{ value: fmtEnergy(tarifa.liveNum), obis: tarifa.obis },
						{ value: fmtEnergy(tarifa.diff) },
					],
				}))}
			/>

			<SectionTitle>Energía por fase</SectionTitle>
			<EnergyTable headers={['Descripción', 'Importada', 'Exportada']} rows={phaseRows} />

			<SectionTitle>Energía reactiva por cuadrante</SectionTitle>
			<EnergyTable headers={['Cuadrante', 'Fase 1', 'Fase 2', 'Fase 3', 'Total']} rows={quadrantRows} />

			{model.validator && (
				<div
					className={`w-full flex items-center gap-2 text-sm rounded-lg border px-4 py-2.5 ${
						model.validator.ok
							? 'bg-emerald-50 border-emerald-300 text-emerald-700 dark:bg-emerald-950 dark:border-emerald-700 dark:text-emerald-300'
							: 'bg-amber-50 border-amber-300 text-amber-800 dark:bg-amber-950 dark:border-amber-700 dark:text-amber-300'
					}`}
				>
					<span>
						Validación cruzada (al cierre): suma por tarifa{' '}
						<b>{fmtEnergy(model.validator.sum)}</b> vs. acumulado activa{' '}
						<b>{fmtEnergy(model.validator.total)}</b> ·{' '}
						<b>{model.validator.pct.toLocaleString('es-AR', { maximumFractionDigits: 2 })}%</b>{' '}
						{model.validator.ok ? '(coincide)' : '— revisar diferencia'}
					</span>
				</div>
			)}
		</div>
	)
}

export default EnergiTotalTab
