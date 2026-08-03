import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import 'highcharts/highcharts-more'
import Swal from 'sweetalert2'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { request } from '../../../../../../utils/js/request'
import { backend } from '../../../../../../utils/routes/app.routes'
import { getFasorial2 } from './utils/actions'
import LoaderComponent from '../../../../../../components/Loader'

// Leyenda del fasorial (como el mockup): desfasaje I–V por fase y ángulos entre tensiones
const PHI_ROWS = [
	{ label: 'φ L1', field: 'A_IV_L1', obis: '1.1.81.7.40.255', color: '#2563eb' },
	{ label: 'φ L2', field: 'A_IV_L2', obis: '1.1.81.7.51.255', color: '#ef4444' },
	{ label: 'φ L3', field: 'A_IV_L3', obis: '1.1.81.7.62.255', color: '#16a34a' },
]
const VDIFF_ROWS = [
	{ label: 'V₂–V₁', field: 'A_V_L2L1', obis: '1.1.81.7.10.255' },
	{ label: 'V₃–V₂', field: 'A_V_L3L2', obis: '1.1.81.7.21.255' },
	{ label: 'V₁–V₃', field: 'A_V_L1L3', obis: '1.1.81.7.2.255' },
]

const fmtAngle = (value) => {
	const num = parseFloat(value)
	if (isNaN(num)) return 'sin datos'
	return `${num.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}°`
}

function LegendColumn({ title, rows, vi }) {
	return (
		<div className='min-w-0'>
			<div className='text-xs font-bold uppercase tracking-wide text-blue-600 dark:text-blue-300 mb-1.5'>
				{title}
			</div>
			<div className='grid grid-cols-[max-content_max-content] gap-x-3.5 gap-y-1.5 items-baseline'>
				{rows.map((row) => (
					<div key={row.field} className='contents'>
						<span
							className='text-sm font-semibold text-right'
							style={row.color ? { color: row.color } : undefined}
						>
							{row.label}
						</span>
						<span className='text-[15px] font-bold cursor-help' title={`OBIS ${row.obis}`}>
							{fmtAngle(vi?.[row.field]?.value)}
						</span>
					</div>
				))}
			</div>
		</div>
	)
}

function Fasorial({ info }) {
	const navigate = useNavigate()
	const [isLoading, setIsLoading] = useState(true)
	const [optionsFasorial, setOptionsFasorial] = useState([])
	const [vi, setVi] = useState(null)
	const getDataInsta = async () => {
		try {
			setIsLoading(true)
			const meter = await request(
				`${backend[`${import.meta.env.VITE_APP_NAME}`]}/getMetrologyVI?serial=${info.serial}&version=${
					info.version
				}&brand=${info.brand}`,
				'GET'
			)

			const opciones = await getFasorial2(meter.data)
			setOptionsFasorial(opciones)
			setVi(meter.data?.VI ?? null)
			setIsLoading(false)
		} catch (error) {
			Swal.fire({
				title: 'Atención!',
				html: `Hubo un problema con la carga de los datos del Medidor.</br>Intente nuevamente...`,
				icon: 'error',
			})
			navigate('/Home')
		}
	}

	useEffect(() => {
		if (!info) {
			Swal.fire({
				title: 'Atención!',
				html: `Hubo un problema con la carga de los datos del Medidor.</br>Intente nuevamente...`,
				icon: 'error',
			})
			navigate('/Home')
		} else {
			getDataInsta()
		}
	}, [info])

	if (isLoading) return <LoaderComponent image={false} />
	return (
		<div className='flex flex-wrap w-full justify-center items-center gap-x-12 gap-y-4'>
			<div className='w-full max-w-full sm:w-2/5 md:w-1/3 flex-shrink-0'>
				<HighchartsReact highcharts={Highcharts} options={optionsFasorial} />
			</div>
			<div className='flex gap-12 flex-wrap justify-center'>
				<LegendColumn title='Desfasaje I–V (φ)' rows={PHI_ROWS} vi={vi} />
				<LegendColumn title='Ángulos entre tensiones' rows={VDIFF_ROWS} vi={vi} />
			</div>
		</div>
	)
}

export default Fasorial
