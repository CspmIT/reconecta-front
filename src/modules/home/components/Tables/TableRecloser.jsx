import { useContext, useEffect, useState } from 'react'
import TableCustom from '../../../../components/TableCustom'
import { storage } from '../../../../storage/storage'
import { MainContext } from '../../../../context/MainContext'
import { ColumnsRecloser, ColumnsRecloserCel } from '../../utils/ColumnsTables/ColumnsRecloser'
import { request } from '../../../../utils/js/request'
import { useNavigate } from 'react-router-dom'
import { backend } from '../../../../utils/routes/app.routes'
import Swal from 'sweetalert2'
import LoaderComponent from '../../../../components/Loader'
import { useMediaQuery } from '@mui/material'

function TableRecloser({ ...props }) {
	const { setInfoNav } = useContext(MainContext)
	const isMobile = useMediaQuery('(max-width: 600px)')
	const [reclosers, setReclosers] = useState(null)
	const navigate = useNavigate()
	const getdisplay = async () => {
		const recloser = await request(`${backend[`${import.meta.env.VITE_APP_NAME}`]}/getAllReclosers`, 'GET')
		setReclosers(recloser.data)
	}

	const changeAlarm = async (data) => {
		try {
			await request(`${backend.Reconecta}/changeStatusAlarm`, 'POST', {
				id: data.id,
				status_alarm: !data.status_alarm,
			})
			setReclosers((prevReclosers) =>
				prevReclosers.map((recloser) =>
					recloser.serial === data.serial ? { ...recloser, status_alarm: !recloser.status_alarm } : recloser
				)
			)
		} catch (error) {}
	}
	const columnsDefaultHide = ['serial', 'version', 'status_alarm']
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
			for (const element of columnsDefaultHide) {
				if (!visibility?.[element]) {
					visibility[element] = false
				}
			}
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

	// const changeView = (nameView) => {
	// 	setInfoNav(nameView)
	// 	navigate(`/Abm/${nameView}`)
	// }
	const deleteRecloser = async (data) => {
		Swal.fire({
			title: '¡Atención!',
			text: '¿Que desea realizar?',
			icon: 'question',
			allowOutsideClick: false,
			showDenyButton: true,
			showCancelButton: true,
			confirmButtonText: 'Eliminar',
			denyButtonText: 'Desvincular',
		}).then(async (result) => {
			if (result.isConfirmed) {
				try {
					data.status = 0
					data.type_device = 1
					const result = await request(
						`${backend[`${import.meta.env.VITE_APP_NAME}`]}/deleteRecloser`,
						'POST',
						data
					)
					Swal.fire({ title: 'Perfecto!', text: 'Se guardo correctamente!', icon: 'success' })
					getdisplay()
				} catch (error) {
					console.error(error)
					Swal.fire({
						title: 'Atención!',
						text: 'Hubo un error al intentear eliminar el reconectador',
						icon: 'warning',
					})
				}
			}
			if (result.isDenied) {
				try {
					data.status = 0
					data.type_device = 1
					const result = await request(
						`${backend[`${import.meta.env.VITE_APP_NAME}`]}/unlinkRelation`,
						'POST',
						data
					)
					Swal.fire({ title: 'Perfecto!', text: 'Se guardo correctamente!', icon: 'success' })
					getdisplay()
				} catch (error) {
					console.error(error)
					Swal.fire({
						title: 'Atención!',
						text: 'Hubo un error al intentear desvincular el reconectador',
						icon: 'warning',
					})
				}
			}
		})
	}
	useEffect(() => {
		getdisplay()
	}, [])

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
		<>
			{reclosers ? (
				<div className='pb-5 w-full'>
					<TableCustom
						data={reclosers}
						columns={
							isMobile
								? ColumnsRecloserCel(changeAlarm, props.newTab, deleteRecloser)
								: ColumnsRecloser(changeAlarm, props.newTab, deleteRecloser)
						}
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
						hide
						sort
						pagination
						columnVisibility={visibility}
						onColumnVisibilityChange={handleColumnVisibilityChange}
					/>
				</div>
			) : (
				<div className='h-96'>
					<LoaderComponent image={false} />
				</div>
			)}
		</>
	)
}

export default TableRecloser
