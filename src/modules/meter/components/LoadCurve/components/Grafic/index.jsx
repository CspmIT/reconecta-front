import { useNavigate } from 'react-router-dom'
import GrafLinea from '../../../../../../components/Graphs/linechart'
import { useEffect, useState } from 'react'
import { request } from '../../../../../../utils/js/request'
import { backend } from '../../../../../../utils/routes/app.routes'
import Swal from 'sweetalert2'
import { getFormatterGraf } from './utils/js/actions'
import LoaderComponent from '../../../../../../components/Loader'
import { MenuItem, TextField } from '@mui/material'
import { dataGraficos } from './utils/dataGraf'
import MeterLineChart from '../Charts/linecharts'
import { DateTimePicker, LocalizationProvider, renderTimeViewClock } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'

function Grafic({ info }) {
	const navigate = useNavigate()
	const [dateCurrent, setDateCurrent] = useState(dayjs())
	const [dateStart, setDateStart] = useState(dayjs().subtract(12, 'hour'))
	const [isLoading, setIsLoading] = useState(true)
	const [dataGraf, setDataGraf] = useState([])
	const getDataGraf = async () => {
		try {
			setIsLoading(true)
			const dataGraf = await request(`${backend[`${import.meta.env.VITE_APP_NAME}`]}/getInfoGraf`, 'POST', {
				serial: info.serial,
				version: info.version,
				brand: info.brand,
				dateStart,
				dateFinished: dateCurrent
			})
			const data = dataGraf.data

			const dataGrafico = await Promise.all(dataGraficos.map((grafico) => getFormatterGraf(data, grafico)))
			setDataGraf(dataGrafico)

		} catch (error) {
			console.error(error)
			Swal.fire({
				title: 'Atención!',
				html: `Hubo un problema con la carga de los datos del Medidor.</br>Intente nuevamente...`,
				icon: 'error',
			})
			navigate('/Home')
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		if (!info) {
			Swal.fire({
				title: 'Atención!',
				html: `Hubo un problema con la carga de los datos del Medidor.<br>Intente nuevamente...`,
				icon: 'error',
			}).then(() => navigate('/Home'))
			return
		}
		getDataGraf()
	}, [info])
	const [selectOptionGraf, setSelectOptionGraf] = useState('Importada')
	const changeDisableGraf = (value) => {
		setSelectOptionGraf(value)
		setDataGraf((prevDataGraf) =>
			prevDataGraf.map((item) => ({
				...item,
				disable: item.titleGraf.includes('Exportada')
					? value !== 'Exportada'
					: item.titleGraf.includes('Importada')
						? value !== 'Importada'
						: item.disable,
			}))
		)
	}
	if (isLoading) return <LoaderComponent image={false} />
	return (
		<>
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
					<button className='bg-blue-500 text-white rounded-lg px-4 py-2 ml-3' onClick={getDataGraf}>
						Filtrar
					</button>
				</div>
			</div>
			{dataGraf.map((graf, index) => {
				if (!graf.disable)
					return (
						<div key={index} className='py-4 my-2 w-full flex flex-col items-center '>
							{graf.select ? (
								<TextField
									select
									value={selectOptionGraf}
									className='w-1/2 !mb-4'
									onChange={(e) => changeDisableGraf(e.target.value)}
								>
									<MenuItem value={'Importada'}>Importada</MenuItem>
									<MenuItem value={'Exportada'}>Exportada</MenuItem>
								</TextField>
							) : null}

							<div className={`w-full h-96 shadow-lg shadow-slate-300 p-4`}>
								<MeterLineChart title={graf.titleGraf} values={graf.data} />
							</div>
						</div>
					)
			})}
		</>
	)
}

export default Grafic
