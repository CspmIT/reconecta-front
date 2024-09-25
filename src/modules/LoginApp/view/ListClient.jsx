import React, { useEffect, useState } from 'react'
import { Button, Card, MenuItem, Select } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { getProduct, logeoApp, schemaName } from '../utils/login'
import { storage } from '../utils/storage'
import LogoBlanco from '../assets/img/Logo_Cooptech.png'
import styles from '../utils/style.module.css'
import { getData } from '../../../storage/cookies-store'
import { backend } from '../../../utils/routes/app.routes'
import { request } from '../../../utils/js/request'
import { requestAuth } from '../utils/requesLogin'
import LoaderComponent from '../../../components/Loader'
function ListClients() {
	const { action } = useParams()
	const usuario = storage.get('usuario')
	const usuarioCooptech = storage.get('usuarioCooptech')
	const [optionsSelect, setOptionsSelect] = useState(null)
	const [valueSelect, setValueSelect] = useState('')
	const [loading, setLoading] = useState(true)
	const navigate = useNavigate()
	const searchClients = async () => {
		setLoading(true)
		const options = []
		if (!usuarioCooptech) {
			setLoading(false)
			navigate(`/`)
		}
		const url = `${backend.Cooptech}/listClientsxUserxApp?id_user=${usuarioCooptech.id_user}&name_product=${import.meta.env.VITE_APP_NAME}`
		const responseData = await requestAuth(url, 'GET')
		for (const key in responseData.data) {
			options.push({
				id: responseData.data[key].id,
				name: responseData.data[key].name,
				selected: false,
				status: 1,
			})
		}
		usuarioCooptech.cliente = options
		if (!usuario?.cliente || usuario.cliente.length <= 1) {
			storage.set('usuarioCooptech', usuarioCooptech)
		}
		setValueSelect(options[0].id)
		setOptionsSelect(options)
		setLoading(false)
	}

	const selectClient = async (data) => {
		setLoading(true)
		let user = storage.get('usuario')
		if (!user?.cliente) {
			user = {
				cliente: usuarioCooptech.cliente,
				id: usuarioCooptech.id_user,
				token: usuarioCooptech.token,
			}
		}
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
		const product = await getProduct(import.meta.env.VITE_APP_NAME, data, user.id)
		if (!product) {
			throw new Error('No se encontro productos relacionados con el usuario')
		}
		const schema = await schemaName(data, product.id_product)
		const token = await logeoApp(user.id, schema)
		setLoading(false)
		navigate(`/LoginCooptech/${token.token}`)
	}
	const handleChangeSelect = (event) => {
		setValueSelect(event.target.value)
	}
	const returnData = async () => {
		const cookies = await getData('token')
		const localStorage = storage.get('usuario')
		if (cookies && localStorage) {
			navigate(`/`)
		}
	}
	useEffect(() => {
		if (action) {
			returnData()
		}
		searchClients()
	}, [])

	return (
		<div className={`min-h-[100vh] w-full flex flex-col justify-center items-center  bg-gray-300 bg-cover ${styles.fondoLogin}`}>
			<Card className='max-md:!min-w-[95vw] !min-w-[50vw] w-1/3 !max-w-[85vw] !min-h-[50vh] p-8 bg-white !rounded-2xl !shadow-lg !shadow-gray-400  flex justify-center items-center flex-col '>
				{optionsSelect && !loading ? (
					<>
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
					</>
				) : (
					<LoaderComponent />
				)}
			</Card>
			<img className='absolute bottom-5 right-5 max-w-52 max-md:max-w-36' src={LogoBlanco} alt='logo Cooptech' />
		</div>
	)
}

export default ListClients
