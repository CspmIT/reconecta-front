import { Fab, TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import { Checklist } from '@mui/icons-material'
import TableGeneral from '../TableGeneral'
import ButtonAddElement from '../ButtonAddElement'
import { request } from '../../../../utils/js/request'
import { backend } from '../../../../utils/routes/app.routes'
import DropdownCheckbox from './dropdownCheckbox'

function TabsHome({ newTab }) {
	const [filters, setFilters] = useState([true, true, true, true, true, true]) // Por defecto dejo todos los checks seleccionados
	const [filtersEquipments, setFiltersEquipments] = useState([true, true, true, true]) // Reconectadores, medidores, analizadores de red
	const [filtersColumns, setFiltersColumns] = useState([true, true, true, true, true, true, true, true, true])
	const [showSelectChecks, setShowSelectChecks] = useState(false)
	const [elementSelected, setElementSelected] = useState(null)
	const [searchValue, setSearchValue] = useState('')
	//const isSmallScreen = useMediaQuery('(max-width: 640px)') // Detectar pantallas pequeñas

	const getChecksUser = async () => {
		try {
			const { data } = await request(`${backend.Reconecta}/UserChecksHome`, 'GET')
			if (data.length > 0) {
				let newFilters = [...filters]
				let newFiltersEquipments = [...filtersEquipments]
				let newFiltersColumns = [...filtersColumns]
				data.forEach((item) => {
					switch (item.type) {
						case 1:
							newFilters[item.check] = false
							break
						case 2:
							newFiltersEquipments[item.check] = false
							break
						case 3:
							newFiltersColumns[item.check] = false
							break
						default:
							break
					}
				})

				setFilters(newFilters)
				setFiltersEquipments(newFiltersEquipments)
				setFiltersColumns(newFiltersColumns)
			}
		} catch (e) {
			console.log(e)
		}
	}

	const handleChecked = (check) => {
		const newFilters = filters.map((item, index) => (index === check ? !item : item))
		setFilters(newFilters)
		const body = {
			check,
			status: newFilters[check] ? 1 : 0,
			type: 1
		}
		request(`${backend.Reconecta}/UserChecksHome`, 'POST', body)
	}

	const handleCheckedEquipments = (check) => {
		const newFilters = filtersEquipments.map((item, index) => (index === check ? !item : item))
		setFiltersEquipments(newFilters)
		const body = {
			check,
			status: newFilters[check] ? 1 : 0,
			type: 2
		}
		request(`${backend.Reconecta}/UserChecksHome`, 'POST', body)
	}

	const handleCheckedColumns = (check) => {
		const newFilters = filtersColumns.map((item, index) => (index === check ? !item : item))
		setFiltersColumns(newFilters)
		const body = {
			check,
			status: newFilters[check] ? 1 : 0,
			type: 3
		}
		request(`${backend.Reconecta}/UserChecksHome`, 'POST', body)
	}

	useEffect(() => {
		if (elementSelected) {
			newTab(elementSelected)
		}
	}, [elementSelected])

	useEffect(() => {
		getChecksUser()
	}, [])

	return (
		<div className={`w-full !rounded-xl flex flex-col items-start`}>
			<div className='bg-white dark:bg-zinc-500 w-full h-full flex justify-center items-center border-2 border-t-0 !p-4 rounded-b-2xl border-zinc-200 dark:!border-gray-700 flex-wrap'>
				<div className='w-9/12 sm:w-11/12 flex justify-start items-center sm:justify-between mb-3'>
					<TextField defaultValue={searchValue} onChange={(e) => setSearchValue(e.target.value)} className='w-5/6 md:w-1/2' label='Buscar registro' variant='outlined' />
					<DropdownCheckbox
						title="Nodos"
						options={[
							{ value: 4, label: 'ET' },
							{ value: 1, label: 'Reconexión' },
							{ value: 2, label: 'Subestación urbana' },
							{ value: 3, label: 'Subestación rural' },
							{ value: 5, label: 'Consumos puntuales' },
						]}
						values={filters}
						onToggle={handleChecked}
					/>
					<DropdownCheckbox
						title="Equipos"
						options={[
							{ value: 1, label: 'Reconectadores', color: 'accent-amber-600' },
							{ value: 2, label: 'Medidores', color: 'accent-red-600' },
							{ value: 3, label: 'Analizadores de red', color: 'accent-purple-600' },
						]}
						values={filtersEquipments}
						onToggle={handleCheckedEquipments}
					/>
					<DropdownCheckbox
						title="Columnas"
						options={[
							{ value: 2, label: 'Nro de serie' },
							{ value: 3, label: 'Estado' },
							{ value: 4, label: 'Conexión' },
							{ value: 5, label: 'Latitud' },
							{ value: 6, label: 'Longitud' },
							{ value: 7, label: 'Potencia' },
						]}
						values={filtersColumns}
						onToggle={handleCheckedColumns}
					/>

				</div>
				<div className='flex w-3/12 sm:w-1/12 justify-end relative mb-3 gap-x-2'>
					<Fab
						size='small'
						className='md:!hidden !flex !justify-center !items-center ml-3'
						onClick={() => setShowSelectChecks(!showSelectChecks)}
					>
						<Checklist />
					</Fab>
					{showSelectChecks && (
						<div className='bg-white dark:bg-zinc-500 p-5 border-2 w-80 border-gray-200 dark:border-gray-700 absolute top-12 right-0 z-10'>
							<label className='italic text-black dark:text-white'>Nodos</label>
							<label className='flex items-center my-2'>
								<input type='checkbox' className='mr-2 !w-6 !h-6' checked={filters[4]} onClick={() => handleChecked(4)} />
								<b className='text-black dark:text-white'>ET</b>
							</label>
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
								<input type='checkbox' className='mr-2 !w-6 !h-6' checked={filters[5]} onClick={() => handleChecked(5)} />
								<b className='text-black dark:text-white'>Consumos puntuales</b>
							</label>
							<label className='italic text-black dark:text-white'>Equipos</label>
							<label className='flex items-center my-2'>
								<input type='checkbox' className='mr-2 !w-6 !h-6 accent-amber-600' checked={filtersEquipments[1]} onClick={() => handleCheckedEquipments(1)} />
								<b className='text-black dark:text-white'>Reconectadores</b>
							</label>
							<label className='flex items-center my-2'>
								<input type='checkbox' className='mr-2 !w-6 !h-6 accent-red-600' checked={filtersEquipments[2]} onClick={() => handleCheckedEquipments(2)} />
								<b className='text-black dark:text-white'>Medidores</b>
							</label>
							<label className='flex items-center my-2'>
								<input type='checkbox' className='mr-2 !w-6 !h-6 accent-purple-600' checked={filtersEquipments[3]} onClick={() => handleCheckedEquipments(3)} />
								<b className='text-black dark:text-white'>Analizadores de red</b>
							</label>
							<label className='italic text-black dark:text-white'>Columnas</label>
							<label className='flex items-center my-2'>
								<input type='checkbox' className='mr-2 !w-6 !h-6' checked={filtersColumns[2]} onClick={() => handleCheckedColumns(2)} />
								<b className='text-black dark:text-white'>Nro de serie</b>
							</label>
							<label className='flex items-center my-2'>
								<input type='checkbox' className='mr-2 !w-6 !h-6' checked={filtersColumns[3]} onClick={() => handleCheckedColumns(3)} />
								<b className='text-black dark:text-white'>Estado</b>
							</label>
							<label className='flex items-center my-2'>
								<input type='checkbox' className='mr-2 !w-6 !h-6' checked={filtersColumns[4]} onClick={() => handleCheckedColumns(4)} />
								<b className='text-black dark:text-white'>Conexión</b>
							</label>
							<label className='flex items-center my-2'>
								<input type='checkbox' className='mr-2 !w-6 !h-6' checked={filtersColumns[5]} onClick={() => handleCheckedColumns(5)} />
								<b className='text-black dark:text-white'>Latitud</b>
							</label>
							<label className='flex items-center my-2'>
								<input type='checkbox' className='mr-2 !w-6 !h-6' checked={filtersColumns[6]} onClick={() => handleCheckedColumns(6)} />
								<b className='text-black dark:text-white'>Longitud</b>
							</label>
							<label className='flex items-center my-2'>
								<input type='checkbox' className='mr-2 !w-6 !h-6' checked={filtersColumns[7]} onClick={() => handleCheckedColumns(7)} />
								<b className='text-black dark:text-white'>Potencia</b>
							</label>
						</div>
					)}
					<ButtonAddElement />
				</div>
				<TableGeneral filters={filters} filtersEquipments={filtersEquipments} filtersColumns={filtersColumns} setElementSelected={setElementSelected} searchValue={searchValue} />
			</div>
		</div>
	)
}

export default TabsHome
