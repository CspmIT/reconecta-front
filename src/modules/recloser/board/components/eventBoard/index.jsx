import React, { useEffect, useState } from 'react'
import TableCustom from '../../../../../components/TableCustom'
import { FormLabel } from '@mui/material'
import Swal from 'sweetalert2'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { request } from '../../../../../utils/js/request'
import { ColumnsEvent } from './ColumnsEvent'
import { backend } from '../../../../../utils/routes/app.routes'
import LoaderComponent from '../../../../../components/Loader'
const EventBoard = ({ idRecloser }) => {
	const [rowCriticos, setRowCriticos] = useState(null)

	const getEvents = async (id) => {
		const data = await request(
			`${backend[`${import.meta.env.VITE_APP_NAME}`]}/eventsDevices?id=${id}&type=Reconectador`,
			'GET'
		)
		const rows = data.data.map((item) => {
			return {
				dateAlert: item.dateAlert,
				event: item.event,
				infoAdd: item.infoAdd,
				statusAlert: 0,
			}
		})
		setRowCriticos(rows)
	}
	useEffect(() => {
		if (idRecloser) {
			getEvents(idRecloser)
			// const intervalId = setInterval(() => {
			// 	getEvents(idRecloser)
			// }, 15000)
			// return () => clearInterval(intervalId)
		}
	}, [idRecloser])

	return (
		<div className='w-full'>
			{rowCriticos ? (
				<>
					<div className='relative flex justify-between items-center mb-4'>
						<FormLabel className='w-full text-center !text-2xl'>Evento </FormLabel>
					</div>
					<div className='w-full max-w-full overflow-x-auto'>
						<LocalizationProvider dateAdapter={AdapterDayjs}>
							<TableCustom
								data={rowCriticos}
								columns={ColumnsEvent()}
								density='comfortable'
								header={{
									background: 'rgb(91 151 248);',
									fontSize: '18px',
									fontWeight: 'bold',
								}}
								toolbarClass={{ background: 'rgb(91 151 248)' }}
								bodyContent={{ fontSize: '16px' }}
								footer={{ background: 'rgb(223 233 249)' }}
								pageSize={10}
								topToolbar
								hide
								filter
								sort
								pagination
							/>
						</LocalizationProvider>
					</div>
				</>
			) : (
				<LoaderComponent />
			)}
		</div>
	)
}

export default EventBoard
