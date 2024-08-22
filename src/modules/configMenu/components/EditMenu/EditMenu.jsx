import { useContext, useEffect, useState } from 'react'
import {
	Accordion,
	AccordionSummary,
	AccordionDetails,
	Checkbox,
	Typography,
	List,
	Button,
	ListItem,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { menus } from '../../utils/DataMenu/menus'
import MenuItems from './components/MenuItems'
import Swal from 'sweetalert2'
import { MainContext } from '../../../../context/MainContext'
import { useNavigate } from 'react-router-dom'

const EditMenu = ({ data, permission }) => {
	const { tabs, setTabs, tabCurrent, setTabCurrent } = useContext(MainContext)
	const navigate = useNavigate()

	const [selectedMenus, setSelectedMenus] = useState({})
	const [expandedAccordions, setExpandedAccordions] = useState({})

	useEffect(() => {
		const initialSelection = permission.reduce((acc, perm) => {
			acc[perm.id] = perm.checked === 'checked'
			return acc
		}, {})
		setSelectedMenus(initialSelection)
	}, [permission])
	const handleCheckboxChange = (id, subMenus) => {
		const updateSelection = (menus, isSelected) => {
			return menus.reduce((acc, menu) => {
				acc[menu.id] = isSelected
				if (menu.subMenus) {
					Object.assign(acc, updateSelection(menu.subMenus, isSelected))
				}
				return acc
			}, {})
		}

		setSelectedMenus((prevSelectedMenus) => {
			const isSelected = !prevSelectedMenus[id]
			const updatedSelection = updateSelection(subMenus, isSelected)
			return {
				...prevSelectedMenus,
				[id]: isSelected,
				...updatedSelection,
			}
		})
	}

	const handleAccordionChange = (id) => (event, isExpanded) => {
		setExpandedAccordions((prevExpandedAccordions) => ({
			...prevExpandedAccordions,
			[id]: isExpanded,
		}))
	}

	const calculateCheckboxState = (menu) => {
		const haveSubMenu = menu.subMenus && menu.subMenus.length > 0
		let statusChildren = false
		if (haveSubMenu) {
			const resultado2 = menu.subMenus.map((subMenu) => calculateCheckboxState(subMenu))
			statusChildren =
				resultado2.filter((checkboxState) => checkboxState.checked || checkboxState.indeterminate).length > 0
		}
		if (!menu.subMenus || menu.subMenus?.length < 1) {
			return {
				checked: selectedMenus[menu.id],
				indeterminate: false,
			}
		}
		const subMenusSelected = menu.subMenus.map((sub) => selectedMenus[sub.id] || false)
		const allSelected = subMenusSelected.every(Boolean)
		const noneSelected = subMenusSelected.every((selected) => !selected)
		if (allSelected) {
			statusChildren = false
		}
		return {
			checked: allSelected,
			indeterminate: (!allSelected && !noneSelected) || statusChildren,
		}
	}

	const groupedMenus = menus.reduce((acc, menu) => {
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

	const SaveMenu = () => {
		Swal.fire({
			title: 'Perfeto',
			text: 'Se guardo correctamente la configuracion del menu',
			icon: 'success',
		})
		navigate('/config/menu')
		setTabs(tabs.filter((_, index) => index !== tabCurrent))
		setTabCurrent((prev) => prev - 1)
	}

	return (
		<div className='w-full'>
			<div className='w-full flex justify-end  p-2'>
				<Button onClick={SaveMenu} variant='contained'>
					Guardar
				</Button>
			</div>
			<div className='w-full'>
				{Object.values(groupedMenus).map((groupMenu) => {
					const number = 240 - parseInt(groupMenu.level) * 10
					const isExpanded = expandedAccordions[groupMenu.id] || false
					const { checked, indeterminate } = calculateCheckboxState(groupMenu)
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
								<Checkbox
									checked={checked}
									indeterminate={indeterminate}
									onClick={(event) => {
										event.stopPropagation()
										handleCheckboxChange(groupMenu.id, groupMenu.subMenus)
									}}
								/>
								<Typography className='flex items-center'>{groupMenu.name}</Typography>
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
										selectedMenus={selectedMenus}
										handleCheckboxChange={handleCheckboxChange}
										calculateCheckboxState={calculateCheckboxState}
									/>
								</List>
							</AccordionDetails>
						</Accordion>
					) : (
						<ListItem className='flex !items-center !w-full !pl-10' key={groupMenu.id}>
							<Checkbox
								checked={checked}
								indeterminate={indeterminate}
								onClick={(event) => {
									event.stopPropagation()
									handleCheckboxChange(groupMenu.id, groupMenu.subMenus)
								}}
							/>
							<Typography className='flex items-center text-black'>{groupMenu.name}</Typography>
						</ListItem>
					)
				})}
			</div>
		</div>
	)
}

export default EditMenu
