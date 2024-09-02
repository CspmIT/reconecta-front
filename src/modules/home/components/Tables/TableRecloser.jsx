import { useContext, useEffect, useState } from 'react'
import TableCustom from '../../../../components/TableCustom'
import { storage } from '../../../../storage/storage'
import { Button, IconButton } from '@mui/material'
import { Add } from '@mui/icons-material'
import { MainContext } from '../../../../context/MainContext'
import { ColumnsRecloser } from '../../utils/ColumnsTables/ColumnsRecloser'
import { request } from '../../../../utils/js/request'
import { useNavigate } from 'react-router-dom'
import { backend } from '../../../../utils/routes/app.routes'

function TableRecloser({ ...props }) {
	const { setInfoNav } = useContext(MainContext)
	const [reclosers, setReclosers] = useState([])
	const navigate = useNavigate()
	const getdisplay = async () => {
		const recloser = await request(`${backend[`${import.meta.env.VITE_APP_NAME}`]}/getAllReclosers`, 'GET')
		setReclosers([...recloser.data])
	}

	const changeAlarm = (Nro_Serie) => {
		setReclosers((prevReclosers) =>
			prevReclosers.map((recloser) =>
				recloser.serial === Nro_Serie
					? { ...recloser, status_alarm_recloser: !recloser.status_alarm_recloser }
					: recloser
			)
		)
	}

	const getColumns = async () => {
		try {
			const user = storage.get('usuario').sub
			const data = {
				table_name: 'recloser',
				id_user: user,
			}
			const column = await request(`${backend[`${import.meta.env.VITE_APP_NAME}`]}/getColumnsTable`, 'POST', data)
			const visibility = column.data.reduce((acc, item) => {
				acc[item.name] = item.status
				return acc
			}, {})
			storage.set('visibilityRecloser', visibility)
			setVisibility(visibility)
		} catch (error) {
			storage.remove('visibilityRecloser')
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
		const listVisibility = storage.get('visibilityRecloser')
		const columns = {
			...listVisibility,
			...change,
		}
		storage.set('visibilityRecloser', columns)
		const data = { table: 'recloser', columns: columns }
		await request(`${backend[`${import.meta.env.VITE_APP_NAME}`]}/saveConfigTable`, 'POST', data)
	}

	const changeView = (nameView) => {
		setInfoNav(nameView)
		navigate(`/Abm/${nameView}`)
	}

	useEffect(() => {
		getdisplay()
	}, [])

	return (
		<div className='pb-5 w-full'>
			<TableCustom
				data={reclosers}
				columns={ColumnsRecloser(changeAlarm, props.newTab)}
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
					<IconButton id='basic-button' onClick={() => changeView('recloser')}>
						<Add />
					</IconButton>
				}
				topToolbar
				copy
				hide
				sort
				pagination
				columnVisibility={visibility}
				onColumnVisibilityChange={handleColumnVisibilityChange}
			/>
		</div>
	)
}

export default TableRecloser
