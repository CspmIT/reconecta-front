import { useEffect, useState } from 'react'
import { request } from '../../../../../utils/js/request'
import { backend } from '../../../../../utils/routes/app.routes'
import LoaderComponent from '../../../../../components/Loader'
import AnalyzerLineChart from '../Charts/linecharts'
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
import dayjs from 'dayjs'

const Graphs = ({ analyzer }) => {
	const [values, setValues] = useState([])
	const [dateCurrent, setDateCurrent] = useState(dayjs())
	const [dateStart, setDateStart] = useState(dayjs().subtract(12, 'hour'))
	const getData = async () => {
		try {
			const body = {
				brand: analyzer?.equipmentmodels?.name.toLowerCase(),
				version: analyzer?.equipmentmodels?.brand.toLowerCase(),
				serial: analyzer?.serial,
				desc: "false",
				dateStart: dayjs(dateStart).toISOString(),
				dateEnd: dayjs(dateCurrent).toISOString()
			}
			const { data } = await request(`${backend[`${import.meta.env.VITE_APP_NAME}`]}/AnalyzerGraphics`, 'POST', body)
			if (data.length > 0) {
				setValues(data)
			}
		} catch (e) {
			console.log(e)
		}
	}
	useEffect(() => {
		getData()
	}, [])
	return (
		<div className='w-full'>
			{values.length > 0 ? (
				<div className='flex flex-col gap-5'>
					<div className='w-full flex justify-center my-5'>
						<LocalizationProvider dateAdapter={AdapterDayjs}>
							<DateTimePicker
								className='bg-white dark:bg-slate-800'
								ampm={false}
								label="Fecha de inicio"
								format='DD/MM/YYYY HH:mm'
								viewRenderers={{
									hours: renderTimeViewClock,
									minutes: renderTimeViewClock,
									seconds: renderTimeViewClock,
								}}
								value={dateStart}
								onChange={(newValue) => {
									setDateStart(newValue)
								}}
							/>
							<DateTimePicker
								className='bg-white dark:bg-slate-800'
								label="Fecha de fin"
								ampm={false}
								format='DD/MM/YYYY HH:mm'
								viewRenderers={{
									hours: renderTimeViewClock,
									minutes: renderTimeViewClock,
									seconds: renderTimeViewClock,
								}}
								value={dateCurrent}
								onChange={(newValue) => {
									setDateCurrent(newValue)
								}}
							/>
						</LocalizationProvider>
						<div className='flex flex-row items-center'>
							<button className='bg-blue-500 text-white rounded-lg px-4 py-2 ml-3' onClick={getData}>
								Filtrar
							</button>
						</div>
					</div>
					<div className='w-full h-[25rem] bg-white p-3'>
						<AnalyzerLineChart values={values[0].tension} title="Tensiones (V)" />
					</div>
					<div className='w-full h-[25rem] bg-white p-3'>
						<AnalyzerLineChart values={values[0].corriente} title="Corrientes (A)" />
					</div>
					<div className='w-full h-[25rem] bg-white p-3'>
						<AnalyzerLineChart values={values[0].activa} title="Potencias Activas (kW)" />
					</div>
					<div className='w-full h-[25rem] bg-white p-3'>
						<AnalyzerLineChart values={values[0].reactiva} title="Potencias Reactivas (kVAr)" />
					</div>
				</div>
			) : (
				<LoaderComponent />
			)}
		</div>
	)
}

export default Graphs
