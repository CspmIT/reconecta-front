import React from 'react'
import CardCustom from '../../../../../components/CardCustom'
import GrafBarra from '../../../../../components/Graphs/barchart'
import { monthsHistory } from '../../utils/objects'

const HistoryBoard = () => {
	const data = monthsHistory
	return (
		<div className='w-full'>
			<CardCustom className='border-t-8 border-r-2 border-b-2 border-blue-500'>
				<GrafBarra title='Diferencia de consumos mensual' seriesData={data} color={'#FF0000'} />
			</CardCustom>
		</div>
	)
}

export default HistoryBoard
