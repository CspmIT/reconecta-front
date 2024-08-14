import React, { useContext, useEffect, useState } from 'react'
import HeaderBoard from '../headerBoard'
import { Button } from '@mui/material'
import { FaEdit, FaRedo } from 'react-icons/fa'
import ControlsBoard from '../controlsBoard'
import MetrologyBoard from '../metrologyBoard'
import EventBoard from '../eventBoard'
import CardBoard from '../cardBoard'
import AnalyticsBoard from '../analyticsBoard'
import ManeuverBoard from '../maneuverBoard'
import { MainContext } from '../../../../../context/MainContext'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'
import { recloser } from '../../utils/objects'
import { Edit } from '@mui/icons-material'

const DataBoard = () => {
	const [selectedCardId, setSelectedCardId] = useState(null)
	const [info, setInfo] = useState([])
	const navigate = useNavigate()
	const handleCardSelect = (id) => {
		setSelectedCardId(id)
	}
	const { tabCurrent, tabs } = useContext(MainContext)

	const [data] = useState(tabs[tabCurrent] || null)
	useEffect(() => {
		if (!data) {
			Swal.fire({
				title: 'Atención!',
				html: `Hubo un problema con la carga de los datos del reconectador.</br>Intente nuevamente...`,
				icon: 'error',
			})
			navigate('/Home')
		} else {
			setInfo(recloser.filter((item) => item.id == data.id)[0])
		}
	}, [data])

	return (
		<div className='w-full  items-center rounded-xl p-3 bg-gray-200 dark:bg-gray-600'>
			<div className='flex flex-row relative justify-between mb-8'>
				<div className='flex-grow flex justify-center'>
					<h2 className='text-2xl'>Reconectador</h2>
				</div>
				<div className='absolute right-2'>
					<Button variant='contained' title='Recargar Datos'>
						<FaRedo />
					</Button>
					<Button
						onClick={() => navigate('/AbmRecloser/' + info.id)}
						className='!ml-3'
						color='warning'
						title='Editar Reconectador'
						variant='contained'
					>
						<FaEdit />
					</Button>
				</div>
			</div>
			<div className='mb-8'>
				<HeaderBoard info={info} />
			</div>
			<div className='mb-4'>
				<ControlsBoard info={info} />
			</div>
			<CardBoard onCardSelect={handleCardSelect} />
			<div className='p-3'>
				{selectedCardId === 1 ? <MetrologyBoard info={info} /> : null}
				{selectedCardId === 2 ? <EventBoard info={info} /> : null}
				{selectedCardId === 3 ? <AnalyticsBoard info={info} /> : null}
				{selectedCardId === 4 ? <ManeuverBoard info={info} /> : null}
			</div>
		</div>
	)
}

export default DataBoard
