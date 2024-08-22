import { ListSubheader, MenuItem, TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import { getRecloser } from './actions'

function AddRecloser({ register, errors, setValue, dataEdit }) {
	const [nameVersion, setnameVersion] = useState('')
	const [info, setInfo] = useState([])
	const [versionSelected, setVersionSelected] = useState('')
	const versiones = [
		{ id: 1, brand: 'NOJA', version: 'RC_01' },
		{ id: 2, brand: 'NOJA', version: 'RC_10' },
		{ id: 3, brand: 'COOPER', version: 'f4' },
		{ id: 4, brand: 'COOPER', version: 'f5' },
		{ id: 5, brand: 'COOPER', version: 'f6' },
		{ id: 6, brand: 'ABM', version: '1' },
	]
	const changeVersion = (value) => {
		const version = versiones.find((item) => item.version == value)
		setValue('version', value)
		setValue('brand', version?.brand || '')
		setnameVersion(version?.brand || '')
		setVersionSelected(value)
	}
	const [erroresStatus, setErroresStatus] = useState(errors)
	useEffect(() => {
		setErroresStatus(errors)
	}, [errors])
	useEffect(() => {
		if (dataEdit) {
			setInfo(dataEdit)
		}
	}, [dataEdit])

	useEffect(() => {
		if (info.length > 0) {
			for (const item of Object.keys(info[0])) {
				setValue(item, info[0][item])
				if (item === 'version') {
					changeVersion(info[0][item])
				}
			}
		}
	}, [info])

	return (
		<>
			<div className='mt-3'>
				<p className='w-full text-center text-2xl'>Reconectador</p>
			</div>
			<div className='w-full mt-3 grid gap-3 md:grid-cols-2 lg:grid-cols-3'>
				<div className='w-full'>
					<TextField
						error={erroresStatus.Nro_Serie ? true : false}
						type='text'
						label='Nro Serie'
						{...register('Nro_Serie', { required: 'El campo es requerido' })}
						className='w-full'
						helperText={erroresStatus.Nro_Serie && erroresStatus.Nro_Serie.message}
						defaultValue={info[0]?.Nro_Serie || ''}
					/>
				</div>
				<div className='w-full'>
					<TextField
						type='text'
						label='Nombre Version'
						disabled={true}
						id='brand'
						{...register('brand')}
						className={`w-1/2 !text-black ${nameVersion == '' ? '!hidden' : ''}`}
						defaultValue={info[0]?.brand || ''}
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
						className={`${nameVersion === '' ? 'w-full' : 'w-1/2'}`}
						helperText={erroresStatus.version && erroresStatus.version.message}
						value={versionSelected}
					>
						<MenuItem value=''>
							<em>Versiones</em>
						</MenuItem>
						<ListSubheader>NOJA</ListSubheader>
						<MenuItem value={'RC_01'}>RC_01</MenuItem>
						<MenuItem value={'RC_10'}>RC_10</MenuItem>
						<ListSubheader>COOPER</ListSubheader>
						<MenuItem value={'f4'}>f4</MenuItem>
						<MenuItem value={'f5'}>f5</MenuItem>
						<MenuItem value={'f6'}>f6</MenuItem>
						<ListSubheader>ABM</ListSubheader>
						<MenuItem value={'1'}>1</MenuItem>
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
