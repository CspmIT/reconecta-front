import { useEffect, useState } from 'react'
import TableCustom from '../../../../../../components/TableCustom'
import { ColumnsTable } from './utils/ColumnsTable'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { backend } from '../../../../../../utils/routes/app.routes'
import { request } from '../../../../../../utils/js/request'
import LoaderComponent from '../../../../../../components/Loader'
import { getTableCurva } from './utils/js/actions'
import { Button, TextField } from '@mui/material'
import { useForm } from 'react-hook-form'
function Curva({ info }) {
	const navigate = useNavigate()
	const [isLoading, setIsLoading] = useState(true)
	const [dataTable, setdataTable] = useState([])
	const getDataInsta = async (dateStart = null, dateFinished = null) => {
		try {
			setIsLoading(true)
			const dataCurva = await request(`${backend[`${import.meta.env.VITE_APP_NAME}`]}/getCurva`, 'POST', {
				serial: info.serial,
				version: info.version,
				brand: info.brand,
				dateStart,
				dateFinished,
			})
			const CurvaData = await getTableCurva(dataCurva.data)
			setdataTable(CurvaData)
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
			getDataInsta()
		}
	}, [info])

	const filterTable = (data) => {
		getDataInsta(data.dateStart, data.dateFinished)
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

export default Curva
