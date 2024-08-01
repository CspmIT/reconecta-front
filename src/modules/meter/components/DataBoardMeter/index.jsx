import { Button } from '@mui/material'
import React, { useState } from 'react'
import { FaEdit, FaRedo } from 'react-icons/fa'
import Header from '../Header'
import CardBoard from '../CardBoard'
import Metrology from '../Metrology'
import LoadCurve from '../LoadCurve'
import QualityTension from '../QualityTension'
import HistoryMeter from '../HistoryMeter'

function DataBoardMeter() {
	const [selectedCardId, setSelectedCardId] = useState(null)
	const handleCardSelect = (id) => {
		setSelectedCardId(id)
	}
	return (
		<div className='w-full  items-center rounded-xl p-3 bg-gray-200 dark:bg-gray-600'>
			<div className='flex flex-row relative justify-between mb-8'>
				<div className='flex-grow flex justify-center'>
					<h2 className='text-2xl'>Medidor</h2>
				</div>
				<div className='absolute right-2'>
					<Button variant='contained' title='Recargar Datos'>
						<FaRedo />
					</Button>
					<Button
						// onClick={() => navigate('/AbmRecloser/' + info.id)}
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
				<Header />
			</div>
			<CardBoard onCardSelect={handleCardSelect} />
			<div className='p-3'>
				{selectedCardId === 1 ? <Metrology /> : null}
				{selectedCardId === 2 ? <LoadCurve /> : null}
				{selectedCardId === 3 ? <QualityTension /> : null}
				{selectedCardId === 4 ? <HistoryMeter /> : null}
			</div>
		</div>
	)
}

export default DataBoardMeter
