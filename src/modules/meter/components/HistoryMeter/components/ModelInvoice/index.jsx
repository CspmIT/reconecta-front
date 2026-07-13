import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import { request } from '../../../../../../utils/js/request'
import { backend } from '../../../../../../utils/routes/app.routes'
import LoaderComponent from '../../../../../../components/Loader'
import { convertStringToDate, meses } from '../../../../../../utils/js/formatDate'

/*
 * Modelo de factura: cards por período de facturación (EOB) con los registros
 * por tarifa (Resto/Pico/Valle) del último período cerrado y del anterior.
 * La demanda máxima por tarifa queda pendiente hasta que el backend exponga
 * el objeto de máxima demanda del EOB (/EOB/maxdemand).
 */
const TARIFAS = [
	{ key: 'RTE_0', label: 'Resto', obis: '1.1.1.8.1.255' },
	{ key: 'RTE_1', label: 'Pico', obis: '1.1.1.8.2.255' },
	{ key: 'RTE_2', label: 'Valle', obis: '1.1.1.8.3.255' },
]

const fmtKwh = (value) => {
	const num = parseFloat(value)
	if (isNaN(num)) return 'sin datos'
	return `${num.toLocaleString('es-AR', { maximumFractionDigits: 2 })} kWh`
}

const monthName = (time) => {
	try {
		const date = convertStringToDate(time)
		return `${meses[date.getMonth()]?.toUpperCase() ?? ''} ${date.getFullYear()}`
	} catch (error) {
		return ''
	}
}

function InvoiceCard({ title, badge, rows, periodo, fp }) {
	return (
		<div className='flex-1 min-w-[270px] border border-gray-300 dark:border-zinc-500 rounded-xl overflow-hidden bg-gray-100 dark:bg-zinc-600 shadow-sm flex flex-col'>
			<div className='bg-[#7E3A39] text-white font-semibold text-sm text-center py-2.5 flex items-center justify-center gap-2'>
				{title || 'PERÍODO'}
				{badge && (
					<span className='text-[10px] font-medium bg-white/25 px-2 py-0.5 rounded-full tracking-wide'>
						{badge}
					</span>
				)}
			</div>
			<div className='p-4 text-sm flex-1 flex flex-col gap-3'>
				<div>
					<p className='text-[11px] uppercase tracking-wide text-gray-600 dark:text-zinc-300 font-semibold mb-1.5'>
						Registro al cierre (acumulado)
					</p>
					{rows.map((row) => (
						<div key={row.label} className='flex items-center gap-2 pl-4 py-0.5'>
							<span className='min-w-[46px] text-gray-600 dark:text-zinc-300'>{row.label}:</span>
							<span
								className='font-semibold cursor-help'
								title={`OBIS ${row.obis} · Acumulador de vida congelado al cierre de facturación`}
							>
								{row.value}
							</span>
						</div>
					))}
				</div>
				{periodo && (
					<div>
						<p className='text-[11px] uppercase tracking-wide text-gray-600 dark:text-zinc-300 font-semibold mb-1.5'>
							Energía del período
						</p>
						{periodo.map((row) => (
							<div key={row.label} className='flex items-center gap-2 pl-4 py-0.5'>
								<span className='min-w-[46px] text-gray-600 dark:text-zinc-300'>{row.label}:</span>
								<span
									className='font-semibold text-blue-800 dark:text-blue-300 cursor-help'
									title='Diferencia entre el registro de este cierre y el del cierre anterior'
								>
									{row.value}
								</span>
							</div>
						))}
					</div>
				)}
				<div>
					<p className='text-[11px] uppercase tracking-wide text-gray-600 dark:text-zinc-300 font-semibold mb-1.5'>
						Factor de potencia
					</p>
					<p className='pl-4 font-semibold'>
						{fp ?? <span className='italic text-gray-400 font-normal'>pendiente</span>}
					</p>
				</div>
				<div>
					<p className='text-[11px] uppercase tracking-wide text-gray-600 dark:text-zinc-300 font-semibold mb-1.5'>
						Demanda máxima
					</p>
					<p className='pl-4 italic text-gray-400'>pendiente de publicación EOB</p>
				</div>
			</div>
		</div>
	)
}

function ModelInvoice({ info }) {
	const [isLoading, setIsLoading] = useState(true)
	const [cards, setCards] = useState([])

	const getData = async () => {
		try {
			setIsLoading(true)
			const body = {
				serial: info.serial,
				version: info.version,
				brand: info.brand,
				dateStart: null,
				dateFinished: null,
			}
			const base = backend[`${import.meta.env.VITE_APP_NAME}`]
			const [tarifa, summary] = await Promise.allSettled([
				request(`${base}/getHistoryEnergyTarifa`, 'POST', body),
				request(`${base}/getHistorySummary`, 'POST', body),
			])
			const data = tarifa.status === 'fulfilled' ? tarifa.value.data : null
			if (!data || data === 'sin datos') {
				setCards([])
				return
			}
			const fpProm = summary.status === 'fulfilled' ? summary.value.data?.FP_2?.value : null

			const buildCard = (index) => {
				let title = ''
				const rows = TARIFAS.map((tarifa) => {
					const item = data[tarifa.key]?.[index]
					if (!title && item?.time) title = monthName(item.time)
					return {
						label: tarifa.label,
						obis: tarifa.obis,
						value: fmtKwh(item?.value),
					}
				})
				return { title, rows }
			}

			// Energía del período = registro de este cierre − registro del cierre anterior
			// (los registros del EOB son acumuladores de vida congelados, no energía del mes)
			const periodo = TARIFAS.map((tarifa) => {
				const actual = parseFloat(data[tarifa.key]?.[0]?.value)
				const anterior = parseFloat(data[tarifa.key]?.[1]?.value)
				return {
					label: tarifa.label,
					value: isNaN(actual) || isNaN(anterior) ? 'sin datos' : fmtKwh(actual - anterior),
				}
			})

			setCards([
				{ ...buildCard(0), badge: 'ÚLTIMO CIERRE', periodo, fp: fpProm ?? null },
				{ ...buildCard(1), badge: 'PERÍODO ANTERIOR', fp: null },
			])
		} catch (error) {
			console.error(error)
			Swal.fire({
				title: 'Atención!',
				html: `Hubo un problema con la carga del modelo de factura.</br>Intente nuevamente...`,
				icon: 'error',
			})
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		if (info) getData()
	}, [info])

	if (isLoading) return <LoaderComponent image={false} />
	if (!cards.length) {
		return (
			<p className='w-full text-center italic text-gray-500 dark:text-zinc-300 py-8'>
				Sin datos de facturación para este medidor.
			</p>
		)
	}

	return (
		<div className='w-full'>
			<p className='text-xs text-gray-600 dark:text-zinc-300 bg-gray-100 dark:bg-zinc-600 border border-gray-200 dark:border-zinc-500 rounded-lg px-3.5 py-2.5 mb-3 leading-relaxed'>
				Registros por tarifa del cierre de facturación (EOB). Cada card corresponde a un período
				cerrado por el reinicio de fin de mes del medidor.
			</p>
			<div className='flex flex-wrap gap-3.5 items-stretch'>
				{cards.map((card, index) => (
					<InvoiceCard key={index} {...card} />
				))}
			</div>
		</div>
	)
}

export default ModelInvoice
