import React, { useState } from 'react'
import { FaChartArea, FaTable } from 'react-icons/fa'
import { MenuItem, Select, Tab, Tabs, useMediaQuery } from '@mui/material'
import TableBoard from './table'
import Graphs from './graphs'

const GraphicBoard = () => {
	const [tab, setTab] = useState(0)
	const isSmallScreen = useMediaQuery('(max-width: 750px)')

	return (
		<div className='w-full flex flex-row flex-wrap justify-center'>
			<div className='w-full flex flex-row justify-center mb-5'>
				{isSmallScreen ? (
					<Select
						value={tab}
						onChange={(e) => setTab(e.target.value)}
						className="w-full mb-4 bg-white dark:bg-zinc-700 dark:text-white rounded-lg"
					>
						<MenuItem value={0}> Curva 1</MenuItem>
						<MenuItem value={1}> Tensiones y corrientes</MenuItem>
						<MenuItem value={2}> Coseno Fi</MenuItem>
						<MenuItem value={3}> Gráficos</MenuItem>
					</Select>
				) : (
					<Tabs value={tab} onChange={(e, newValue) => setTab(newValue)} aria-label='simple tabs example' className='w-full'>
						<Tab className='w-1/4' label='Curva 1' icon={<FaTable />} />
						<Tab className='text-wrap w-1/4' label='Tensiones y corrientes' icon={<FaTable />} />
						<Tab className='w-1/4' label='Coseno Fi' icon={<FaTable />} />
						<Tab className='w-1/4' label='Gráficos' icon={<FaChartArea />} />
					</Tabs>
				)}
			</div>
			<div className='w-full'>{tab === 3 ? <Graphs /> : <TableBoard tab={tab} />}</div>
		</div>
	)
}

export default GraphicBoard
