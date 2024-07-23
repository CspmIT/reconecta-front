import { Button } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { FaLock, FaLockOpen } from 'react-icons/fa'
import { boardControls } from '../../utils/objects'
import Swal from 'sweetalert2'

const ControlsBoard = ({ info }) => {
	const [enabled, setEnabled] = useState(false)
	const [control, setControl] = useState(
		boardControls.reduce((acc, control) => {
			acc[control.field] = control.type === 'switch' ? false : 1
			return acc
		}, {})
	)
	const [countdown, setCountdown] = useState(0)
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
				setControl((prevState) => ({
					...prevState,
					[id]: !prevState[id],
				}))
			}
		})
	}

	const setCircleValue = (id, value) => {
		if (enabled) {
			contador()
			setControl((prevState) => ({
				...prevState,
				[id]: value,
			}))
		}
	}
	useEffect(() => {
		if (info) {
			setControl(
				boardControls.reduce((acc, control) => {
					acc[control.field] = info[control.field] || (control.type === 'switch' ? false : 1)
					return acc
				}, {})
			)
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
	return (
		<div>
			<div className='my-3 text-center'>
				<b className='text-xl mr-3'>Controles</b>
				<Button size='large' variant='contained' onClick={() => enableControl()}>
					{enabled ? <FaLockOpen /> : <FaLock />}
				</Button>
			</div>
			<div className='w-full flex flex-row flex-wrap justify-between'>
				{boardControls.map((boardcontrol, index) =>
					boardcontrol.type === 'switch' ? (
						<div key={index} className='w-1/4 flex flex-row justify-center items-center text-center my-3'>
							<label>
								<b className='mr-2'>{boardcontrol.name}</b>
							</label>
							<label className='inline-flex items-center cursor-pointer'>
								<input
									disabled={!enabled}
									type='checkbox'
									checked={!!control[boardcontrol.field]}
									id={boardcontrol.field}
									onClick={() => toggleCheck(boardcontrol.field)}
									className='sr-only peer'
								/>
								<div className="relative w-14 h-7 bg-gray-400 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
							</label>
						</div>
					) : (
						<div key={index} className='w-1/4 text-center my-3'>
							<label>
								<b className='mr-2'>{boardcontrol.name}</b>
							</label>
							<div className='flex flex-row justify-center'>
								{Array.from({ length: 4 }, (_, i) => (
									<span
										className={`${
											i + 1 === control[boardcontrol.field] ? 'bg-blue-600' : 'bg-slate-400'
										} mx-2 text-white rounded-[50%] w-[28px] h-[27px] flex pl-[10px] pt-[3px] cursor-pointer`}
										key={i}
										onClick={() => setCircleValue(boardcontrol.field, i + 1)}
									>
										{i + 1}
									</span>
								))}
							</div>
						</div>
					)
				)}
			</div>
		</div>
	)
}

export default ControlsBoard
