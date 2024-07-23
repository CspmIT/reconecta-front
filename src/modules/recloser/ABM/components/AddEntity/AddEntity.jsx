import { TextField } from '@mui/material'
import { useEffect, useState } from 'react'

function AddEntity({ register, errors }) {
	return (
		<>
			<p className='w-full text-center text-2xl mb-3'>Entidad</p>
			<div className='w-full grid gap-3 md:grid-cols-2 lg:grid-cols-3'>
				<div className='w-full'>
					<TextField
						error={errors.name_entity ? true : false}
						type='text'
						label={`Nombre`}
						id='name_entity'
						{...register('name_entity', { required: 'El Campo es requerido' })}
						className='w-full'
						helperText={errors.name_entity && errors.name_entity.message}
						// defaultValue={editProfile ? userData.name_entity : ''}
					/>
				</div>
				<div className='w-full'>
					<TextField
						error={errors.number_entity ? true : false}
						type='text'
						label={`Numero`}
						id='name_entity'
						{...register('number_entity', { required: 'El Campo es requerido' })}
						className='w-full'
						helperText={errors.number_entity && errors.number_entity.message}
						// defaultValue={editProfile ? userData.number_entity : ''}
					/>
				</div>
				<div className='w-full'>
					<TextField
						error={errors.description_entity ? true : false}
						type='text'
						id='description_entity'
						label={`Descripción`}
						{...register('description_entity', { required: 'El Campo es requerido' })}
						className='w-full'
						helperText={errors.description_entity && errors.description_entity.message}
						// defaultValue={editProfile ? userData.number_entity : ''}
					/>
				</div>
			</div>
		</>
	)
}

export default AddEntity
