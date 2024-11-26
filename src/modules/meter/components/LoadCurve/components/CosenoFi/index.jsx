import React, { useEffect, useState } from 'react'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { ColumnsTable } from './utils/DataTable'
import TableCustom from '../../../../../../components/TableCustom'
import LoaderComponent from '../../../../../../components/Loader'
import { useForm } from 'react-hook-form'
import Swal from 'sweetalert2'
import { request } from '../../../../../../utils/js/request'
import { backend } from '../../../../../../utils/routes/app.routes'
import { useNavigate } from 'react-router-dom'
import { Button, TextField } from '@mui/material'
import { getTableCosenoFi } from './utils/js/actions'
function CosenoFi({ info }) {
	const navigate = useNavigate()
	const [isLoading, setIsLoading] = useState(true)
	const [dataTable, setdataTable] = useState([])
	const getDataCosenoFi = async (dateStart = null, dateFinished = null) => {
		try {
			setIsLoading(true)
			const dataCosenoFi = await request(`${backend[`${import.meta.env.VITE_APP_NAME}`]}/getCosenofi`, 'POST', {
				serial: info.serial,
				version: info.version,
				brand: info.brand,
				dateStart,
				dateFinished,
			})
			const CosenoFiData = await getTableCosenoFi(dataCosenoFi.data)
			setdataTable(CosenoFiData)
			setIsLoading(false)
		} catch (error) {
			console.error(error)
			Swal.fire({
				title: 'Atención!',
				html: `Hubo un problema con la carga de los datos del Medidor.</br>Intente nuevamente...`,
				icon: 'error',
			})
			navigate('/Home')
		}
	}

	useEffect(() => {
		if (!info) {
			Swal.fire({
				title: 'Atención!',
				html: `Hubo un problema con la carga de los datos del Medidor.</br>Intente nuevamente...`,
				icon: 'error',
			})
			navigate('/Home')
		} else {
			getDataCosenoFi()
		}
	}, [info])

	const filterTable = (data) => {
		getDataCosenoFi(data.dateStart, data.dateFinished)
	}

	const {
		register,
		formState: { errors },
		handleSubmit,
	} = useForm()
	if (isLoading) return <LoaderComponent image={false} />
	return (
		<div className='w-full'>
			<form className='flex justify-center w-full gap-4 my-4' onSubmit={handleSubmit(filterTable)}>
				<TextField
					error={errors.dateStart ? true : false}
					type='date'
					label='Desde'
					{...register('dateStart', { required: 'El campo es requerido' })}
					InputLabelProps={{
						shrink: true,
					}}
					className='w-1/4'
					helperText={errors.dateStart && errors.dateStart.message}
				/>
				<TextField
					error={errors.dateFinished ? true : false}
					type='date'
					label='Desde'
					{...register('dateFinished', { required: 'El campo es requerido' })}
					InputLabelProps={{
						shrink: true,
					}}
					className='w-1/4'
					helperText={errors.dateFinished && errors.dateFinished.message}
				/>

				<Button type='submit' variant='contained' color='primary'>
					Filtrar
				</Button>
			</form>
			<LocalizationProvider dateAdapter={AdapterDayjs}>
				<TableCustom
					data={dataTable}
					columns={ColumnsTable}
					density='compact'
					header={{
						background: 'rgb(190 190 190)',
						fontSize: '18px',
						fontWeight: 'bold',
					}}
					card={{
						boxShadow: `1px 1px 8px 0px #00000046`,
						borderRadius: '0.25rem',
					}}
					toolbarClass={{ background: 'rgb(190 190 190)' }}
					body={{ backgroundColor: 'rgba(209, 213, 219, 0.31)' }}
					footer={{ background: 'rgb(190 190 190)' }}
					pageSize={10}
					topToolbar
					filter
					exportPdf
					exportExcel
					pagination
				/>
			</LocalizationProvider>
		</div>
	)
}

export default CosenoFi
