import React from 'react'
import { IconButton, MenuItem, Modal, Select, FormControl, InputLabel, Button } from '@mui/material'
import { ImCross } from 'react-icons/im'

const ModalData = ({ setOpenModal, openModal }) => {
	const onSubmit = (e) => {
		e.preventDefault()
		setOpenModal(false)
	}

	return (
		<Modal open={openModal} onClose={() => setOpenModal(false)} aria-labelledby='modal-modal-title' aria-describedby='modal-modal-description'>
			<div className='w-full md:w-1/2 !absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 p-2'>
				<div className='bg-white rounded-md shadow-md w-full'>
					<div className='p-4 bg-[#243f8c] rounded-t-md relative'>
						<h1 className='text-xl font-bold text-white'>Editar Evento</h1>
						<IconButton onClick={() => setOpenModal(false)} className='!absolute !top-4 !right-4'>
							<ImCross size={15} />
						</IconButton>
					</div>
					<div className='p-7'>
						<form encType='multipart/form-data' className='flex flex-col items-center mt-4' onSubmit={onSubmit} id='formEditUser'>
							<div className='flex flex-col gap-4 w-full my-5'>
								<div className='flex w-full gap-2 justify-center items-center'>
									<FormControl className='w-1/3'>
										<InputLabel>Prioridad</InputLabel>
										<Select defaultValue=''>
											<MenuItem value={1}>Alta</MenuItem>
											<MenuItem value={2}>Baja</MenuItem>
											<MenuItem value={3}>Sin Modificar</MenuItem>
										</Select>
									</FormControl>
									<FormControl className='w-1/3'>
										<InputLabel>Destello</InputLabel>
										<Select defaultValue=''>
											<MenuItem value={0}>Sí</MenuItem>
											<MenuItem value={1}>No</MenuItem>
										</Select>
									</FormControl>
									<FormControl className='w-1/3'>
										<InputLabel>Notificación</InputLabel>
										<Select defaultValue=''>
											<MenuItem value={0}>Sí</MenuItem>
											<MenuItem value={1}>No</MenuItem>
										</Select>
									</FormControl>
								</div>
							</div>
							<Button type='submit' variant='contained' color='primary'>
								Enviar
							</Button>
						</form>
					</div>
				</div>
			</div>
		</Modal>
	)
}

export default ModalData
