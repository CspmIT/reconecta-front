import { CloudUpload } from '@mui/icons-material'
import { Button, ListSubheader, MenuItem, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import AddUSer from './AddUSer'

function AddSubStationRural({ register, errors, setValue, clearErrors }) {
	const [alimentacion, setAlimentacion] = useState('')

	const potencia = [
		{ potencia: 5, alimentacion: 'mono' },
		{ potencia: 10, alimentacion: 'mono' },
		{ potencia: 16, alimentacion: 'mono' },
		{ potencia: 10, alimentacion: 'trifasico' },
		{ potencia: 16, alimentacion: 'trifasico' },
		{ potencia: 21, alimentacion: 'trifasico' },
		{ potencia: 31.5, alimentacion: 'trifasico' },
		{ potencia: 40, alimentacion: 'trifasico' },
		{ potencia: 50, alimentacion: 'trifasico' },
		{ potencia: 63, alimentacion: 'trifasico' },
		{ potencia: 80, alimentacion: 'trifasico' },
		{ potencia: 100, alimentacion: 'trifasico' },
	]
	const changeAlim = (value) => {
		setValue('type_alim', value)
		setAlimentacion(value)
	}

	const [selectedFile, setSelectedFile] = useState(null)
	const [preview, setPreview] = useState(null)

	const handleFileChange = (event) => {
		const file = event.target.files[0]
		if (file && file.type.startsWith('image/')) {
			setSelectedFile(file)
			const reader = new FileReader()
			reader.onloadend = () => {
				setPreview(reader.result)
			}
			reader.readAsDataURL(file)
		} else {
			setSelectedFile(null)
			setPreview(null)
		}
	}

	return (
		<>
			<div className='mt-3'>
				<p className='w-full text-center text-2xl'>Sub Estación Rural</p>
			</div>
			<div className='w-full mt-3 grid gap-3 md:grid-cols-2 lg:grid-cols-3'>
				<TextField
					error={errors.type_alim ? true : false}
					select
					label='Tipo de Alimentación'
					id='type_alim'
					{...register('type_alim', {
						required: 'El campo es requerido',
						onChange: (e) => changeAlim(e.target.value),
					})}
					className={`w-full`}
					helperText={errors.type_alim && errors.type_alim.message}
					defaultValue={''}
				>
					<MenuItem value=''>
						<em>Alimentación</em>
					</MenuItem>
					<MenuItem value={'mono'}>Monofasico</MenuItem>
					<MenuItem value={'trifasico'}>Trifasico</MenuItem>
				</TextField>

				<TextField
					error={errors.potencia ? true : false}
					select
					label='Potencia del Transformador'
					id='potencia'
					{...register('potencia', {
						required: 'El campo es requerido',
						onChange: (e) => setValue('potencia', e.target.value),
					})}
					className='w-full'
					helperText={errors.potencia && errors.potencia.message}
					defaultValue={''}
				>
					<MenuItem value={''}>
						<em>Potencia</em>
					</MenuItem>
					{alimentacion &&
						potencia.map((item, index) => {
							if (item.alimentacion == alimentacion) {
								return (
									<MenuItem key={index} value={item.potencia}>
										{item.potencia}
									</MenuItem>
								)
							}
						})}
				</TextField>

				<TextField
					error={errors.measurementPAT ? true : false}
					type='text'
					label='Medición de PAT'
					{...register('measurementPAT', { required: 'El campo es requerido' })}
					className='w-full'
					helperText={errors.measurementPAT && errors.measurementPAT.message}
				/>

				<TextField
					error={errors.numberMeter ? true : false}
					type='text'
					label='Numero de Medidor'
					{...register('numberMeter', { required: 'El campo es requerido' })}
					className='w-full'
					helperText={errors.numberMeter && errors.numberMeter.message}
				/>

				<div className='w-full flex flex-col items-center'>
					{preview && (
						<div className='mb-4'>
							<img src={preview} alt='Preview' className='max-w-full h-auto' />
						</div>
					)}
					<Button
						component='label'
						variant='contained'
						className={`w-1/2 ${errors.fileStation ? ' !border-solid !border-2 !border-red-500' : ''}`}
						startIcon={<CloudUpload />}
					>
						Foto
						<TextField
							error={!!errors.fileStation}
							type='file'
							accept='image/*'
							{...register('fileStation', { required: 'El campo es requerido' })}
							className='!hidden'
							onChange={handleFileChange}
							helperText={errors.fileStation && errors.fileStation.message}
						/>
					</Button>
				</div>
			</div>
			<AddUSer register={register} errors={errors} setValue={setValue} clearErrors={clearErrors} />
		</>
	)
}

export default AddSubStationRural
