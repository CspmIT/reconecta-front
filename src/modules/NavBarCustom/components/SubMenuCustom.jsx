import { Collapse, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem, Popper, useMediaQuery } from '@mui/material'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const SubMenuCustom = ({ item, openSideBar, activeButton, buttonActive }) => {
	const [anchorEl, setAnchorEl] = useState(null)
	const [openSub, setOpenSub] = useState(item.submenus.some((value) => value.link == buttonActive))
	const isMobile = useMediaQuery('(max-width: 600px)');
	const handleClose = () => {
		setAnchorEl(null)
		setOpenSub(false)
	}
	const handleOpen = (evento) => {
		setOpenSub(!openSub)
		setAnchorEl(evento.currentTarget)
	}
	useEffect(() => {
		if (!openSideBar) {
			setOpenSub(false)
		} else {
			setOpenSub(item.submenus.some((value) => value.link == buttonActive))
		}
	}, [openSideBar, buttonActive])
	return (
		<>
			<ListItemButton onClick={(evento) => handleOpen(evento)} sx={{
				minHeight: isMobile ? 60 : 48,
				justifyContent: isMobile ? 'center' : 'flex-start'
			}}>
				<ListItemIcon
					className={`${item.submenus.some((value) => value.link == buttonActive)
						? ' !text-blue-500 dark:!text-blue-500'
						: ''
						}`}
						sx={{
							...(isMobile && {
								minWidth: 'auto !important'
							})
						}}

				>
					{item.icon}
				</ListItemIcon>
				<ListItemText sx={{
					display: isMobile ? 'none !important' : 'block'
				}}
					className={`${item.submenus.some((value) => value.link == buttonActive)
						? ' !text-blue-500 dark:!text-blue-500'
						: ''
						}`}
					primary={item.name}
				/>
			</ListItemButton>
			{openSideBar ? (
				<Collapse in={openSub} timeout='auto' unmountOnExit>
					{item.submenus.map((submenu, index) => {
						return (
							<ListItemButton key={index} onClick={() => activeButton(submenu.link)}>
								<Link to={submenu.link} className='text-black dark:text-white flex pl-5'>
									<ListItemIcon
										className={`${buttonActive === submenu.link ? ' !text-blue-500 dark:!text-blue-500' : ''
											}`}
									>
										{submenu.icon}
									</ListItemIcon>
									<ListItemText
										className={`${buttonActive === submenu.link ? ' !text-blue-500 dark:!text-blue-500' : ''
											}`}
										primary={submenu.name}
									/>
								</Link>
							</ListItemButton>
						)
					})}
				</Collapse>
			) : (
				<Popper
					id={item.name}
					key={item.name}
					className='bg-[#ffffff] z-40 rounded-md shadow-md flex flex-col justify-start'
					placement='left-start'
					open={openSub}
					anchorEl={anchorEl}
					sx={{
						...(isMobile && {
							transform: 'translate3d(-50px, -65px, 0px) !important',
							position: isMobile ? 'fixed !important' : 'absolute !important'
						})
					}}
				>
					{item.submenus?.map((item, index) => {
						return (
							<MenuItem
								className={`gap-3  ${buttonActive === item.link ? ' !text-blue-500' : ' !text-gray-500'
									}`}
								key={index}
								onClick={() => activeButton(item.link)}
							>
								{item.icon} {item.name}
							</MenuItem>
						)
					})}
				</Popper>
				// <Menu
				//     id='basic-menu'
				//     anchorEl={anchorEl}
				//     open={openSub}
				//     onClose={handleClose}
				//     MenuListProps={{
				//         'aria-labelledby': 'basic-button'
				//     }}
				// >
				//     {item.submenus?.map((item, index) => {
				//         return (
				//             <MenuItem
				//                 active
				//                 className={`gap-3  ${
				//                     buttonActive === item.link ? ' !text-blue-500' : ' !text-gray-500'
				//                 }`}
				//                 key={index}
				//                 onClick={() => activeButton(item.link)}
				//             >
				//                 {item.icon} {item.name}
				//             </MenuItem>
				//         )
				//     })}
				// </Menu>
			)}
		</>
	)
}
export default SubMenuCustom
