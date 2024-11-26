import { useEffect, useState } from 'react'
import { ColumnsTable, ColumnsTableModal } from './utils/DataTable'
import LoaderComponent from '../../../../../../components/Loader'
import Swal from 'sweetalert2'
import { request } from '../../../../../../utils/js/request'
import { backend } from '../../../../../../utils/routes/app.routes'
import { useNavigate } from 'react-router-dom'
import TableAntecedent from '../TableAntecedent/TableAntecedent'
import { formatterDataModal, formatterDataTable } from '../../utils/Js'
function Subtension({ info }) {
	const navigate = useNavigate()
	const [dataTable, setDataTable] = useState([])
	const [dataTableModal, setDataModal] = useState([])
	const [isLoading, setIsLoading] = useState(true)
	const getDataSubtension = async (dateStart = null, dateFinished = null) => {
		try {
			setIsLoading(true)
			const dataSubtension = await request(
				`${backend[`${import.meta.env.VITE_APP_NAME}`]}/getQualityUnderVoltage`,
				'POST',
				{
					serial: info.serial,
					version: info.version,
					brand: info.brand,
					dateStart,
					dateFinished,
				}
			)
			const dataFormatter = await formatterDataTable(dataSubtension.data)
			dataFormatter.sort((a, b) => {
				return new Date(b.datePeriod) - new Date(a.datePeriod)
			})
			setDataTable(dataFormatter)
			const dataSubtensionModal = await request(
				`${backend[`${import.meta.env.VITE_APP_NAME}`]}/getQualityUnderVoltageSummary`,
				'POST',
				{
					serial: info.serial,
					version: info.version,
					brand: info.brand,
					dateStart,
					dateFinished,
				}
			)
			const dataFormatterModal = await formatterDataModal(dataSubtensionModal.data)
			setDataModal(dataFormatterModal)
		} catch (error) {
			Swal.fire({
				title: 'Atención!',
				html: `Hubo un problema con la carga de los datos del Medidor.</br>Intente nuevamente...`,
				icon: 'error',
			})
			navigate('/Home')
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
			getDataSubtension()
		}
	}, [info])
	if (isLoading) return <LoaderComponent image={false} />
	return (
		<TableAntecedent
			ColumnsTable={ColumnsTable}
			ColumnsTableModal={ColumnsTableModal}
			dataTable={dataTable}
			dataTableModal={dataTableModal}
		/>
	)
}

export default Subtension
