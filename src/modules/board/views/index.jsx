import { Button } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import { FaList, FaMapMarkedAlt, FaTable } from 'react-icons/fa'
import DataBoard from '../components/dataBoard'
import { MainContext } from '../../../context/MainContext'

const Board = () => {
	const { tabCurrent, tabs } = useContext(MainContext)
	const [idReco, setIdReco] = useState(tabs[tabCurrent].id)
	const buttons = [{ icon: <FaList /> }, { icon: <FaTable /> }, { icon: <FaMapMarkedAlt /> }]
	return (
		<div className='w-full flex flex-row justify-center text-black dark:text-white relative pr-3'>
			<div className='w-full h-min flex-row flex flex-wrap justify-between rounded-md bg-slate-50 dark:bg-gray-800 p-4 pb-8'>
				<div className='w-10/12'>
					<h1 className='text-left text-2xl'>Nombre del reconectador {idReco}</h1>
				</div>
				<div className='w-2/12 justify-evenly flex'>
					{buttons.map((button, i) => (
						<Button size='medium' variant='contained' key={i} href={`/board/${idReco}`}>
							{button.icon}
						</Button>
					))}
				</div>
				<div className='w-full'>
					<hr className='my-4'></hr>
				</div>
				<div className='w-full flex flex-row justify-center'>
					<DataBoard id={idReco} />
				</div>
			</div>
		</div>
	)
}

export default Board
