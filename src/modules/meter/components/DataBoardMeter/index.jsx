import { Button } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import { FaEdit, FaRedo } from 'react-icons/fa'
import Header from '../Header'
import CardBoard from '../CardBoard'
import Metrology from '../Metrology'
import LoadCurve from '../LoadCurve'
import QualityTension from '../QualityTension'
import HistoryMeter from '../HistoryMeter'
import { useNavigate } from 'react-router-dom'
import { MainContext } from '../../../../context/MainContext'
import Swal from 'sweetalert2'
import { backend } from '../../../../utils/routes/app.routes'
import { request } from '../../../../utils/js/request'
import LoaderComponent from '../../../../components/Loader'

function DataBoardMeter() {
	const [info, setInfo] = useState(null)
	const navigate = useNavigate()
	const [isLoading, setIsLoading] = useState(true)
	const { tabCurrent, tabs } = useContext(MainContext)
	const [data] = useState(tabs[tabCurrent] || null)

	const getDataMeter = async (id) => {
		try {
			const meter = await request(`${backend[`${import.meta.env.VITE_APP_NAME}`]}/getDataMeter?id=${id}`, 'GET')
			setInfo(meter.data)
			setIsLoading(false)
			setSelectedCardId(1)
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
		if (!data) {
			Swal.fire({
				title: 'Atención!',
				html: `Hubo un problema con la carga de los datos del Medidor.</br>Intente nuevamente...`,
				icon: 'error',
			})
			navigate('/Home')
		} else {
			getDataMeter(data.id)
		}
	}, [data])

	const [selectedCardId, setSelectedCardId] = useState(null)
	const handleCardSelect = (id) => {
		setSelectedCardId(id)
	}
	return (
		<div className='w-full rounded-xl p-3 bg-gray-200 dark:bg-gray-600 '>
			<div className='flex flex-row relative justify-between mb-8'>
				<div className='flex-grow flex justify-center'>
					<h2 className='text-2xl'>Medidor</h2>
				</div>
				<div className='absolute right-2 top-8 md:top-0'>
					<Button variant='contained' title='Recargar Datos'>
						<FaRedo />
					</Button>
					<Button
						onClick={() => navigate('/AbmDevice/meter/' + info.id)}
						className='!ml-3'
						color='warning'
						title='Editar Reconectador'
						variant='contained'
					>
						<FaEdit />
					</Button>
				</div>
			</div>
			{isLoading ? (
				<div className='p-5'>
					<LoaderComponent image={false} />
				</div>
			) : (
				<>
					<div className='mb-8'>
						<Header info={info} />
					</div>
					<CardBoard onCardSelect={handleCardSelect} />
					<div className='p-3'>
						{selectedCardId === 1 ? <Metrology info={info} /> : null}
						{selectedCardId === 2 ? <LoadCurve info={info} /> : null}
						{selectedCardId === 3 ? <QualityTension info={info} /> : null}
						{selectedCardId === 4 ? <HistoryMeter info={info} /> : null}
					</div>
				</>
			)}
		</div>
	)
}

export default DataBoardMeter
