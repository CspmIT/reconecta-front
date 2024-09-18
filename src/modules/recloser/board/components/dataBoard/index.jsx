import React, { useContext, useEffect, useState } from 'react'
import HeaderBoard from '../headerBoard'
import { Button } from '@mui/material'
import { FaEdit, FaRedo } from 'react-icons/fa'
import ControlsBoard from '../controlsBoard'
import CardBoard from '../cardBoard'
import { MainContext } from '../../../../../context/MainContext'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'
import { request } from '../../../../../utils/js/request'
import { backend } from '../../../../../utils/routes/app.routes'

const DataBoard = () => {
	const [info, setInfo] = useState(null)
	const navigate = useNavigate()
	const { tabCurrent, tabs, setTabs } = useContext(MainContext)
	const [data] = useState(tabs[tabCurrent] || null)
	const [selectedCardId, setSelectedCardId] = useState(null)

	const handleCardSelect = (id) => {
		tabs[tabCurrent].ActionOpen = id
		setTabs(tabs)
		setSelectedCardId(id)
	}
	const getDataRecloser = async (id) => {
		const recloser = await request(`${backend[`${import.meta.env.VITE_APP_NAME}`]}/getDataRecloser?id=${id}`, 'GET')
		setInfo(recloser.data)
		setSelectedCardId(1)
	}

	useEffect(() => {
		if (!data) {
			Swal.fire({
				title: 'Atención!',
				html: `Hubo un problema con la carga de los datos del reconectador.</br>Intente nuevamente...`,
				icon: 'error',
			})
			navigate('/Home')
		} else {
			getDataRecloser(data.id)
		}
	}, [data])
	useEffect(() => {
		if (info) {
			setSelectedCardId(data.ActionOpen)
		}
	}, [info])
	const { setInfoNav } = useContext(MainContext)
	const editRecloser = (info) => {
		setInfoNav([info])
		navigate('/AbmDevice/recloser/' + info.recloser.id)
	}
	return (
		<div className='w-full  items-center rounded-xl p-3 bg-gray-200 dark:bg-gray-600'>
			<div className='flex flex-row relative justify-between mb-8'>
				<div className='flex-grow flex justify-center'>
					<h2 className='text-2xl'>Reconectador</h2>
				</div>
				<div className='absolute right-2 top-8 md:top-0'>
					<Button variant='contained' title='Recargar Datos'>
						<FaRedo />
					</Button>
					<Button onClick={() => editRecloser(info)} className='!ml-3' color='warning' title='Editar Reconectador' variant='contained'>
						<FaEdit />
					</Button>
				</div>
			</div>
			<div className='mb-8'>
				<HeaderBoard info={info} />
			</div>
			<div className='mb-4'>
				<ControlsBoard info={info} />
			</div>
			<CardBoard onCardSelect={handleCardSelect} selectedCardId={selectedCardId} info={info} />
		</div>
	)
}

export default DataBoard
