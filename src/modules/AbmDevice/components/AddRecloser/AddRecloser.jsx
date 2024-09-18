import { Button, ListSubheader, MenuItem, TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { getRecloser, getVersions, saveRecloser } from '../../utils/js/recloser'

function AddRecloser({ id }) {
	const navigate = useNavigate()
	const [nameVersion, setnameVersion] = useState('')
	const [info, setInfo] = useState({})
	const [versionSelected, setVersionSelected] = useState('')
	const [versiones, setVersiones] = useState([])
	const listVersion = async () => {
		const version = await getVersions()
		setVersiones(version)
	}
	const changeVersion = (value) => {
		const selectedVersion = versiones.find((item) => item.version.some((ver) => ver.name === value))
		const version = selectedVersion?.version.find((ver) => ver.name === value)
		setValue('version', value)
		if (version) {
			setValue('brand', selectedVersion?.name)
			setInfo((prev) => ({
				...prev,
				brand: selectedVersion.name,
				version: value,
			}))
		}
		setnameVersion(selectedVersion?.name || '')
		setVersionSelected(value)
	}
	const getDataEdit = async (id) => {
		const data = await getRecloser(id)
		changeVersion(data.version)
		setValue('serial', data.serial)
		setValue('config', data.config)
		setValue('id', data.id)
		setInfo(data)
	}

	const {
		register,
		setValue,
		formState: { errors },
		handleSubmit,
	} = useForm()

	const onSubmit = async (info) => {
		try {
			await saveRecloser(info)
			Swal.fire({ title: 'Perfecto!', icon: 'success', text: 'Recloser agregado correctamente' })
			navigate(info.id_recloser !== 0 ? '/tabs' : '/Home')
		} catch (e) {
			Swal.fire({
				title: '¡Atención!',
				text: e.message,
				icon: 'warning',
			})
		}
	}
	useEffect(() => {
		listVersion()
	}, [])
	useEffect(() => {
		if (id && versiones) {
			getDataEdit(id)
		}
	}, [id, versiones])
	return (
		<>
			<div className='mt-3'>
				<p className='w-full text-center text-2xl'>Reconectador</p>
			</div>
			<form id='formAbmRecloser' onSubmit={handleSubmit(onSubmit)} className='w-full flex flex-wrap p-7'>
				<div className='w-full mt-3 grid gap-3 md:grid-cols-2 lg:grid-cols-3'>
					<TextField type='number' {...register('id')} className='!hidden' value={info.id || 0} />
					<div className='w-full'>
						<TextField
							error={!!errors.serial}
							type='text'
							label='Nro Serie'
							{...register('serial', { required: 'El campo es requerido' })}
							className='w-full'
							helperText={errors.serial?.message}
							onChange={(e) => {
								setInfo((prev) => ({
									...prev,
									serial: e.target.value,
								}))
								register('serial').onChange(e)
							}}
							value={info.serial || ''}
						/>
					</div>
					<div className='w-full'>
						<TextField
							type='text'
							label='Nombre Version'
							disabled
							id='brand'
							{...register('brand')}
							className={`w-1/2 !text-black ${nameVersion === '' ? '!hidden' : ''}`}
							value={info.brand || ''}
						/>
						<TextField
							error={!!errors.version}
							select
							label='Versiones'
							id='version'
							{...register('version', {
								required: 'El campo es requerido',
								onChange: (e) => changeVersion(e.target.value),
							})}
							className={nameVersion === '' ? 'w-full' : 'w-1/2'}
							helperText={errors.version?.message}
							value={versionSelected}
						>
							<MenuItem value=''>
								<em>Versiones</em>
							</MenuItem>
							{versiones.map((brand, index2) => [
								<ListSubheader key={`brand-${index2}`}>{brand.name}</ListSubheader>,
								...brand.version.map((version, index) => (
									<MenuItem key={`version-${index}`} value={version.name}>
										{version.name}
									</MenuItem>
								)),
							])}
						</TextField>
					</div>
					<div className='w-full'>
						<TextField
							error={!!errors.config}
							select
							label='Configuración'
							id='config'
							{...register('config', { required: 'El campo es requerido' })}
							onChange={(e) => {
								setInfo((prev) => ({
									...prev,
									config: e.target.value,
								}))
								register('config').onChange(e)
							}}
							className='w-full'
							helperText={errors.config?.message}
							value={info.config || ''}
						>
							<MenuItem value=''>
								<em>Configuración</em>
							</MenuItem>
							<MenuItem value={1}>Común</MenuItem>
							<MenuItem value={2}>Especial</MenuItem>
						</TextField>
					</div>
				</div>
				<div className='w-full flex justify-center mt-5'>
					<Button type='submit' variant='contained'>
						Guardar
					</Button>
				</div>
			</form>
		</>
	)
}

export default AddRecloser
