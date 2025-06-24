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
import { useNavigate, useParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import SubstationClient from '../Components/SubstationClient'

const Abm = () => {
	const navigate = useNavigate()
	const { elementId } = useParams()
	const [selectMarkers, setSelectMarkers] = useState([])
	const [numberEquipments, setNumberEquipments] = useState([])
	const [numberClients, setNumberClients] = useState([])
	const [typeSelected, setTypeSelected] = useState(null)
	const [elementSelected, setElementSelected] = useState([])
	const [abrevSelected, setAbrevSelected] = useState(null)
	const [dataEdit, setDataEdit] = useState([])
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
		if (elementId) {
			data.id = elementId
		}
		data.name = `${abrevSelected}${data.name}`
		data.lon = data.lng_marker
		data.lat = data.lat_marker
		delete data.lng_marker
		delete data.lat_marker
		const requestData = {
			element: data,
			equipment: numberEquipments,
			client: numberClients
		}
		try {
			const method = elementId ? 'PATCH' : 'POST'
			await request(`${backend.Reconecta}/Elements`, method, requestData)
			navigate('/')
			Swal.fire({
				icon: 'success',
				title: 'Se guardó correctamente',
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
		setNumberEquipments([...numberEquipments, { id, id_model: '', serial: '', observation: '', configuration: 1 }])
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

	const handleNewClient = () => {
		const id = numberClients.length === 0 ? 1 : numberClients[numberClients.length - 1].id + 1
		setNumberClients([
			...numberClients,
			{ id, name: '', feed: 1, power: '', pat: '' },
		])
	}
	const handleDeleteClient = (id) => {
		const updatedClients = numberClients.filter((client) => client.id !== id)
		setNumberClients(updatedClients)
	}
	const handleChangeClient = (index, field, value) => {
		const updatedClients = [...numberClients]
		updatedClients[index][field] = value
		setNumberClients(updatedClients)
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
	useEffect(() => {
		if (elementId) {
			const fetchElement = async () => {
				try {
					const { data } = await request(`${backend.Reconecta}/Elements/${elementId}`, 'GET')
					if (data[0]) {
						setDataEdit(data[0])
						setValue('type', data[0].type)
						setValue('name', data[0].name.slice(2))
						setValue('description', data[0].description)
						setValue('power', data[0].power)
						setValue('serial', data[0].serial || '')
						setValue('lng_marker', data[0].lon)
						setValue('lat_marker', data[0].lat)
						setValue('id_map', data[0].id_map)
						setElementSelected(elements.find((el) => el.id === data[0].type))
						setAbrevSelected(data[0].name.slice(0, 2))
						setTypeSelected(data[0].type)
						if (data[0].type === 3) {
							const clients = data[0].clients.map((client, index) => ({
								id: index + 1,
								name: client.name,
								feed: client.feed,
								power: client.power,
								pat: client.pat,
								bd_id: client.id
							}))
							setNumberClients(clients)
						}
						const equipments = data[0].equipments.map((equipment, index) => ({
							id: index + 1,
							id_model: equipment.id_model,
							serial: equipment.serial,
							observation: equipment.observation,
							configuration: equipment.configuration || 1,
							bd_id: equipment.id
						}))
						setNumberEquipments(equipments)
						setSelectMarkers([{ lat: data[0].lat, lng: data[0].lon }])
					}
				} catch (error) {
					console.error('Error fetching element:', error)
				}
			}
			fetchElement()
		}
	}, [elementId])
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
							value={typeSelected}
							InputLabelProps={{ shrink: elementId || typeSelected ? true : false }}
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
								InputLabelProps={{ shrink: elementId || abrevSelected ? true : false }}
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
								InputLabelProps={{ shrink: elementId ? true : false }}
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
								InputLabelProps={{ shrink: elementId ? true : false }}
							/>
							{errors.description && <p className='text-red-500'>{errors.description.message}</p>}
						</div>
						<div className='w-full md:w-1/3 '>
							<TextField
								className='w-full'
								label='Potencia instalada'
								name='power'
								{...register('power', { required: 'Campo obligatorio' })}
								InputLabelProps={{ shrink: elementId ? true : false }}
							/>
							{errors.power && <p className='text-red-500'>{errors.power.message}</p>}
						</div>
						{elementSelected?.id === 3 && (
							<div className='w-full md:w-1/3 '>
								<TextField
									className='w-full'
									label='Numero de Medidor'
									name='serial'
									{...register('serial', { required: 'Campo obligatorio' })}
								/>
								{errors.serial && <p className='text-red-500'>{errors.serial.message}</p>}
							</div>
						)}
					</div>
					<AddMarkerMap
						register={register}
						errors={errors}
						dataEdit={dataEdit}
						setSelectMarkers={setSelectMarkers}
					/>
					{elementSelected?.id !== 3 ? (
						<>
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
						</>
					) : (
						<>
							<div className='w-full flex my-5 items-center'>
								<p className='text-start text-xl my-3'>Clientes asociados</p>
								<button type='button' onClick={handleNewClient} className='text-green-500'>
									<FaPlusCircle size={25} />
								</button>
							</div>
							<div className='w-full'>
								{numberClients.map((client, index) => (
									<SubstationClient
										key={client.id}
										data={client}
										onChange={(field, value) => handleChangeClient(index, field, value)}
										type={typeSelected}
										handleDeleteClient={handleDeleteClient}
									/>
								))}
							</div>
						</>
					)}
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
