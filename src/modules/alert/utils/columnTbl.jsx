import { Close, Info } from '@mui/icons-material'
import { Box, IconButton, Modal, Typography } from '@mui/material'
import { useState } from 'react'

const eventsList = ['Bloqueo', 'Apertura']
export const columnsCriticos = [
	{
		accessorFn: (originalRow) => new Date(originalRow.dateAlert), //convert to date for sorting and filtering
		size: 200,
		id: 'dateAlert',
		header: 'Fecha',
		accessorKey: 'dateAlert',
		filterVariant: 'date-range',
		Cell: ({ cell }) => `${cell.getValue().toLocaleDateString()} ${cell.getValue().toLocaleTimeString()}`, // convert back to string for display
		muiTableHeadCellProps: {
			style: { minWidth: '6vw', maxWidth: '6vw', textWrap: 'wrap' },
		},
		muiTableBodyCellProps: {
			style: { minWidth: '1vw', maxWidth: '2vw', textWrap: 'wrap' },
		},
	},
	{
		header: 'Matricula',
		accessorKey: 'nro_recloser',
		muiFilterTextFieldProps: { placeholder: 'Matricula' },
		muiTableHeadCellProps: {
			style: { minWidth: '5vw', maxWidth: '5vw', textWrap: 'wrap' },
		},
		muiTableBodyCellProps: {
			style: { minWidth: '1vw', maxWidth: '2vw', textWrap: 'wrap' },
		},
	},
	{
		header: 'Nombre',
		accessorKey: 'name',
		muiFilterTextFieldProps: { placeholder: 'Nombre' },
		muiTableHeadCellProps: {
			style: { minWidth: '6vw', maxWidth: '6vw', textWrap: 'wrap' },
		},
		muiTableBodyCellProps: {
			style: { minWidth: '1vw', maxWidth: '2vw', textWrap: 'wrap' },
		},
	},
	{
		header: 'Evento',
		accessorKey: 'event',
		muiFilterTextFieldProps: { placeholder: 'Evento' },
		Cell: ({ row }) => {
			const [open, setOpen] = useState(false)

			const handleOpen = () => setOpen(true)
			const handleClose = () => setOpen(false)

			return (
				<div>
					{row.original.event}
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
		header: 'Información adicional',
		accessorKey: 'infoAdd',
		muiFilterTextFieldProps: { placeholder: 'Info adic.' },
		enableColumnFilter: false,
	},
]
