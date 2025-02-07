import { MenuItem, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { FaMinusCircle } from 'react-icons/fa'
import { request } from '../../../../utils/js/request'
import { backend } from '../../../../utils/routes/app.routes'

const Equipment = ({ data, onChange, type, handleDeleteEquipment }) => {
	const handleDelete = () => {
		handleDeleteEquipment(data.id)
	}
	const [models, setModels] = useState([])
	const getModels = async () => {
		const { data } = await request(`${backend.Reconecta}/ElementsModel`, 'GET')
		setModels(data)
	}
	useEffect(() => {
		getModels()
	}, [])
	return (
		<div className='flex w-full gap-3 justify-start mb-3'>
			<TextField
				select
				className='w-full md:w-1/6'
				label='Modelo'
				value={data.id_model}
				onChange={(e) => onChange('id_model', e.target.value)}
			>
				<MenuItem key={0} value=''>
					<em>Seleccionar modelo</em>
				</MenuItem>
				{models.map((model) => (
					<MenuItem key={model.id} value={model.id}>
						{model.name} {model.brand}
					</MenuItem>
				))}
			</TextField>

			<TextField
				className='w-full md:w-1/4'
				label='Nro Serie'
				value={data.serial}
				onChange={(e) => onChange('serial', e.target.value)}
			/>
			<TextField
				className='w-full md:w-1/4'
				label='Observacion'
				value={data.observation}
				onChange={(e) => onChange('observation', e.target.value)}
			/>
			{type === 1 && (
				<TextField
					select
					className='w-full md:w-1/4'
					label='Configuración'
					value={data.configuration}
					onChange={(e) => onChange('configuration', e.target.value)}
				>
					<MenuItem key={1} value='1'>
						Estandar
					</MenuItem>
					<MenuItem key={2} value='2'>
						Especial
					</MenuItem>
				</TextField>
			)}
			<button type='button' onClick={handleDelete} className='text-red-500'>
				<FaMinusCircle size={25} />
			</button>
		</div>
	)
}

export default Equipment
