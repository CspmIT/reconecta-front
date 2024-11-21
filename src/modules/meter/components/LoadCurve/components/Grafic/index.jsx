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

function Grafic({ info }) {
	const navigate = useNavigate()
	const [isLoading, setIsLoading] = useState(true)
	const [dataGraf, setDataGraf] = useState([])
	const getDataGraf = async (dateStart = null, dateFinished = null) => {
		try {
			setIsLoading(true)
			const dataGraf = await request(`${backend[`${import.meta.env.VITE_APP_NAME}`]}/getInfoGraf`, 'POST', {
				serial: info.serial,
				version: info.version,
				brand: info.brand,
				dateStart,
				dateFinished,
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
			{dataGraf.map((graf, index) => {
				if (!graf.disable)
					return (
						<div className='py-4 my-2 w-full flex flex-col items-center '>
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

							<div className={`w-full shadow-lg shadow-slate-300 p-4`}>
								<GrafLinea
									key={index}
									title={graf.titleGraf}
									seriesData={graf.graf}
									axisX={graf.data.DatePeriod}
									configyAxis={graf.config}
									colors={['#ff4c4c', '#6cff6c', '#6161ff', '#ffff62']}
									configMarks={{
										radius: 1,
									}}
								/>
							</div>
						</div>
					)
			})}
		</>
	)
}

export default Grafic
