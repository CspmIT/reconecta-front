import { useMediaQuery, Fab } from '@mui/material'
import { useContext, useState } from 'react'
import { CustomTabPanel } from './PanelTab'
import { Add, Checklist } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { MainContext } from '../../../../context/MainContext'

function TabsHome({ tabs }) {
	const navigate = useNavigate()
	const { setInfoNav } = useContext(MainContext)
	const [value, setValue] = useState(0)
	const [showSelectChecks, setShowSelectChecks] = useState(false)
	//const isSmallScreen = useMediaQuery('(max-width: 640px)') // Detectar pantallas pequeñas

	const handleChange = (event, newValue) => {
		setValue(newValue)
	}

	const handleSelectChange = (event) => {
		setValue(event.target.value)
	}

	const handleNew = () => {
		navigate('/addElement')
	}

	const classTabs =
		'!border-solid !border-gray-200 !rounded-t-xl !text-base !text-black !font-bold dark:!text-zinc-200 dark:!border-gray-700'
	const classTabStatus = [
		'!bg-white !border-r-2 !border-t-2 !border-l-2 dark:!bg-zinc-500',
		'!border-b-2 !bg-gray-300 dark:!bg-zinc-700 hover:dark:!bg-zinc-500 hover:!bg-zinc-400',
	]

	return (
		<div className={`w-full !rounded-xl flex flex-col items-start`}>
			<div className='bg-white dark:bg-zinc-500 w-full h-full flex justify-center items-center border-2 border-t-0 !p-4 rounded-b-2xl border-zinc-200 dark:!border-gray-700 flex-wrap'>
				<div className='w-10/12 sm:w-11/12 flex justify-start items-center'>
					<div className='md:flex items-center space-x-4 flex-wrap sm:flex-nowrap hidden'>
						<label className='flex items-center'>
							<input type='checkbox' className='mr-2 !w-6 !h-6' />
							<b className='text-black dark:text-white text-lg'>Reconectador</b>
						</label>
						<label className='flex items-center'>
							<input type='checkbox' className='mr-2 !w-6 !h-6' />
							<b className='text-black dark:text-white text-lg'>ET132</b>
						</label>
						<label className='flex items-center'>
							<input type='checkbox' className='mr-2 !w-6 !h-6' />
							<b className='text-black dark:text-white text-lg'>Subestacion urbana</b>
						</label>
						<label className='flex items-center'>
							<input type='checkbox' className='mr-2 !w-6 !h-6' />
							<b className='text-black dark:text-white text-lg'>Subestacion rural</b>
						</label>
						<label className='flex items-center'>
							<input type='checkbox' className='mr-2 !w-6 !h-6' />
							<b className='text-black dark:text-white text-lg'>Consumos puntuales</b>
						</label>
					</div>
					<div className='flex justify-end md:hidden relative mb-3'>
						<Fab
							size='small'
							className='!flex !justify-center !items-center'
							onClick={() => setShowSelectChecks(!showSelectChecks)}
						>
							<Checklist />
						</Fab>
						{showSelectChecks && (
							<div className='bg-white dark:bg-zinc-500 p-5 border-2 w-80 border-gray-200 dark:border-gray-700 absolute top-12 left-0 z-10'>
								<label className='flex items-center my-2'>
									<input type='checkbox' className='mr-2 !w-6 !h-6' />
									<b className='text-black dark:text-white'>Reconectador</b>
								</label>
								<label className='flex items-center my-2'>
									<input type='checkbox' className='mr-2 !w-6 !h-6' />
									<b className='text-black dark:text-white'>ET132</b>
								</label>
								<label className='flex items-center my-2'>
									<input type='checkbox' className='mr-2 !w-6 !h-6' />
									<b className='text-black dark:text-white'>Subestacion urbana</b>
								</label>
								<label className='flex items-center my-2'>
									<input type='checkbox' className='mr-2 !w-6 !h-6' />
									<b className='text-black dark:text-white'>Subestacion rural</b>
								</label>
								<label className='flex items-center my-2'>
									<input type='checkbox' className='mr-2 !w-6 !h-6' />
									<b className='text-black dark:text-white'>Consumos puntuales</b>
								</label>
							</div>
						)}
					</div>
				</div>
				<div className='flex w-2/12 sm:w-1/12 justify-end relative mb-3'>
					<Fab
						onClick={handleNew}
						className='!flex !justify-center !items-center'
						size='small'
						color='primary'
						aria-label='add'
					>
						<Add />
					</Fab>
				</div>
				<div className='w-full'>
					{tabs.map((item, index) => (
						<CustomTabPanel
							key={index}
							value={value}
							index={index}
							className={'w-full flex max-sm:flex-col flex-wrap justify-evenly'}
						>
							{item.component}
						</CustomTabPanel>
					))}
				</div>
			</div>
		</div>
	)
}

export default TabsHome
