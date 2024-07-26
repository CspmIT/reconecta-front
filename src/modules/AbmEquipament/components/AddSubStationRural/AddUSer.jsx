import { Search } from '@mui/icons-material'
import { Button, MenuItem, TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import { usersProcoop } from '../../utils/js/usersProcoop'
import TableCustom from '../../../../components/TableCustom'
import { columnsUsers } from '../../utils/dataBackend/tableUserProcoop'

function AddUser({ register, errors, setValue, clearErrors }) {
	const [errorSearch, setErrorSearch] = useState(false)
	const [errorAdd, setErrorAdd] = useState({
		selectUser: false,
		numberMeter: false,
		statusUser: false,
	})
	const [messageError, setMessageError] = useState('Campo Obligatorio')
	const [listUsers, setListUsers] = useState([])
	const [newUsers, setNewUsers] = useState([])

	const [formDataSearch, setFormDataSearch] = useState({
		numCustomer: '',
		name: '',
		account: '',
	})

	const [formDataAdd, setFormDataAdd] = useState({
		selectUser: '',
		numberMeter: '',
		statusUser: '',
	})

	const handleInputChange = (e, setFormData) => {
		const { name, value } = e.target
		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}))
	}

	const searchUser = () => {
		const filledFields = Object.entries(formDataSearch).filter(([, value]) => value)
		if (filledFields.length !== 1) {
			setMessageError(
				filledFields.length > 1 ? 'Solo se debe utilizar un campo para la búsqueda' : 'Campo Obligatorio'
			)
			setErrorSearch(true)
			return
		}

		setErrorSearch(false)
		const [field, value] = filledFields[0]
		const lowerCaseValue = value.toLowerCase()
		const users =
			field === 'name'
				? usersProcoop.filter((item) => item[field].toLowerCase().includes(lowerCaseValue))
				: usersProcoop.filter((item) => item[field] === parseInt(value))

		setListUsers(users)
	}

	const newUser = () => {
		const emptyField = Object.entries(formDataAdd).find(([, value]) => !value)
		if (emptyField) {
			const [field] = emptyField
			setErrorAdd((prevData) => ({
				...prevData,
				[field]: true,
			}))
			return
		}

		const userValue = parseInt(formDataAdd.selectUser, 10)
		const user = usersProcoop.find((item) => item.numCustomer === userValue)
		if (user && !newUsers.some((item) => item.numCustomer === userValue)) {
			user.numberMeter = formDataAdd.numberMeter
			user.statusUser = formDataAdd.statusUser
			setNewUsers((prevData) => [...prevData, user])
		}

		setFormDataSearch({
			numCustomer: '',
			name: '',
			account: '',
		})
		setFormDataAdd({
			selectUser: '',
			numberMeter: '',
			statusUser: '',
		})
		setListUsers([])
		setErrorAdd({ selectUser: false, numberMeter: false, statusUser: false })
	}

	useEffect(() => {
		if (newUsers.length > 0) {
			setValue('users', newUsers)
			clearErrors('users')
		}
	}, [newUsers, setValue])
	const deleteUser = (id) => {
		const users = newUsers.filter((item) => item.numCustomer !== id)
		setValue('users', users)
		setNewUsers(users)
	}
	return (
		<>
			<div className={`mt-3 p-2 ${errors.users ? 'border-2 border-red-500 border-solid' : ''}`}>
				<h1 className='w-full text-2xl'>Datos de Usuario</h1>
				<h2 className='w-full text-xl'>Búsqueda</h2>
				<div className='w-full mt-3 grid gap-3 md:grid-cols-2 lg:grid-cols-3'>
					{['numCustomer', 'name', 'account'].map((field) => (
						<TextField
							key={field}
							error={errorSearch}
							helperText={errorSearch && messageError}
							type={field === 'name' ? 'text' : 'number'}
							label={`${
								field === 'numCustomer'
									? 'Numero de socio'
									: field === 'name'
									? 'Nombre de socio'
									: 'Cuenta de socio'
							}`}
							id={field}
							name={field}
							value={formDataSearch[field]}
							onChange={(e) => handleInputChange(e, setFormDataSearch)}
							className='w-full'
						/>
					))}
				</div>
				<div className='w-full flex justify-center items-center mt-3'>
					<Button type='button' variant='contained' onClick={searchUser}>
						<Search className='mr-3' /> Buscar
					</Button>
				</div>
				<TextField type='text' className='!hidden' {...register('users', { required: true })} />

				{(listUsers.length > 0 || newUsers.length > 0) && (
					<>
						<div className='w-full gap-3 mb-3 flex flex-col justify-center items-center mt-3'>
							<div className='w-2/3 mt-3 grid gap-3 md:grid-cols-2 lg:grid-cols-3'>
								<TextField
									select
									label='Nombre del usuario'
									name='selectUser'
									value={formDataAdd.selectUser}
									onChange={(e) => handleInputChange(e, setFormDataAdd)}
									className='w-full'
									error={errorAdd.selectUser}
									helperText={errorAdd.selectUser && messageError}
								>
									<MenuItem value=''>
										<em>Usuario</em>
									</MenuItem>
									{listUsers.map((item, index) => (
										<MenuItem key={index} value={item.numCustomer}>
											{item.name}
										</MenuItem>
									))}
								</TextField>
								<TextField
									error={errorAdd.numberMeter}
									helperText={errorAdd.numberMeter && messageError}
									type='text'
									label='Numero de medidor'
									name='numberMeter'
									value={formDataAdd.numberMeter}
									onChange={(e) => handleInputChange(e, setFormDataAdd)}
									className='w-full'
								/>
								<TextField
									select
									label='Estado del servicio'
									name='statusUser'
									value={formDataAdd.statusUser}
									onChange={(e) => handleInputChange(e, setFormDataAdd)}
									className='w-full'
									error={errorAdd.statusUser}
									helperText={errorAdd.statusUser && messageError}
								>
									<MenuItem value=''>
										<em>Estado</em>
									</MenuItem>
									<MenuItem value={1}>En servicio</MenuItem>
									<MenuItem value={2}>Fuera de Servicio</MenuItem>
								</TextField>
							</div>
							<Button type='button' variant='contained' onClick={newUser}>
								Agregar Socio
							</Button>
						</div>
						{newUsers.length > 0 && (
							<div className='w-full flex justify-center'>
								<div className='w-2/3'>
									<TableCustom columns={columnsUsers(deleteUser)} data={newUsers} />
								</div>
							</div>
						)}
					</>
				)}
			</div>
			<p className='text-red-500 text-xs mt-2 ml-3'>{errors.users && 'Debe agregar al menos 1 asociado'}</p>
		</>
	)
}

export default AddUser
