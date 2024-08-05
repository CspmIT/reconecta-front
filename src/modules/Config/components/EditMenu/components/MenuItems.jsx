import { Accordion, AccordionSummary, AccordionDetails, Checkbox, Typography, List, ListItem } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

function MenuItems({ items, expandedAccordions, handleAccordionChange, selectedMenus, handleCheckboxChange }) {
	const calculateCheckboxState = (menu) => {
		const subMenusSelected = menu.subMenus.map((sub) => selectedMenus[sub.id] || false)
		const allSelected = subMenusSelected.every(Boolean)
		const noneSelected = subMenusSelected.every((selected) => !selected)
		return {
			checked: allSelected,
			indeterminate: !allSelected && !noneSelected,
		}
	}

	return items.map((item) => {
		const number = 240 - parseInt(item.level) * 20
		const isExpanded = expandedAccordions[item.id] || false
		const { checked, indeterminate } = calculateCheckboxState(item)
		return (
			<div key={item.id} className='!w-full'>
				{item.subMenus.length ? (
					<Accordion
						expanded={isExpanded}
						onChange={handleAccordionChange(item.id)}
						key={item.id}
						sx={{ backgroundColor: isExpanded ? `rgb(${number},${number},${number})` : 'transparent' }}
						className={`!w-full !shadow-none `}
					>
						<AccordionSummary
							expandIcon={<ExpandMoreIcon className='text-black' />}
							aria-controls={`panel${item.id}-content`}
							sx={{ flexDirection: 'row-reverse', textAlign: 'center' }}
							id={`panel${item.id}-header`}
						>
							<Checkbox
								checked={checked}
								indeterminate={indeterminate}
								onClick={(event) => {
									event.stopPropagation()
									handleCheckboxChange(item.id, item.subMenus)
								}}
							/>
							<Typography className='flex items-center'>{item.name}</Typography>
						</AccordionSummary>

						{item.subMenus && (
							<AccordionDetails
								className={`flex flex-col !items-start !pl-14 ${
									isExpanded ? 'border-solid border-0 border-t-2 border-white' : ''
								}`}
								key={item.id}
							>
								<List className='w-full'>
									<MenuItems
										items={item.subMenus}
										expandedAccordions={expandedAccordions}
										handleAccordionChange={handleAccordionChange}
										selectedMenus={selectedMenus}
										handleCheckboxChange={handleCheckboxChange}
									/>
								</List>
							</AccordionDetails>
						)}
					</Accordion>
				) : (
					<ListItem className='flex !items-center !w-full !pl-10' key={item.id}>
						<Checkbox
							checked={selectedMenus[item.id] || false}
							onClick={(event) => {
								event.stopPropagation()
								handleCheckboxChange(item.id, [])
							}}
						/>
						<Typography className='flex items-center'>{item.name}</Typography>
					</ListItem>
				)}
			</div>
		)
	})
}

export default MenuItems
