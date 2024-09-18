import MenuIcon from '@mui/icons-material/Menu'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import { ListItemText, ListItemIcon, ListItemButton, ListItem, IconButton, Divider, Typography, List, Toolbar } from '@mui/material'
import DropdownImage from '../../core/components/DropdownImage'
import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import ButtonModeDark from '../../core/components/ButtonModeDark'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import AppBarCustom from '../components/AppBarCustom'
import DrawerCustom from '../components/DrawerCustom'
import DrawerHeaderCustom from '../components/DrawerHeaderCustom'
import SubMenuCustom from '../components/SubMenuCustom'
import styles from '../utils/css/styles.module.css'
import { MainContext } from '../../../context/MainContext'
import BottonApps from '../../LoginApp/components/BottonApps/BottonApps'
import MenuSideBar from '../components/MenuSideBar'
function NavBarCustom() {
	const [open, setOpen] = useState(false)
	const { tabActive, tabs, infoNav } = useContext(MainContext)
	const navigate = useNavigate()
	const NavBarRef = useRef(null)
	const { pathname } = useLocation()
	const locationTAbs = pathname.split('/')[1] || '/DashBoard'
	const location = pathname
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
						<BottonApps />
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
						{MenuSideBar(tabActive, infoNav).map((item, index) => {
							if (tabs.length == 0 && item.link == '/tabs') {
								return null
							}
							if (item.name == 'ABM Equipos' && item.link == '') {
								return null
							}
							return (
								<ListItem key={index} disablePadding sx={{ display: 'block' }}>
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
												className={item.link === '/Alert' ? styles.backgroundAlert : ''}
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
							)
						})}
					</List>
				</div>
			</DrawerCustom>
		</>
	)
}

export default NavBarCustom
