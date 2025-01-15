import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import TableCustom from '../../../../../../components/TableCustom'
import {
	ColumnsTableEnergiImpExp,
	ColumnsTableReactivaxCuadrante,
	dataTableReactivaxCuadrante,
} from './utils/DataTable'
import { dataTableEnergiImpExp } from './utils/DataTable'
import LoaderComponent from '../../../../../../components/Loader'
import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import { request } from '../../../../../../utils/js/request'
import { backend } from '../../../../../../utils/routes/app.routes'
import { BorderBottom } from '@mui/icons-material'
function EnergiTotal({ info }) {
	const [isLoading, setIsLoading] = useState(true)
	const [dataImpExp, setDataImpExp] = useState({})
	const [dataReactxCuadrante, setDataReactxCuadrante] = useState({})
	const getInfoRestart = async (dateStart = null, dateFinished = null) => {
		try {
			setIsLoading(true)
			const dataRestart = await request(
				`${backend[`${import.meta.env.VITE_APP_NAME}`]}/getHistoryEnergyTotal`,
				'POST',
				{
					serial: info.serial,
					version: info.version,
					brand: info.brand,
					dateStart,
					dateFinished,
				}
			)
			const data = dataRestart.data
			setDataImpExp(dataTableEnergiImpExp(data))
			setDataReactxCuadrante(dataTableReactivaxCuadrante(data))
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
			getInfoRestart()
		}
	}, [info])
	if (isLoading) return <LoaderComponent image={false} />
	return (
		<>
			<LocalizationProvider dateAdapter={AdapterDayjs}>
				<div className='w-full max-lg:w-full flex flex-col gap-4'>
					<div className='w-full'>
						<p className='text-xl text-center font-bold w-full'>Energia Importada/Exportadas</p>
					</div>
					<TableCustom
						data={dataImpExp}
						columns={ColumnsTableEnergiImpExp}
						density='compact'
						header={{
							background: 'rgb(190 190 190)',
							fontSize: '18px',
							border: 'none',
							fontWeight: 'bold',
						}}
						card={{
							boxShadow: `1px 1px 8px 0px #00000046`,
							borderRadius: '0.25rem',
						}}
						body={{ backgroundColor: 'rgba(209, 213, 219, 0.31)' }}
						footer={{ height: '0px' }}
						toolbarClass={{ background: 'rgb(190 190 190)', borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}
						topToolbar
						exportExcel
					/>

					<div className='w-full mt-3'>
						<p className='text-xl text-center font-bold w-full'>Energia Reactiva por Cuadrante</p>
					</div>
					<TableCustom
						data={dataReactxCuadrante}
						columns={ColumnsTableReactivaxCuadrante}
						density='compact'
						header={{
							background: 'rgb(190 190 190)',
							fontSize: '18px',
							border: 'none',
							fontWeight: 'bold',
						}}
						card={{
							boxShadow: `1px 1px 8px 0px #00000046`,
							borderRadius: '0.25rem',
						}}
						body={{ backgroundColor: 'rgba(209, 213, 219, 0.31)' }}
						footer={{ height: '0px' }}
						toolbarClass={{ background: 'rgb(190 190 190)', borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}
						topToolbar
						exportExcel
					/>
				</div>
			</LocalizationProvider>
		</>
	)
}

export default EnergiTotal
