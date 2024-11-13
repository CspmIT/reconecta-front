import { useContext, useEffect, useState } from 'react'
import CardCustom from '../../../components/CardCustom'
import TableCustom from '../../../components/TableCustom'
import { MainContext } from '../../../context/MainContext'
import { useNavigate } from 'react-router-dom'
import { dataPerfils } from '../utils/DataTable/dataProfile'
import { ColumnsProfile } from '../utils/DataTable/ColumnsProfile'
import { ColumnsUser } from '../utils/DataTable/ColumnsUsers'
import PermissionMenu from '../components/PermissionMenu/PermissionMenu'
import { request } from '../../../utils/js/request'
import { backend } from '../../../utils/routes/app.routes'
import LoaderComponent from '../../../components/Loader'
import Swal from 'sweetalert2'

function ConfigMenu() {
	const { tabs, setTabs, setTabCurrent } = useContext(MainContext)
	const navigate = useNavigate()
	const [listUsers, setListUsers] = useState(null)
	const [listProfile, setListProfile] = useState([])
	const getUsers = async () => {
		try {
			const response = await request(`${backend[`${import.meta.env.VITE_APP_NAME}`]}/listUsersPass`, 'GET')
			if (response?.data) {
				setListUsers(response.data)
			}
		} catch (error) {
			console.error('Error al obtener los usuarios:', error)
		}
	}
	const getProfiles = async () => {
		try {
			const response = await request(`${backend[`${import.meta.env.VITE_APP_NAME}`]}/listProfiles`, 'GET')
			if (response?.data) {
				setListProfile(response.data)
			}
		} catch (error) {
			console.error('Error al obtener los usuarios:', error)
		}
	}

	useEffect(() => {
		getProfiles()
		getUsers()
	}, [])

	const editUser = (data) => {
		const existingTabIndex = tabs.findIndex((tab) => tab.name === `Edicion Menu de:${data.last_name}`)
		if (existingTabIndex !== -1) {
			setTabCurrent(existingTabIndex)
		} else {
			setTabs((prevTabs) => [
				...prevTabs,
				{
					name: `Edicion Menu de:${data.last_name}`,
					id: data.id,
					link: '/userEdit',
					component: <PermissionMenu data={data} id_user={data.id} />,
				},
			])
			setTabCurrent(tabs.length)
		}
		navigate('/tabs')
	}
	const editProfile = (data) => {
		const existingTabIndex = tabs.findIndex((tab) => tab.name === `Edicion Menu Perfil ${data.name}`)
		if (existingTabIndex !== -1) {
			setTabCurrent(existingTabIndex)
		} else {
			setTabs((prevTabs) => [
				...prevTabs,
				{
					name: `Edicion Menu Perfil ${data.description}`,
					id: data.id,
					link: '/userEdit',
					component: <PermissionMenu data={data} profile={data.id} />,
				},
			])
			setTabCurrent(tabs.length)
		}
		navigate('/tabs')
	}

	const swalNewPassword = async (info) => {
		Swal.fire({
			title: 'Crear nueva contraseña',
			input: 'text',
			inputAttributes: {
				autocapitalize: 'off',
				placeholder: 'Ingrese su contraseña',
			},
			inputLabel: 'Ingresa la nueva contraseña',
			inputPlaceholder: 'Nueva contraseña',
			showCancelButton: true,
			confirmButtonText: 'Guardar',
			preConfirm: async (password) => {
				if (!password) {
					Swal.showValidationMessage('La contraseña no puede estar vacía')
				} else {
					await savePassword(info, password)
				}
			},
		})
	}

	const savePassword = async (info, password) => {
		try {
			const data = { id_user: info?.id, id: info?.passwordRecloser?.id || 0, password: password }
			await request(`${backend[`${import.meta.env.VITE_APP_NAME}`]}/savePass`, 'POST', data)

			await getUsers()
			Swal.fire({
				title: 'Perfecto!',
				text: 'Se guardó correctamente',
				icon: 'success',
			})
		} catch (error) {
			Swal.fire({
				title: 'Atención!',
				text: 'Hubo un error en el guardado',
				icon: 'warning',
			})
		}
	}
	return (
		<CardCustom
			className={
				'w-full h-full flex flex-col items-center justify-center text-black dark:text-white relative p-3 rounded-md'
			}
		>
			{listProfile.length == 0 ? (
				<LoaderComponent />
			) : (
				<>
					<div className='w-full  md:p-5'>
						<h1 className='text-2xl mb-3'>Habilitaciones por Perfiles</h1>
						<TableCustom
							data={listProfile}
							columns={ColumnsProfile(editProfile)}
							density='compact'
							header={{
								background: 'rgb(190 190 190)',
								fontSize: '18px',
								fontWeight: 'bold',
								padding: '20px 20px 10px 20px !important',
							}}
							toolbarClass={{ background: 'rgb(190 190 190)' }}
							body={{ backgroundColor: 'rgba(209, 213, 219, 0.31)' }}
							footer={{ background: 'rgb(190 190 190)', padding: '20px !important' }}
							card={{
								boxShadow: `1px 1px 8px 0px #00000046`,
								borderRadius: '0.75rem',
							}}
						/>
					</div>
					{listUsers ? (
						<div className='w-full mt-4 md:p-5'>
							<h1 className='text-2xl mb-3'>Habilitaciones por Usuarios</h1>
							<TableCustom
								data={listUsers}
								columns={ColumnsUser(editUser, swalNewPassword, listProfile)}
								density='compact'
								header={{
									background: 'rgb(190 190 190)',
									fontSize: '18px',
									fontWeight: 'bold',
								}}
								toolbarClass={{ background: 'rgb(190 190 190)' }}
								body={{ backgroundColor: 'rgba(209, 213, 219, 0.31)' }}
								footer={{ background: 'rgb(190 190 190)' }}
								card={{
									boxShadow: `1px 1px 8px 0px #00000046`,
									borderRadius: '0.75rem',
								}}
								topToolbar
								pagination
								pageSize={10}
							/>
						</div>
					) : (
						<LoaderComponent />
					)}
				</>
			)}
		</CardCustom>
	)
}

export default ConfigMenu
