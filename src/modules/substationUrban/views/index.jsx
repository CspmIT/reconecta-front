import React from 'react'
import HeaderBoard from '../components/HeaderBoard'
import DetailBoard from '../components/DetailBoard'
import InstantValuesBoard from '../components/InstantValuesBoard'
import ChargeBoard from '../components/ChargeBoard'
import ComunicationBoard from '../components/ComunicationBoard'

const SubstationUrbanBoard = () => {
	return (
		<div className='w-full flex flex-row justify-center text-black dark:text-white relative pr-3'>
			<div className='w-full h-min flex-row flex flex-wrap justify-between rounded-md bg-slate-50 dark:bg-gray-800 p-4 pb-8'>
				<div className='w-full items-center rounded-xl p-3 bg-gray-200 dark:bg-gray-600'>
					<div className='flex flex-row relative justify-between mb-8'>
						<div className='flex-grow flex justify-center'>
							<h2 className='text-2xl'>Subestación Urbana</h2>
						</div>
					</div>
					<HeaderBoard />
					<div className='w-full flex flex-wrap justify-center'>
						<DetailBoard />
						<InstantValuesBoard />
					</div>
					<div className='w-full flex flex-wrap justify-center'>
						<ChargeBoard />
						<ComunicationBoard />
					</div>
				</div>
			</div>
		</div>
	)
}

export default SubstationUrbanBoard
