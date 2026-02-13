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
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone.js'
dayjs.extend(utc);
dayjs.extend(timezone);

const DataBoard = ({ analyzer }) => {
	const [selectedCardId, setSelectedCardId] = useState(null)
	const [timeData, setTimeData] = useState(null)
	// const [info, setInfo] = useState([])
	const navigate = useNavigate()
	const handleCardSelect = (id) => {
		setSelectedCardId(id)
	}
	const { tabCurrent, tabs } = useContext(MainContext)

	const [data] = useState(tabs[tabCurrent] || null)

	const handleLastRegister = (time) => {
		const t = dayjs.utc(time).tz('America/Argentina/Buenos_Aires');
		const fecha = t.format('DD/MM/YYYY HH:mm');
		setTimeData(fecha)
	}
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

	useEffect(() => {
		if (analyzer.id) {
			handleCardSelect(1)
		}
	}, [analyzer])

	return (
		<div className='w-full  items-center rounded-xl p-3 bg-gray-200 dark:bg-gray-600'>
			<div className='flex flex-row relative justify-between mb-8'>
				<div className='flex-grow flex justify-center'>
					<h2 className='text-2xl'>{data.name}</h2>
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
				<b>Último registro de datos: </b><br />
				<b className='text-lg'>{timeData}</b>
			</div>
			<div className=''>
				<CardBoard onCardSelect={handleCardSelect} />
			</div>
			<div className='w-full'>
				<hr className='my-4 border-slate-400 dark:border-slate-200' />
			</div>
			<div className='w-full'>
				{selectedCardId === 1 && <MetrologyBoard analyzer={analyzer} lastRegister={handleLastRegister} />}
				{selectedCardId === 2 && <GraphicBoard analyzer={analyzer} />}
				{selectedCardId === 3 && <HistoryBoard analyzer={analyzer} />}
			</div>
		</div>
	)
}

export default DataBoard
