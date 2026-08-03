import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import Swal from 'sweetalert2'
import TableCustom from '../../../../components/TableCustom'
import LoaderComponent from '../../../../components/Loader'
import { request } from '../../../../utils/js/request'
import { backend } from '../../../../utils/routes/app.routes'
import { formatterDataTable } from '../QualityTension/utils/Js'
import { formatterDataTable as interFormatterTable } from '../QualityTension/components/InterripcionTension/utils/js/action'

/*
 * Log unificado de eventos del medidor. Junta los antecedentes de calidad de
 * tensión (VQD) de los 4 tipos en orden cronológico. Puede haber redundancia
 * con la curva LP (mismo evento por dos vías): se acepta, es un sitio de logs.
 */
const SOURCES = [
	{
		endpoint: '/getQualitySurge',
		formatter: formatterDataTable,
		map: (row) => ({
			tipo: 'Calidad (VQD)',
			desc: `Sobretensión fase ${row.fase} (${row.Amplitud})`,
			sev: 'Aviso',
			extra: `Duración ${row.duration}`,
		}),
	},
	{
		endpoint: '/getQualityUnderVoltage',
		formatter: formatterDataTable,
		map: (row) => ({
			tipo: 'Calidad (VQD)',
			desc: `Subtensión fase ${row.fase} (${row.Amplitud})`,
			sev: 'Aviso',
			extra: `Duración ${row.duration}`,
		}),
	},
	{
		endpoint: '/getQualityCourt',
		formatter: formatterDataTable,
		map: (row) => ({
			tipo: 'Calidad (VQD)',
			desc: `Corte de tensión fase ${row.fase}`,
			sev: 'Alerta',
			extra: `Duración ${row.duration}`,
		}),
	},
	{
		endpoint: '/getQualityInterruption',
		formatter: interFormatterTable,
		map: (row) => ({
			tipo: 'Calidad (VQD)',
			desc: 'Interrupción de tensión',
			sev: 'Alerta',
			extra: `Duración ${row.duration}`,
		}),
	},
]

const SEV_CLASS = {
	Alerta: 'text-red-700 dark:text-red-400 font-semibold',
	Aviso: 'text-amber-700 dark:text-amber-400 font-semibold',
	Info: 'text-emerald-700 dark:text-emerald-400 font-semibold',
}

const columns = [
	{
		accessorKey: 'fecha',
		header: 'Fecha',
		size: 140,
	},
	{ accessorKey: 'tipo', header: 'Tipo', size: 120 },
	{ accessorKey: 'desc', header: 'Descripción', size: 260 },
	{
		accessorKey: 'sev',
		header: 'Severidad',
		size: 100,
		Cell: ({ cell }) => <span className={SEV_CLASS[cell.getValue()] ?? ''}>{cell.getValue()}</span>,
	},
	{ accessorKey: 'extra', header: 'Información adicional', size: 220 },
]

function EventsMeter({ info }) {
	const [rows, setRows] = useState([])
	const [isLoading, setIsLoading] = useState(true)

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
			const results = await Promise.allSettled(
				SOURCES.map((src) => request(`${base}${src.endpoint}`, 'POST', body))
			)
			const events = []
			for (let i = 0; i < results.length; i++) {
				if (results[i].status !== 'fulfilled') continue
				try {
					const list = await SOURCES[i].formatter(results[i].value.data)
					list.forEach((row) => {
						events.push({
							_date: row.datePeriod,
							fecha: dayjs(row.datePeriod).format('DD/MM/YYYY HH:mm:ss'),
							...SOURCES[i].map(row),
						})
					})
				} catch (error) {
					console.error(error)
				}
			}
			events.sort((a, b) => new Date(b._date) - new Date(a._date))
			setRows(events)
		} catch (error) {
			console.error(error)
			Swal.fire({
				title: 'Atención!',
				html: `Hubo un problema con la carga de los eventos.</br>Intente nuevamente...`,
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

	return (
		<div className='w-full'>
			<div className='flex items-baseline justify-between mb-4 flex-wrap gap-2'>
				<span className='text-lg font-medium'>Eventos del medidor</span>
				<span className='text-xs italic text-gray-500 dark:text-zinc-300'>
					Antecedentes de calidad de tensión unificados en orden cronológico
				</span>
			</div>
			<TableCustom
				data={rows}
				columns={columns}
				density='compact'
				header={{
					background: 'rgb(190 190 190)',
					fontSize: '18px',
					fontWeight: 'bold',
				}}
				card={{
					boxShadow: `1px 1px 8px 0px #00000046`,
					borderRadius: '0.25rem',
				}}
				toolbarClass={{ background: 'rgb(190 190 190)' }}
				body={{ backgroundColor: 'rgba(209, 213, 219, 0.31)' }}
				footer={{ background: 'rgb(190 190 190)' }}
				pageSize={15}
				topToolbar
				filter
				pagination
			/>
		</div>
	)
}

export default EventsMeter
