import { useContext, useEffect, useState } from 'react'
import TableCustom from '../../../../components/TableCustom'
import { columns } from '../../utils/dataTable'
import { useNavigate } from 'react-router-dom'
import { storage } from '../../../../storage/storage'
import { IconButton } from '@mui/material'
import { Add } from '@mui/icons-material'
import { MainContext } from '../../../../context/MainContext'
import { ColumnsRural } from '../../utils/ColumnsTables/ColumnsStationRural'
import { dataUser, substation } from '../../utils/dataTables/dataRural'

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

	const [visibility, setVisibility] = useState(storage.get('visibilitySubstationRural'))

	const handleColumnVisibilityChange = (newVisibility) => {
		const change = newVisibility()
		setVisibility((prevVisibility) => ({
			...prevVisibility,
			...change,
		}))
		const listVisibility = storage.get('visibilitySubstationRural')
		storage.set('visibilitySubstationRural', {
			...listVisibility,
			...change,
		})
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
				btnCustomToolbar={
					<IconButton id='basic-button' onClick={() => changeView('subStationRural')}>
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

export default TableSubStationRural
