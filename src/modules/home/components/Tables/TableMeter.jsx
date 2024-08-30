import { useContext, useEffect, useState } from 'react'
import TableCustom from '../../../../components/TableCustom'
import { useNavigate } from 'react-router-dom'
import { storage } from '../../../../storage/storage'
import { IconButton } from '@mui/material'
import { Add } from '@mui/icons-material'
import { MainContext } from '../../../../context/MainContext'
import { deviceSubStation, devices, listMeters } from '../../utils/dataTables/dataMeter'
import { ColumnsMeter } from '../../utils/ColumnsTables/ColumnsMeter'
import { request } from '../../../../utils/js/request'

function TableMeter({ ...props }) {
	const [meters, setMeters] = useState([])
	const navigate = useNavigate()
	const getdisplay = () => {
		const metersList = listMeters.map((meter) => {
			deviceSubStation
				.filter((device) => device.id_device == meter.id)
				.map((device) => {
					meter.device_name = device.name
					meter.type_station = 'SUB ESTACIÓN'
				})
			devices
				.filter((device) => device.id_device == meter.id)
				.map((device) => {
					switch (parseInt(device.id_substation)) {
						case 1:
							meter.device_name = 'MEDICION EN BARRA'
							break
						case 2:
							meter.device_name = 'ALIMENTADOR 1'
							break
						case 3:
							meter.device_name = 'ALIMENTADOR 2'
							break
						case 4:
							meter.device_name = 'DISTRIBUIDOR 1'
							break
						case 5:
							meter.device_name = 'DISTRIBUIDOR 2'
							break
						case 6:
							meter.device_name = 'DISTRIBUIDOR 3'
							break
						case 7:
							meter.device_name = 'DISTRIBUIDOR 4'
							break
					}
					meter.type_station = 'ESTACIÓN DE REBAJE'
				})
			return meter
		})
		setMeters(metersList)
	}

	const getColumns = async () => {
		try {
			const user = storage.get('usuario').sub
			const data = {
				table_name: 'meter',
				id_user: user,
			}
			const column = await request(`${import.meta.env.VITE_APP_BACK}/getColumnsTable`, 'POST', data)
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
		await request(`${import.meta.env.VITE_APP_BACK}/saveConfigTable`, 'POST', data)
	}

	useEffect(() => {
		getdisplay()
	}, [])

	const { setInfoNav } = useContext(MainContext)
	const changeView = (nameView) => {
		setInfoNav(nameView)
		navigate(`/Abm/${nameView}`)
	}

	return (
		<div className='pb-5 w-full'>
			<TableCustom
				data={meters}
				columns={ColumnsMeter(props.newTab)}
				density='comfortable'
				header={{
					background: 'rgb(190 190 190)',
					fontSize: '18px',
					fontWeight: 'bold',
				}}
				toolbarClass={{ background: 'rgb(190 190 190)' }}
				body={{ backgroundColor: 'rgba(209, 213, 219, 0.31)' }}
				footer={{ background: 'rgb(190 190 190)' }}
				card={{
					boxShadow: `1px 1px 8px 0px #00000046`,
					borderRadius: '0.75rem',
				}}
				btnCustomToolbar={
					<IconButton id='basic-button' onClick={() => changeView('meter')}>
						<Add />
					</IconButton>
				}
				topToolbar
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
