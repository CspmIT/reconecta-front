import TabsMeter from '../tabsMeter'
import { useEffect, useState } from 'react'
import ModelInvoice from './components/ModelInvoice'
import EnergiTotalTab from './components/EnergiTotalTab'
import { request } from '../../../../utils/js/request'
import { backend } from '../../../../utils/routes/app.routes'
import LoaderComponent from '../../../../components/Loader'

/*
 * Pestaña Energía (EOB), layout del mockup:
 *  - Card fija: reinicios del último cierre (getEobSummary) + Valores de operación.
 *  - Sub-tabs: Modelo de factura (getEobInvoice) y Energía total (getEobEnergyTotal).
 * Las sub-tabs están en migración a los endpoints nuevos (pendiente mapeo de fields).
 */
const CAUSA_REINICIO = {
	1: 'Mediante opresión de tecla',
	20: 'Finalización del periodo',
}

const causaTexto = (code) => {
	if (code === undefined || code === null) return 'sin datos'
	const num = parseInt(code, 10)
	return CAUSA_REINICIO[num] ?? `Código ${code} (sin interpretación)`
}

function HistoryMeter({ info }) {
	const [isLoading, setIsLoading] = useState(true)
	const [resumen, setResumen] = useState(null)
	const [loadError, setLoadError] = useState(false)
	// Submúltiplo de energía compartido entre las sub-tabs (mockup: aplica a todo el panel)
	const [energyUnit, setEnergyUnit] = useState('auto')

	const getSummary = async () => {
		try {
			setIsLoading(true)
			setLoadError(false)
			const response = await request(
				`${backend[`${import.meta.env.VITE_APP_NAME}`]}/getEobSummary`,
				'POST',
				{
					serial: info.serial,
					version: info.version,
					brand: info.brand,
				}
			)
			// EOB/main publica una vez por mes; el backend trae el último registro por field
			const main = response.data?.main
			const pick = (field) => main?.[field]?.[0]?.value
			setResumen({
				causa: pick('rst_causa'),
				fecha: pick('rst'),
				numero: pick('rst_num'),
				dias: pick('rst_dias'),
			})
		} catch (error) {
			console.error(error)
			setLoadError(true)
			setResumen(null)
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		if (info) getSummary()
	}, [info])

	const tabs = [
		{
			id: 1,
			title: 'Modelo de factura',
			component: <ModelInvoice info={info} unit={energyUnit} onUnitChange={setEnergyUnit} />,
		},
		{
			id: 2,
			title: 'Energía total',
			component: <EnergiTotalTab info={info} unit={energyUnit} onUnitChange={setEnergyUnit} />,
		},
	]

	if (isLoading) return <LoaderComponent image={false} />
	const hasRestart = resumen && resumen.causa !== undefined

	return (
		<>
			<div className='w-full flex flex-wrap justify-center relative py-5 mb-5 border-y-2 border-solid border-gray-300 dark:border-zinc-500'>
				{hasRestart ? (
					<div className='w-full grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-2 justify-items-center leading-relaxed'>
						{/* Cada registro en su propio renglón, etiqueta y valor en línea */}
						<p className='whitespace-nowrap'>
							Causa del último reinicio:{' '}
							<span
								className='font-bold cursor-help'
								title='OBIS 1.0.98.134.1.255 · llega como código en rst_causa'
							>
								{causaTexto(resumen.causa)}
							</span>
						</p>
						<p className='whitespace-nowrap'>
							Fecha del último reinicio:{' '}
							<span className='font-bold'>{resumen.fecha ?? 'sin datos'}</span>
						</p>
						<p className='whitespace-nowrap'>
							Número de reinicios:{' '}
							<span className='font-bold'>{resumen.numero ?? 'sin datos'}</span>
						</p>
						<p className='whitespace-nowrap'>
							Días desde el último reinicio:{' '}
							<span className='font-bold'>{resumen.dias ?? 'sin datos'}</span>
						</p>
					</div>
				) : (
					<p className='italic text-gray-500 dark:text-zinc-300 py-2'>
						{loadError
							? 'No se pudo cargar el resumen de reinicios. Intente recargar.'
							: 'Sin registros de reinicio (EOB) para este medidor.'}
					</p>
				)}
			</div>
			<TabsMeter tabs={tabs} />
		</>
	)
}

export default HistoryMeter
