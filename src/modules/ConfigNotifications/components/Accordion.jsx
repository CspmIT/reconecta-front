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
	const sendNotificationMQTT = async (dataInflux) => {
		try {
			await request(`${backend[`${import.meta.env.VITE_APP_NAME}`]}/sendMqttMessagge`, 'POST', dataInflux)
		} catch (error) {
			throw new Error(error)
		}
	}
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

				// BUSCO TODO LOS RECONECTADORES CON EL ID DE VERSION QUE SE MODIFICO PARA MANDARLE LA ALERTA DE QUE SE ACTUALIZO LAS ALARMAS Y LOS EVENTOS.
				const listRecloser = await request(
					`${backend[`${import.meta.env.VITE_APP_NAME}`]}/getRecloserxVersion?id_version=${
						tableData[0].id_version
					}`,
					'GET'
				)
				const now = new Date()

				const options = {
					timeZone: 'America/Argentina/Buenos_Aires',
					year: 'numeric',
					month: '2-digit',
					day: '2-digit',
					hour: '2-digit',
					minute: '2-digit',
					second: '2-digit',
				}

				const formattedDate = new Intl.DateTimeFormat('en-US', options).format(now).replace(/[\s:,/]/g, '')

				const nameFile = `_${listRecloser.data?.[0]?.version?.brand?.name}_${listRecloser.data?.[0]?.version?.name}_${formattedDate}.txt`
				const fileEvent = await generateFileEvent(tableData, nameFile)
				const fileAlarm = await generateFileAlarm(tableData, nameFile)

				if (listRecloser.data) {
					listRecloser.data.forEach((info) => {
						const dataInflux = {
							url: 'eventUpdate',
							brand: info?.version?.brand?.name,
							serial: info?.serial,
							data: `Event_${nameFile}`,
						}
						// COMENTE EL GUARDADO EN MQTT PARA NO GENERAR BASURA PERO ESTA FUNCIONAL.
						// FALTA GENERAR EL ENVIO POR ALARMAS PERO ES EL MISMO dataInflux SOLO QUE CAMBIANDO EL URL A alarmUpdate y en el nombre del archivo pasarlo a Alarm_
						// sendNotificationMQTT(dataInflux)
					})
				}
				// FALTA EL GUARDADO DEL ARCHIVO EN EL SERVIDOR FTP
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
