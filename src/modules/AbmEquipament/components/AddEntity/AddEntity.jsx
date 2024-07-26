import { MenuItem, TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import { markersRecloser } from '../../../map/utils/js/markers'

function AddEntity({ register, errors, setValue, addMarker, enableMarkers, setSelectMarkers }) {
	const [typeEntity, setTypeEntity] = useState(0)
	const existEntity = (status) => {
		setSelectMarkers([])
		setTypeEntity(status)
		enableMarkers(status)
	}

	const change = (e) => {
		setValue('markerEntity', e.target.value)
		addMarker(e.target.value)
	}
	useEffect(() => {
		if (typeEntity) {
			addMarker('')
		}
	}, [typeEntity])
	return (
		<>
			<p className='w-full text-center text-2xl mb-3'>Entidad</p>
			<div className='w-full flex justify-center mb-5'>
				<TextField
					select
					label={`Entidad`}
					onChange={(e) => existEntity(e.target.value)}
					className='w-1/2'
					defaultValue={0}
				>
					<MenuItem key={0} value={0}>
						Nuevo
					</MenuItem>
					<MenuItem key={1} value={1}>
						Existente
					</MenuItem>
				</TextField>
			</div>
			{!typeEntity ? (
				<div className='w-full grid gap-3 md:grid-cols-2 lg:grid-cols-3'>
					<div className='w-full'>
						<TextField
							error={errors.name_entity ? true : false}
							type='text'
							label={`Nombre`}
							{...register('name_entity', { required: 'El Campo es requerido' })}
							className='w-full'
							helperText={errors.name_entity && errors.name_entity.message}
						/>
					</div>
					<div className='w-full'>
						<TextField
							error={errors.number_entity ? true : false}
							type='text'
							label={`Numero`}
							{...register('number_entity', { required: 'El Campo es requerido' })}
							className='w-full'
							helperText={errors.number_entity && errors.number_entity.message}
						/>
					</div>
					<div className='w-full'>
						<TextField
							error={errors.description_entity ? true : false}
							type='text'
							label={`Descripción`}
							{...register('description_entity', { required: 'El Campo es requerido' })}
							className='w-full'
							helperText={errors.description_entity && errors.description_entity.message}
						/>
					</div>
				</div>
			) : (
				<div className='w-full flex justify-center'>
					<TextField
						error={errors.markerEntity ? true : false}
						select
						label={`Entidad`}
						name='markerEntity'
						{...register('markerEntity', { required: 'El campo es requerido', onChange: (e) => change(e) })}
						className='w-1/3'
						defaultValue={''}
						helperText={errors.markerEntity && errors.markerEntity.message}
					>
						<MenuItem value={''}>
							<em>Seleccionar Entidad</em>
						</MenuItem>
						{markersRecloser.map((item) => (
							<MenuItem key={item.id} value={item.id}>
								{item.info.name}
							</MenuItem>
						))}
					</TextField>
				</div>
			)}
		</>
	)
}

export default AddEntity
