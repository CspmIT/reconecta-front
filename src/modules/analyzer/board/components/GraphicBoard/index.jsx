import React, { useState } from 'react'
import { FaChartArea, FaTable } from 'react-icons/fa'
import { Tab, Tabs } from '@mui/material'
import TableBoard from './table'
import Graphs from './graphs'

const GraphicBoard = () => {
	const [tab, setTab] = useState(0)
	return (
		<div className='w-full flex flex-row flex-wrap justify-center'>
			<div className='w-full flex flex-row justify-center mb-5'>
				<Tabs value={tab} onChange={(e, newValue) => setTab(newValue)} aria-label='simple tabs example' className='w-2/3'>
					<Tab className='w-1/4' label='Curva 1' icon={<FaTable />} />
					<Tab className='text-wrap w-1/4' label='Tensiones y corrientes' icon={<FaTable />} />
					<Tab className='w-1/4' label='Coseno Fi' icon={<FaTable />} />
					<Tab className='w-1/4' label='Gráficos' icon={<FaChartArea />} />
				</Tabs>
			</div>
			<div className='w-full'>{tab === 3 ? <Graphs /> : <TableBoard tab={tab} />}</div>
		</div>
	)
}

export default GraphicBoard
