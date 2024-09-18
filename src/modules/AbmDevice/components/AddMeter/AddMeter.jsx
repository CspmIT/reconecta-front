import { ListSubheader, MenuItem, TextField } from '@mui/material'
import { useState } from 'react'
import { versionMeters } from '../../utils/js/versionsMeter'

function AddMeter({ register, errors, setValue }) {
	const [nameVersion, setNameVersion] = useState('')

	const changeVersion = (value) => {
		let [id_brand, id_version] = value.split('_')
		const version = versionMeters.find((item) => item.id == id_brand)
		setValue('name_version', version?.brand || '')
		setValue('version', version?.versions.find((vers) => vers.id == id_version)?.id || '')
		setNameVersion(version?.versions.find((vers) => vers.id == id_version)?.name || '')
	}
	return (
		<>
			<div className='mt-3'>
				<p className='w-full text-center text-2xl'>Medidor</p>
			</div>
			<div className='w-full flex justify-center '>
				<div className='w-2/3 mt-3 grid gap-3 md:grid-cols-2 lg:grid-cols-2'>
					<TextField
						error={errors.nro_serie ? true : false}
						type='text'
						label='Nro Serie'
						{...register('nro_serie', { required: 'El campo es requerido' })}
						className='w-full'
						helperText={errors.nro_serie && errors.nro_serie.message}
					/>
					<div className={`w-full`}>
						<TextField
							type='text'
							label='Nombre Version'
							disabled={true}
							id='name_version'
							{...register('name_version')}
							className={`w-1/2 !text-black ${nameVersion == '' ? '!hidden' : ''}`}
						/>
						<TextField
							error={!!errors.version}
							select
							label='Version'
							id='version'
							{...register('version', {
								required: 'El campo es requerido',
								onChange: (e) => changeVersion(e.target.value),
							})}
							className={`${nameVersion === '' ? 'w-full' : 'w-1/2'}`}
							helperText={errors.version && errors.version.message}
							defaultValue={''}
						>
							<MenuItem value=''>
								<em>Versiones</em>
							</MenuItem>
							{versionMeters.flatMap((item, index) => [
								<ListSubheader key={`header_${index}`}>{item.brand}</ListSubheader>,
								...item.versions.map((version) => (
									<MenuItem key={`${item.id}_${version.id}`} value={`${item.id}_${version.id}`}>
										{version.name}
									</MenuItem>
								)),
							])}
						</TextField>
					</div>
				</div>

				{/* <div className='w-full'>
					
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
				</div> */}
			</div>
		</>
	)
}

export default AddMeter
