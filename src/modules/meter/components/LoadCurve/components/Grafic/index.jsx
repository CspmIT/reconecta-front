import { useEffect, useMemo, useState } from 'react'
import dayjs from 'dayjs'
import { Button, TextField } from '@mui/material'
import { useForm } from 'react-hook-form'
import MeterLineChart from '../Charts/linecharts'
import LoaderComponent from '../../../../../../components/Loader'
import { request } from '../../../../../../utils/js/request'
import { backend } from '../../../../../../utils/routes/app.routes'
import { useMeter } from '../../../../context/MeterContext'
import { enabledVariables } from '../../utils/curvaConfig'

/*
 * Gráficas de la curva de carga (LP): un chart por grupo de variables (misma
 * naturaleza juntas, como el mockup), con los datos del topic /status/curva
 * (endpoint getCurva) y solo las variables tildadas en "Variables".
 */
function Grafic({ info, enabledKeys }) {
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

	// Un chart por grupo; series alineadas por _time (huecos = null, corta la línea).
	// Las etiquetas del eje X usan el field "ts" del topico (fecha que reporta el
	// medidor); si falta, se cae al _time de ingestion de Influx.
	const charts = useMemo(() => {
		if (!data) return []
		const tsByTime = new Map(
			(Array.isArray(data.ts) ? data.ts : []).map((item) => [item.time, item.value])
		)
		const recordLabel = (time) => tsByTime.get(time) ?? dayjs(time).format('DD/MM/YYYY HH:mm')
		const groups = new Map()
		variables.forEach((variable) => {
			if (!groups.has(variable.group)) groups.set(variable.group, [])
			groups.get(variable.group).push(variable)
		})
		const result = []
		groups.forEach((groupVars, group) => {
			const timesSet = new Set()
			groupVars.forEach((variable) => {
				;(Array.isArray(data[variable.key]) ? data[variable.key] : []).forEach((item) =>
					timesSet.add(item.time)
				)
			})
			const times = [...timesSet].sort()
			if (!times.length) return
			const values = { DatePeriod: times.map((time) => recordLabel(time)) }
			groupVars.forEach((variable) => {
				const serie = Array.isArray(data[variable.key]) ? data[variable.key] : []
				const byTime = new Map(serie.map((item) => [item.time, item.value]))
				values[variable.label] = times.map((time) => {
					let value = byTime.get(time) ?? null
					if (value !== null && txOn && variable.tx === 'vt') {
						const num = parseFloat(value)
						if (!isNaN(num)) value = +(num * vtFactor).toFixed(2)
					}
					return value
				})
			})
			result.push({ title: group, values })
		})
		return result
	}, [data, variables, txOn, vtFactor])

	const filterCharts = (formData) => {
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
			<form className='flex justify-center w-full gap-4 my-4' onSubmit={handleSubmit(filterCharts)}>
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
			) : !charts.length ? (
				<p className='w-full text-center italic text-gray-500 dark:text-zinc-300 py-6'>
					No hay registros de curva en el rango elegido.
				</p>
			) : (
				charts.map((chart) => (
					<div key={chart.title} className='py-4 my-2 w-full flex flex-col items-center'>
						<div className='w-full h-96 shadow-lg shadow-slate-300 dark:shadow-zinc-800 p-4'>
							<MeterLineChart title={chart.title} values={chart.values} />
						</div>
					</div>
				))
			)}
		</div>
	)
}

export default Grafic
