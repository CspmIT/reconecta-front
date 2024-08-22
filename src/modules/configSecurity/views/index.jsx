import { useNavigate } from 'react-router-dom'
import CardCustom from '../../../components/CardCustom'
import TableCustom from '../../../components/TableCustom'
import { ColumnsUser } from '../utils/DataTable/ColumnsUsers'
import { listUsers } from '../utils/DataTable/dataUser'
import { MainContext } from '../../../context/MainContext'
import { useContext, useEffect } from 'react'
import EditUserRecloser from '../components/EditUserRecloser/EditUserRecloser'

function ConfigSecurity() {
	const { tabs, setTabs, setTabCurrent } = useContext(MainContext)
	const navigate = useNavigate()
	const editUserRecloser = (data) => {
		setTabs((prevTabs) => [
			...prevTabs,
			{
				name: 'Edicion Usuario de Reconecta',
				id: data.id,
				link: '/editUserRecloser',
				component: <EditUserRecloser data={data} />,
			},
		])
		setTabCurrent(tabs.length)
		navigate('/tabs')
	}

	return (
		<CardCustom
			className={
				'w-full h-full flex flex-col items-center justify-center text-black dark:text-white relative pb-5 rounded-md'
			}
		>
			<div className=' w-2/3 mt-4'>
				<h1 className='text-2xl mb-3'>Usuarios Reconecta</h1>
				<TableCustom
					data={listUsers.filter((usr) => usr.id_profile !== 1)}
					columns={ColumnsUser(editUserRecloser)}
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

export default ConfigSecurity
