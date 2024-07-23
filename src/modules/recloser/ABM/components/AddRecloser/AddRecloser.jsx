import { ListSubheader, MenuItem, TextField } from '@mui/material'
import { useEffect, useState } from 'react'

function AddRecloser({ register, errors, setValue }) {
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
				<p className='w-full text-center text-2xl'>Activo</p>
			</div>
			<div className='w-full mt-3 grid gap-3 md:grid-cols-2 lg:grid-cols-3'>
				<div className='w-full'>
					<TextField
						error={erroresStatus.nro_serie ? true : false}
						type='text'
						label='Nro Serie'
						{...register('nro_serie', { required: 'El campo es requerido' })}
						className='w-full'
						helperText={erroresStatus.nro_serie && erroresStatus.nro_serie.message}
					/>
				</div>
				<div className='w-full'>
					<TextField
						type='text'
						label='Nombre Version'
						disabled={true}
						id='name_version'
						{...register('name_version')}
						className={`w-1/2 !text-black ${nameVersion == '' ? '!hidden' : ''}`}
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
						<ListSubheader>NOJA</ListSubheader>
						<MenuItem value={1}>01</MenuItem>
						<MenuItem value={2}>10</MenuItem>
						<ListSubheader>COOPER</ListSubheader>
						<MenuItem value={3}>4</MenuItem>
						<MenuItem value={4}>5</MenuItem>
						<MenuItem value={5}>6</MenuItem>
						<ListSubheader>ABM</ListSubheader>
						<MenuItem value={6}>1</MenuItem>
					</TextField>
				</div>
				<div className='w-full'>
					<TextField
						error={erroresStatus.config ? true : false}
						select
						label='Configuración'
						id='config'
						{...register('config', {
							required: 'El campo es requerido',
							onChange: (e) => setValue('config', e.target.value),
						})}
						className='w-full'
						helperText={erroresStatus.config && erroresStatus.config.message}
						defaultValue={''}
					>
						<MenuItem value={''}>
							<em>Configuración</em>
						</MenuItem>
						<MenuItem value={1}>Común</MenuItem>
						<MenuItem value={2}>Especial</MenuItem>
					</TextField>
				</div>
			</div>
		</>
	)
}

export default AddRecloser
