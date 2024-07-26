import React, { useState } from 'react'
import CardCustom from '../../../../../components/CardCustom'
import { FaChartArea, FaHistory, FaTachometerAlt } from 'react-icons/fa'

const CardBoard = ({ onCardSelect }) => {
	const [selectedCardId, setSelectedCardId] = useState(null)
	const boardCards = [
		{ id: 1, name: 'METROLOGÍA', icon: <FaTachometerAlt /> },
		{ id: 2, name: 'CURVA DE CARGA', icon: <FaChartArea /> },
		{ id: 3, name: 'HISTORICOS', icon: <FaHistory /> },
	]
	const handleCard = (id) => {
		const newSelectedCardId = id === selectedCardId ? null : id
		setSelectedCardId(newSelectedCardId)
		onCardSelect(newSelectedCardId)
	}

	return (
		<div className='flex flex-row justify-center select-none'>
			{boardCards.map((card, i) => (
				<div className='w-1/4 py-5 flex flex-row justify-center' key={i}>
					<CardCustom className={`w-5/6 h-full py-5 cursor-pointer ${selectedCardId === card.id ? 'outline outline-4 outline-blue-500' : 'hover:outline hover:outline-4 hover:outline-blue-500'}`}>
						<div onClick={() => handleCard(card.id)} className='w-full flex flex-col items-center font-bold'>
							<div className='text-2xl text-blue-600'>{card.icon}</div>
							<div className='text-xl mt-3 font-sans'>{card.name}</div>
						</div>
					</CardCustom>
				</div>
			))}
		</div>
	)
}

export default CardBoard
