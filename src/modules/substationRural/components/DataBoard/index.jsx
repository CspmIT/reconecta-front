import { Button, MenuItem, TextField } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { request } from '../../../../utils/js/request'
import { backend } from '../../../../utils/routes/app.routes'
import Swal from 'sweetalert2'
import { getImage, saveImage } from '../../../../utils/js/minio'
import { FaCloudUploadAlt, FaSave } from "react-icons/fa";

const DataBoard = ({ info }) => {
	const fileInputRef = useRef(null)
	const [showSave, setShowSave] = useState(false)
	const [clients, setClients] = useState(info.clients)
	const [image, setImage] = useState(null)
	const [fileSave, setFileSave] = useState(null)
	const [clientSelected, setClientSelected] = useState([])
	const [clientStatus, setClientStatus] = useState(false)
	const [actualPat, setActualPat] = useState(null)
	const [pat, setPat] = useState(null)
	const feeds = ['No definida', 'Monofásica', 'Trifásica']

	const handleButtonClick = () => {
		fileInputRef.current.click() // dispara el input escondido
	}

	const handleButtonSave = async () => {
		try {
			const newNameFile = await saveImage(fileSave)
			if (newNameFile) {
				const body = {
					id: info.id,
					image: newNameFile
				}
				await request(`${backend.Reconecta}/ElementsImage`, "PATCH", body)
				Swal.fire({
					icon: 'success',
					title: 'Imagen guardada correctamente',
					toast: true,
					position: 'top-end',
					showConfirmButton: false,
					timer: 1500,
				})
				setShowSave(false)
			}
		} catch (e) {
			Swal.fire({
				icon: 'error',
				title: 'Ocurrió un error al guardar la imagen, intente nuevamente con otra',
				confirmButtonText: "Aceptar"
			})
			setShowSave(false)
		}
	}

	const handleFileChange = (event) => {
		const file = event.target.files[0]
		if (file) {
			const reader = new FileReader()
			reader.onload = (e) => {
				setImage(e.target.result)
			}
			reader.readAsDataURL(file)
			setShowSave(true)
			const imageSave = Array.from(event.target.files).shift()
			setFileSave(imageSave)
		}
	}

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
		const img = await getImage(info.image)
		setImage(img)
		const body = {
			id: info.id
		}
		const { data } = await request(`${backend.Reconecta}/SubstationPatFilter`, "POST", body)
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
		<div className='w-full flex flex-row flex-wrap pb-16'>
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
				<div className='w-full md:w-3/4 flex flex-col justify-center h-[50vh] items-center gap-y-3'>
					<div className='h-full'>
						<img src={image} className='h-full object-contain' />
					</div>
					<div className='flex gap-x-3'>
						<Button variant='contained' title='Cargar imagen' color='primary' onClick={handleButtonClick}><FaCloudUploadAlt /></Button>
						{showSave && (
							<Button variant='contained' title='Guardar imagen' color='success' onClick={handleButtonSave}><FaSave /></Button>
						)}
					</div>
					<input
						type="file"
						accept="image/*"
						ref={fileInputRef}
						onChange={handleFileChange}
						hidden
					/>

				</div>
			</div>
		</div>
	)
}

export default DataBoard
