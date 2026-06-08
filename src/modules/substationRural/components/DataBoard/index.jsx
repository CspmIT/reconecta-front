import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, TextField } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { request } from '../../../../utils/js/request'
import { backend } from '../../../../utils/routes/app.routes'
import Swal from 'sweetalert2'
import { getImage, saveImage } from '../../../../utils/js/minio'
import { FaCloudUploadAlt, FaSave, FaRegImage, FaPlus, FaTrash } from "react-icons/fa";

const DataBoard = ({ info, onPatSaved }) => {
	const fileInputRef = useRef(null)
	const [showSave, setShowSave] = useState(false)
	const [clients, setClients] = useState(info.clients)
	const [image, setImage] = useState(null)
	const [fileSave, setFileSave] = useState(null)
	const [clientSelected, setClientSelected] = useState(null)
	const [clientStatus, setClientStatus] = useState(false)
	const [actualPat, setActualPat] = useState(null)
	const [pat, setPat] = useState(null)
	const [showAddClient, setShowAddClient] = useState(false)
	const [newClient, setNewClient] = useState({ name: '', meter: '', account: '' })
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

	const closeAddClient = () => {
		setShowAddClient(false)
		setNewClient({ name: '', meter: '', account: '' })
	}

	const addClient = async () => {
		try {
			const body = {
				name: newClient.name,
				meter: newClient.meter || null,
				account: newClient.account || null,
				id_element: info.id
			}
			const { data } = await request(`${backend.Reconecta}/SubstationClient`, "POST", body)
			setClients((prevClients) => [...prevClients, data.data])
			setNewClient({ name: '', meter: '', account: '' })
			setShowAddClient(false)
			Swal.fire({
				icon: 'success',
				title: 'Cliente agregado correctamente',
				toast: true,
				position: 'top-end',
				showConfirmButton: false,
				timer: 1500,
			})
		} catch (e) {
			Swal.fire({
				icon: 'error',
				title: 'Ocurrió un problema al agregar el cliente',
				toast: true,
				position: 'top-end',
				showConfirmButton: false,
				timer: 1500,
			})
		}
	}

	const deleteClient = async () => {
		const result = await Swal.fire({
			icon: 'warning',
			title: '¿Eliminar cliente?',
			text: `Se eliminará "${clientSelected.name}" de esta subestación`,
			showCancelButton: true,
			confirmButtonText: 'Eliminar',
			cancelButtonText: 'Cancelar',
			confirmButtonColor: '#d33',
		})
		if (!result.isConfirmed) return
		try {
			await request(`${backend.Reconecta}/SubstationClient`, "DELETE", { id: clientSelected.id })
			setClients((prevClients) => prevClients.filter((c) => c.id !== clientSelected.id))
			setClientSelected(null)
			setClientStatus(false)
			Swal.fire({
				icon: 'success',
				title: 'Cliente eliminado correctamente',
				toast: true,
				position: 'top-end',
				showConfirmButton: false,
				timer: 1500,
			})
		} catch (e) {
			Swal.fire({
				icon: 'error',
				title: 'Ocurrió un problema al eliminar el cliente',
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
			onPatSaved?.()
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

	useEffect(() => {
		if (clients.length === 1) {
			const onlyClient = clients[0]
			setClientSelected(onlyClient)
			setClientStatus(onlyClient.status ? 1 : 0)
		}
	}, [clients])
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
				<div className='m-2 gap-3 flex'>
					<TextField select className='w-full' value={clientSelected?.id || ''} onChange={handleChange} label='Clientes'>
						<MenuItem value=''>Seleccione un cliente</MenuItem>
						{clients.map((client, index) => (
							<MenuItem key={index} value={client.id}>
								{client.name}
							</MenuItem>
						))}
					</TextField>
					<TextField
						InputProps={{ readOnly: true }}
						InputLabelProps={{ shrink: true }}
						className='w-full'
						value={clientSelected?.meter ?? ''}
						label='Nº de medidor'
					/>
					<TextField
						InputProps={{ readOnly: true }}
						InputLabelProps={{ shrink: true }}
						className='w-full'
						value={clientSelected?.account ?? ''}
						label='Cuenta'
					/>
					<Button variant='contained' title='Agregar cliente' color='primary' className='!px-5' onClick={() => setShowAddClient(true)}><FaPlus /></Button>
				</div>
				{clientSelected?.id && (
					<div className='m-2 gap-3 flex'>
						<TextField value={clientStatus} select className='w-full' label='Estado' onChange={(e => setClientStatus(e.target.value))}>
							<MenuItem value={1}>En servicio</MenuItem>
							<MenuItem value={0}>Fuera de servicio</MenuItem>
						</TextField>
						<Button disabled={clientStatus == clientSelected.status} variant='contained' color='success' size='small' className='!px-5' onClick={saveStatusClient} >Guardar</Button>
						<Button variant='contained' color='error' size='small' title='Eliminar cliente' className='!px-5' onClick={deleteClient}><FaTrash /></Button>
					</div>
				)}
				<div className='m-2 gap-3 flex'>
					<TextField InputLabelProps={{ shrink: pat !== null }} type='number' step className='w-full' value={pat} label='Medición PAT' onChange={(e) => setPat(e.target.value)} />
					<Button disabled={!pat || Number(pat) === Number(actualPat)} variant='contained' color='success' size='small' className='!px-5' onClick={savePat} >Guardar</Button>
				</div>
			</div>
			<div className='w-full md:w-1/2 flex flex-row flex-wrap justify-center'>
				<div className='w-full md:w-3/4 flex flex-col justify-center h-[50vh] items-center gap-y-3'>
					<div className='h-full'>
						{image ? (
							<img src={image} className='h-full object-contain border-2 border-yellow-600' />
						) : (
							<div className='h-full min-h-[200px] flex flex-col items-center justify-center gap-y-3 px-8 text-center text-gray-400 dark:text-gray-500'>
								<FaRegImage size={56} className='opacity-60' />
								<span className='text-sm font-medium'>No hay imagen cargada</span>
							</div>
						)}
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
			<Dialog open={showAddClient} onClose={closeAddClient} maxWidth='xs' fullWidth>
				<DialogTitle>Agregar cliente</DialogTitle>
				<DialogContent className='!pt-2'>
					<div className='flex flex-col gap-3 mt-2'>
						<TextField
							label='Nombre del cliente *'
							value={newClient.name}
							onChange={(e) => setNewClient((prev) => ({ ...prev, name: e.target.value }))}
							autoFocus
						/>
						<TextField
							label='Nº de medidor'
							value={newClient.meter}
							onChange={(e) => setNewClient((prev) => ({ ...prev, meter: e.target.value }))}
						/>
						<TextField
							label='Cuenta'
							type='number'
							value={newClient.account}
							onChange={(e) => setNewClient((prev) => ({ ...prev, account: e.target.value }))}
						/>
					</div>
				</DialogContent>
				<DialogActions>
					<Button onClick={closeAddClient}>Cancelar</Button>
					<Button disabled={!newClient.name.trim()} variant='contained' color='success' onClick={addClient}>Agregar</Button>
				</DialogActions>
			</Dialog>
		</div>
	)
}

export default DataBoard
