import { useContext, useEffect, useState } from 'react'
import TableCustom from '../../../../components/TableCustom'
import { useNavigate } from 'react-router-dom'
import { storage } from '../../../../storage/storage'
import { useMediaQuery } from '@mui/material'
import { MainContext } from '../../../../context/MainContext'
import { ColumnsMeter, ColumnsMeterCel } from '../../utils/ColumnsTables/ColumnsMeter'
import { request } from '../../../../utils/js/request'
import { backend } from '../../../../utils/routes/app.routes'

function TableMeter({ ...props }) {
	const [meters, setMeters] = useState([])
	const navigate = useNavigate()
	const isMobile = useMediaQuery('(max-width: 600px)')
	const getdisplay = async () => {
		const metersList = await request(`${backend.Reconecta}/getListMeter`, 'GET')
		const dataFormater = metersList.data.map((item) => ({
			serial: item.serial,
			id: item.id,
			matricula: item.number,
			device_name: item.name,
			version: item.fullVersion,
			status_meter: item.status_meter,
		}))
		setMeters(dataFormater)
	}

	const getColumns = async () => {
		try {
			const user = storage.get('usuario').sub
			const data = {
				table_name: 'meter',
				id_user: user,
			}
			const column = await request(`${backend[`${import.meta.env.VITE_APP_NAME}`]}/getColumnsTable`, 'POST', data)
			const visibility = column.data.reduce((acc, item) => {
				acc[item.name] = item.status
				return acc
			}, {})
			storage.set('visibilityMeter', visibility)
			setVisibility(visibility)
		} catch (error) {
			storage.remove('visibilityMeter')
			console.error('Error fetching columns:', error)
		}
	}
	const [visibility, setVisibility] = useState(getColumns)
	const handleColumnVisibilityChange = async (newVisibility) => {
		const change = newVisibility()
		setVisibility((prevVisibility) => ({
			...prevVisibility,
			...change,
		}))
		const listVisibility = storage.get('visibilityMeter')
		const columns = {
			...listVisibility,
			...change,
		}
		storage.set('visibilityMeter', columns)
		const data = { table: 'meter', columns: columns }
		await request(`${backend[`${import.meta.env.VITE_APP_NAME}`]}/saveConfigTable`, 'POST', data)
	}

	useEffect(() => {
		getdisplay()
	}, [])

	const { setInfoNav } = useContext(MainContext)
	const changeView = (nameView) => {
		setInfoNav(nameView)
		navigate(`/Abm/${nameView}`)
	}
	const [darkMode, setDarkMode] = useState(storage.get('dark'))
	useEffect(() => {
		setDarkMode(storage.get('dark'))
	}, [storage.get('dark')])

	const stylesTable = {
		header: { background: !darkMode ? 'rgb(190 190 190) ' : 'rgb(46 46 46) ' },
		toolbarClass: { background: !darkMode ? 'rgb(190 190 190) ' : 'rgb(46 46 46) ' },
		footer: { background: !darkMode ? 'rgb(190 190 190) ' : 'rgb(46 46 46) ' },
	}
	return (
		<div className='pb-5 w-full'>
			<TableCustom
				data={meters}
				columns={isMobile ? ColumnsMeterCel(props.newTab) : ColumnsMeter(props.newTab)}
				density='compact'
				header={{
					...stylesTable.header,
					fontSize: '18px',
					fontWeight: 'bold',
				}}
				toolbarClass={{ ...stylesTable.toolbarClass }}
				body={{ backgroundColor: 'rgba(209, 213, 219, 0.31)' }}
				footer={{ ...stylesTable.footer }}
				card={{
					boxShadow: `1px 1px 8px 0px #00000046`,
					borderRadius: '0.75rem',
				}}
				topToolbar
				pageSize={20}
				copy
				grouping
				hide
				sort
				pagination
				columnVisibility={visibility}
				onColumnVisibilityChange={handleColumnVisibilityChange}
			/>
		</div>
	)
}

export default TableMeter
