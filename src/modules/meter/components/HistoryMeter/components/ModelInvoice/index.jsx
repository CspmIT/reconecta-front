import { useEffect, useMemo, useState } from 'react'
import { MenuItem, Select } from '@mui/material'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { request } from '../../../../../../utils/js/request'
import { backend } from '../../../../../../utils/routes/app.routes'
import LoaderComponent from '../../../../../../components/Loader'
import { meses } from '../../../../../../utils/js/formatDate'
import { EnergyUnitSelect, fmtEnergyValue } from '../energyUnits'

dayjs.extend(customParseFormat)

/*
 * Modelo de factura (mockup): 3 cards
 *  1. Mes EN CURSO: registros vivos (status/E_tar, E_imp, P_imp, VI)
 *  2. Último cierre de facturación (EOB)
 *  3. Cierre anterior seleccionable (selector de mes)
 * Mapeo de topics/fields: back-reconecta/docs/eob-modelo-factura.json
 */
const fmtKw = (value) => {
	if (value === undefined || value === null) return null
	const num = parseFloat(value)
	if (isNaN(num)) return null
	return `${num.toLocaleString('es-AR', { maximumFractionDigits: 2 })} kW`
}
const fmtFp = (value) => {
	const num = parseFloat(value)
	if (isNaN(num)) return null
	return num.toLocaleString('es-AR', { maximumFractionDigits: 3 })
}

// Códigos OBIS COSEM (mockup) para el tooltip de cada valor
const OBIS_CIERRE = {
	activa: ['1.1.1.8.1.255', '1.1.1.8.2.255', '1.1.1.8.3.255'],
	reactiva: '1.1.3.8.0.255',
	demanda: ['1.1.1.6.1.255', '1.1.1.6.2.255', '1.1.1.6.3.255'],
	fp: '1.1.13.4.0.255',
}
const OBIS_CURSO = {
	activa: ['1.1.1.8.1.255', '1.1.1.8.2.255', '1.1.1.8.3.255'],
	reactiva: '1.1.3.8.0.255',
	demanda: ['0.0.98.133.61.255', '0.0.98.133.62.255', '0.0.98.133.63.255'],
	fp: '1.1.13.7.0.255',
}

// Agrupa los fields de un tópico en registros por _time
// (todos los fields de una misma publicación comparten el _time)
const topicRecords = (group) => {
	const byTime = new Map()
	Object.values(group ?? {}).forEach((serie) => {
		if (!Array.isArray(serie)) return
		serie.forEach((item) => {
			if (!byTime.has(item.time)) byTime.set(item.time, { _time: item.time })
			byTime.get(item.time)[item.field] = item.value
		})
	})
	return [...byTime.values()].sort((a, b) => new Date(a._time) - new Date(b._time))
}

const monthKey = (isoTime) => (isoTime ? isoTime.slice(0, 7) : null)

// El reinicio cierra el período ANTERIOR: el cierre del 01/06 corresponde a MAYO
const closeTitle = (record) => {
	let date = dayjs(record.rst, 'DD/MM/YYYY HH:mm:ss')
	if (!date.isValid()) date = dayjs(record._time)
	if (!date.isValid()) return 'PERÍODO'
	const period = date.subtract(1, 'day')
	return `${meses[period.month()]?.toUpperCase() ?? ''} ${period.year()}`
}

function Leaf({ label, value, when, obis }) {
	return (
		<div className='flex items-center gap-2 pl-4 py-0.5'>
			<span className='min-w-[46px] text-gray-600 dark:text-zinc-300'>{label}:</span>
			<span
				className={value ? 'font-semibold cursor-help' : 'italic text-gray-400 font-normal'}
				title={obis ? `OBIS ${obis}` : undefined}
			>
				{value ?? 'pendiente'}
			</span>
			{when && <span className='text-[10px] text-gray-500 dark:text-zinc-400'>{when}</span>}
		</div>
	)
}

