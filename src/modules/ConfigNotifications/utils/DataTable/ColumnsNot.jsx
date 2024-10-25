import { MenuItem, Select } from '@mui/material'
import React, { useState } from 'react'

export const ColumnsNot = (handlePriority, handleCheck) => [
	{
		header: 'ID',
		accessorKey: 'id',
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
				await handlePriority(data)
			}
			// const handleChange = (event) => {
			// 	setStatus(event.target.value)
			// 	handlePriority(row.original.id, event.target.value, row.index)
			// }
			return (
				<Select key={row.index} id='priority' className='max-h-8 w-56' value={status} onChange={handleChange}>
					<MenuItem value={1}>ALTA</MenuItem>
					<MenuItem value={2}>SIN MODIFICAR</MenuItem>
					<MenuItem value={3}>BAJA</MenuItem>
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
					onChange={handleChange}
				/>
			)
		},
	},
]
