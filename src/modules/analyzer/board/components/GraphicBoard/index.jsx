import React, { useState } from 'react'
import { FaChartArea, FaTable } from 'react-icons/fa'
import { MenuItem, Select, Tab, Tabs, useMediaQuery } from '@mui/material'
import TableBoard from './table'
import Graphs from './graphs'

const GraphicBoard = ({ analyzer }) => {
	const [tab, setTab] = useState(0)
	const isSmallScreen = useMediaQuery('(max-width: 750px)')
	const tabs = ['Curva 1', 'Tensiones y corrientes', 'Coseno Fi', 'Energía', 'Gráficos']
	const classTabs =
		'!border-solid !border-gray-200 !rounded-t-xl !text-base !text-black !font-bold dark:!text-zinc-200 dark:!border-gray-700'
	const classTabStatus = [
		['!bg-white !border-r-2 !border-t-2 !border-l-2 dark:!bg-zinc-500 '],
		['!border-b-2 !bg-gray-300 dark:!bg-zinc-700 hover:dark:!bg-zinc-500 hover:!bg-zinc-400 '],
	]

	return (
		<div className='w-full flex flex-row flex-wrap justify-center'>
			<div className='w-full flex flex-row justify-center mb-5'>
				{isSmallScreen ? (
					<Select
						value={tab}
						onChange={(e) => setTab(e.target.value)}
						className="w-full mb-4 bg-white dark:bg-zinc-700 dark:text-white rounded-lg"
					>
						{tabs.map((item, index) => (
							<MenuItem key={index} value={index}>
								{item}
							</MenuItem>
						))}
					</Select>
				) : (
					<Tabs
						indicatorColor='transparent'
						value={tab}
						onChange={(e, newValue) => setTab(newValue)}
						aria-label='basic tabs example'
					>
						{tabs.map((item, index) => {
							return (
								<Tab
									key={index}
									className={`flex-grow !mr-1 relative ${classTabStatus[tab === index ? 0 : 1]
										} ${classTabs}`}
									label={<p className='text-black dark:text-white w-full text-center px-8'>{item}</p>}
								/>
							)
						})}
					</Tabs>
				)}
			</div>
			<div className='w-full'>{tab === 4 ? <Graphs /> : <TableBoard tab={tab} analyzer={analyzer} />}</div>
		</div>
	)
}

export default GraphicBoard
