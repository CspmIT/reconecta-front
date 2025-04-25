import React, { useContext, useEffect, useState } from 'react'
import DataBoard from '../components/DataBoard'
import { MainContext } from '../../../../context/MainContext'
import { request } from '../../../../utils/js/request'
import { backend } from '../../../../utils/routes/app.routes'

const AnalyzerBoard = () => {
	const { tabCurrent, tabs } = useContext(MainContext)
	const [analyzer, setAnalyzer] = useState([])
	const getAnalyzer = async (id) => {
		const { data } = await request(`${backend[`${import.meta.env.VITE_APP_NAME}`]}/Equipment/${id}`, 'GET')
		setAnalyzer(data[0])
	}
	useEffect(() => {
		getAnalyzer(tabs[tabCurrent].id);
	}, [])
	return (
		<div className='w-full flex flex-row justify-center text-black dark:text-white relative pr-3'>
			<div className='w-full h-min flex-row flex flex-wrap justify-between rounded-md bg-slate-50 dark:bg-gray-800 p-4 pb-8'>
				<DataBoard analyzer={analyzer} />
			</div>
		</div>
	)
}

export default AnalyzerBoard
