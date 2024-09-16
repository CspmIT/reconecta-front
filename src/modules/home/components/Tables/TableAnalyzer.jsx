import { useContext, useEffect, useState } from 'react'
import TableCustom from '../../../../components/TableCustom'
import { columns } from '../../utils/dataTable'
import { useNavigate } from 'react-router-dom'
import { storage } from '../../../../storage/storage'
import { IconButton } from '@mui/material'
import { Add } from '@mui/icons-material'
import { MainContext } from '../../../../context/MainContext'
import { AnalyzerList } from '../../utils/dataTables/dataAnalyzer'
import { ColumnsAnalyzer } from '../../utils/ColumnsTables/ColumnsAnalyzer'
import { request } from '../../../../utils/js/request'
import { backend } from '../../../../utils/routes/app.routes'

function TableAnalyzer({ ...props }) {
	const [analizers, setAnalizers] = useState([])
	const navigate = useNavigate()
	const getdisplay = () => {
		const data = AnalyzerList.map((item) => {
			let info = { ...item }
			info.version = item.version == 1 ? 'SMART' : ''
			info.brand = item.brand == 1 ? 'POWERMETER' : 'SACI'
			return info
		})
		setAnalizers(data)
	}
	const getColumns = async () => {
		try {
			const user = storage.get('usuario').sub
			const data = {
				table_name: 'analizer',
				id_user: user,
			}
			const column = await request(`${backend[`${import.meta.env.VITE_APP_NAME}`]}/getColumnsTable`, 'POST', data)
			const visibility = column.data.reduce((acc, item) => {
				acc[item.name] = item.status
				return acc
			}, {})
			storage.set('visibilityAnalyzer', visibility)
			setVisibility(visibility)
		} catch (error) {
			storage.remove('visibilityAnalyzer')
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
		const listVisibility = storage.get('visibilityAnalyzer')
		const columns = {
			...listVisibility,
			...change,
		}
		storage.set('visibilityAnalyzer', columns)
		const data = { table: 'analizer', columns: columns }
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
				data={analizers}
				columns={ColumnsAnalyzer(props.newTab)}
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
				// 	<IconButton id='basic-button' onClick={() => changeView('netAnalyzer')}>
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

export default TableAnalyzer
