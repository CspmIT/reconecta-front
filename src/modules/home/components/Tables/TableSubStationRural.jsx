import { useContext, useEffect, useState } from 'react'
import TableCustom from '../../../../components/TableCustom'
import { useNavigate } from 'react-router-dom'
import { storage } from '../../../../storage/storage'
import { IconButton } from '@mui/material'
import { Add } from '@mui/icons-material'
import { MainContext } from '../../../../context/MainContext'
import { ColumnsRural } from '../../utils/ColumnsTables/ColumnsStationRural'
import { dataUser, substation } from '../../utils/dataTables/dataRural'
import { request } from '../../../../utils/js/request'
import { backend } from '../../../../utils/routes/app.routes'

function TableSubStationRural({ ...props }) {
	const [subStations, setSubStations] = useState([])
	const navigate = useNavigate()
	const generateData = () => {
		const Station = substation.map((station, index) => {
			station.user = dataUser.filter((item, index) => item.id_user_recloser == station.id)
			return station
		})
		setSubStations(Station)
	}
	const getColumns = async () => {
		try {
			const user = storage.get('usuario').sub
			const data = {
				table_name: 'sub_rural',
				id_user: user,
			}
			const column = await request(`${backend[`${import.meta.env.VITE_APP_NAME}`]}/getColumnsTable`, 'POST', data)
			const visibility = column.data.reduce((acc, item) => {
				acc[item.name] = item.status
				return acc
			}, {})
			storage.set('visibilitySubstationRural', visibility)
			setVisibility(visibility)
		} catch (error) {
			storage.remove('visibilitySubstationRural')
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
		const listVisibility = storage.get('visibilitySubstationRural')
		const columns = {
			...listVisibility,
			...change,
		}
		storage.set('visibilitySubstationRural', columns)
		const data = { table: 'sub_rural', columns: columns }
		await request(`${backend[`${import.meta.env.VITE_APP_NAME}`]}/saveConfigTable`, 'POST', data)
	}

	useEffect(() => {
		generateData()
	}, [])

	const { setInfoNav } = useContext(MainContext)
	const changeView = (nameView) => {
		setInfoNav(nameView)
		navigate(`/Abm/${nameView}`)
	}

	return (
		<div className='pb-5 w-full'>
			<TableCustom
				key={Math.random()}
				data={subStations}
				columns={ColumnsRural(props.newTab)}
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
				// 	<IconButton id='basic-button' onClick={() => changeView('subStationRural')}>
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

export default TableSubStationRural
