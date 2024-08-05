import { Delete, Edit, ListRounded } from '@mui/icons-material'
import { Button, IconButton, Popper } from '@mui/material'
import { useEffect, useRef, useState } from 'react'

export const ColumnsTasks = () => [
	{
		header: 'Tarea',
		accessorKey: 'task',
		muiFilterTextFieldProps: { placeholder: 'Tarea' },
	},
	{
		header: 'Tipo de tarea',
		accessorKey: 'typeTask',
		muiFilterTextFieldProps: { placeholder: 'Tipo de tarea' },
	},
	{
		header: 'Orden de Mantenimiento',
		accessorKey: 'order',
		muiFilterTextFieldProps: { placeholder: 'Orden de Mantenimiento' },
	},
	{
		header: 'Fecha de creación',
		accessorKey: 'createdAt',
		muiFilterTextFieldProps: { placeholder: 'Fecha de creación' },
	},
	{
		header: '',
		accessorKey: 'options',
		size: 10,
		enableSorting: false,
		enableColumnFilter: false,
		enableClickToCopy: false,
		Cell: ({ row }) => {
			const popperRef = useRef(null)
			const popperRef2 = useRef(null)
			const handleClickOutside = (event) => {
				if (popperRef2.current && !popperRef2.current.contains(event.target) && popperRef.current && !popperRef.current.contains(event.target)) {
					setAnchorEl(null)
				}
			}

			useEffect(() => {
				document.addEventListener('mousedown', handleClickOutside)
				return () => {
					document.removeEventListener('mousedown', handleClickOutside)
				}
			}, [])

			const [anchorEl, setAnchorEl] = useState(null)
			const open = Boolean(anchorEl)
			const handleClick = (event) => {
				setAnchorEl(anchorEl ? null : event.currentTarget)
			}

			const handleClose = () => {
				setAnchorEl(null)
			}
			return (
				<>
					<IconButton ref={popperRef2} aria-describedby={row.id} onClick={handleClick}>
						<ListRounded color='info' />
					</IconButton>
					<Popper ref={popperRef} id={row.id} className='bg-[#f0f0f0] rounded-md shadow-md flex flex-col justify-start' placement='left-start' open={open} anchorEl={anchorEl}>
						<Button
							variant='text'
							className='!justify-start !text-black'
							type='button'
							onClick={() => {
								handleClose()
							}}
						>
							<Edit color='warning' className='mr-2' />
							Editar
						</Button>
						<Button
							variant='text'
							className='!justify-start !text-black'
							type='button'
							onClick={() => {
								handleClose()
							}}
						>
							<Delete color='error' className='mr-2' />
							Eliminar
						</Button>
					</Popper>
				</>
			)
		},
	},
]
