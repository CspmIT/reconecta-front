import { Collapse, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem, Popper } from '@mui/material'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const SubMenuCustom = ({ item, openSideBar, activeButton, buttonActive }) => {
	const [anchorEl, setAnchorEl] = useState(null)
	const [openSub, setOpenSub] = useState(item.submenus.some((value) => value.link == buttonActive))
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
			<ListItemButton onClick={(evento) => handleOpen(evento)}>
				<ListItemIcon
					className={`${item.submenus.some((value) => value.link == buttonActive) ? ' !text-blue-500' : ''}`}
				>
					{item.icon}
				</ListItemIcon>
				<ListItemText
					className={`${item.submenus.some((value) => value.link == buttonActive) ? ' !text-blue-500' : ''}`}
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
										className={`${buttonActive === submenu.link ? ' !text-blue-500' : ''}`}
									>
										{submenu.icon}
									</ListItemIcon>
									<ListItemText
										className={`${buttonActive === submenu.link ? ' !text-blue-500' : ''}`}
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
					className='bg-[#ffffff] z-50 rounded-md shadow-md flex flex-col justify-start'
					placement='left-start'
					open={openSub}
					anchorEl={anchorEl}
				>
					{item.submenus?.map((item, index) => {
						return (
							<MenuItem
								className={`gap-3  ${
									buttonActive === item.link ? ' !text-blue-500' : ' !text-gray-500'
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
