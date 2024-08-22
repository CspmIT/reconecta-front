import { useContext, useEffect, useState } from 'react'
import TableCustom from '../../../../components/TableCustom'
import { columns } from '../../utils/dataTable'
import { useNavigate } from 'react-router-dom'
import { storage } from '../../../../storage/storage'
import { recloser } from '../../../recloser/board/utils/objects'
import { IconButton, Menu, MenuItem } from '@mui/material'
import { Add } from '@mui/icons-material'
import { MainContext } from '../../../../context/MainContext'
import { ColumnsRecloser } from '../../utils/ColumnsTables/ColumnsRecloser'

function TableRecloser({ ...props }) {
	const [reclosers, setReclosers] = useState([])
	const navigate = useNavigate()
	const getdisplay = () => {
		setReclosers([...recloser])
	}

	const changeAlarm = (Nro_Serie) => {
		setReclosers((prevReclosers) =>
			prevReclosers.map((recloser) =>
				recloser.Nro_Serie === Nro_Serie ? { ...recloser, alarm_recloser: !recloser.alarm_recloser } : recloser
			)
		)
	}
	useEffect(() => {
		getdisplay()
	}, [])

	const [visibility, setVisibility] = useState(storage.get('visibilityRecloser'))

	const handleColumnVisibilityChange = (newVisibility) => {
		const change = newVisibility()
		setVisibility((prevVisibility) => ({
			...prevVisibility,
			...change,
		}))
		const listVisibility = storage.get('visibilityRecloser')
		storage.set('visibilityRecloser', {
			...listVisibility,
			...change,
		})
	}
	// const [anchorEl, setAnchorEl] = useState(null)
	// const open = Boolean(anchorEl)
	// const handleClick = (event) => {
	// 	setAnchorEl(event.currentTarget)
	// }
	const { setInfoNav } = useContext(MainContext)
	const changeView = (nameView) => {
		setInfoNav(nameView)
		navigate(`/Abm/${nameView}`)
	}
	// const handleClose = () => {
	// 	setAnchorEl(null)
	// }

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
					// <div>
					<IconButton
						id='basic-button'
						// aria-controls={open ? 'basic-menu' : undefined}
						// aria-haspopup='true'
						// aria-expanded={open ? 'true' : undefined}
						onClick={() => changeView('recloser')}
					>
						<Add />
					</IconButton>
					//  <Menu
					// 	id='basic-menu'
					// 	anchorEl={anchorEl}
					// 	open={open}
					// 	onClose={handleClose}
					// 	MenuListProps={{
					// 		'aria-labelledby': 'basic-button',
					// 	}}
					// >
					// 	<MenuItem onClick={() => changeView('recloser')}>Reconectador</MenuItem>
					// 	<MenuItem onClick={() => changeView('meter')}>Medidor</MenuItem>
					// 	<MenuItem onClick={() => changeView('subStationUrban')}>Sub Estación</MenuItem>
					// 	<MenuItem onClick={() => changeView('subStationRural')}>Sub Estación Rural</MenuItem>
					// 	<MenuItem onClick={() => changeView('networkAnalyzer')}>Analizador de Red</MenuItem>
					// </Menu>
					// </div>
				}
				topToolbar
				copy
				// grouping
				// filter
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
