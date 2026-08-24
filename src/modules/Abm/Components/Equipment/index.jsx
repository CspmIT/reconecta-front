import { MenuItem, Radio, TextField, Tooltip } from '@mui/material'
import React from 'react'
import { FaMinusCircle } from 'react-icons/fa'

/**
 * Una fila de equipo del elemento.
 *
 * `models` llega por prop y no se pide aca: la vista lo consulta una sola vez y
 * lo reparte. Antes cada fila hacia su propio GET /ElementsModel, o sea siete
 * pedidos iguales en un elemento con siete equipos, y ademas la vista necesita
 * los modelos para saber cual de las filas es un reconectador.
 *
 * @param {boolean} showMain muestra el selector de principal (solo cuando el
 *        elemento tiene mas de un reconectador: recien ahi hay algo que elegir)
 */
const Equipment = ({ data, onChange, type, handleDeleteEquipment, models = [], showMain = false, onMain }) => {
	const handleDelete = () => {
		handleDeleteEquipment(data.id)
	}

	return (
		<div className='flex w-full gap-3 justify-start mb-3 items-center'>
			{showMain && (
				<Tooltip title='Equipo que representa a este elemento en el mapa: de él salen el estado y las mediciones'>
					<span className='flex items-center'>
						<Radio checked={!!data.is_main} onChange={() => onMain(data.id)} size='small' />
					</span>
				</Tooltip>
			)}
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
			{!data.bd_id && (
				<button type='button' onClick={handleDelete} className='text-red-500'>
					<FaMinusCircle size={25} />
				</button>
			)}
		</div>
	)
}

export default Equipment
