import { Badge } from '@mui/material'
import { BsFillMenuButtonWideFill } from 'react-icons/bs'
import { FaCogs, FaFile, FaMapMarkedAlt, FaProjectDiagram } from 'react-icons/fa'
import { MdContentPaste, MdNotificationsActive } from 'react-icons/md'
import { PiTabsFill } from 'react-icons/pi'
import { RiAlertFill, RiDashboardFill } from 'react-icons/ri'

const MenuSideBar = (tabActive, infoNav) => [
	{ name: 'Alertas', link: '/Alert', icon: <RiAlertFill className=' text-3xl' /> },
	{ name: 'Dashboard', link: '/Home', icon: <RiDashboardFill className=' text-3xl' /> },
	{
		name: 'Mapa',
		link: '/map',
		icon: <FaMapMarkedAlt className=' text-3xl' />,
	},
	{
		name: 'Diagram',
		link: '/Diagram',
		icon: <FaProjectDiagram className=' text-3xl' />,
	},
	{
		name: 'Bitácora',
		link: '/bitacora',
		icon: <MdContentPaste className=' text-3xl' />,
	},
	{
		name: 'Configuración',
		icon: <FaCogs className='dark:text-white text-3xl' />,
		submenus: [
			{
				name: 'Accesos',
				link: '/config/menu',
				icon: <BsFillMenuButtonWideFill className='dark:text-white text-2xl my-1' />,
			},
			{
				name: 'Notificaciones',
				link: '/config/notifications',
				icon: <MdNotificationsActive className='dark:text-white text-2xl my-1' />,
			},
		],
	},

	{
		name: 'Paginas',
		link: '/tabs',
		icon: (
			<Badge badgeContent={tabActive} color='primary'>
				<PiTabsFill className='dark:text-white text-3xl' />
			</Badge>
		),
	},
	{
		name: 'ABM Equipos',
		link: `${infoNav}`,
		icon: <FaFile className='dark:text-white text-3xl' />,
	},
]

export default MenuSideBar
