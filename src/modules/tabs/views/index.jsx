import { Tab, Tabs } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import { CustomTabPanel, a11yProps } from '../components/PanelTab'
import { MainContext } from '../../../context/MainContext'

function TabDinamic({ ...props }) {
	const [value, setValue] = useState(0)
	const handleChange = (event, newValue) => {
		setValue(newValue)
	}
	const { setTabActive } = useContext(MainContext)
	useEffect(() => {
		if (props?.tabs?.length > 0 && props.pag === true) {
			setTabActive(props.tabs.length)
		}
	}, [props?.tabs?.length])

	const classTabs =
		' !border-solid !border-gray-200 !rounded-t-xl !max-w-full !text-base !text-black !font-bold dark:!text-zinc-200 dark:!border-gray-700'
	const classTabStatus = [
		[' !bg-white !border-r-2  !border-t-2 !border-l-2 dark:!bg-zinc-500 '],
		[' !border-b-2 !bg-gray-300 dark:!bg-zinc-700 '],
	]
	return (
		<div className='w-full max-w-[94.5vw] mr-3 !rounded-xl flex flex-col items-center '>
			<Tabs
				className='flex w-full '
				indicatorColor='transparent'
				value={value}
				onChange={handleChange}
				aria-label='basic tabs example'
			>
				{props?.tabs?.map((item, index) => {
					return (
						<Tab
							key={index}
							className={`flex-grow ${classTabStatus[value == index ? 0 : 1]} ${classTabs}`}
							label={item.name}
							{...a11yProps(index)}
						/>
					)
				})}
			</Tabs>
			<div
				className={` bg-white dark:!bg-zinc-500 w-full h-full flex-col justify-center items-center border-2 border-t-0 !p-4 rounded-b-2xl border-zinc-200 dark:!border-gray-700`}
			>
				{props?.tabs?.map((item, index) => {
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
	)
}

export default TabDinamic
