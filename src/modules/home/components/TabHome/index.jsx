import { Fab } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import { Checklist } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { MainContext } from '../../../../context/MainContext'
import TableGeneral from '../TableGeneral'
import ButtonAddElement from '../ButtonAddElement'

function TabsHome({ newTab }) {
	const navigate = useNavigate()
	const { setInfoNav } = useContext(MainContext)
	const [value, setValue] = useState(0)
	const [filters, setFilters] = useState([true, true, true, true, true, true]) // Por defecto dejo todos los checks seleccionados
	const [showSelectChecks, setShowSelectChecks] = useState(false)
	const [elementSelected, setElementSelected] = useState(null)
	//const isSmallScreen = useMediaQuery('(max-width: 640px)') // Detectar pantallas pequeñas

	const handleNew = () => {
		navigate('/addElement')
	}

	const handleChecked = (check) => {
		const newFilters = filters.map((item, index) => (index === check ? !item : item))
		setFilters(newFilters)
	}

	useEffect(() => {
		if (elementSelected) {
			console.log("Elemento seleccionado", elementSelected)
			newTab(elementSelected)
		}
	}, [elementSelected])

	return (
		<div className={`w-full !rounded-xl flex flex-col items-start`}>
			<div className='bg-white dark:bg-zinc-500 w-full h-full flex justify-center items-center border-2 border-t-0 !p-4 rounded-b-2xl border-zinc-200 dark:!border-gray-700 flex-wrap'>
				<div className='w-10/12 sm:w-11/12 flex justify-start items-center'>
					<div className='md:flex items-center space-x-4 flex-wrap sm:flex-nowrap hidden'>
						<label className='flex items-center'>
							<input type='checkbox' className='mr-2 !w-6 !h-6' checked={filters[4]} onClick={() => handleChecked(4)} />
							<b className='text-black dark:text-white text-lg'>ET</b>
						</label>
						<label className='flex items-center'>
							<input type='checkbox' className='mr-2 !w-6 !h-6' checked={filters[1]} onClick={() => handleChecked(1)} />
							<b className='text-black dark:text-white text-lg'>Reconexión</b>
						</label>
						<label className='flex items-center'>
							<input type='checkbox' className='mr-2 !w-6 !h-6' checked={filters[2]} onClick={() => handleChecked(2)} />
							<b className='text-black dark:text-white text-lg'>Subestacion urbana</b>
						</label>
						<label className='flex items-center'>
							<input type='checkbox' className='mr-2 !w-6 !h-6' checked={filters[3]} onClick={() => handleChecked(3)} />
							<b className='text-black dark:text-white text-lg'>Subestacion rural</b>
						</label>
						<label className='flex items-center'>
							<input type='checkbox' className='mr-2 !w-6 !h-6' checked={filters[5]} onClick={() => handleChecked(5)} />
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
									<input type='checkbox' className='mr-2 !w-6 !h-6' checked={filters[1]} onClick={() => handleChecked(1)} />
									<b className='text-black dark:text-white'>Reconexión</b>
								</label>
								<label className='flex items-center my-2'>
									<input type='checkbox' className='mr-2 !w-6 !h-6' checked={filters[2]} onClick={() => handleChecked(2)} />
									<b className='text-black dark:text-white'>Subestacion urbana</b>
								</label>
								<label className='flex items-center my-2'>
									<input type='checkbox' className='mr-2 !w-6 !h-6' checked={filters[3]} onClick={() => handleChecked(3)} />
									<b className='text-black dark:text-white'>Subestacion rural</b>
								</label>
								<label className='flex items-center my-2'>
									<input type='checkbox' className='mr-2 !w-6 !h-6' checked={filters[4]} onClick={() => handleChecked(4)} />
									<b className='text-black dark:text-white'>ET132</b>
								</label>
								<label className='flex items-center my-2'>
									<input type='checkbox' className='mr-2 !w-6 !h-6' checked={filters[5]} onClick={() => handleChecked(5)} />
									<b className='text-black dark:text-white'>Consumos puntuales</b>
								</label>
							</div>
						)}
					</div>
				</div>
				<div className='flex w-2/12 sm:w-1/12 justify-end relative mb-3'>
					<ButtonAddElement />
				</div>
				<TableGeneral filters={filters} setElementSelected={setElementSelected} />
			</div>
		</div>
	)
}

export default TabsHome
