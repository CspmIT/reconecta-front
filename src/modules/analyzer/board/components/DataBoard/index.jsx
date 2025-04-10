import React, { useContext, useEffect, useState } from 'react'
import { Button } from '@mui/material'
import { FaEdit, FaRedo } from 'react-icons/fa'
import { MainContext } from '../../../../../context/MainContext'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'
import CardBoard from '../cardBoard'
import HistoryBoard from '../historyBoard'
import GraphicBoard from '../GraphicBoard'
import MetrologyBoard from '../metrologyBoard'

const DataBoard = ({ analyzer }) => {
	console.log(analyzer)
	const [selectedCardId, setSelectedCardId] = useState(null)
	// const [info, setInfo] = useState([])
	const navigate = useNavigate()
	const handleCardSelect = (id) => {
		setSelectedCardId(id)
	}
	const { tabCurrent, tabs } = useContext(MainContext)

	const [data] = useState(tabs[tabCurrent] || null)
	useEffect(() => {
		if (!data) {
			Swal.fire({
				title: 'Atención!',
				html: `Hubo un problema con la carga de los datos del analizador.</br>Intente nuevamente...`,
				icon: 'error',
			})
			navigate('/Home')
		} else {
			// setInfo(recloser.filter((item) => item.id == data.id)[0])
		}
	}, [data])

	return (
		<div className='w-full  items-center rounded-xl p-3 bg-gray-200 dark:bg-gray-600'>
			<div className='flex flex-row relative justify-between mb-8'>
				<div className='flex-grow flex justify-center'>
					<h2 className='text-2xl'>Analizador de red</h2>
				</div>
				<div className='absolute right-2 top-8 md:top-0'>
					<Button variant='contained' title='Recargar Datos'>
						<FaRedo />
					</Button>
					<Button onClick={() => navigate('/Equipment/' + analyzer.id)} className='!ml-3' color='warning' title='Editar Analizador' variant='contained'>
						<FaEdit />
					</Button>
				</div>
			</div>
			<div className='flex flex-wrap justify-center w-full pt-5'>
				<div className='w-full sm:w-1/6 text-center'>
					<b>Marca:</b> <br />
					<b className='text-lg'>{analyzer?.equipmentmodels?.name}</b>
				</div>
				<div className='w-full sm:w-1/6 text-center'>
					<b>Versión: </b> <br />
					<b className='text-lg'>{analyzer?.equipmentmodels?.brand}</b>
				</div>
				<div className='w-full sm:w-1/6 text-center'>
					<b>Nro de serie: </b> <br />
					<b className='text-lg'>{analyzer?.serial}</b>
				</div>
			</div>
			<div>
				<hr className='my-8' />
			</div>
			<div className='w-full text-center'>
				<b>Último registro de datos: </b>
			</div>
			<div className=''>
				<CardBoard onCardSelect={handleCardSelect} />
			</div>
			<div className='w-full'>
				<hr className='my-4 border-slate-400 dark:border-slate-200' />
			</div>
			<div className='w-full'>
				{selectedCardId === 1 && <MetrologyBoard analyzer={analyzer} />}
				{selectedCardId === 2 && <GraphicBoard analyzer={analyzer} />}
				{selectedCardId === 3 && <HistoryBoard analyzer={analyzer} />}
			</div>
		</div>
	)
}

export default DataBoard