function GroupTitle({ children }) {
	return (
		<p className='text-[11px] uppercase tracking-wide text-gray-600 dark:text-zinc-300 font-semibold mb-1.5'>
			{children}
		</p>
	)
}

function InvoiceCard({ title, badge, curso, data, headerExtra }) {
	const obis = curso ? OBIS_CURSO : OBIS_CIERRE
	return (
		<div className='flex-1 min-w-[270px] border border-gray-300 dark:border-zinc-500 rounded-xl overflow-hidden bg-gray-100 dark:bg-zinc-600 shadow-sm flex flex-col'>
			<div
				className={`${curso ? 'bg-[#7E3A39]' : 'bg-[#B5403E]'} text-white font-semibold text-sm text-center min-h-[56px] px-3 py-1 flex items-center justify-center gap-2`}
			>
				{headerExtra ?? title ?? 'PERÍODO'}
				{badge && (
					<span className='text-[10px] font-medium bg-white/25 px-2 py-0.5 rounded-full tracking-wide'>
						{badge}
					</span>
				)}
			</div>
			<div className='p-4 text-sm flex-1 flex flex-col gap-3'>
				<div>
					<GroupTitle>Energía activa</GroupTitle>
					<Leaf label='Resto' value={data.activa.resto} obis={obis.activa[0]} />
					<Leaf label='Pico' value={data.activa.pico} obis={obis.activa[1]} />
					<Leaf label='Valle' value={data.activa.valle} obis={obis.activa[2]} />
				</div>
				<div>
					<GroupTitle>Energía reactiva</GroupTitle>
					<p
						className={`pl-4 ${data.reactiva ? 'font-semibold cursor-help' : 'italic text-gray-400'}`}
						title={`OBIS ${obis.reactiva}`}
					>
						{data.reactiva ?? 'pendiente'}
					</p>
				</div>
				<div>
					<GroupTitle>Demanda máxima</GroupTitle>
					<Leaf label='Resto' value={data.demanda.resto} when={data.demanda.restoFecha} obis={obis.demanda[0]} />
					<Leaf label='Pico' value={data.demanda.pico} when={data.demanda.picoFecha} obis={obis.demanda[1]} />
					<Leaf label='Valle' value={data.demanda.valle} when={data.demanda.valleFecha} obis={obis.demanda[2]} />
				</div>
				<div>
					<GroupTitle>Factor de potencia</GroupTitle>
					<p
						className={`pl-4 ${data.fp ? 'font-semibold cursor-help' : 'italic text-gray-400'}`}
						title={`OBIS ${obis.fp}`}
					>
						{data.fp ?? 'pendiente'}
					</p>
				</div>
			</div>
		</div>
	)
}

