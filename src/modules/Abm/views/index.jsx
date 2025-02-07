import React, { useEffect, useState } from 'react'
import CardCustom from '../../../components/CardCustom'
import { MenuItem, TextField } from '@mui/material'
import { elements } from '../utils/data'
import Equipment from '../Components/Equipment'
import { useForm } from 'react-hook-form'
import AddMarkerMap from '../Components/Map/AddMarkerMap'
import { FaPlusCircle } from 'react-icons/fa'
import { request } from '../../../utils/js/request'
import { backend } from '../../../utils/routes/app.routes'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'

const Abm = () => {
	const navigate = useNavigate()
	const [selectMarkers, setSelectMarkers] = useState([])
	const [numberEquipments, setNumberEquipments] = useState([])
	const [typeSelected, setTypeSelected] = useState(null)
	const [elementSelected, setElementSelected] = useState([])
	const [abrevSelected, setAbrevSelected] = useState(null)
	const {
		register,
		setValue,
		clearErrors,
		formState: { errors },
		handleSubmit,
	} = useForm()
	const handleChange = async (e) => {
		setElementSelected(elements.find((element) => element.id === e.target.value))
		setTypeSelected(e.target.value)
	}
	const onSubmit = async (data) => {
		data.name = `${abrevSelected}${data.name}`
		data.lon = data.lng_marker
		data.lat = data.lat_marker
		delete data.lng_marker
		delete data.lat_marker
		const requestData = {
			element: data,
			equipment: numberEquipments,
		}
		try {
			await request(`${backend.Reconecta}/Elements`, 'POST', requestData)
			navigate('/')
			Swal.fire({
				icon: 'success',
				title: 'Elemento creado correctamente',
				toast: true,
				position: 'top-end',
				showConfirmButton: false,
				timer: 1500,
			})
		} catch (e) {
			Swal.fire({
				icon: 'error',
				title: 'Error al crear el elemento',
				toast: true,
				position: 'top-end',
				showConfirmButton: false,
				timer: 1500,
			})
		}
	}
	const handleNewEquipment = () => {
		const id = numberEquipments.length === 0 ? 1 : numberEquipments[numberEquipments.length - 1].id + 1
		setNumberEquipments([...numberEquipments, { id, id_model: '', serial: '', observation: '', configuration: '' }])
	}

	const handleDeleteEquipment = (id) => {
		const updatedEquipments = numberEquipments.filter((equipment) => equipment.id !== id)
		setNumberEquipments(updatedEquipments)
	}
	const handleChangeEquipment = (index, field, value) => {
		const updatedEquipments = [...numberEquipments]
		updatedEquipments[index][field] = value
		setNumberEquipments(updatedEquipments)
	}
	useEffect(() => {
		if (selectMarkers?.lat) {
			clearErrors('lng_marker')
			clearErrors('lat_marker')
			setValue('lng_marker', selectMarkers.lng)
			setValue('lat_marker', selectMarkers.lat)
		} else {
			setValue('lng_marker', null)
			setValue('lat_marker', null)
		}
	}, [selectMarkers])
	useEffect(() => {
		if (elementSelected?.abrev?.length > 0) {
			setAbrevSelected(elementSelected.abrev[0])
		}
	}, [elementSelected])
	return (
		<div className={'w-full flex justify-center items-center rounded-md text-black'}>
			<CardCustom className={'w-full rounded-md text-black flex justify-center flex-wrap gap-y-3'}>
				<div className='w-full flex-row gap-3'>
					<div className='mt-3'>
						<p className='w-full text-center text-2xl'>Añadir nuevo elemento</p>
					</div>
				</div>
				<form id='formAbmRecloser' onSubmit={handleSubmit(onSubmit)} className='w-full p-7'>
					<div className='w-full flex flex-col items-center gap-3 mb-5'>
						<p className='w-full text-center text-xl'>Infraestructura</p>
						<TextField
							className='w-full md:w-1/4'
							select
							label='Tipo de Infraestructura'
							{...register('type', { required: 'El Campo es requerido' })}
							onChange={(e) => {
								handleChange(e)
								setValue('type', e.target.value)
							}}
						>
							{elements.map((element) => (
								<MenuItem key={element.id} value={element.id}>
									{element.name}
								</MenuItem>
							))}
						</TextField>
					</div>
					<div className='w-full flex gap-3'>
						<div className='w-full md:w-1/3 flex flex-wrap'>
							<TextField
								className='w-1/6'
								select
								value={abrevSelected || ''}
								onChange={(e) => setAbrevSelected(e.target.value)}
							>
								{elementSelected?.abrev?.map((abrev) => (
									<MenuItem key={abrev} value={abrev}>
										{abrev}
									</MenuItem>
								))}
							</TextField>
							<TextField
								className='w-5/6'
								label='Matricula'
								name='name'
								{...register('name', { required: 'Nombre obligatorio' })}
							/>
							{errors.name && <p className='text-red-500'>{errors.name.message}</p>}
						</div>
						<div className='w-full md:w-1/3 '>
							<TextField
								className='w-full'
								label='Descripción'
								name='description'
								onChange={handleChange}
								{...register('description', { required: 'Campo obligatorio' })}
							/>
							{errors.description && <p className='text-red-500'>{errors.description.message}</p>}
						</div>
						<div className='w-full md:w-1/3 '>
							<TextField
								className='w-full'
								label='Potencia instalada'
								name='power'
								{...register('power', { required: 'Campo obligatorio' })}
							/>
							{errors.power && <p className='text-red-500'>{errors.power.message}</p>}
						</div>
					</div>
					<AddMarkerMap
						register={register}
						errors={errors}
						dataEdit={[]}
						setSelectMarkers={setSelectMarkers}
					/>
					<div className='w-full flex my-5 items-center'>
						<p className='text-start text-xl my-3'>Equipos</p>
						<button type='button' onClick={handleNewEquipment} className='text-green-500'>
							<FaPlusCircle size={25} />
						</button>
					</div>
					<div className='w-full'>
						{numberEquipments.map((equipment, index) => (
							<Equipment
								key={equipment.id}
								data={equipment}
								onChange={(field, value) => handleChangeEquipment(index, field, value)}
								type={typeSelected}
								handleDeleteEquipment={handleDeleteEquipment}
							/>
						))}
					</div>
					<div className='w-full flex justify-center mt-5'>
						<button type='submit' className='bg-green-600 hover:bg-green-500 text-white rounded-md p-2'>
							Guardar todo
						</button>
					</div>
				</form>
			</CardCustom>
		</div>
	)
}

export default Abm
