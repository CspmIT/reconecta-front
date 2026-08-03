import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import { request } from '../../../../utils/js/request'
import { backend } from '../../../../utils/routes/app.routes'
import LoaderComponent from '../../../../components/Loader'
import { useMeter } from '../../context/MeterContext'
import MetricCard from './components/MetricCard'
import ComboCard from './components/ComboCard'
import Fasorial from './components/Fasorial'

const PHASE_LABELS = ['L₁', 'L₂', 'L₃']

// Filas de una card combinada imp/exp (L1, L2, L3, Total)
const comboRows = (data, impKey, expKey, impObis, expObis) =>
	[...PHASE_LABELS, 'Total'].map((l, i) => ({
		l,
		total: i === 3,
		imp: { value: data?.[`${impKey}_${i}`]?.value, obis: impObis[i] },
		exp: { value: data?.[`${expKey}_${i}`]?.value, obis: expObis[i] },
	}))

function Metrology({ info, insta }) {
	const { convertV, convertI, txOn } = useMeter()
	const [power, setPower] = useState(null)
	const [energy, setEnergy] = useState(null)
	const [isLoading, setIsLoading] = useState(true)

	const getData = async () => {
		try {
			setIsLoading(true)
			const query = `serial=${info.serial}&version=${info.version}&brand=${info.brand}`
			const base = backend[`${import.meta.env.VITE_APP_NAME}`]
			const [power, energy] = await Promise.all([
				request(`${base}/getMetrologyPower?${query}`, 'GET'),
				request(`${base}/getMetrologyEnergy?${query}`, 'GET'),
			])
			setPower(power.data)
			setEnergy(energy.data)
		} catch (error) {
			console.error(error)
			Swal.fire({
				title: 'Atención!',
				html: `Hubo un problema con la carga de la metrología.</br>Intente nuevamente...`,
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

	const vi = insta?.VI ?? {}
	const maxExtra = (rmsKey, convert, uni) => {
		const month = insta?.maxMonth?.[rmsKey]?.value
		const history = insta?.maxHistory?.[rmsKey]?.value
		if (month === undefined && history === undefined) return ''
		const f = (v) => (v === undefined ? '—' : `${convert(parseFloat(v).toFixed(2))} ${uni}`)
		return `Máx. mes anterior: ${f(month)} · Máx. histórico: ${f(history)}`
	}

	const tensionRows = [
		{ l: 'V₁', value: convertV(vi.V_0?.value), obis: '1.1.32.7.0.255', extra: maxExtra('RMS_Max_6', convertV, 'V') },
		{ l: 'V₂', value: convertV(vi.V_1?.value), obis: '1.1.52.7.0.255', extra: maxExtra('RMS_Max_8', convertV, 'V') },
		{ l: 'V₃', value: convertV(vi.V_2?.value), obis: '1.1.72.7.0.255', extra: maxExtra('RMS_Max_10', convertV, 'V') },
		{ l: 'Vₙ', value: convertV(vi.V_3?.value), obis: '1.1.92.7.0.255' },
	].map((r) => ({ ...r, uni: 'V', converted: txOn }))

	const corrienteRows = [
		{ l: 'I₁', value: convertI(vi.I_0?.value), obis: '1.1.31.7.0.255', extra: maxExtra('RMS_Max_0', convertI, 'A') },
		{ l: 'I₂', value: convertI(vi.I_1?.value), obis: '1.1.51.7.0.255', extra: maxExtra('RMS_Max_2', convertI, 'A') },
		{ l: 'I₃', value: convertI(vi.I_2?.value), obis: '1.1.71.7.0.255', extra: maxExtra('RMS_Max_4', convertI, 'A') },
		{ l: 'Iₙ', value: convertI(vi.I_3?.value), obis: '1.1.91.7.0.255' },
	].map((r) => ({ ...r, uni: 'A', converted: txOn }))

	const cosenoRows = [
		{ l: 'cos φ₁', value: vi.CFi_0?.value, obis: '1.1.33.7.0.255' },
		{ l: 'cos φ₂', value: vi.CFi_1?.value, obis: '1.1.53.7.0.255' },
		{ l: 'cos φ₃', value: vi.CFi_2?.value, obis: '1.1.73.7.0.255' },
		{ l: 'Total', value: vi.CFi_3?.value, obis: '1.1.13.7.0.255' },
	].map((r) => ({ ...r, uni: '' }))

	const powerBlocks = [
		{
			sub: 'Activa',
			unit: 'kW',
			rows: comboRows(
				power,
				'IAcP',
				'EAcP',
				['1.1.21.7.0.255', '1.1.41.7.0.255', '1.1.61.7.0.255', '1.1.1.7.0.255'],
				['1.1.22.7.0.255', '1.1.42.7.0.255', '1.1.62.7.0.255', '1.1.2.7.0.255']
			),
		},
		{
			sub: 'Reactiva',
			unit: 'kVAr',
			rows: comboRows(
				power,
				'IReP',
				'EReP',
				['1.1.23.7.0.255', '1.1.43.7.0.255', '1.1.63.7.0.255', '1.1.3.7.0.255'],
				['1.1.24.7.0.255', '1.1.44.7.0.255', '1.1.64.7.0.255', '1.1.4.7.0.255']
			),
		},
		{
			sub: 'Aparente',
			unit: 'kVA',
			rows: comboRows(
				power,
				'IApP',
				'EApP',
				['1.1.29.7.0.255', '1.1.49.7.0.255', '1.1.69.7.0.255', '1.1.9.7.0.255'],
				['1.1.30.7.0.255', '1.1.50.7.0.255', '1.1.70.7.0.255', '1.1.10.7.0.255']
			),
		},
	]

	const energyBlocks = [
		{
			sub: 'Activa',
			unit: 'kWh',
			rows: comboRows(
				energy,
				'IAcE',
				'EAcE',
				['1.1.21.8.0.255', '1.1.41.8.0.255', '1.1.61.8.0.255', '1.1.1.8.0.255'],
				['1.1.22.8.0.255', '1.1.42.8.0.255', '1.1.62.8.0.255', '1.1.2.8.0.255']
			),
		},
		{
			sub: 'Reactiva',
			unit: 'kVArh',
			rows: comboRows(
				energy,
				'IReE',
				'EReE',
				['1.1.23.8.0.255', '1.1.43.8.0.255', '1.1.63.8.0.255', '1.1.3.8.0.255'],
				['1.1.24.8.0.255', '1.1.44.8.0.255', '1.1.64.8.0.255', '1.1.4.8.0.255']
			),
		},
		{
			sub: 'Aparente',
			unit: 'kVAh',
			rows: comboRows(
				energy,
				'IApE',
				'EApE',
				['1.1.29.8.0.255', '1.1.49.8.0.255', '1.1.69.8.0.255', '1.1.9.8.0.255'],
				['1.1.30.8.0.255', '1.1.50.8.0.255', '1.1.70.8.0.255', '1.1.10.8.0.255']
			),
		},
	]

	return (
		<div className='w-full'>
			<div className='flex items-baseline justify-between mb-4 flex-wrap gap-2'>
				<span className='text-lg font-medium'>Metrología instantánea</span>
				{txOn && (
					<span className='text-xs text-blue-700 dark:text-blue-300'>
						Tensiones y corrientes convertidas (CT/VT aplicado)
					</span>
				)}
			</div>
			<div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
				<MetricCard title='Tensión de fase' rows={tensionRows} />
				<MetricCard title='Corrientes' rows={corrienteRows} />
				<MetricCard title='Coseno φ' rows={cosenoRows} />
				<div className='md:col-span-3 border-2 border-t-4 border-blue-600 rounded-xl px-4 py-4 bg-white dark:bg-zinc-700 shadow-sm'>
					<h4 className='text-lg font-semibold text-center mb-3'>Diagrama fasorial</h4>
					<Fasorial info={{ version: info.version, brand: info.brand, serial: info.serial }} />
				</div>
				<ComboCard title='Potencia' blocks={powerBlocks} />
				<ComboCard title='Energía' blocks={energyBlocks} />
			</div>
		</div>
	)
}

export default Metrology
