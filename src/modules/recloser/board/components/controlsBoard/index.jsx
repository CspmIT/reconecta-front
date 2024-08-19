import { Accordion, AccordionDetails, AccordionSummary, Button, IconButton, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { FaCheck, FaLock, FaLockOpen } from 'react-icons/fa'
import { boardControls } from '../../utils/objects'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Swal from 'sweetalert2'
import { controls } from '../../utils/controlsRecloser'
import { ContentCopy, Edit, Key, Lock, LockOpen } from '@mui/icons-material'

import EditControls from './EditControls'

const ControlsBoard = ({ info }) => {
	const [enabled, setEnabled] = useState(false)
	const [controlBasic, setControlBasic] = useState([])
	const [controlAdvance, setControlAdvance] = useState([])
	const [countdown, setCountdown] = useState(0)
	const [edit, setEdit] = useState(false)
	const toggleCheck = (id) => {
		contador()
		Swal.fire({
			title: 'Atención!',
			text: `Estas por ejecutar ${id}. ¿Deseas Ejecutarlo?`,
			icon: 'question',
			allowOutsideClick: false,
			showDenyButton: true,
			confirmButtonText: 'Si',
		}).then((result) => {
			if (result.isConfirmed) {
				setControlBasic((prevState) => ({
					...prevState,
					[id]: !prevState[id],
				}))
			}
		})
	}

	const setCircleValue = (id, value) => {
		if (enabled) {
			contador()
			setControlBasic((prevState) => ({
				...prevState,
				[id]: value,
			}))
		}
	}
	useEffect(() => {
		if (Object.keys(info).length) {
			setControlBasic(controls[info.brand][info.version].basic)
			setControlAdvance(controls[info.brand][info.version].advance)
		}
	}, [info])

	const enableControl = () => {
		if (!enabled) {
			Swal.fire({
				title: 'ingrese su contraseña',
				input: 'text',
				inputAttributes: {
					autocapitalize: 'off',
					onkeydown: 'this.type="password"',
					placeholder: 'ingrese su contraseña',
				},
				showCancelButton: true,
				confirmButtonText: 'Autentificar',
				showLoaderOnConfirm: true,
				preConfirm: (login) => {
					if (login === '1234') {
						Swal.fire('Perfecto!', 'Se habilito correctamente los controles', 'success')
						contador()
						setEnabled(!enabled)
					} else {
						Swal.fire('Error', 'Contraseña incorrecta', 'error')
					}
				},
			})
		} else {
			setEnabled(!enabled)
		}
	}

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
			setEdit((edit) => !edit)
		} else {
			console.log('hola')
			console.log(controls)
			setEdit((edit) => !edit)
		}
	}
	const setContainer = (data) => {
		console.log(data)
		// falta realizar el guardado cuando se realice el backend
	}
	return (
		<>
			<div className='w-full my-3 text-center relative'>
				<b className='text-xl mr-3'>Controles</b>
				<Button size='large' variant='contained' type='button' onClick={() => enableControl()}>
					{enabled ? <LockOpen className='!text-xl' /> : <Lock className='!text-xl' />}
				</Button>
				<IconButton
					className={`!absolute right-5 ${
						!edit ? '!bg-yellow-300 hover:!bg-yellow-400' : ' !bg-green-300 hover:!bg-green-400 '
					}  shadow-slate-400 shadow-md`}
					type='button'
					onClick={editControls}
				>
					{!edit ? <Edit className='!text-xl' /> : <FaCheck className='!text-xl' />}
				</IconButton>
			</div>
			{edit ? (
				<EditControls controls={controls} info={info} setContainer={setContainer} />
			) : (
				<>
					<div className='grid grid-cols-4 gap-3'>
						{controlBasic.map((boardcontrol, index) => (
							<div key={index} className='flex  p-3 rounded-md items-center justify-between bg-gray-300 '>
								{boardcontrol.type === 'switch' ? (
									<>
										<label>
											<b className='mr-2'>{boardcontrol.name}</b>
										</label>
										<label className='inline-flex items-center cursor-pointer relative'>
											<input
												disabled={!enabled}
												type='checkbox'
												checked={!!controlBasic[boardcontrol.field]}
												id={boardcontrol.field}
												onClick={() => toggleCheck(boardcontrol.field)}
												className='sr-only peer'
											/>
											<div className="relative w-14 h-7 bg-gray-400 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
										</label>
									</>
								) : (
									<>
										<label>
											<b className='mr-2'>{boardcontrol.name}</b>
										</label>
										<div className='flex flex-row justify-center'>
											{Array.from({ length: 4 }, (_, i) => (
												<span
													className={`${
														i + 1 === controlBasic[boardcontrol.field]
															? 'bg-blue-600'
															: 'bg-slate-400'
													} mx-2 text-white rounded-[50%] w-[28px] h-[27px] flex pl-[10px] pt-[3px] cursor-pointer`}
													key={i}
													onClick={() => setCircleValue(boardcontrol.field, i + 1)}
												>
													{i + 1}
												</span>
											))}
										</div>
									</>
								)}
							</div>
						))}
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
							<AccordionDetails className={`!w-full grid grid-cols-4 gap-3`}>
								{controlAdvance.map((boardcontrol, index) => (
									<div
										key={index}
										className='flex p-3 rounded-md items-center justify-between bg-gray-300 '
									>
										{boardcontrol.type === 'switch' ? (
											<>
												<label>
													<b className='mr-2'>{boardcontrol.name}</b>
												</label>
												<label className='inline-flex items-center cursor-pointer relative'>
													<input
														disabled={!enabled}
														type='checkbox'
														checked={!!controlBasic[boardcontrol.field]}
														id={boardcontrol.field}
														onClick={() => toggleCheck(boardcontrol.field)}
														className='sr-only peer'
													/>
													<div className="relative w-14 h-7 bg-gray-400 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
												</label>
											</>
										) : (
											<>
												<label>
													<b className='mr-2'>{boardcontrol.name}</b>
												</label>
												<div className='flex flex-row justify-center'>
													{Array.from({ length: 4 }, (_, i) => (
														<span
															className={`${
																i + 1 === controlBasic[boardcontrol.field]
																	? 'bg-blue-600'
																	: 'bg-slate-400'
															} mx-2 text-white rounded-[50%] w-[28px] h-[27px] flex pl-[10px] pt-[3px] cursor-pointer`}
															key={i}
															onClick={() => setCircleValue(boardcontrol.field, i + 1)}
														>
															{i + 1}
														</span>
													))}
												</div>
											</>
										)}
									</div>
								))}
							</AccordionDetails>
						</Accordion>
					</div>
				</>
			)}
		</>
	)
}

export default ControlsBoard
