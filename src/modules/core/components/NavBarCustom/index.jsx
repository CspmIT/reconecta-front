import { styled, useTheme } from '@mui/material/styles'
import MuiDrawer from '@mui/material/Drawer'
import MuiAppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import List from '@mui/material/List'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import DropdownImage from '../DropdownImage'
import DashboardIcon from '@mui/icons-material/Dashboard'
import { Fragment, useContext, useEffect, useRef, useState } from 'react'
import ButtonModeDark from '../ButtonModeDark'
import { Link, useLocation } from 'react-router-dom'
import WarningIcon from '@mui/icons-material/Warning'
import QueryStatsIcon from '@mui/icons-material/QueryStats'
import { FaMapMarkedAlt, FaCogs } from 'react-icons/fa'
import { RiAlertFill, RiDashboardFill, RiRemoteControl2Fill } from 'react-icons/ri'
import { PiTabsFill } from 'react-icons/pi'
import { Badge, Card, Collapse } from '@mui/material'
import { MainContext } from '../../../../context/MainContext'
const drawerWidth = 240

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen
    }),
    background: 'transparent !important',
    overflowX: 'hidden'
})

const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
    }),
    overflowX: 'hidden',
    background: 'transparent !important',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`
    }
})

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar
}))

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open'
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    background: '#a9a9a9 !important',

    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
    }),
    ...(open && {
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen
        })
    })
}))

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
        ...openedMixin(theme),
        '& .MuiDrawer-paper': openedMixin(theme)
    }),
    ...(!open && {
        ...closedMixin(theme),
        '& .MuiDrawer-paper': closedMixin(theme)
    })
}))

function NavBarCustom() {
    const [open, setOpen] = useState(false)
    const NavBarRef = useRef(null) // Referencia al dropdown
    const [buttonActive, setButtonActive] = useState('')
    const location = useLocation()

    const [openSubMenu, setOpenSubMenu] = useState(null)

    // Manejar clic en submenús
    const handleSubMenuClick = (name) => {
        setOpenSubMenu(openSubMenu === name ? null : name)
    }

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

    const { tabActive } = useContext(MainContext)

    useEffect(() => {
        setButtonActive(location.pathname)
    }, [location])

    const menuSideBar = [
        { name: 'Dashboard', link: 'DashBoard', icon: <RiDashboardFill className='dark:text-white text-3xl' /> },
        { name: 'Alertas', link: 'Alert', icon: <RiAlertFill className='dark:text-white text-3xl' /> },
        { name: 'Tablero', link: 'Board', icon: <RiRemoteControl2Fill className='dark:text-white text-3xl' /> },
        { name: 'Mapa', link: 'map', icon: <FaMapMarkedAlt className='dark:text-white text-3xl' /> },
        {
            name: 'Configuración',
            link: 'config',
            icon: <FaCogs className='dark:text-white text-3xl' />,
            submenus: [
                {
                    name: 'Perfil',
                    link: 'config/profile'
                },
                {
                    name: 'Cuenta',
                    link: 'config/account'
                }
            ]
        }
        // {
        //     name: 'Paginas',
        //     link: 'tabs',
        //     icon: (
        //         <Badge badgeContent={tabActive} color='primary'>
        //             <PiTabsFill className='dark:text-white text-3xl' />
        //         </Badge>
        //     )
        // }
    ]

    const SubMenu = ({ item, openSub, onClick }) => (
        <>
            <ListItem disablePadding onClick={onClick}>
                <ListItemButton>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.name} />
                </ListItemButton>
            </ListItem>
            {open ? (
                <Collapse in={openSub} timeout='auto' unmountOnExit>
                    <List component='div' disablePadding>
                        {item.submenus.map((submenu, index) => (
                            <ListItem className='pl-5' key={index} disablePadding>
                                <Link to={submenu.link} className='text-black dark:text-white'>
                                    <ListItemButton>
                                        <ListItemIcon>
                                            <RiDashboardFill className='dark:text-white text-3xl' />
                                        </ListItemIcon>
                                        <ListItemText primary={submenu.name} />
                                    </ListItemButton>
                                </Link>
                            </ListItem>
                        ))}
                    </List>
                </Collapse>
            ) : (
                <Collapse in={openSub} timeout='auto' unmountOnExit>
                    <div className='absolute '>
                        <List component='div' disablePadding>
                            {item.submenus.map((submenu, index) => (
                                <ListItem className='pl-5' key={index} disablePadding>
                                    <Link to={submenu.link} className='text-black dark:text-white'>
                                        <ListItemButton>
                                            <ListItemIcon>
                                                <RiDashboardFill className='dark:text-white text-3xl' />
                                            </ListItemIcon>
                                            <ListItemText primary={submenu.name} />
                                        </ListItemButton>
                                    </Link>
                                </ListItem>
                            ))}
                        </List>
                    </div>
                </Collapse>
            )}
        </>
    )

    return (
        <>
            <AppBar position='fixed' open={open}>
                <Toolbar>
                    <IconButton
                        color='inherit'
                        aria-label='open drawer'
                        onClick={handleDrawerOpen}
                        edge='start'
                        sx={{
                            marginRight: 5,
                            boxShadow: 'none',
                            ...(open && { display: 'none' })
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
            </AppBar>
            <Drawer variant='permanent' open={open} ref={NavBarRef}>
                <div className='bg-white dark:bg-gray-700 h-full'>
                    <DrawerHeader>
                        <IconButton onClick={handleDrawerClose}>
                            <ChevronLeftIcon className='dark:text-white' />
                        </IconButton>
                    </DrawerHeader>
                    <Divider />
                    <List>
                        {menuSideBar.map((item, index) => (
                            <Fragment key={index}>
                                <ListItem disablePadding sx={{ display: 'block' }}>
                                    {item.submenus ? (
                                        <SubMenu item={item} openSub={openSubMenu === item.name} onClick={() => handleSubMenuClick(item.name)} />
                                    ) : (
                                        <Link to={item.link} className='text-black dark:text-white'>
                                            <ListItemButton
                                                sx={{
                                                    minHeight: 48,
                                                    justifyContent: open ? 'initial' : 'center',
                                                    px: 2.5,
                                                    py: 1.8
                                                }}
                                            >
                                                <ListItemIcon
                                                    sx={{
                                                        minWidth: 0,
                                                        mr: open ? 3 : 'auto',
                                                        justifyContent: 'center'
                                                    }}
                                                    className='dark:text-white'
                                                >
                                                    {item.icon}
                                                </ListItemIcon>
                                                <ListItemText className='dark:text-white' primary={item.name} sx={{ opacity: open ? 1 : 0 }} />
                                            </ListItemButton>
                                        </Link>
                                    )}
                                </ListItem>
                            </Fragment>
                        ))}
                    </List>
                </div>
            </Drawer>
        </>
    )
}

export default NavBarCustom
