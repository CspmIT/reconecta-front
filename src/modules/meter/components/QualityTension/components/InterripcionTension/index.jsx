import { ColumnsTable, ColumnsTableModal } from './utils/DataTable'
import TableAntecedent from '../TableAntecedent/TableAntecedent'
import LoaderComponent from '../../../../../../components/Loader'
import Swal from 'sweetalert2'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { request } from '../../../../../../utils/js/request'
import { backend } from '../../../../../../utils/routes/app.routes'
import { formatterDataModal, formatterDataTable } from './utils/js/action'
function InterrupcionTension({ info }) {
	const navigate = useNavigate()
	const [dataTable, setDataTable] = useState([])
	const [dataModal, setDataModal] = useState([])
	const [isLoading, setIsLoading] = useState(true)
	const getDataInterruption = async (dateStart = null, dateFinished = null) => {
		try {
			setIsLoading(true)
			const dataSubtension = await request(
				`${backend[`${import.meta.env.VITE_APP_NAME}`]}/getQualityInterruption`,
				'POST',
				{
					serial: info.serial,
					version: info.version,
					brand: info.brand,
					dateStart,
					dateFinished,
				}
			)
			console.log(dataSubtension)
			const dataFormatter = await formatterDataTable(dataSubtension.data)
			console.log(dataFormatter)
			dataFormatter.sort((a, b) => {
				return new Date(b.datePeriod) - new Date(a.datePeriod)
			})
			setDataTable(dataFormatter)
			const dataSubtensionModal = await request(
				`${backend[`${import.meta.env.VITE_APP_NAME}`]}/getQualityInterruptionSummary`,
				'POST',
				{
					serial: info.serial,
					version: info.version,
					brand: info.brand,
					dateStart,
					dateFinished,
				}
			)
			console.log(dataSubtensionModal)
			const dataFormatterModal = await formatterDataModal(dataSubtensionModal.data)
			console.log(dataFormatterModal)
			setDataModal(dataFormatterModal)
		} catch (error) {
			console.error(error)
			Swal.fire({
				title: 'Atención!',
				html: `Hubo un problema con la carga de los datos del Medidor.</br>Intente nuevamente...`,
				icon: 'error',
			})
			// navigate('/Home')
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		if (!info) {
			Swal.fire({
				title: 'Atención!',
				html: `Hubo un problema con la carga de los datos del Medidor.</br>Intente nuevamente...`,
				icon: 'error',
			})
			navigate('/Home')
		} else {
			getDataInterruption()
		}
	}, [info])
	if (isLoading) return <LoaderComponent image={false} />
	return (
		<TableAntecedent
			ColumnsTable={ColumnsTable}
			ColumnsTableModal={ColumnsTableModal}
			dataTable={dataTable}
			dataTableModal={dataModal}
		/>
	)
}

export default InterrupcionTension
