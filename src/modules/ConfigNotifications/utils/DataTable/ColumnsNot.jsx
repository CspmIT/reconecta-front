import { Close, Info } from '@mui/icons-material'
import { Box, IconButton, MenuItem, Modal, Select, Typography } from '@mui/material'
import { useState } from 'react'

export const ColumnsNot = (handlePriority, handleCheck, access) => [
	{
		header: '',
		accessorKey: 'type_var',
		muiTableBodyCellProps: {
			style: { minWidth: '1vw', maxWidth: '1vw', textWrap: 'wrap' },
		},
	},
	{
		header: 'Evento',
		accessorKey: 'name',
		muiTableHeadCellProps: {
			align: 'center',
		},
		muiTableBodyCellProps: {
			style: { minWidth: '35vw', maxWidth: '50vw', textWrap: 'wrap' },
		},
		Cell: ({ row }) => {
			const [open, setOpen] = useState(false)

			const handleOpen = () => setOpen(true)
			const handleClose = () => setOpen(false)

			return (
				<div>
					{row.original.name}
					{row.original.description ? (
						<>
							<IconButton onClick={handleOpen}>
								<Info />
							</IconButton>
							<Modal
								open={open}
								onClose={handleClose}
								aria-labelledby='modal-title'
								aria-describedby='modal-description'
							>
								<Box
									sx={{
										position: 'absolute',
										top: '50%',
										left: '50%',
										transform: 'translate(-50%, -50%)',
										width: 400,
										bgcolor: 'background.paper',
										color: 'black',
										boxShadow: 24,
										p: 4,
										borderRadius: 2,
									}}
								>
									<IconButton onClick={handleClose} className='!absolute !right-0 top-0'>
										<Close />
									</IconButton>
									<Typography id='modal-title' variant='h6' component='h2'>
										Detalles del Evento
									</Typography>
									<Typography id='modal-description' sx={{ mt: 2 }}>
										{row.original.description}
									</Typography>
								</Box>
							</Modal>
						</>
					) : null}
				</div>
			)
		},
	},
	{
		header: 'Prioridad',
		accessorKey: 'priority',
		size: 50,
		muiTableBodyCellProps: {
			align: 'center',
		},
		muiTableHeadCellProps: {
			align: 'center',
		},
		Cell: ({ row }) => {
			const [status, setStatus] = useState(row.original.priority)
			const handleChange = async (event) => {
				setStatus(event.target.value)
				const data = row.original
				data.priority = event.target.value
				data.flash_screen = event.target.value > 1 ? false : row.original.flash_screen
				await handlePriority(data)
			}
			return (
				<Select
					key={row.index}
					id='priority'
					disabled={!access}
					className='max-h-8 w-56'
					value={status}
					onChange={handleChange}
				>
					<MenuItem value={1}>ALTA</MenuItem>
					<MenuItem value={2}>BAJA</MenuItem>
					<MenuItem value={3}>SIN PRIORIDAD</MenuItem>
				</Select>
			)
		},
	},
	{
		header: 'Destello en Pantalla',
		accessorKey: 'flash_screen',
		size: 20,
		muiTableBodyCellProps: {
			align: 'center',
		},
		muiTableHeadCellProps: {
			align: 'center',
		},
		Cell: ({ row }) => {
			const [status, setStatus] = useState(row.original.flash_screen)
			const disable = !access || row.original.priority > 1 ? true : false
			const handleChange = async (event) => {
				setStatus(event.target.checked)
				const data = row.original
				data.flash_screen = event.target.checked
				await handleCheck(data)
			}
			return (
				<input
					type='checkbox'
					id={`check_flash_screen_${row.index}`}
					style={{ height: '18px', width: '18px' }}
					checked={status}
					disabled={disable}
					onChange={handleChange}
				/>
			)
		},
	},
	{
		header: 'Notificación',
		accessorKey: 'alarm',
		size: 20,
		muiTableBodyCellProps: {
			align: 'center',
		},
		muiTableHeadCellProps: {
			align: 'center',
		},
		Cell: ({ row }) => {
			const [status, setStatus] = useState(row.original.alarm)
			const handleChange = async (event) => {
				setStatus(event.target.checked)
				const data = row.original
				data.alarm = event.target.checked
				await handleCheck(data)
			}
			return (
				<input
					type='checkbox'
					id={`check_alarm_${row.index}`}
					style={{ height: '18px', width: '18px' }}
					checked={status}
					disabled={!access}
					onChange={handleChange}
				/>
			)
		},
	},
]