function ModelInvoice({ info, unit = 'auto', onUnitChange }) {
	const [isLoading, setIsLoading] = useState(true)
	const [loadError, setLoadError] = useState(false)
	const [data, setData] = useState(null)
	const [selectedClose, setSelectedClose] = useState(null)

	const getData = async () => {
		try {
			setIsLoading(true)
			setLoadError(false)
			const response = await request(
				`${backend[`${import.meta.env.VITE_APP_NAME}`]}/getEobInvoice`,
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

	// Cierres: registros de EOB/main + react/maxdemand matcheados por mes del _time
	const closes = useMemo(() => {
		if (!data) return []
		const reactByMonth = new Map(
			topicRecords(data.react).map((record) => [monthKey(record._time), record])
		)
		const dmaxByMonth = new Map(
			topicRecords(data.maxdemand).map((record) => [monthKey(record._time), record])
		)
		return topicRecords(data.main)
			.map((record) => {
				const key = monthKey(record._time)
				const react = reactByMonth.get(key)
				const dmax = dmaxByMonth.get(key)
				return {
					key: record._time,
					title: closeTitle(record),
					activa: {
						resto: fmtEnergyValue(record.ai_t1, 'W', unit),
						pico: fmtEnergyValue(record.ai_t2, 'W', unit),
						valle: fmtEnergyValue(record.ai_t3, 'W', unit),
					},
					reactiva: fmtEnergyValue(react?.ri_tot, 'VAr', unit),
					demanda: {
						resto: fmtKw(dmax?.dmax_t1_valor),
						restoFecha: dmax?.dmax_t1_fecha,
						pico: fmtKw(dmax?.dmax_t2_valor),
						picoFecha: dmax?.dmax_t2_fecha,
						valle: fmtKw(dmax?.dmax_t3_valor),
						valleFecha: dmax?.dmax_t3_fecha,
					},
					fp: null, // pendiente: el firmware aún no publica FP del período
				}
			})
			.reverse() // más nuevo primero
	}, [data, unit])

	// Card EN CURSO desde los registros vivos
	const cursoCard = useMemo(() => {
		if (!data) return null
		const pick = (group, field) => data[group]?.[field]?.at(-1)?.value
		const hasLive = ['E_tar', 'E_imp', 'P_imp', 'VI'].some(
			(group) => data[group] && Object.keys(data[group]).length
		)
		if (!hasLive) return null
		const now = dayjs()
		return {
			title: `${meses[now.month()]?.toUpperCase()} ${now.year()}`,
			activa: {
				resto: fmtEnergyValue(pick('E_tar', 'IAcE_Tar_0'), 'W', unit),
				pico: fmtEnergyValue(pick('E_tar', 'IAcE_Tar_2'), 'W', unit),
				valle: fmtEnergyValue(pick('E_tar', 'IAcE_Tar_4'), 'W', unit),
			},
			reactiva: fmtEnergyValue(pick('E_imp', 'IReE_3'), 'VAr', unit),
			demanda: {
				resto: fmtKw(pick('P_imp', 'DeM_Ta_0')),
				restoFecha: pick('P_imp', 'DeM_Ta_1'),
				pico: fmtKw(pick('P_imp', 'DeM_Ta_2')),
				picoFecha: pick('P_imp', 'DeM_Ta_3'),
				valle: fmtKw(pick('P_imp', 'DeM_Ta_4')),
				valleFecha: pick('P_imp', 'DeM_Ta_5'),
			},
			fp: fmtFp(pick('VI', 'CFi_3')),
		}
	}, [data, unit])

	const lastClose = closes[0] ?? null
	const previousCloses = closes.slice(1)
	const selected =
		previousCloses.find((close) => close.key === selectedClose) ?? previousCloses[0] ?? null

	if (isLoading) return <LoaderComponent image={false} />
	if (loadError) {
		return (
			<p className='w-full text-center italic text-red-600 dark:text-red-400 py-8'>
				No se pudo cargar el modelo de factura. Intente nuevamente.
			</p>
		)
	}
	if (!cursoCard && !closes.length) {
		return (
			<p className='w-full text-center italic text-gray-500 dark:text-zinc-300 py-8'>
				Sin datos de facturación para este medidor.
			</p>
		)
	}

	return (
		<div className='w-full flex flex-col gap-3'>
			{/* Selector de submúltiplo compartido con "Energía total" */}
			<div className='w-full flex justify-end'>
				<EnergyUnitSelect value={unit} onChange={onUnitChange} />
			</div>
			<div className='w-full flex flex-wrap gap-3.5 items-stretch'>
				{cursoCard && <InvoiceCard curso badge='EN CURSO' title={cursoCard.title} data={cursoCard} />}
				{lastClose && <InvoiceCard title={lastClose.title} data={lastClose} />}
				{selected && (
					<InvoiceCard
						data={selected}
						headerExtra={
							<Select
								size='small'
								value={selected.key}
								onChange={(e) => setSelectedClose(e.target.value)}
								className='!text-white [&_.MuiSelect-icon]:!text-white [&_.MuiOutlinedInput-notchedOutline]:!border-white/40'
								title='Elegí el período a consultar'
							>
								{previousCloses.map((close) => (
									<MenuItem key={close.key} value={close.key}>
										{close.title}
									</MenuItem>
								))}
							</Select>
						}
					/>
				)}
			</div>
		</div>
	)
}

export default ModelInvoice
