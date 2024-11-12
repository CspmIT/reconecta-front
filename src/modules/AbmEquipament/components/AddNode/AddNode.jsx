import { MenuItem, TextField } from '@mui/material'
import { useEffect, useState } from 'react'

function AddNode({ register, errors, setValue, changeInfra, dataEdit }) {
	const [info, setInfo] = useState({
		id: 0,
		type: '',
		name: '',
		number: '',
		description: '',
	})

	const handleChange = (e) => {
		const { name, value } = e.target
		setInfo((prev) => ({
			...prev,
			[name]: value,
		}))
	}

	const handleNumberChange = (e) => {
		const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '')
		setInfo((prev) => ({
			...prev,
			number: value,
		}))
		setValue('number', value)
	}

	const changeType = (status) => {
		changeInfra(status)
	}

	useEffect(() => {
		if (dataEdit) {
			changeType(dataEdit.type)
			for (const [key, value] of Object.entries(dataEdit)) {
				setValue(key == 'id' ? 'id_node' : key, value || '')
			}
			setInfo(dataEdit)
		}
	}, [dataEdit])
	const typeDevice = [
		{ title: 'Nodo de Reconexión', value: 'Reconectador' },
		{ title: 'Nodo de Estacion Urbana', value: 'Sub estación urbana' },
		{ title: 'Nodo de Estacion Rural', value: 'Sub estación rural' },
	]
	return (
		<>
			<p className='w-full text-center text-2xl mb-3'>Infraestructura</p>
			<div className='w-full flex justify-center mb-5'>
				<TextField
					select
					error={!!errors.type}
					label='Tipo de Infraestructura'
					{...register('type', { required: 'El Campo es requerido' })}
					onChange={(e) => {
						changeType(e.target.value)
						handleChange(e)
					}}
					className='w-full md:w-1/2'
					value={info.type || ''}
					helperText={errors.type?.message}
					name='type'
				>
					<MenuItem key={0} value=''>
						<em>Seleccionar tipo</em>
					</MenuItem>
					{typeDevice.map((item, index) => {
						return (
							<MenuItem key={index} value={item.value}>
								{item.title}
							</MenuItem>
						)
					})}
				</TextField>
			</div>

			<div className='w-full grid gap-3 md:grid-cols-2 lg:grid-cols-3'>
				<TextField type='number' {...register('id_node')} className='!hidden' value={info.id || ''} />
				<div className='w-full'>
					<TextField
						error={!!errors.name}
						type='text'
						label='Nombre'
						{...register('name', { required: 'El Campo es requerido' })}
						className='w-full'
						helperText={errors.name?.message}
						value={info.name || ''}
						onChange={handleChange}
						name='name'
					/>
				</div>
				<div className='w-full'>
					<TextField
						error={!!errors.number}
						type='text'
						label='Matricula'
						disabled={!!dataEdit.number}
						{...register('number', {
							required: 'El Campo es requerido',
							pattern: {
								value: /^[A-Z0-9]*$/,
								message: 'Solo se permiten letras mayúsculas y números',
							},
						})}
						className='w-full'
						helperText={errors.number?.message}
						onChange={handleNumberChange}
						value={info.number || ''}
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
						value={info.description || ''}
						onChange={handleChange}
						name='description'
					/>
				</div>
			</div>
		</>
	)
}

export default AddNode
