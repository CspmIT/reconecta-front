import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import AddMarkerMap from '../../../AbmEquipament/components/Map/AddMarkerMap'
import CardCustom from '../../../../components/CardCustom'
import { Button, TextField } from '@mui/material'
import { saveNode } from '../../../AbmEquipament/utils/js/nodeAction'
import Swal from 'sweetalert2'

const AddNode = ({ setNodeId, handleAddNode }) => {
	const [selectMarkers, setSelectMarkers] = useState([])
	const {
		register,
		setValue,
		watch,
		clearErrors,
		formState: { errors },
		handleSubmit,
	} = useForm()

	const onSubmit = async (info) => {
		try {
			info.type = 'Reconectador'
			const { data } = await saveNode(info)
			setNodeId(data.id)
			handleAddNode()
			Swal.fire({ title: 'Perfecto!', icon: 'success', text: 'Nodo agregado correctamente' })
		} catch (e) {
			Swal.fire({
				title: '¡Atención!',
				text: 'Ocurrió un error al intentar guardar el nodo',
				icon: 'error',
			})
			console.log(e)
		}
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
	return (
		<CardCustom className={'w-full !bg-slate-100 rounded-md text-black p-5 mt-5'}>
			<h2 className='text-center text-xl'>Cargar nuevo nodo</h2>
			<form id='formAbmRecloser' onSubmit={handleSubmit(onSubmit)} className='w-full flex flex-wrap p-7'>
				<div className='w-full grid gap-3 md:grid-cols-2 lg:grid-cols-3'>
					<div className='w-full'>
						<TextField
							error={!!errors.name}
							type='text'
							label='Nombre'
							{...register('name', { required: 'El Campo es requerido' })}
							className='w-full'
							helperText={errors.name?.message}
							name='name'
						/>
					</div>
					<div className='w-full'>
						<TextField
							error={!!errors.number}
							type='text'
							label='Matricula'
							inputProps={{ style: { textTransform: 'uppercase' } }}
							{...register('number', {
								required: 'El Campo es requerido',
								pattern: {
									value: /^[A-Z0-9]*$/,
									message: 'Solo se permiten letras mayúsculas y números',
								},
							})}
							className='w-full'
							helperText={errors.number?.message}
							name='number'
						/>
					</div>
					<div className='w-full'>
						<TextField
							error={!!errors.description}
							type='text'
							label='Descripción'
							{...register('description')}
							className='w-full'
							helperText={errors.description?.message}
							name='description'
						/>
					</div>
				</div>
				<AddMarkerMap
					register={register}
					errors={errors}
					watch={watch}
					dataEdit={[]}
					setSelectMarkers={setSelectMarkers}
				/>
				<div className='w-full flex justify-center mt-5'>
					<Button type='submit' variant='contained'>
						Cargar y asignar nodo
					</Button>
				</div>
			</form>
		</CardCustom>
	)
}

export default AddNode
