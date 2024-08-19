import { useContext } from 'react'
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

function ConfigMenu() {
	const { tabs, setTabs, setTabCurrent } = useContext(MainContext)
	const navigate = useNavigate()

	const editUser = (data) => {
		setTabs((prevTabs) => [
			...prevTabs,
			{
				name: 'Edicion Menu Usuario',
				id: data.id,
				link: '/userEdit',
				component: <EditMenu data={data} permission={userPermission} />,
			},
		])
		setTabCurrent(tabs.length)
		navigate('/tabs')
	}
	const editProfile = (data) => {
		setTabs((prevTabs) => [
			...prevTabs,
			{
				name: 'Edicion Menu Perfil',
				id: data.id,
				link: '/userEdit',
				component: <EditMenu data={data} permission={profilePermission} />,
			},
		])
		setTabCurrent(tabs.length)
		navigate('/tabs')
	}

	return (
		<CardCustom
			className={
				'w-full h-full flex flex-col items-center justify-center text-black dark:text-white relative p-3 rounded-md'
			}
		>
			<div className='w-2/3 '>
				<h1 className='text-2xl mb-3'>Perfiles</h1>
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
			<div className=' w-2/3 mt-4'>
				<h1 className='text-2xl mb-3'>Usuarios</h1>
				<TableCustom
					data={listUsers}
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
		</CardCustom>
	)
}

export default ConfigMenu
