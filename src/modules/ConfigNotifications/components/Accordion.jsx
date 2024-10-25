import React, { useEffect, useState } from 'react'
import AccordionMui from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import TableCustom from '../../../components/TableCustom'
import { ColumnsNot } from '../utils/DataTable/ColumnsNot'
import Button from '@mui/material/Button'
import Swal from 'sweetalert2'
import LoaderComponent from '../../../components/Loader'
import { request } from '../../../utils/js/request'
import { backend } from '../../../utils/routes/app.routes'

const CustomAccordion = ({ title, dataTable }) => {
	const [expanded, setExpanded] = useState(false)
	const [tableData, setTableData] = useState([])
	const [newData, setNewData] = useState({})

	const handleChange = () => {
		setExpanded(!expanded)
	}

	const handlePriority = (row) => {
		let data = newData
		data[row.id] = row
		console.log(data)
		setNewData(data)
	}
	// row.original, 'flash_screen', event.target.checked
	const handleCheck = (row) => {
		let data = newData
		data[row.id] = row
		setNewData(data)
	}
	useEffect(() => {
		setTableData(dataTable)
	}, [])

	const saveData = async () => {
		const { value: result } = await Swal.fire({
			html: '¿Estás seguro de Guardar los Cambios?',
			icon: 'question',
			confirmButtonText: 'Guardar',
			cancelButtonText: 'Cancelar',
			showCancelButton: true,
			showCloseButton: true,
		})
		if (result) {
			// const dataSave = tableData.map((item) => {
			// 	if (newData[item.id]) {
			// 		item = newData[item.id]
			// 	}
			// 	return item
			// })
			const data = Object.values(newData).map((item) => item)
			console.log(data)
			const config = await request(`${backend[`${import.meta.env.VITE_APP_NAME}`]}/ConfigNotify`, 'POST', data)
		}
	}

	return (
		<AccordionMui
			expanded={expanded}
			onChange={handleChange}
			className='!rounded-md !shadow-md dark:!bg-gray-500 !bg-gray-300'
		>
			<AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls='panel1-content' id='panel1-header'>
				{title}
			</AccordionSummary>
			<AccordionDetails className='bg-zinc-100 dark:bg-zinc-900'>
				{expanded && !tableData.length ? (
					<LoaderComponent />
				) : (
					<div className='p-5'>
						<TableCustom
							data={tableData}
							columns={ColumnsNot(handlePriority, handleCheck)}
							density='compact'
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
							enableRowVirtualization
						/>
						<div className='mt-5 w-full flex justify-center'>
							<Button onClick={saveData} variant='contained'>
								Guardar
							</Button>
						</div>
					</div>
				)}
			</AccordionDetails>
		</AccordionMui>
	)
}

export default CustomAccordion
