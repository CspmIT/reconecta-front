import { Button, ListSubheader, MenuItem, TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { getMeter, getVersions, saveMeter } from './utils/js/actions'
import Swal from 'sweetalert2'

function AddMeter() {
	const { id, name } = useParams()
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
	const getDataEdit = async () => {
		const data = await getMeter(id)
		changeVersion(data.version)
		setValue('serial', data.serial)
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
			await saveMeter(info)
			Swal.fire({ title: 'Perfecto!', icon: 'success', text: 'Recloser agregado correctamente' })
			navigate('/Home')
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
		if (id) {
			getDataEdit()
		}
	}, [id])
	return (
		<>
			<div className='mt-3'>
				<p className='w-full text-center text-2xl'>Medidor</p>
			</div>
			<form id='formAbmRecloser' onSubmit={handleSubmit(onSubmit)} className='w-full flex flex-wrap p-7'>
				<div className='w-full flex justify-center '>
					<TextField type='number' {...register('id')} className='!hidden' value={info.id || 0} />
					<div className='w-2/3 mt-3 grid gap-3 md:grid-cols-2 lg:grid-cols-2'>
						<TextField
							error={errors.serial ? true : false}
							type='text'
							label='Nro Serie'
							{...register('serial', {
								required: 'El campo es requerido',
								onChange: (e) => {
									const infoUpdate = { ...info, serial: e.target.value }
									setInfo(infoUpdate)
								},
							})}
							className='w-full'
							helperText={errors.serial && errors.serial.message}
							defaultValue={info.serial || ''}
							value={info.serial || ''}
						/>
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
										<MenuItem className='!pl-8' key={`version-${index}`} value={version.name}>
											{version.name}
										</MenuItem>
									)),
								])}
							</TextField>
						</div>
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

export default AddMeter
