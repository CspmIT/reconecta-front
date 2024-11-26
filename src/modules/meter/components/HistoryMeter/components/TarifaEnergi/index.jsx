import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { ColumnsTableDifEnergi, ColumnsTableEnergi, dataTableDifEnergi, dataTableEnergi } from './utils/DataTable'
import TableCustom from '../../../../../../components/TableCustom'
import { useEffect, useState } from 'react'
import { request } from '../../../../../../utils/js/request'
import { backend } from '../../../../../../utils/routes/app.routes'
import Swal from 'sweetalert2'
import LoaderComponent from '../../../../../../components/Loader'
import { convertStringToDate, formatStrToDate, meses } from '../../../../../../utils/js/formatDate'
function TarifaEnergi({ info }) {
	const [isLoading, setIsLoading] = useState(true)
	const [dataRegistro, setDataRegistro] = useState({})
	const [dataMonth, setDataMonth] = useState({})
	const getInfoTarifaEnergy = async (dateStart = null, dateFinished = null) => {
		try {
			setIsLoading(true)
			const dataEnergy = await request(
				`${backend[`${import.meta.env.VITE_APP_NAME}`]}/getHistoryEnergyTarifa`,
				'POST',
				{
					serial: info.serial,
					version: info.version,
					brand: info.brand,
					dateStart,
					dateFinished,
				}
			)
			const data = dataEnergy.data
			const Tarifas_value = {}
			const Dif_tarifas_value = {}
			let mes_dif_mensual = ''

			if (data !== 'sin datos') {
				Object.keys(data).forEach((key) => {
					if (/^RTE_[0-2]$/.test(key)) {
						const [actual, anterior] = data[key]
						const mesAnterior = convertStringToDate(anterior.time)
						mes_dif_mensual = meses[mesAnterior.getMonth()] || ''
						const valorActual = parseFloat(actual.value).toFixed(2)
						const diferencia = (parseFloat(actual.value) - parseFloat(anterior.value)).toFixed(2)

						Tarifas_value[key] = { value: valorActual, date: actual.time }
						Dif_tarifas_value[key] = diferencia
					}
				})
			}
			const result = dataTableEnergi({ Tarifas_value, Dif_tarifas_value, mes_dif_mensual })
			setDataRegistro(result)
			setDataMonth(dataTableDifEnergi({ Tarifas_value, Dif_tarifas_value, mes_dif_mensual }))
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
			getInfoTarifaEnergy()
		}
	}, [info])
	if (isLoading) return <LoaderComponent image={false} />

	return (
		<>
			<LocalizationProvider dateAdapter={AdapterDayjs}>
				<div className='w-full max-lg:w-full flex flex-col gap-4'>
					<div className='w-full'>
						<p className='text-xl text-center font-bold w-full'>Registro de Tarifas de Energía</p>
					</div>
					<TableCustom
						data={dataRegistro}
						columns={ColumnsTableEnergi}
						density='compact'
						header={{
							background: 'rgb(190 190 190)',
							fontSize: '18px',
							fontWeight: 'bold',
						}}
						card={{
							boxShadow: `1px 1px 8px 0px #00000046`,
							borderRadius: '0.25rem',
						}}
						body={{ backgroundColor: 'rgba(209, 213, 219, 0.31)' }}
						footer={{ height: '0px' }}
					/>
				</div>
				<div className='w-full max-lg:w-full flex flex-col gap-4 mt-4'>
					<div className='w-full'>
						<p className='text-xl text-center font-bold w-full'>Diferencia mensual de Tarifas de Energía</p>
					</div>
					<TableCustom
						data={dataMonth}
						columns={ColumnsTableDifEnergi}
						density='compact'
						header={{
							background: 'rgb(190 190 190)',
							fontSize: '18px',
							fontWeight: 'bold',
						}}
						card={{
							boxShadow: `1px 1px 8px 0px #00000046`,
							borderRadius: '0.25rem',
						}}
						body={{ backgroundColor: 'rgba(209, 213, 219, 0.31)' }}
						footer={{ height: '0px' }}
					/>
				</div>
			</LocalizationProvider>
		</>
	)
}

export default TarifaEnergi
