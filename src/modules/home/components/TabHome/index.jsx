import { Fab, TextField } from '@mui/material'
import { useCallback, useEffect, useState } from 'react'
import { Checklist } from '@mui/icons-material'
import TableGeneral from '../TableGeneral'
import ButtonAddElement from '../ButtonAddElement'
import { request } from '../../../../utils/js/request'
import { backend } from '../../../../utils/routes/app.routes'
import DropdownCheckbox from './dropdownCheckbox'
import OPTIONS from '../../utils/dataTables/tabHome'
import MobileCheckGroup from './MobileCheckGroup'


function TabsHome({ newTab }) {
	const [filters, setFilters] = useState(OPTIONS.DEFAULT_FILTERS)
	const [filtersEquipments, setFiltersEquipments] = useState(OPTIONS.DEFAULT_EQUIPMENT_FILTERS)
	const [filtersColumns, setFiltersColumns] = useState(OPTIONS.DEFAULT_COLUMN_FILTERS)
	const [showSelectChecks, setShowSelectChecks] = useState(false)
	const [searchInput, setSearchInput] = useState('')
	const [searchValue, setSearchValue] = useState('')

	useEffect(() => {
		const t = setTimeout(() => setSearchValue(searchInput), 250)
		return () => clearTimeout(t)
	}, [searchInput])

	useEffect(() => {
		let cancelled = false
		const getChecksUser = async () => {
			try {
				const { data } = await request(`${backend.Reconecta}/UserChecksHome`, 'GET')
				if (cancelled || !data?.length) return
				const nextFilters = [...OPTIONS.DEFAULT_FILTERS]
				const nextEquipments = [...OPTIONS.DEFAULT_EQUIPMENT_FILTERS]
				const nextColumns = [...OPTIONS.DEFAULT_COLUMN_FILTERS]
				data.forEach((item) => {
					switch (item.type) {
						case 1: nextFilters[item.check] = false; break
						case 2: nextEquipments[item.check] = false; break
						case 3: nextColumns[item.check] = false; break
						default: break
					}
				})
				setFilters(nextFilters)
				setFiltersEquipments(nextEquipments)
				setFiltersColumns(nextColumns)
			} catch (e) {
				console.log(e)
			}
		}
		getChecksUser()
		return () => { cancelled = true }
	}, [])

	const handleChecked = useCallback((check) => {
		setFilters((prev) => {
			const next = prev.map((item, index) => (index === check ? !item : item))
			request(`${backend.Reconecta}/UserChecksHome`, 'POST', { check, status: next[check] ? 1 : 0, type: 1 })
			return next
		})
	}, [])

	const handleCheckedEquipments = useCallback((check) => {
		setFiltersEquipments((prev) => {
			const next = prev.map((item, index) => (index === check ? !item : item))
			request(`${backend.Reconecta}/UserChecksHome`, 'POST', { check, status: next[check] ? 1 : 0, type: 2 })
			return next
		})
	}, [])

	const handleCheckedColumns = useCallback((check) => {
		setFiltersColumns((prev) => {
			const next = prev.map((item, index) => (index === check ? !item : item))
			request(`${backend.Reconecta}/UserChecksHome`, 'POST', { check, status: next[check] ? 1 : 0, type: 3 })
			return next
		})
	}, [])

	const handleElementSelected = useCallback((element) => {
		if (element) newTab(element)
	}, [newTab])

	return (
		<div className={`w-full !rounded-xl flex flex-col items-start`}>
			<div className='bg-white dark:bg-zinc-500 w-full h-full flex justify-center items-center border-2 border-t-0 !p-4 rounded-b-2xl border-zinc-200 dark:!border-gray-700 flex-wrap'>
				<div className='w-9/12 sm:w-11/12 flex justify-start items-center sm:justify-between mb-3'>
					<TextField
						value={searchInput}
						onChange={(e) => setSearchInput(e.target.value)}
						className='w-5/6 md:w-1/2'
						label='Buscar registro'
						variant='outlined'
					/>
					<DropdownCheckbox title="Nodos" options={OPTIONS.NODE_OPTIONS} values={filters} onToggle={handleChecked} />
					<DropdownCheckbox title="Equipos" options={OPTIONS.EQUIPMENT_OPTIONS} values={filtersEquipments} onToggle={handleCheckedEquipments} />
					<DropdownCheckbox title="Columnas" options={OPTIONS.COLUMN_OPTIONS} values={filtersColumns} onToggle={handleCheckedColumns} />
				</div>
				<div className='flex w-3/12 sm:w-1/12 justify-end relative mb-3 gap-x-2'>
					<Fab
						size='small'
						className='md:!hidden !flex !justify-center !items-center ml-3'
						onClick={() => setShowSelectChecks((v) => !v)}
					>
						<Checklist />
					</Fab>
					{showSelectChecks && (
						<div className='bg-white dark:bg-zinc-500 p-5 border-2 w-80 border-gray-200 dark:border-gray-700 absolute top-12 right-0 z-10'>
							<MobileCheckGroup title='Nodos' options={OPTIONS.NODE_OPTIONS} values={filters} onToggle={handleChecked} />
							<MobileCheckGroup title='Equipos' options={OPTIONS.EQUIPMENT_OPTIONS} values={filtersEquipments} onToggle={handleCheckedEquipments} />
							<MobileCheckGroup title='Columnas' options={OPTIONS.COLUMN_OPTIONS} values={filtersColumns} onToggle={handleCheckedColumns} />
						</div>
					)}
					<ButtonAddElement />
				</div>
				<TableGeneral
					filters={filters}
					filtersEquipments={filtersEquipments}
					filtersColumns={filtersColumns}
					setElementSelected={handleElementSelected}
					searchValue={searchValue}
				/>
			</div>
		</div>
	)
}

export default TabsHome
