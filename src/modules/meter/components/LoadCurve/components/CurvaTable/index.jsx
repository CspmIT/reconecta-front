import { useEffect, useMemo, useState } from 'react'
import { Button, TextField } from '@mui/material'
import { useForm } from 'react-hook-form'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import TableCustom from '../../../../../../components/TableCustom'
import LoaderComponent from '../../../../../../components/Loader'
import { request } from '../../../../../../utils/js/request'
import { backend } from '../../../../../../utils/routes/app.routes'
import { useMeter } from '../../../../context/MeterContext'
import { formatStrToDate } from '../../../../../../utils/js/formatDate'
import { enabledVariables } from '../../utils/curvaConfig'

/*
 * Tabla de la curva de carga (LP): una sola tabla con las variables tildadas
 * en "Variables" como columnas. Todos los canales salen del topic /status/curva
 * (endpoint getCurva); las filas se arman mergeando los fields por _time.
 */
// La unidad acompaña cada dato (además del encabezado); '-' va solo
const fmtValue = (value, unit = '') => {
	const num = parseFloat(value)
	if (isNaN(num)) return '-'
	const text = num.toLocaleString('es-AR', { maximumFractionDigits: 3 })
	return unit ? `${text} ${unit}` : text
}

function CurvaTable({ info, enabledKeys }) {
	const { txOn, vtFactor } = useMeter()
	const [data, setData] = useState(null)
	const [isLoading, setIsLoading] = useState(true)
	const [loadError, setLoadError] = useState(false)

	const variables = useMemo(() => enabledVariables(enabledKeys), [enabledKeys])

	const getData = async (dateStart = null, dateFinished = null) => {
		try {
			setIsLoading(true)
			setLoadError(false)
			const response = await request(
				`${backend[`${import.meta.env.VITE_APP_NAME}`]}/getCurva`,
				'POST',
				{
					serial: info.serial,
					version: info.version,
					brand: info.brand,
					dateStart,
					dateFinished,
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

	// Merge de los fields por _time de Influx. Como fecha del registro se muestra
	// el field "ts" del topico (la fecha que reporta el propio medidor); si no
	// vino o no parsea, se cae al _time de ingestion.
	const rows = useMemo(() => {
		if (!data) return []
		const tsByTime = new Map(
			(Array.isArray(data.ts) ? data.ts : []).map((item) => [item.time, item.value])
		)
		const recordDate = (time) => {
			const ts = tsByTime.get(time)
			if (ts) {
				const parsed = formatStrToDate(ts)
				if (!isNaN(parsed)) return parsed
			}
			return new Date(time)
		}
		const merged = new Map()
		variables.forEach((variable) => {
			const serie = data[variable.key]
			if (!Array.isArray(serie)) return
			serie.forEach((item) => {
				if (!merged.has(item.time)) {
					merged.set(item.time, { datePeriod: recordDate(item.time) })
				}
				let value = item.value
				// Toggle Convertido: solo las tensiones se llevan a primario (×VT)
				if (txOn && variable.tx === 'vt') {
					const num = parseFloat(value)
					if (!isNaN(num)) value = +(num * vtFactor).toFixed(2)
				}
				merged.get(item.time)[variable.key] = value
			})
		})
		return [...merged.values()].sort((a, b) => b.datePeriod - a.datePeriod)
	}, [data, variables, txOn, vtFactor])

	const columns = useMemo(
		() => [
			{
				id: 'datePeriod',
				accessorKey: 'datePeriod',
				Cell: ({ cell }) =>
					`${cell.getValue().toLocaleDateString()} ${cell.getValue().toLocaleTimeString()}`,
				header: 'Fecha / Hora',
				size: 170,
			},
			...variables.map((variable) => ({
				header: variable.label,
				accessorKey: variable.key,
				enableColumnFilter: false,
				enableSorting: false,
				size: 130,
				Cell: ({ cell }) => fmtValue(cell.getValue(), variable.unit),
			})),
		],
		[variables]
	)

	const filterTable = (formData) => {
		getData(formData.dateStart, formData.dateFinished)
	}

	const {
		register,
		formState: { errors },
		handleSubmit,
	} = useForm()

	if (isLoading) return <LoaderComponent image={false} />

	if (!variables.length) {
		return (
			<p className='w-full text-center italic text-gray-500 dark:text-zinc-300 py-8'>
				No hay variables seleccionadas. Abrí <b>Variables</b> y tildá al menos una.
			</p>
		)
	}

	return (
		<div className='w-full'>
			<form className='flex justify-center w-full gap-4 my-4' onSubmit={handleSubmit(filterTable)}>
				<TextField
					error={errors.dateStart ? true : false}
					type='date'
					label='Desde'
					{...register('dateStart', { required: 'El campo es requerido' })}
					InputLabelProps={{
						shrink: true,
					}}
					className='w-1/4'
					helperText={errors.dateStart && errors.dateStart.message}
				/>
				<TextField
					error={errors.dateFinished ? true : false}
					type='date'
					label='Hasta'
					{...register('dateFinished', { required: 'El campo es requerido' })}
					InputLabelProps={{
						shrink: true,
					}}
					className='w-1/4'
					helperText={errors.dateFinished && errors.dateFinished.message}
				/>
				<Button type='submit' variant='contained' color='primary'>
					Filtrar
				</Button>
			</form>
			{loadError ? (
				<p className='w-full text-center italic text-red-600 dark:text-red-400 py-6'>
					No se pudieron cargar los registros de la curva. Intente nuevamente.
				</p>
			) : !rows.length ? (
				<p className='w-full text-center italic text-gray-500 dark:text-zinc-300 py-6'>
					No hay registros de curva en el rango elegido.
				</p>
			) : (
				<LocalizationProvider dateAdapter={AdapterDayjs}>
					<TableCustom
						data={rows}
						columns={columns}
						density='compact'
						densityToggle={false}
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
						pageSize={10}
						topToolbar
						exportPdf
						exportExcel
						pagination
					/>
				</LocalizationProvider>
			)}
		</div>
	)
}

export default CurvaTable
