import { useContext, useEffect, useState } from 'react'
import DataBoard from '../components/dataBoard'
import { MainContext } from '../../../context/MainContext'
import { request } from '../../../utils/js/request'
import { backend } from '../../../utils/routes/app.routes'

const Board = () => {
	const { tabCurrent, tabs } = useContext(MainContext)
	const [recloser, setRecloser] = useState([])
	const getRecloser = async (id) => {
		const { data } = await request(`${backend[`${import.meta.env.VITE_APP_NAME}`]}/Equipment/${id}`, 'GET')
		setRecloser(data[0])
	}
	useEffect(() => {
		getRecloser(tabs[tabCurrent].id);
	}, [])
	return (
		<div className='w-full flex flex-row justify-center text-black dark:text-white relative'>
			<div className='w-full h-min flex-row flex flex-wrap justify-between rounded-md md:p-4 p-0 pb-8'>
				<div className='w-full min-h-[60vh] flex flex-row justify-center'>
					<DataBoard recloser={recloser} />
				</div>
			</div>
		</div>
	)
}

export default Board
