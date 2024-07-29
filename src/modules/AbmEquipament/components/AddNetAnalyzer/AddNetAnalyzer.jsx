import { ListSubheader, MenuItem, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'

const AddNetAnalyzer = ({ register, errors, setValue }) => {
	const [nameVersion, setnameVersion] = useState('')
	const versiones = [
		{ id: 1, recloser: 'NOJA', version: '01' },
		{ id: 2, recloser: 'NOJA', version: '10' },
		{ id: 3, recloser: 'COOPER', version: '4' },
		{ id: 4, recloser: 'COOPER', version: '5' },
		{ id: 5, recloser: 'COOPER', version: '6' },
		{ id: 6, recloser: 'ABM', version: '1' },
	]
	const changeVersion = (value) => {
		const version = versiones.find((item) => item.id == value)
		setValue('name_version', version?.recloser || '')
		setValue('version', version?.id || '')
		setnameVersion(version?.recloser || '')
	}
	const [erroresStatus, setErroresStatus] = useState(errors)
	useEffect(() => {
		setErroresStatus(errors)
	}, [errors])
	return (
		<>
			<div className='mt-3'>
				<p className='w-full text-center text-2xl'>Analizador de red</p>
			</div>
			<div className='w-full flex flex-row'>
				<TextField
					error={erroresStatus.nro_serie ? true : false}
					type='text'
					label='Nombre'
					{...register('name', { required: 'El campo es requerido' })}
					className='w-full'
					helperText={erroresStatus.nro_serie && erroresStatus.nro_serie.message}
				/>
				<TextField
					error={erroresStatus.version ? true : false}
					select
					label='Versiones'
					id='version'
					{...register('version', {
						required: 'El campo es requerido',
						onChange: (e) => changeVersion(e.target.value),
					})}
					className={`${nameVersion == '' ? 'w-full' : 'w-1/2'}`}
					helperText={erroresStatus.version && erroresStatus.version.message}
					defaultValue={''}
				>
					<MenuItem value=''>
						<em>Versiones</em>
					</MenuItem>
					<ListSubheader>POWERMETER</ListSubheader>
					<MenuItem value={1}>Smart</MenuItem>
					<ListSubheader>SACI</ListSubheader>
					<MenuItem value={3}>-</MenuItem>
				</TextField>
				<TextField
					error={erroresStatus.version ? true : false}
					select
					label='Conexión'
					id='conection'
					{...register('conection', {
						required: 'El campo es requerido',
						onChange: (e) => changeVersion(e.target.value),
					})}
					className={`${nameVersion == '' ? 'w-full' : 'w-1/2'}`}
					helperText={erroresStatus.version && erroresStatus.version.message}
					defaultValue={''}
				>
					<MenuItem value=''>
						<em>Conexiones</em>
					</MenuItem>
					<MenuItem value={1}>Energía</MenuItem>
					<MenuItem value={2}>Externo</MenuItem>
				</TextField>
				<TextField
					error={erroresStatus.nro_serie ? true : false}
					type='text'
					label='Nro de serie'
					{...register('nro_serie', { required: 'El campo es requerido' })}
					className='w-full'
					helperText={erroresStatus.nro_serie && erroresStatus.nro_serie.message}
				/>
			</div>
		</>
	)
}

export default AddNetAnalyzer
