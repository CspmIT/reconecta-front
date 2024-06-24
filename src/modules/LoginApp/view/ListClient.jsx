import React, { useEffect, useState } from 'react'
import { Button, Card, MenuItem, Select } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { getProduct, logeoApp, schemaName } from '../utils/login'
import Cookies from 'js-cookie'
import { storage } from '../utils/storage'
import LogoBlanco from '../assets/img/Logo_Cooptech.png'
function ListClients() {
	const usuario = storage.get('usuario')
	const [optionsSelect, setOptionsSelect] = useState([])
	const [valueSelect, setValueSelect] = useState('')
	const navigate = useNavigate()
	const searchClients = async () => {
		const options = []
		for (const key in usuario.cliente) {
			options.push(usuario.cliente[key])
		}
		setValueSelect(options[0].id)
		setOptionsSelect(options)
	}
	useEffect(() => {
		searchClients()
	}, [])

	const selectClient = async (data) => {
		const user = storage.get('usuario')
		user.cliente.map((element) => {
			if (element.id === data) {
				element.selected = true
			} else {
				element.selected = false
			}
			return element
		})
		storage.set('usuario', user)
		storage.set('usuarioCooptech', {
			token: user.token,
			id_user: user.id,
			cliente: user.cliente.find((item) => item.selected === true),
		})
		const product = await getProduct('Oficina Virtual', data, user.id)
		if (!product) {
			throw new Error('No se encontro productos relacionados con el usuario')
		}
		const schema = await schemaName(data, product.id_product)
		const token = await logeoApp(usuario.id, schema)
		navigate(`/LoginCooptech/${token.token}`)
	}
	const handleChangeSelect = (event) => {
		setValueSelect(event.target.value)
	}
	useEffect(() => {
		const cookies = Cookies.get('token')
		const localStorage = storage.get('usuario')
		if (cookies && localStorage) {
			navigate(`/`)
		}
	}, [])
	return (
		<div
			className={`min-h-[100vh] w-full flex flex-col justify-center items-center  bg-gray-300 bg-cover !bg-[url('src/views/LoginApp/assets/img/FondoGris.jpg')]`}
		>
			<Card className='max-md:!min-w-[95vw] !min-w-[50vw] w-1/3 !max-w-[85vw] !min-h-[50vh] p-8 bg-white !rounded-2xl !shadow-lg !shadow-gray-400  flex justify-center items-center flex-col '>
				<h1 className='mb-5'>Seleccionar una Organización</h1>
				<Select
					className='!bg-[#bbb9b8b3]/[.7] !text-black w-full'
					id='selectClient'
					value={valueSelect}
					onChange={handleChangeSelect}
				>
					{optionsSelect.map((item) => {
						return (
							<MenuItem key={item.id} value={item.id}>
								{item.name}
							</MenuItem>
						)
					})}
				</Select>
				<Button onClick={() => selectClient(valueSelect)} variant='contained' sx={{ marginTop: 3 }}>
					Entrar
				</Button>
			</Card>
			<img className='absolute bottom-5 right-5 max-w-52 max-md:max-w-36' src={LogoBlanco} alt='logo Cooptech' />
		</div>
	)
}

export default ListClients
