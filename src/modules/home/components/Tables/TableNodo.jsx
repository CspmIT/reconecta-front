import { useContext, useEffect, useState } from 'react'
import TableCustom from '../../../../components/TableCustom'
import { storage } from '../../../../storage/storage'
import { MainContext } from '../../../../context/MainContext'
import { request } from '../../../../utils/js/request'
import { useNavigate } from 'react-router-dom'
import { backend } from '../../../../utils/routes/app.routes'
import { ColumnsNodo, ColumnsNodoCel } from '../../utils/ColumnsTables/ColumnsNodo'
import LoaderComponent from '../../../../components/Loader'
import Swal from 'sweetalert2'
import { useMediaQuery } from '@mui/material'

function TableNodo() {
	const { setInfoNav } = useContext(MainContext)
	const [node, setNode] = useState(null)
	const isMobile = useMediaQuery('(max-width: 600px)')
	const navigate = useNavigate()
	const getdisplay = async () => {
		const nodes = await request(`${backend[`${import.meta.env.VITE_APP_NAME}`]}/getListNode`, 'GET')
		setNode(nodes.data)
	}
	const getColumns = async () => {
		try {
			const user = storage.get('usuario').sub
			const data = {
				table_name: 'node',
				id_user: user,
			}
			const column = await request(`${backend[`${import.meta.env.VITE_APP_NAME}`]}/getColumnsTable`, 'POST', data)
			const visibility = column.data.reduce((acc, item) => {
				acc[item.name] = item.status
				return acc
			}, {})
			storage.set('visibilityNode', visibility)
			setVisibility(visibility)
		} catch (error) {
			storage.remove('visibilityNode')
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
		const listVisibility = storage.get('visibilityNode')
		const columns = {
			...listVisibility,
			...change,
		}
		storage.set('visibilityNode', columns)
		const data = { table: 'node', columns: columns }
		await request(`${backend[`${import.meta.env.VITE_APP_NAME}`]}/saveConfigTable`, 'POST', data)
	}

	const changeView = (data) => {
		setInfoNav([{ ...data, link: '/Abm/' }])
		navigate(`/Abm/node/${data.id}`)
	}
	const deleteNodo = async (data) => {
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
					Swal.fire({
						text: 'Por favos espere...',
						timerProgressBar: true,
						didOpen: () => {
							Swal.showLoading()
						},
					})
					const result = await request(
						`${backend[`${import.meta.env.VITE_APP_NAME}`]}/deleteNode`,
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
					Swal.fire({
						text: 'Por favos espere...',
						timerProgressBar: true,
						didOpen: () => {
							Swal.showLoading()
						},
					})
					const result = await request(
						`${backend[`${import.meta.env.VITE_APP_NAME}`]}/unlinkRelationNode`,
						'POST',
						data
					)
					Swal.fire({ title: 'Perfecto!', text: 'Se desvinculo correctamente!', icon: 'success' })
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
	return (
		<>
			{node ? (
				<div className='pb-5 w-full'>
					<TableCustom
						data={node}
						columns={isMobile ? ColumnsNodoCel(changeView, deleteNodo) : ColumnsNodo(changeView, deleteNodo)}
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
						topToolbar
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

export default TableNodo
