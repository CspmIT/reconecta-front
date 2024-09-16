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

	const changeType = (status) => {
		changeInfra(status)
	}

	useEffect(() => {
		if (dataEdit) {
			changeType(dataEdit.type)
			for (const item of Object.keys(dataEdit)) {
				if (item == 'id') {
					setValue('id_node', dataEdit[item])
				} else {
					setValue(item, dataEdit[item])
				}
			}
			setInfo(dataEdit)
		}
	}, [dataEdit])

	return (
		<>
			<p className='w-full text-center text-2xl mb-3'>Infraestructura</p>
			<div className='w-full flex justify-center mb-5'>
				<TextField
					select
					error={errors.type ? true : false}
					label={`Tipo de Infraestructura`}
					{...register('type', { required: 'El Campo es requerido' })}
					onChange={(e) => {
						changeType(e.target.value)
						handleChange(e)
					}}
					className='w-1/2'
					value={info.type}
					helperText={errors.type && errors.type.message}
					name='type'
				>
					<MenuItem key={0} value={''}>
						<em>Seleccionar tipo</em>
					</MenuItem>
					<MenuItem key={1} value={1}>
						Nodo de Reconexión
					</MenuItem>
					{/* <MenuItem key={2} value={2}>
						Sub Estación Rural
					</MenuItem>
					<MenuItem key={3} value={3}>
						Sub Estación Urbana
					</MenuItem> */}
				</TextField>
			</div>

			<div className='w-full grid gap-3 md:grid-cols-2 lg:grid-cols-3'>
				<TextField type='number' {...register('id_node')} className='!hidden' defaultValue={info.id} />
				<div className='w-full'>
					<TextField
						error={errors.name ? true : false}
						type='text'
						label={`Nombre`}
						{...register('name', { required: 'El Campo es requerido' })}
						className='w-full'
						helperText={errors.name && errors.name.message}
						value={info.name}
						onChange={handleChange}
						name='name'
					/>
				</div>
				<div className='w-full'>
					<TextField
						error={errors.number ? true : false}
						type='text'
						label={`matricula`}
						disabled={Boolean(dataEdit.number)}
						{...register('number', {
							required: 'El Campo es requerido',
							pattern: {
								value: /^[A-Z0-9]*$/,
								message: 'Solo se permiten letras mayúsculas y números',
							},
						})}
						className='w-full'
						helperText={errors.number && errors.number.message}
						onChange={(e) => {
							const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '')
							setInfo((prev) => ({
								...prev,
								number: value,
							}))
						}}
						value={info.number}
						name='number'
					/>
				</div>
				<div className='w-full'>
					<TextField
						error={errors.description ? true : false}
						type='text'
						label={`Descripción`}
						{...register('description')}
						className='w-full'
						helperText={errors.description && errors.description.message}
						value={info.description}
						onChange={handleChange}
						name='description'
					/>
				</div>
			</div>
		</>
	)
}

export default AddNode
