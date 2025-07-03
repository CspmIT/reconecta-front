import React, { useEffect, useState } from 'react'
import CardCustom from '../../../../../components/CardCustom'
import GrafBarra from '../../../../../components/Graphs/barchart'
import { request } from '../../../../../utils/js/request'
import { backend } from '../../../../../utils/routes/app.routes'

const HistoryBoard = ({ analyzer }) => {
	const [dataMonths, setDataMonths] = useState([])
	const getData = async () => {
		try {
			const body = {
				brand: analyzer?.equipmentmodels?.name.toLowerCase(),
				version: analyzer?.equipmentmodels?.brand.toLowerCase(),
				serial: analyzer?.serial,
			}
			const { data } = await request(`${backend[`${import.meta.env.VITE_APP_NAME}`]}/AnalyzerMonths`, 'POST', body)
			setDataMonths(Object.values(data))
		} catch (error) {
			console.error('Error fetching monthly data:', error)
		}
	}
	useEffect(() => {
		getData()
	}, [])
	return (
		<div className='w-full'>
			<CardCustom className='border-t-8 border-r-2 border-b-2 border-blue-500'>
				{dataMonths.length > 0 && (
					<GrafBarra title='Diferencia de consumos mensual' seriesData={dataMonths} color={'#FF0000'} />
				)}
			</CardCustom>
		</div>
	)
}

export default HistoryBoard
