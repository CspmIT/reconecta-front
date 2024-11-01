import { MenuItem, Select } from '@mui/material'
import React, { useState } from 'react'

export const ColumnsNot = (handlePriority, handleCheck, access) => [
	{
		header: 'ID',
		accessorKey: 'id_event_influx',
		muiTableHeadCellProps: {
			style: { minWidth: '3ch', maxWidth: '3ch' },
		},
		muiTableBodyCellProps: {
			style: { minWidth: '3ch', maxWidth: '3ch' },
		},
	},
	{
		header: 'Evento',
		accessorKey: 'name',
	},
	{
		header: 'Prioridad',
		accessorKey: 'priority',
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
