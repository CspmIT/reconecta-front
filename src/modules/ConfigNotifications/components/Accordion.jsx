import { useEffect, useState } from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import TableCustom from '../../../components/TableCustom'
import { ColumnsNot } from '../utils/DataTable/ColumnsNot'
import Swal from 'sweetalert2'
import LoaderComponent from '../../../components/Loader'
import { request } from '../../../utils/js/request'
import { backend } from '../../../utils/routes/app.routes'
import { Accordion, AccordionDetails, AccordionSummary, Button } from '@mui/material'
import {
	downloadFromFormData,
	generateFileAlarm,
	generateFileEvent,
	generateSources,
	sendConfigMqtt,
} from '../utils/js'
import SwalLoader from '../../../components/SwalLoader/SwalLoader'

const CustomAccordion = ({ title, dataTable, access }) => {
	const [expanded, setExpanded] = useState(false)
	const [tableData, setTableData] = useState([])
	const [newData, setNewData] = useState({})
	const [isLoading, setIsLoading] = useState(true)
	const handleChange = () => {
		setExpanded(!expanded)
		if (expanded) {
			setTableData([])
		} else {
			setTimeout(() => {
				setTableData(dataTable)
			}, 300)
		}
	}

	const handlePriority = (row) => {
		const dataTable = tableData.reduce((acc, value) => {
			acc.push(value.id == row.id ? row : value)
			return acc
		}, [])
		setTableData(dataTable)
		let data = newData
		data[row.id] = row
		setNewData(data)
	}
	const handleCheck = (row) => {
		let data = newData
		data[row.id] = row
		setNewData(data)
	}
	useEffect(() => {
		if (tableData.length) {
			setIsLoading(false)
		} else {
			setIsLoading(true)
		}
	}, [tableData])

	const saveData = async () => {
		try {
			const { value: result } = await Swal.fire({
				html: '¿Estás seguro de Guardar los Cambios?',
				icon: 'question',
				confirmButtonText: 'Guardar',
				cancelButtonText: 'Cancelar',
				showCancelButton: true,
				showCloseButton: true,
			})

			if (result) {
				SwalLoader()
				// todo esto comentado es para pasar lo de alarmas por mqtt pero se cambio para hacerlo por ftp
				// const dataModify = Object.values(newData).map((item) => item)
				// CANTIDAD DE REGISTROS POR GRUPO
				// const cantReg = 47
				// const sources = await generateSources(tableData, dataModify, cantReg)
				// await sendConfigMqtt(sources, tableData[0].type, tableData[0].id_version)

				const fileEvent = await generateFileEvent(tableData)
				const fileAlarm = await generateFileAlarm(tableData)
				// para ver como queda el txt descomenta esta linea y pasale el formdata
				// await downloadFromFormData(fileEvent)
				// await downloadFromFormData(fileAlarm)
				const data = Object.values(newData).map((item) => item)
				await request(`${backend[`${import.meta.env.VITE_APP_NAME}`]}/ConfigNotify`, 'POST', data)
				Swal.close()
				Swal.fire({
					title: 'Recorda!',
					text: 'Esta comentado el codigo del guardado por precuación',
					icon: 'warning',
				})
			}
		} catch (error) {
			Swal.fire({
				title: 'Atención!',
				text: 'Hubo un error al guardar la configuración',
				icon: 'warning',
			})
			console.error(error) // Captura y muestra el error
		}
	}
	return (
		<Accordion
			expanded={expanded}
			onChange={handleChange}
			className='!rounded-md !shadow-md dark:!bg-gray-500 !bg-gray-300'
		>
			<AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls='panel1-content' id='panel1-header'>
				{title}
			</AccordionSummary>
			<AccordionDetails className='bg-zinc-100 dark:bg-zinc-900'>
				{isLoading ? (
					<LoaderComponent image={false} />
				) : (
					<div className='p-5'>
						<TableCustom
							data={tableData}
							columns={ColumnsNot(handlePriority, handleCheck, access)}
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
							groupBy={'type_var'}
							enableRowVirtualization
						/>
						<div className='mt-5 w-full flex justify-center'>
							<Button onClick={saveData} disabled={!access} variant='contained'>
								Guardar
							</Button>
						</div>
					</div>
				)}
			</AccordionDetails>
		</Accordion>
	)
}

export default CustomAccordion
