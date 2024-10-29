import { Tab, Tabs, useMediaQuery } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { FaChartArea, FaPowerOff, FaTachometerAlt } from 'react-icons/fa'
import { BsFiles } from 'react-icons/bs'
import MetrologyBoard from '../metrologyBoard'
import EventBoard from '../eventBoard'
import AnalyticsBoard from '../analyticsBoard'
import ManeuverBoard from '../maneuverBoard'

function CardBoard({ onCardSelect, info }) {
	const [selectedCardId, setSelectedCardId] = useState(1)
	const isMobile = useMediaQuery('(max-width: 600px)')
	const boardCards = [
		{ id: 1, name: 'METROLOGÍA', icon: <FaTachometerAlt /> },
		{ id: 2, name: 'EVENTOS', icon: <BsFiles /> },
		{ id: 3, name: 'ANALÍTICAS', icon: <FaChartArea /> },
		{ id: 4, name: 'MANIOBRAS', icon: <FaPowerOff /> },
	]

	const handleCard = (id) => {
		if (id !== selectedCardId) {
			setSelectedCardId(id)
			onCardSelect(id)
		}
	}

	const classTabs =
		'!border-solid !border-gray-200 !rounded-l-xl !text-base !text-black !font-bold dark:!text-zinc-200 dark:!border-gray-700'
	return (
		<div className='w-full max-w-[94.5vw] flex flex-row rounded-xl overflow-hidden'>
			<Tabs
				className='flex flex-col !w-10 border-r '
				value={selectedCardId - 1}
				orientation='vertical'
				indicatorColor='transparent'
				aria-label='vertical tabs example'
			>
				{boardCards.map((item) => (
					<Tab
						key={item.id}
						style={{ minWidth: 0, height: '144px' }}
						className={`w-full ${
							selectedCardId == item.id ? '!bg-white' : '!bg-gray-300'
						}   !border-t-2 !border-l-2 !border-b-2 dark:!bg-zinc-500 min-w-0 ${classTabs} relative`}
						onClick={() => handleCard(item.id)}
						label={
							<div
								className='flex items-center justify-center w-14 h-fit'
								style={{
									transform: 'rotate(-90deg)',
									whiteSpace: 'nowrap',
									textAlign: 'center',
								}}
							>
								<span>{item.name}</span>
							</div>
						}
					/>
				))}
			</Tabs>
			<div style={{maxWidth: isMobile ? '84%' : ''}} className='w-11/12 md:w-full bg-white dark:bg-zinc-500 mt-0.5 flex justify-center items-center border-2 border-t-0 border-l-0 md:p-4 p-3 rounded-r-2xl border-zinc-200 dark:border-gray-700'>
				{selectedCardId === 1 && <MetrologyBoard idRecloser={info?.recloser?.id || null} />}
				{selectedCardId === 2 && <EventBoard idRecloser={info?.recloser?.id || null} />}
				{selectedCardId === 3 && <AnalyticsBoard idRecloser={info?.recloser?.id || null} />}
				{selectedCardId === 4 && <ManeuverBoard info={info || {}} />}
			</div>
		</div>
	)
}

export default CardBoard
