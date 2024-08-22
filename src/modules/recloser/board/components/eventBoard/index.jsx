import React, { useEffect, useState } from 'react'
import TableCustom from '../../../../../components/TableCustom'
import { FormLabel } from '@mui/material'
import Swal from 'sweetalert2'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { request } from '../../../../../utils/js/request'
import { ColumnsEvent } from './ColumnsEvent'
const EventBoard = ({ idRecloser }) => {
	const [rowCriticos, setRowCriticos] = useState([])
	const [bottonCheck, setBottonCheck] = useState(false)

	const ChangeColorRow = (row) => {
		return row.original.statusAlert === 1
	}

	const checkAlertCriticas = (table) => {
		Swal.fire({
			title: 'Atención!',
			html: '¿Está seguro de que desea limpiar las alertas críticas?',
			icon: 'warning',
			showCancelButton: true,
			allowOutsideClick: false,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Si',
			cancelButtonText: 'No, cancelar',
		}).then((result) => {
			if (result.isConfirmed) {
				Swal.fire({
					title: 'Atención!',
					html: '¿Deseas limpiar toda la tabla o solo la pag actual?',
					icon: 'warning',
					showCancelButton: true,
					allowOutsideClick: false,
					confirmButtonColor: '#3085d6',
					cancelButtonColor: '#d33',
					confirmButtonText: 'Actual',
					cancelButtonText: 'Toda la tabla',
				}).then((result) => {
					const changeRows = rowCriticos.map((row, index) => {
						if (!result.isConfirmed || table.getRowModel().rows.some((item) => item.index == index)) {
							row.statusAlert = 0
						}
						return row
					})

					setBottonCheck(false)
					setRowCriticos(changeRows)
				})
			}
		})
	}

	const getEvents = async (id) => {
		const data = await request(`${import.meta.env.VITE_APP_BACK_RECONECTA}/listEvents?id=${id}`, 'GET')
		if (!Object.keys(data).length) {
			Swal.fire({
				title: 'Atención!',
				html: `Hubo un problema con la carga de los datos del reconectador.</br>Intente nuevamente...`,
				icon: 'error',
			})
			return
		}
		const rows = data.data.map((item) => {
			return {
				dateAlert: item.time.value,
				event: `${item.variable.value} - ${item.event.value}`,
				infoAdd: ' ',
				statusAlert: 0,
			}
		})
		setRowCriticos(rows)
	}
	useEffect(() => {
		if (!idRecloser) {
			Swal.fire({
				title: 'Atención!',
				html: `Hubo un problema con la carga de los datos del reconectador.</br>Intente nuevamente...`,
				icon: 'error',
			})
		} else {
			getEvents(idRecloser)
			const intervalId = setInterval(() => {
				getEvents(idRecloser)
			}, 15000)
			return () => clearInterval(intervalId)
		}
	}, [idRecloser])

	useEffect(() => {
		if (rowCriticos.some((row) => row.statusAlert === 1)) {
			setBottonCheck(true)
		}
	}, [rowCriticos])

	return (
		<div className='w-full'>
			<div className='relative flex justify-between items-center mb-4'>
				<FormLabel className='w-full text-center !text-2xl'>Evento Criticos</FormLabel>
			</div>
			<LocalizationProvider dateAdapter={AdapterDayjs}>
				<TableCustom
					getPage={checkAlertCriticas}
					data={rowCriticos}
					columns={ColumnsEvent()}
					density='comfortable'
					header={{
						background: 'rgb(190 190 190)',
						fontSize: '18px',
						fontWeight: 'bold',
					}}
					toolbarClass={{ background: 'rgb(190 190 190)' }}
					body={{ backgroundColor: 'rgba(209, 213, 219, 0.31)' }}
					footer={{ background: 'rgb(190 190 190)' }}
					ChangeColorRow={ChangeColorRow}
					pageSize={10}
					checkAlert={bottonCheck}
					topToolbar
					hide
					filter
					sort
					pagination
				/>
			</LocalizationProvider>
		</div>
	)
}

export default EventBoard
