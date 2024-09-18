import { Button, TextField } from '@mui/material'
import React from 'react'
import { FaLocationDot } from 'react-icons/fa6'

const DataBoard = ({ info }) => {
	return (
		<div className='w-full flex flex-row flex-wrap'>
			<div className='w-full md:w-1/2 flex flex-col justify-around'>
				<div className='m-2'>
					<TextField InputProps={{ readOnly: true }} className='w-full' value={info.name_station || ''} label='Sub Estación' />
				</div>
				<div className='m-2'>
					<TextField InputProps={{ readOnly: true }} className='w-full' value={info.potencia_transformador || ''} label='Potencia del transformador' />
				</div>
				<div className='m-2'>
					<TextField InputProps={{ readOnly: true }} className='w-full' value={info.power || ''} label='Tipo de alimentación' />
				</div>
				<div className='m-2'>
					<TextField InputProps={{ readOnly: true }} className='w-full' value={info.num_meter || ''} label='Número de Medidor' />
				</div>
				<div className='m-2'>
					<TextField InputProps={{ readOnly: true }} className='w-full' value={info.measurement_pat || ''} label='Medición PAT' />
				</div>
				<div className='m-2'>
					<TextField InputProps={{ readOnly: true }} className='w-full' value={info.user || ''} label='Nombre del cliente relacionado' />
				</div>
			</div>
			<div className='w-full md:w-1/2 flex flex-row flex-wrap justify-center'>
				<div className='w-full flex flex-row justify-center h-[50vh] items-center'>
					{info.name_photo && <img className='h-full' src={`https://app.coopmorteros.coop/public/images/event_station_rural/${info.name_photo}`} alt='Imagen reconectador' />}
				</div>
				<div className='w-full flex flex-row justify-center my-3'>
					<Button variant='contained' color='info' target='_blank' href={`https://www.google.com.ar/maps/dir/@${info.lat_point},${info.lng_point},17z/${info.lat_point},${info.lng_point}/`}>
						<FaLocationDot className='mr-2' />
						Ubicación
					</Button>
				</div>
			</div>
		</div>
	)
}

export default DataBoard
