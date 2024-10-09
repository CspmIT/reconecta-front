import { Accordion, AccordionDetails, AccordionSummary, Button, List, ListItem, Typography } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { useEffect, useState } from 'react'
import MenuItems from '../PermissionMenu/components/MenuItems'
import CardCustom from '../../../../components/CardCustom'
import { Add } from '@mui/icons-material'
import { backend } from '../../../../utils/routes/app.routes'
import { request } from '../../../../utils/js/request'
import { createNewMenu, editMenu } from './utils/js/actions'
import Swal from 'sweetalert2'
import BtnActions from './components/BtnActions'

function AddMenu() {
	const [expandedAccordions, setExpandedAccordions] = useState({})
	const [groupedMenus, setGroupedMenus] = useState([])
	const [dataMenu, setDataMenu] = useState([])
	// Función para obtener los datos de los menús y agruparlos según sea necesario
	const getDataMenu = async () => {
		const menus = await request(`${backend[`${import.meta.env.VITE_APP_NAME}`]}/getAllMenu`, 'GET')
		setDataMenu(menus.data)
		setGroupedMenus(await groupedMenu(menus.data))
	}
	const groupedMenu = async (data) => {
		const result = data.reduce((acc, menu) => {
			const groupMenuId = parseInt(menu.group_menu)
			if (!acc[groupMenuId]) {
				acc[groupMenuId] = { ...menu, subMenus: [] }
			}
			if (menu.sub_menu) {
				const parentMenu = acc[groupMenuId]
				const subMenu = { ...menu, subMenus: [] }
				const findAndAddSubMenu = (parent, sub) => {
					if (parent.id === sub.sub_menu) {
						parent.subMenus.push(sub)
					} else {
						for (let i = 0; i < parent.subMenus.length; i++) {
							findAndAddSubMenu(parent.subMenus[i], sub)
						}
					}
				}
				findAndAddSubMenu(parentMenu, subMenu)
			}
			return acc
		}, {})
		return result
	}
	// Cargar los datos al inicializar el componente
	useEffect(() => {
		getDataMenu()
	}, [])

	// Manejar el cambio de expansión de los acordeones
	const handleAccordionChange = (id) => (event, isExpanded) => {
		setExpandedAccordions((prevExpandedAccordions) => ({
			...prevExpandedAccordions,
			[id]: isExpanded,
		}))
	}

	const createMenu = async () => {
		const result = await createNewMenu(groupedMenus, false)
		if (result) {
			getDataMenu()
		}
	}
	const createSubMenu = async (menu) => {
		const result = await createNewMenu(menu, true)
		if (result) {
			getDataMenu()
		}
	}
	const editSubMenu = async (menu) => {
		const result = await editMenu(menu)
		if (result) {
			getDataMenu()
		}
	}
	const deleteSubMenu = async (menu) => {
		const { value: result } = await Swal.fire({
			title: 'Atención!',
			text: `¿Deseas eliminar el menú "${menu.name}" y todos sus submenús?`,
			icon: 'question',
			allowOutsideClick: false,
			showDenyButton: true,
			showCancelButton: false,
			confirmButtonText: 'Sí',
			denyButtonText: 'No',
		})
		if (result) {
			const deleteData = dataMenu
				.filter((item) => isDescendant(menu, item))
				.map((item) => {
					item.status = 0
					return item
				})
			const result = await request(`${backend[import.meta.env.VITE_APP_NAME]}/deleteMenu`, 'POST', deleteData)
			if (!result) {
				throw new Error('Error al eliminar un menu')
			}
			getDataMenu()
		}
	}

	const isDescendant = (menu, item) => {
		if (item.id === menu.id) {
			return true
		}
		let currentMenu = item
		while (currentMenu.sub_menu !== null) {
			if (currentMenu.sub_menu === menu.id) {
				return true
			}
			currentMenu = dataMenu.find((menuItem) => menuItem.id === currentMenu.sub_menu)
		}
		return false
	}
	return (
		<CardCustom className='w-full h-full flex flex-col items-center justify-center text-black dark:text-white relative p-3 rounded-md'>
			<div className='w-full flex justify-start p-2'>
				<Button onClick={createMenu} variant='contained'>
					<Add />
					Nuevo Menu
				</Button>
			</div>

			<div className='w-full'>
				{Object.values(groupedMenus).map((groupMenu) => {
					if (groupMenu.status == 0) {
						return false
					}
					const number = 240 - parseInt(groupMenu.level) * 10
					const isExpanded = expandedAccordions[groupMenu.id] || false
					return groupMenu.subMenus.length > 0 ? (
						<Accordion
							key={groupMenu.id}
							expanded={isExpanded}
							onChange={handleAccordionChange(groupMenu.id)}
							sx={{ backgroundColor: `rgb(${number},${number},${number})` }}
							className='!shadow-none border-2 border-solid border-white'
						>
							<AccordionSummary
								expandIcon={<ExpandMoreIcon />}
								sx={{ flexDirection: 'row-reverse' }}
								aria-controls={`panel${groupMenu.id}-content`}
								id={`panel${groupMenu.id}-header`}
							>
								<Typography className='flex items-center'>{groupMenu.name}</Typography>
								<BtnActions
									data={groupMenu}
									optCreate={createSubMenu}
									optEdit={editSubMenu}
									optDelete={deleteSubMenu}
								/>
							</AccordionSummary>
							<AccordionDetails
								className={`!pl-14 ${
									isExpanded ? 'border-0 border-t-2 border-solid border-white' : ''
								}`}
							>
								<List>
									<MenuItems
										items={groupMenu.subMenus}
										expandedAccordions={expandedAccordions}
										handleAccordionChange={handleAccordionChange}
										newSubMenu={createSubMenu}
										deleteSubMenu={deleteSubMenu}
										editSubMenu={editSubMenu}
									/>
								</List>
							</AccordionDetails>
						</Accordion>
					) : (
						<ListItem className='flex !items-center !w-full !pl-10' key={groupMenu.id}>
							<Typography className='flex items-center text-black'>{groupMenu.name}</Typography>
							<BtnActions
								data={groupMenu}
								optCreate={createSubMenu}
								optEdit={editSubMenu}
								optDelete={deleteSubMenu}
							/>
						</ListItem>
					)
				})}
			</div>
		</CardCustom>
	)
}

export default AddMenu
