import { Button, MenuItem, TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import { FaLocationDot } from 'react-icons/fa6'
import MapSubstation from '../Map'
import { request } from '../../../../utils/js/request'
import { backend } from '../../../../utils/routes/app.routes'
import Swal from 'sweetalert2'

const DataBoard = ({ info }) => {
	const [clients, setClients] = useState(info.clients)
	const [clientSelected, setClientSelected] = useState([])
	const [clientStatus, setClientStatus] = useState(false)
	const [actualPat, setActualPat] = useState(null)
	const [pat, setPat] = useState(null)
	const feeds = ['No definida', 'Monofásica', 'Trifásica']
	const handleChange = (e) => {
		const selectedClient = clients.find((client) => client.id === e.target.value)
		setClientSelected(selectedClient)
		setClientStatus(selectedClient.status ? 1 : 0)
	}

	const saveStatusClient = async () => {
		try {
			const body = {
				id: clientSelected.id,
				status: clientStatus
			}
			await request(`${backend.Reconecta}/SubstationClient`, "PATCH", body)
			setClients((prevClients) =>
				prevClients.map((c) =>
					c.id === clientSelected.id
						? { ...c, status: clientStatus === 1 }
						: c
				)
			)
			setClientSelected(prev => ({ ...prev, status: clientStatus }))
			Swal.fire({
				icon: 'success',
				title: 'Se guardó correctamente',
				toast: true,
				position: 'top-end',
				showConfirmButton: false,
				timer: 1500,
			})


		} catch (e) {
			Swal.fire({
				icon: 'error',
				title: 'Ocurrió un problema al guardar el cliente',
				toast: true,
				position: 'top-end',
				showConfirmButton: false,
				timer: 1500,
			})
		}
	}

	const savePat = async () => {
		const body = {
			value: pat,
			element: info.id
		}
		try {
			await request(`${backend.Reconecta}/SubstationPat`, "POST", body)
			await getHistoryPat()
			Swal.fire({
				icon: 'success',
				title: 'Se guardó correctamente',
				toast: true,
				position: 'top-end',
				showConfirmButton: false,
				timer: 1500,
			})
		} catch (e) {
			Swal.fire({
				icon: 'error',
				title: 'Ocurrió un problema al guardar la medición',
				toast: true,
				position: 'top-end',
				showConfirmButton: false,
				timer: 1500,
			})
		}
	}

	const getPat = async () => {
		const { data } = await request(`${backend.Reconecta}/SubstationPat/${info.id}/1`, "GET")
		const actualValue = data.find(e => e.status)
		if (actualValue?.value) {
			setPat(actualValue.value)
			setActualPat(actualValue.value)
		}
	}
	useEffect(() => {
		getPat()
	}, [])
	return (
		<div className='w-full flex flex-row flex-wrap'>
			<div className='w-full md:w-1/2 flex flex-col justify-around'>
				<div className='m-2'>
					<TextField InputProps={{ readOnly: true }} className='w-full' value={`${info.name}`} label='Sub Estación' />
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
								{`${client.name} - Medidor Nº ${client.meter}`}
							</MenuItem>
						))}
					</TextField>
				</div>
				{clientSelected.length !== 0 && (
					<div className='m-2 gap-3 flex'>
						<TextField value={clientStatus} select className='w-full' label='Estado' onChange={(e => setClientStatus(e.target.value))}>
							<MenuItem value={1}>En servicio</MenuItem>
							<MenuItem value={0}>Fuera de servicio</MenuItem>
						</TextField>
						<Button disabled={clientStatus == clientSelected.status} variant='contained' color='success' size='small' className='!px-5' onClick={saveStatusClient} >Guardar</Button>
					</div>
				)}
				<div className='m-2 gap-3 flex'>
					<TextField InputLabelProps={{ shrink: pat !== null }} type='number' step className='w-full' value={pat} label='Medición PAT' onChange={(e) => setPat(e.target.value)} />
					<Button disabled={actualPat === pat} variant='contained' color='success' size='small' className='!px-5' onClick={savePat} >Guardar</Button>
				</div>
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
