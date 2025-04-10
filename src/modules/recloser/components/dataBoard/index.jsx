import React, { useContext, useEffect, useState } from 'react'
import HeaderBoard from '../headerBoard'
import { Button } from '@mui/material'
import { FaCog, FaCogs, FaEdit, FaRedo, FaTrash } from 'react-icons/fa'
import ControlsBoard from '../controlsBoard'
import CardBoard from '../cardBoard'
import { MainContext } from '../../../../context/MainContext'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'
import { request } from '../../../../utils/js/request'
import { backend } from '../../../../utils/routes/app.routes'
import LoaderComponent from '../../../../components/Loader'

const DataBoard = ({ recloser }) => {
	const [info, setInfo] = useState(null)
	const navigate = useNavigate()
	const { setInfoNav, tabCurrent, setTabCurrent, setTabActive, tabs, setTabs } = useContext(MainContext)
	const [data] = useState(tabs[tabCurrent] || null)
	const [selectedCardId, setSelectedCardId] = useState(null)

	const handleCardSelect = (id) => {
		tabs[tabCurrent].ActionOpen = id
		setTabs(tabs)
		setSelectedCardId(id)
	}
	const getDataRecloser = async (id) => {
		const { data } = await request(`${backend[`${import.meta.env.VITE_APP_NAME}`]}/getDataRecloser?id=${id}`, 'GET')
		setInfo(data)
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

	const editRecloser = (info) => {
		setInfoNav([info])
		navigate('/Equipment/' + info.recloser.id)
	}
	const refreshInflux = async () => {
		getDataRecloser(data.id)
	}
	const deleteRecloser = async (data) => {
		Swal.fire({
			title: '¡Atención!',
			text: '¿Que desea realizar?',
			icon: 'question',
			allowOutsideClick: false,
			showDenyButton: true,
			showCancelButton: true,
			confirmButtonText: '⛓️‍💥 Desvincular',
			denyButtonText: '🗑️ Eliminar',
		}).then(async (result) => {
			if (result.isDenied) {
				const infoUpdate = {
					...data.recloser,
					type_device: data.recloser?.relation?.type_device || 1,
					status: 0,
				}

				try {
					const result = await request(
						`${backend[`${import.meta.env.VITE_APP_NAME}`]}/deleteRecloser`,
						'POST',
						infoUpdate
					)
					Swal.fire({ title: 'Perfecto!', text: 'Se guardo correctamente!', icon: 'success' })
					const tabsfiltered = tabs.filter((item) => item.id != data.recloser.id)
					setTabs(tabsfiltered)
					setTabActive(tabsfiltered.length)
					setInfoNav(!tabsfiltered.length ? '' : tabsfiltered)
					setTabCurrent(0)
					navigate('/Home')
				} catch (error) {
					console.error(error)
					Swal.fire({
						title: 'Atención!',
						text: 'Hubo un error al intentear eliminar el reconectador',
						icon: 'warning',
					})
				}
			}
			if (result.isConfirmed) {
				try {
					const infoUpdate = {
						...data.recloser,
						type_device: data?.recloser?.relation?.type_device || 1,
					}
					const result = await request(
						`${backend[`${import.meta.env.VITE_APP_NAME}`]}/unlinkRelation`,
						'POST',
						infoUpdate
					)
					Swal.fire({ title: 'Perfecto!', text: 'Se guardo correctamente!', icon: 'success' })
					const tabsfiltered = tabs.filter((item) => item.id != data.recloser.id)
					setTabs(tabsfiltered)
					setTabActive(tabsfiltered.length)
					setInfoNav(!tabsfiltered.length ? '' : tabsfiltered)
					setTabCurrent(0)
					navigate('/Home')
				} catch (error) {
					console.error(error)
					Swal.fire({
						title: 'Atención!',
						text: 'Hubo un error al intentear desvincular el reconectador',
						icon: 'warning',
					})
				}
			}
		})
	}

	return (
		<div className='w-full h-auto items-center rounded-xl p-3 bg-gray-200 dark:bg-gray-600'>
			{info ? (
				<>
					<div className='flex flex-row relative justify-between mb-8'>
						<div className='flex-grow flex justify-center'>
							<h2 className='text-2xl'>Reconectador</h2>
						</div>
						<div className='absolute right-2 top-8 md:top-0'>
							<Button
								variant='contained'
								title='Recargar Datos'
								type='button'
								onClick={async () => await refreshInflux()}
							>
								<FaRedo />
							</Button>
							<Button
								type='button'
								onClick={() => editRecloser(info)}
								className='!ml-3'
								color='warning'
								title='Editar Reconectador'
								variant='contained'
							>
								<FaEdit />
							</Button>
							{/* <Button
								type='button'
								onClick={() => deleteRecloser(info)}
								className='!ml-3'
								color='secondary'
								title='Opciones de Reconectador'
								variant='contained'
							>
								<FaCog />
							</Button> */}
						</div>
					</div>
					<div className='mb-8'>
						<HeaderBoard info={info} />
					</div>
					<div className='mb-4'>
						<ControlsBoard info={info} />
					</div>
					<CardBoard onCardSelect={handleCardSelect} selectedCardId={selectedCardId} info={info} />
				</>
			) : (
				<>
					<LoaderComponent />
				</>
			)}
		</div>
	)
}

export default DataBoard
