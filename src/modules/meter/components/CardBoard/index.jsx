import { useState } from 'react'
import { FaChartArea, FaHistory, FaRuler, FaSearchengin } from 'react-icons/fa'
import CardCustom from '../../../../components/CardCustom'

const CardBoard = ({ onCardSelect }) => {
	const [selectedCardId, setSelectedCardId] = useState(null)
	const boardCards = [
		{ id: 1, title: 'METROLOGÍA INSTANTÁNEA', subtitle: '', icon: <FaRuler /> },
		{ id: 2, title: 'CURVA DE CARGA', subtitle: '(LP)', icon: <FaChartArea /> },
		{ id: 3, title: 'CALIDAD DE TENSION', subtitle: '(VQD)', icon: <FaSearchengin /> },
		{ id: 4, title: 'HISTORICOS', subtitle: '(EOB)', icon: <FaHistory /> },
	]
	const handleCard = (id) => {
		const newSelectedCardId = id === selectedCardId ? null : id
		setSelectedCardId(newSelectedCardId)
		onCardSelect(newSelectedCardId)
	}

	return (
		<div className='flex flex-row justify-between select-none'>
			{boardCards.map((card, i) => (
				<div className='w-1/4 py-5 flex flex-row justify-center' key={i}>
					<CardCustom
						className={`w-5/6 h-full py-5 cursor-pointer ${
							selectedCardId === card.id
								? 'outline outline-4 outline-blue-500'
								: 'hover:outline hover:outline-4 hover:outline-blue-500'
						}`}
					>
						<div
							onClick={() => handleCard(card.id)}
							className='w-full flex flex-col items-center font-bold'
						>
							<div className='text-3xl text-blue-600'>{card.icon}</div>
							<div className='text-lg text-center mt-3 font-sans'>{card.title}</div>
							<div className='text-lg text-center font-sans'>{card.subtitle}</div>
						</div>
					</CardCustom>
				</div>
			))}
		</div>
	)
}

export default CardBoard
