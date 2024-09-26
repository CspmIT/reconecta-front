import { useContext, useEffect, useState } from 'react'
import CardCustom from '../../../components/CardCustom'
import TableCustom from '../../../components/TableCustom'
import { MainContext } from '../../../context/MainContext'
import { useNavigate } from 'react-router-dom'
import { dataPerfils } from '../utils/DataTable/dataProfile'
import { ColumnsProfile } from '../utils/DataTable/ColumnsProfile'
import { ColumnsUser } from '../utils/DataTable/ColumnsUsers'
import { listUsers } from '../utils/DataTable/dataUser'
import EditMenu from '../components/EditMenu/EditMenu'
import { profilePermission, userPermission } from '../utils/DataMenu/permisos'
import { request } from '../../../utils/js/request'
import { backend } from '../../../utils/routes/app.routes'
import LoaderComponent from '../../../components/Loader'

function ConfigMenu() {
	const { tabs, setTabs, setTabCurrent } = useContext(MainContext)
	const navigate = useNavigate()
	const [listUser, setListUsers] = useState(null)
	useEffect(() => {
		const getUsers = async () => {
			// const listUser = await request(`${backend[`${import.meta.env.VITE_APP_NAME}`]}/listUsers`, 'GET')
			// console.log(listUser)
			// setListUsers(listUser.data)
			setListUsers(listUsers)
		}
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
					component: <EditMenu data={data} permission={userPermission} />,
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
					name: `Edicion Menu Perfil ${data.name}`,
					id: data.id,
					link: '/userEdit',
					component: <EditMenu data={data} permission={profilePermission} />,
				},
			])
			setTabCurrent(tabs.length)
		}
		navigate('/tabs')
	}

	return (
		<CardCustom
			className={
				'w-full h-full flex flex-col items-center justify-center text-black dark:text-white relative p-3 rounded-md'
			}
		>
			<div className='w-full  md:p-5'>
				<h1 className='text-2xl mb-3'>Habilitaciones por Perfiles</h1>
				<TableCustom
					data={dataPerfils}
					columns={ColumnsProfile(editProfile)}
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
				/>
			</div>
			{listUser ? (
				<div className='w-full mt-4 md:p-5'>
					<h1 className='text-2xl mb-3'>Habilitaciones por Usuarios</h1>
					<TableCustom
						data={listUser}
						columns={ColumnsUser(editUser)}
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
		</CardCustom>
	)
}

export default ConfigMenu
