import { useEffect, useState } from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Swal from 'sweetalert2'
import LoaderComponent from '../../../components/Loader'
import { request } from '../../../utils/js/request'
import { backend } from '../../../utils/routes/app.routes'
import { Accordion, AccordionDetails, AccordionSummary, Button } from '@mui/material'
import SwalLoader from '../../../components/SwalLoader/SwalLoader'
import TablesEvents from '../utils/DataTable/TablesEvents'

const CustomAccordion = ({ title, dataTable, access }) => {
	const [expanded, setExpanded] = useState(false)
	const [tableData, setTableData] = useState([])
	const [isLoading, setIsLoading] = useState(true)
	const [newConfigs, setNewConfigs] = useState([])
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

	useEffect(() => {
		if (tableData.length) {
			setIsLoading(false)
		} else {
			setIsLoading(true)
		}
	}, [tableData])

	const handleNewConfigs = async (type, checked, id) => {
		let field
		switch (type) {
			case 1:
				field = { priority: checked, id }
				break;
			case 2:
				field = { flash_screen: checked ? 1 : 0, id }
				break;
			case 3:
				field = { alarm: checked ? 1 : 0, id }
				break;
			default:
				break;
		}

		const chargedConfigs = [...newConfigs]
		const index = chargedConfigs.findIndex(item => item.id === id)
		if (index !== -1) {
			chargedConfigs[index] = {
				...chargedConfigs[index],
				...field,
			}
		} else {
			chargedConfigs.push(field)
		}

		setNewConfigs(chargedConfigs)
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
				await request(`${backend.Reconecta}/ConfigNotify`, 'PATCH', newConfigs)
				Swal.fire({
					title: 'Perfecto!',
					text: 'Configuración guardada correctamente',
					icon: 'success',
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
						<TablesEvents initialData={tableData} handleNewConfig={handleNewConfigs} />
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