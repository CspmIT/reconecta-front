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
	useMediaQuery,
} from '@mui/material'
import DropdownImage from '../../core/components/DropdownImage'
import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import ButtonModeDark from '../../core/components/ButtonModeDark'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import AppBarCustom from '../components/AppBarCustom'
import DrawerCustom from '../components/DrawerCustom'
import DrawerHeaderCustom from '../components/DrawerHeaderCustom'
import SubMenuCustom from '../components/SubMenuCustom'
import { MdNotificationsActive } from 'react-icons/md'
import styles from '../utils/css/styles.module.css'
import { MainContext } from '../../../context/MainContext'
import BottonApps from '../../LoginApp/components/BottonApps/BottonApps'
import MenuSideBar from '../components/MenuSideBar'
import { storage } from '../../../storage/storage'
function NavBarCustom() {
	const [open, setOpen] = useState(false)
	const { tabActive, tabs, infoNav } = useContext(MainContext)
	const navigate = useNavigate()
	const NavBarRef = useRef(null)
	const { pathname } = useLocation()
	const locationTAbs = pathname.split('/')[1] || '/DashBoard'
	const location = pathname
	const [buttonActive, setButtonActive] = useState(location)
	const isMobile = useMediaQuery('(max-width: 600px)')
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
		document.addEventListener('mouseup', handleClickOutside)
		return () => {
			document.removeEventListener('mouseup', handleClickOutside)
		}
	}, [])
	useEffect(() => {
		setButtonActive(location)
		if (location === '/DashBoard') {
			setButtonActive('Home')
		}
		if (infoNav != '') {
			setButtonActive(infoNav)
		}
		if ((locationTAbs.includes('Abm') || locationTAbs.includes('AbmDevice')) && !infoNav[0]) {
			navigate('Home')
		}
	}, [location, locationTAbs])

	const activeButton = useCallback(
		(id) => {
			setButtonActive(id)
			navigate(id)
		},
		[navigate]
	)
	const [nameCoop, setNameCoop] = useState('')
	useEffect(() => {
		if (storage.get('usuarioCooptech')) {
			const cliente = Array.isArray(storage.get('usuarioCooptech')?.client)
				? storage.get('usuarioCooptech')?.cliente?.filter((item) => item.selected)[0]
				: storage.get('usuarioCooptech')?.cliente || ''
			setNameCoop(cliente.name)
		}
	}, [])

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
							...(isMobile && { display: 'none' }),
							...(open && { display: 'none' }),
						}}
					>
						<MenuIcon />
					</IconButton>
					<Typography variant='h6' noWrap component='div'>
						Reconecta
					</Typography>
					<div className='absolute right-5 flex flex-row items-center gap-2'>
						<p className='text-black text-xl ml-3 select-none'>{nameCoop}</p>
						<BottonApps />
						<ButtonModeDark />
						<DropdownImage />
					</div>
				</Toolbar>
			</AppBarCustom>
			<DrawerCustom
				variant='permanent'
				open={open}
				ref={NavBarRef}
				sx={{
					...(isMobile && {
						position: 'fixed',
						bottom: 0,
						width: '100%',
						height: '10vh',
						zIndex: 1200,
						'& .MuiDrawer-paper': {
							position: 'absolute',
							bottom: 0,
							width: '100%',
							height: '10vh',
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'space-around',
							padding: '0',
						},
					}),
				}}
			>
				<div className='bg-white dark:bg-gray-800 h-full w-full sm:w-auto'>
					<DrawerHeaderCustom style={{ display: isMobile ? 'none' : '' }}>
						<IconButton onClick={handleDrawerClose}>
							<ChevronLeftIcon className='dark:text-white' />
						</IconButton>
					</DrawerHeaderCustom>
					<Divider />

					<List
						sx={{
							...(isMobile && {
								display: 'flex',
								flexDirection: 'row',
								justifyContent: 'center',
								width: '100%',
								padding: 0,
							}),
						}}
					>
						{MenuSideBar(tabActive, infoNav).map((item, index) => {
							if (tabs.length == 0 && item.link == '/tabs') {
								return null
							}
							if (item.name == 'ABM Equipos' && item.link == '') {
								return null
							}
							return (
								<ListItem
									key={index}
									disablePadding
									sx={{
										...(isMobile && {
											flexGrow: 1,
											flexBasis: 0,
											justifyContent: 'center',
											display: 'flex',
										}),
									}}
								>
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
												// className={item.link === '/Alert' ? styles.backgroundAlert : ''}
												sx={{
													minHeight: 48,
													justifyContent: !isMobile && open ? 'initial' : 'center',
													px: 2.5,
													py: 1.8,
												}}
												onClick={() => activeButton(item.link)}
											>
												<ListItemIcon
													sx={{
														minWidth: 0,
														mr: !isMobile && open ? 3 : 'auto',
														justifyContent: 'center',
														color: buttonActive == item.link ? 'blue' : '',
													}}
												>
													{item.icon}
												</ListItemIcon>
												<ListItemText
													primary={item.name}
													sx={{
														opacity: !isMobile && open ? 1 : 0,
														color: buttonActive == item.link ? 'blue' : '',
														display: isMobile ? 'none !important' : 'block',
													}}
												/>
											</ListItemButton>
										</Link>
									)}
								</ListItem>
							)
						})}
					</List>
				</div>
			</DrawerCustom>
		</>
	)
}

export default NavBarCustom
