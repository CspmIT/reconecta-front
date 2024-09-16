import { useContext, useEffect, useState } from 'react'
import TableCustom from '../../../../components/TableCustom'
import { columns } from '../../utils/dataTable'
import { useNavigate } from 'react-router-dom'
import { storage } from '../../../../storage/storage'
import { IconButton } from '@mui/material'
import { Add } from '@mui/icons-material'
import { MainContext } from '../../../../context/MainContext'
import { ColumnsUrban } from '../../utils/ColumnsTables/ColumnsStationUrban'
import { request } from '../../../../utils/js/request'
import { backend } from '../../../../utils/routes/app.routes'

function TableSubStationUrban({ ...props }) {
	const [subStations, setSubStations] = useState([])
	const navigate = useNavigate()
	const getdisplay = () => {
		setSubStations([
			{
				id: '16',
				date_create: '2024-06-12 13:59:00',
				lat_location: '-30.716188',
				lng_location: '-62.005287',
				location: 'URQUIZA 17',
				name: 'CONSUMO INTERNO COOPMORTEROS',
				power: '100',
				status: 1,
				user_create: '257',
				potencia: 48.04,
				status_markador: '#cc0000',
			},
			{
				id: '4',
				date_create: '2023-12-28 11:08:00',
				lat_location: '-30.734469',
				lng_location: '-62.007158',
				location: 'RP1',
				name: 'SETA 64',
				power: '400',
				status: 1,
				user_create: '257',
				potencia: 4.16,
				status_markador: '#48a240',
			},
			{
				id: '10',
				date_create: '2024-01-03 14:47:00',
				lat_location: '-30.719774',
				lng_location: '-61.993065',
				location: 'PARQUE SOLAR FOTOVOLTAICO',
				name: 'SETA PARQUE SOLAR ',
				power: '300 KVA',
				status: 1,
				user_create: '257',
				potencia: 0,
				status_markador: '#cc0000',
			},
		])
	}
	const getColumns = async () => {
		try {
			const user = storage.get('usuario').sub
			const data = {
				table_name: 'sub_urban',
				id_user: user,
			}
			const column = await request(`${backend[`${import.meta.env.VITE_APP_NAME}`]}/getColumnsTable`, 'POST', data)
			const visibility = column.data.reduce((acc, item) => {
				acc[item.name] = item.status
				return acc
			}, {})
			storage.set('visibilitySubstationUrb', visibility)
			setVisibility(visibility)
		} catch (error) {
			storage.remove('visibilitySubstationUrb')
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
		const listVisibility = storage.get('visibilitySubstationUrb')
		const columns = {
			...listVisibility,
			...change,
		}
		storage.set('visibilitySubstationUrb', columns)
		const data = { table: 'sub_urban', columns: columns }
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

	return (
		<div className='pb-5 w-full'>
			<TableCustom
				data={subStations}
				columns={ColumnsUrban(props.newTab)}
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
				// btnCustomToolbar={
				// 	<IconButton id='basic-button' onClick={() => changeView('subStationUrban')}>
				// 		<Add />
				// 	</IconButton>
				// }
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

export default TableSubStationUrban
