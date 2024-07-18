import MenuIcon from '@mui/icons-material/Menu'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import {
	ListItemText,
	ListItemIcon,
	ListItemButton,
	ListItem,
	IconButton,
	Divider,
	Typography,
	List,
	Toolbar,
	Badge,
} from '@mui/material'
import DropdownImage from '../../core/components/DropdownImage'
import { Fragment, useContext, useEffect, useRef, useState } from 'react'
import ButtonModeDark from '../../core/components/ButtonModeDark'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FaMapMarkedAlt, FaCogs, FaProjectDiagram } from 'react-icons/fa'
import { RiAlertFill, RiDashboardFill, RiRemoteControl2Fill } from 'react-icons/ri'
import AppBarCustom from '../components/AppBarCustom'
import DrawerCustom from '../components/DrawerCustom'
import DrawerHeaderCustom from '../components/DrawerHeaderCustom'
import SubMenuCustom from '../components/SubMenuCustom'
import { InsertChart, NotificationAdd } from '@mui/icons-material'
import styles from '../utils/css/styles.module.css'
import { MainContext } from '../../../context/MainContext'
import { PiTabsFill } from 'react-icons/pi'
function NavBarCustom() {
	const [open, setOpen] = useState(false)
	const { tabActive, tabs } = useContext(MainContext)
	const navigate = useNavigate()
	const NavBarRef = useRef(null)
	const location = useLocation().pathname.split('/')[1] || '/DashBoard'
	const [buttonActive, setButtonActive] = useState(location)
	const handleDrawerOpen = () => {
		setOpen(true)
	}
	const handleDrawerClose = () => {
		setOpen(false)
	}
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (NavBarRef.current && !NavBarRef.current.contains(event.target)) {
				handleDrawerClose()
			}
		}
		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [])
	const menuSideBar = [
		{ name: 'Alertas', link: 'Alert', icon: <RiAlertFill className=' text-3xl' /> },
		{ name: 'Dashboard', link: 'Home', icon: <RiDashboardFill className=' text-3xl' /> },
		// {
		// 	name: 'Tablero',
		// 	link: 'Board',
		// 	icon: <RiRemoteControl2Fill className='dark:text-white text-3xl' />,
		// 	submenus: [
		// 		{
		// 			name: 'Perfil2',
		// 			link: 'config/profile',
		// 			icon: <RiRemoteControl2Fill className='dark:text-white text-3xl' />,
		// 		},
		// 		{
		// 			name: 'Cuenta2',
		// 			link: 'config/account',
		// 			icon: <RiRemoteControl2Fill className='dark:text-white text-3xl' />,
		// 		},
		// 	],
		// },
		{
			name: 'Mapa',
			link: 'map',
			icon: <FaMapMarkedAlt className=' text-3xl' />,
		},
		{
			name: 'Diagram',
			link: 'Diagram',
			icon: <FaProjectDiagram className=' text-3xl' />,
		},
		// {
		// 	name: 'Notificaciones',
		// 	link: 'notificaciones',
		// 	icon: <NotificationAdd className='dark:text-white text-3xl' />,
		// },
		// {
		// 	name: 'Configuración',
		// 	link: 'config',
		// 	icon: <FaCogs className='dark:text-white text-3xl' />,
		// 	submenus: [
		// 		{
		// 			name: 'Perfil',
		// 			link: 'config/profile2',
		// 			icon: <RiRemoteControl2Fill className='dark:text-white text-3xl' />,
		// 		},
		// 		{
		// 			name: 'Cuenta',
		// 			link: 'config/account2',
		// 			icon: <RiRemoteControl2Fill className='dark:text-white text-3xl' />,
		// 		},
		// 	],
		// },
		{
			name: 'Paginas',
			link: 'tabs',
			icon: (
				<Badge badgeContent={tabActive} color='primary'>
					<PiTabsFill className='dark:text-white text-3xl' />
				</Badge>
			),
		},
	]
	useEffect(() => {
		setButtonActive(location)
		if (location === '/DashBoard') {
			setButtonActive('Home')
		}
	}, [location])

	const activeButton = (id) => {
		setButtonActive(id)
		navigate(id)
	}
	return (
		<>
			<AppBarCustom position='fixed' open={open}>
				<Toolbar>
					<IconButton
						color='inherit'
						aria-label='open drawer'
						onClick={handleDrawerOpen}
						edge='start'
						sx={{
							marginRight: 5,
							boxShadow: 'none',
							...(open && { display: 'none' }),
						}}
					>
						<MenuIcon />
					</IconButton>
					<Typography variant='h6' noWrap component='div'>
						Reconecta
					</Typography>
					<div className='absolute right-5 flex flex-row items-center gap-2'>
						<ButtonModeDark />
						<DropdownImage />
					</div>
				</Toolbar>
			</AppBarCustom>
			<DrawerCustom variant='permanent' open={open} ref={NavBarRef}>
				<div className='bg-white dark:bg-gray-800 h-full'>
					<DrawerHeaderCustom>
						<IconButton onClick={handleDrawerClose}>
							<ChevronLeftIcon className='dark:text-white' />
						</IconButton>
					</DrawerHeaderCustom>
					<Divider />
					<List>
						{menuSideBar.map((item, index) => {
							if (tabs.length == 0 && item.link == 'tabs') {
								return ''
							}
							return (
								<Fragment key={index}>
									<ListItem disablePadding sx={{ display: 'block' }}>
										{item.submenus ? (
											<SubMenuCustom
												item={item}
												className={`dark:text-white`}
												openSideBar={open}
												buttonActive={buttonActive}
												activeButton={activeButton}
											/>
										) : (
											<Link to={item.link} className={` text-black dark:text-white`}>
												<ListItemButton
													className={item.link === 'Alert' ? styles.backgroundAlert : ''}
													sx={{
														minHeight: 48,
														justifyContent: open ? 'initial' : 'center',
														px: 2.5,
														py: 1.8,
													}}
													onClick={() => activeButton(item.link)}
												>
													<ListItemIcon
														sx={{
															minWidth: 0,
															mr: open ? 3 : 'auto',
															justifyContent: 'center',
															color: buttonActive == item.link ? 'blue' : '',
														}}
													>
														{item.icon}
													</ListItemIcon>
													<ListItemText
														primary={item.name}
														sx={{
															opacity: open ? 1 : 0,
															color: buttonActive == item.link ? 'blue' : '',
														}}
													/>
												</ListItemButton>
											</Link>
										)}
									</ListItem>
								</Fragment>
							)
						})}
					</List>
				</div>
			</DrawerCustom>
		</>
	)
}

export default NavBarCustom
