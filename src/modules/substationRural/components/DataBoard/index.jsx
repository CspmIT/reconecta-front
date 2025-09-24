import { Button, MenuItem, TextField } from '@mui/material'
import { useState } from 'react'
import { FaLocationDot } from 'react-icons/fa6'
import MapSubstation from '../Map'

const DataBoard = ({ info }) => {
	const { clients } = info
	const [clientSelected, setClientSelected] = useState([])
	const feeds = ['No definida', 'Monofásica', 'Trifásica']
	const handleChange = (e) => {
		const selectedClient = clients.find((client) => client.id === e.target.value)
		setClientSelected(selectedClient)
	}
	return (
		<div className='w-full flex flex-row flex-wrap'>
			<div className='w-full md:w-1/2 flex flex-col justify-around'>
				<div className='m-2'>
					<TextField InputProps={{ readOnly: true }} className='w-full' value={`${info.name} - ${info.description}`} label='Sub Estación' />
				</div>
				<div className='m-2'>
					<TextField InputProps={{ readOnly: true }} className='w-full' value={info.power || ''} label='Potencia del transformador' />
				</div>
				<div className='m-2'>
					<TextField InputLabelProps={{ shrink: true }} InputProps={{ readOnly: true }} className='w-full' value={feeds[info.feed]} label='Tipo de alimentación' />
				</div>
				<div className='m-2'>
					<TextField select className='w-full' onChange={handleChange} label='Clientes'>
						<MenuItem value=''>Seleccione un cliente</MenuItem>
						{clients.map((client, index) => (
							<MenuItem key={index} value={client.id}>
								{client.name}
							</MenuItem>
						))}
					</TextField>
				</div>
				<div className='m-2'>
					<TextField InputProps={{ readOnly: true }} className='w-full' value={clientSelected?.meter || ''} label='Número de Medidor' />
				</div>
				{/* <div className='m-2'>
					<TextField InputProps={{ readOnly: true }} className='w-full' value={clientSelected?.pat || ''} label='Medición PAT' />
				</div> */}
			</div>
			<div className='w-full md:w-1/2 flex flex-row flex-wrap justify-center'>
				<div className='w-full md:w-3/4 flex flex-row justify-center h-[50vh] items-center'>
					<MapSubstation element={info} />
				</div>
				<div className='w-full flex flex-row justify-center my-3'>
					<Button variant='contained' color='info' target='_blank' href={`https://www.google.com.ar/maps/dir/@${info.lat},${info.lon},17z/${info.lat},${info.lon}/`}>
						<FaLocationDot className='mr-2' />
						Ubicación
					</Button>
				</div>
			</div>
		</div>
	)
}

export default DataBoard
