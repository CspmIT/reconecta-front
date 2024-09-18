import { MenuItem, Select, Tab, Tabs, useMediaQuery } from '@mui/material'
import { useState } from 'react'
import { CustomTabPanel, a11yProps } from './PanelTab'

function TabsMeter({ tabs }) {
	const [value, setValue] = useState(0)
	const isSmallScreen = useMediaQuery('(max-width: 850px)')
	const handleChange = (event, newValue) => {
		setValue(newValue)
	}

	const handleSelectChange = (event) => {
		setValue(event.target.value)
	  }
	const classTabs =
		'!border-solid !border-gray-200 !rounded-t-xl !text-base !text-black !font-bold dark:!text-zinc-200 dark:!border-gray-700'
	const classTabStatus = [
		['!bg-white !border-r-2 !border-t-2 !border-l-2 dark:!bg-zinc-500 '],
		['!border-b-2 !bg-gray-300 dark:!bg-zinc-700 hover:dark:!bg-zinc-500 hover:!bg-zinc-400 '],
	]

	return (
		<>
			<div className={`w-full mr-3 !rounded-xl flex flex-col items-start`}>
				{isSmallScreen ? (
					<Select
						value={value}
						onChange={handleSelectChange}
						className="w-full mb-4 bg-white dark:bg-zinc-700 dark:text-white rounded-lg"
					>
						{tabs.map((item, index) => (
							<MenuItem key={index} value={index}>
								{item.title}
							</MenuItem>
						))}
					</Select>
				) : (
					<Tabs
						// className='flex w-full'
						indicatorColor='transparent'
						value={value}
						onChange={handleChange}
						aria-label='basic tabs example'
					>
						{tabs.map((item, index) => {
							return (
								<Tab
									key={index}
									className={`flex-grow !mr-1 relative ${classTabStatus[value === index ? 0 : 1]
										} ${classTabs}`}
									label={<p className='text-black dark:text-white w-full text-center'>{item.title}</p>}
									{...a11yProps(index)}
								/>
							)
						})}
					</Tabs>
				)}
				<div
					className={`bg-white dark:!bg-zinc-500 w-full h-full flex-col justify-center items-center border-2 border-t-0 !p-4 rounded-b-2xl border-zinc-200 dark:!border-gray-700`}
				>
					{tabs.map((item, index) => {
						return (
							<CustomTabPanel
								key={index}
								className={'w-full flex max-sm:flex-col flex-wrap justify-evenly'}
								value={value}
								index={index}
							>
								{item.component}
							</CustomTabPanel>
						)
					})}
				</div>
			</div>
		</>
	)
}

export default TabsMeter
