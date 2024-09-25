import { Accordion, AccordionDetails, AccordionSummary, Button, IconButton, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { FaCheck } from 'react-icons/fa'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Swal from 'sweetalert2'
// import { controls } from '../../utils/controlsRecloser'
import { Edit, Lock, LockOpen } from '@mui/icons-material'

import DndComponent from './DndComponent'
import { request } from '../../../../../utils/js/request'
import { backend } from '../../../../../utils/routes/app.routes'
import ControlSwitch from './components/ControlSwitch'
import ControlCircle from './components/ControlCircle'
import { storage } from '../../../../../storage/storage'
import { enableControl } from './utils/js/controls'

const ControlsBoard = ({ info }) => {
	const [enabled, setEnabled] = useState(false)
	const [controlBasic, setControlBasic] = useState([])
	const [controlAdvance, setControlAdvance] = useState([])
	const [controlBasicOrigin, setControlBasicOrigin] = useState([])
	const [controlAdvanceOrigin, setControlAdvanceOrigin] = useState([])
	const [countdown, setCountdown] = useState(0)
	const [edit, setEdit] = useState(false)
	const user = storage.get('usuario').sub

	const getControls = async (version) => {
		const listControls = await request(`${backend.Reconecta}/getControlsRecloserUser`, 'POST', { user, version })
		const basico = listControls.data
			.filter((item) => item.level == 1)
			.map((item) => {
				const checked = info?.instantaneo[item.field] ? info?.instantaneo[item.field][0].value : 'sin Datos'
				item.status = checked
				return item
			})
		const avanzado = listControls.data
			.filter((item) => item.level == 2)
			.map((item) => {
				const checked = info?.instantaneo[item.field] ? info?.instantaneo[item.field][0].value : 'sin Datos'
				item.status = checked
				return item
			})
		setControlBasic(basico)
		setControlAdvance(avanzado)
		setControlBasicOrigin(basico)
		setControlAdvanceOrigin(avanzado)
	}
	useEffect(() => {
		if (info) {
			getControls(info.recloser.version)
		}
	}, [info])

	const contador = () => {
		setCountdown(10)
	}
	useEffect(() => {
		if (countdown > 0) {
			const timer = setInterval(() => {
				setCountdown((prevCount) => prevCount - 1)
			}, 1000)

			// Limpieza del intervalo cuando el componente se desmonta o el contador llega a 0
			return () => clearInterval(timer)
		} else {
			setEnabled(false)
		}
	}, [countdown])

	const editControls = () => {
		if (!edit) {
			setEdit(true)
		} else {
			Swal.fire({
				title: '¡Atención!',
				text: '¿Deseas guardar este orden de controles?',
				icon: 'question',
				allowOutsideClick: false,
				showDenyButton: true,
				showCancelButton: true,
				confirmButtonText: 'Sí',
			}).then(async (result) => {
				if (result.isConfirmed) {
					try {
						const basico = controlBasic.map((item, index) => {
							if (typeof item.id === 'string') {
								const id_control = parseInt(item.id.split('item-')[1]) || 0
								return { id_control, level: 1, id_user: user, ubication: index + 1 }
							}
							return null
						})
						const avanzado = controlAdvance.map((item, index) => {
							if (typeof item.id === 'string') {
								const id_control = parseInt(item.id.split('item-')[1]) || 0
								return { id_control, level: 2, id_user: user, ubication: index + 1 }
							}
							return null
						})
						const listControls = [...basico, ...avanzado].filter(Boolean)

						if (!listControls.length) {
							setEdit(false)
							throw new Error('No se guardaron correctamente los controles')
						}
						setControlBasicOrigin(basico)
						setControlAdvanceOrigin(avanzado)
						await request(backend.Reconecta + '/saveControlsRecloser', 'POST', { controls: listControls })
						setEdit(false)
					} catch (error) {
						Swal.fire({ title: '¡Atención!', text: error.message || error, icon: 'warning' })
					}
				}
				if (result.isDismissed) {
					setControlBasic(controlBasicOrigin)
					setControlAdvance(controlAdvanceOrigin)
					setEdit(false)
				}
			})
		}
	}

	const setContainer = (data) => {
		const Basic = data.find((item) => item.title == 'Basicos')
		const Advance = data.find((item) => item.title == 'Avanzados')
		setControlBasic(Basic.items)
		setControlAdvance(Advance.items)
	}
	return (
		<>
			<div className='w-full my-3 text-center relative'>
				<b className='text-xl mr-3'>Controles</b>
				<Button
					size='large'
					variant='contained'
					type='button'
					onClick={() => enableControl(contador, enabled, setEnabled)}
				>
					{enabled ? <LockOpen className='!text-xl' /> : <Lock className='!text-xl' />}
				</Button>
				<IconButton
					className={`!absolute right-0 sm:right-5 ${
						!edit ? '!bg-yellow-300 hover:!bg-yellow-400' : ' !bg-green-300 hover:!bg-green-400 '
					}  shadow-slate-400 shadow-md`}
					type='button'
					onClick={editControls}
				>
					{!edit ? <Edit className='!text-xl' /> : <FaCheck className='!text-xl' />}
				</IconButton>
			</div>
			{edit ? (
				<DndComponent controls={{ Basic: controlBasic, Advance: controlAdvance }} setContainer={setContainer} />
			) : (
				<>
					<div className='flex flex-wrap gap-3'>
						{controlBasic.map((boardcontrol, index) => {
							return (
								<div
									key={index}
									className={`w-full sm:w-[48%] lg:w-[24%] flex p-3 ${
										(!boardcontrol.enabled || boardcontrol.status == 'sin Datos') && '!opacity-25'
									} rounded-md items-center justify-between bg-gray-300 `}
								>
									{boardcontrol.type_input === 'switch' ? (
										<ControlSwitch contador={contador} control={boardcontrol} enabled={enabled} />
									) : (
										<ControlCircle contador={contador} control={boardcontrol} enabled={enabled} />
									)}
								</div>
							)
						})}
					</div>
					<div className='w-full flex mt-4'>
						<Accordion className='!w-full !shadow-none border-2 border-solid border-white'>
							<AccordionSummary
								expandIcon={<ExpandMoreIcon />}
								className='!w-full'
								aria-controls={`panel-content`}
							>
								<Typography className='flex items-center justify-center w-full'>Avanzado</Typography>
							</AccordionSummary>
							<AccordionDetails className={`flex flex-wrap gap-3`}>
								{controlAdvance.map((boardcontrol, index) => {
									return (
										<div
											key={index}
											className={`w-full sm:w-[48%] lg:w-[24%] flex p-3 ${
												(!boardcontrol.enabled || boardcontrol.status == 'sin Datos') &&
												'!opacity-25'
											} rounded-md items-center justify-between bg-gray-300 `}
										>
											{boardcontrol.type_input === 'switch' ? (
												<ControlSwitch
													contador={contador}
													control={boardcontrol}
													enabled={enabled}
												/>
											) : (
												<ControlCircle
													contador={contador}
													control={boardcontrol}
													enabled={enabled}
												/>
											)}
										</div>
									)
								})}
							</AccordionDetails>
						</Accordion>
					</div>
				</>
			)}
		</>
	)
}

export default ControlsBoard
