import { useState } from 'react'
import { Accordion, AccordionSummary, AccordionDetails, Checkbox, Typography, List } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { menus } from '../../utils/DataMenu/menus'
import MenuItems from './components/MenuItems'

const EditMenu = () => {
	const [selectedMenus, setSelectedMenus] = useState({})
	const [expandedAccordions, setExpandedAccordions] = useState({})

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
		const subMenusSelected = menu.subMenus.map((sub) => selectedMenus[sub.id] || false)
		const allSelected = subMenusSelected.every(Boolean)
		const noneSelected = subMenusSelected.every((selected) => !selected)
		return {
			checked: allSelected,
			indeterminate: !allSelected && !noneSelected,
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

	return (
		<div className='w-full'>
			{Object.values(groupedMenus).map((groupMenu) => {
				const number = 240 - parseInt(groupMenu.level) * 10
				const isExpanded = expandedAccordions[groupMenu.id] || false
				const { checked, indeterminate } = calculateCheckboxState(groupMenu)
				return (
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
							className={`!pl-14 ${isExpanded ? 'border-0 border-t-2 border-solid border-white' : ''}`}
						>
							<List>
								<MenuItems
									items={groupMenu.subMenus}
									expandedAccordions={expandedAccordions}
									handleAccordionChange={handleAccordionChange}
									selectedMenus={selectedMenus}
									handleCheckboxChange={handleCheckboxChange}
								/>
							</List>
						</AccordionDetails>
					</Accordion>
				)
			})}
		</div>
	)
}

export default EditMenu
