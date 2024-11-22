import { useEffect, useState } from 'react'
import { ColumnsTable, ColumnsTableModal } from './utils/DataTable'
import { useNavigate } from 'react-router-dom'
import { request } from '../../../../../../utils/js/request'
import { backend } from '../../../../../../utils/routes/app.routes'
import Swal from 'sweetalert2'
import LoaderComponent from '../../../../../../components/Loader'
import TableAntecedent from '../TableAntecedent/TableAntecedent'
import { formatterDataModal, formatterDataTable } from '../../utils/Js'
function Surge({ info }) {
	const navigate = useNavigate()
	const [dataTable, setDataTable] = useState([])
	const [dataModal, setDataModal] = useState([])
	const [isLoading, setIsLoading] = useState(true)
	const getDataSobreTension = async (dateStart = null, dateFinished = null) => {
		try {
			setIsLoading(true)
			const dataSobreTension = await request(
				`${backend[`${import.meta.env.VITE_APP_NAME}`]}/getQualitySurge`,
				'POST',
				{
					serial: info.serial,
					version: info.version,
					brand: info.brand,
					dateStart,
					dateFinished,
				}
			)
			const dataFormatterTable = await formatterDataTable(dataSobreTension.data)
			dataFormatterTable.sort((a, b) => {
				return new Date(b.datePeriod) - new Date(a.datePeriod)
			})
			setDataTable(dataFormatterTable)

			const dataSobreTensionModal = await request(
				`${backend[`${import.meta.env.VITE_APP_NAME}`]}/getQualitySurgeSummary`,
				'POST',
				{
					serial: info.serial,
					version: info.version,
					brand: info.brand,
					dateStart,
					dateFinished,
				}
			)
			const dataFormatterModal = await formatterDataModal(dataSobreTensionModal.data)
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
			getDataSobreTension()
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

export default Surge
