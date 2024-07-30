import { MenuItem, TextField } from '@mui/material'
import React from 'react'

function AddSubStationUrban({ register, errors, setValue }) {
	return (
		<>
			<div className='mt-3'>
				<p className='w-full text-center text-2xl'>Sub Estacion Urbana</p>
			</div>
			<div className='w-full mt-3 grid gap-3 md:grid-cols-2 lg:grid-cols-3'>
				<div className='w-full'>
					<TextField
						error={errors.powerTrans ? true : false}
						type='text'
						label='Potencia del transformador'
						{...register('powerTrans', { required: 'El campo es requerido' })}
						className='w-full'
						helperText={errors.powerTrans && errors.powerTrans.message}
					/>
				</div>
			</div>
		</>
	)
}

export default AddSubStationUrban
