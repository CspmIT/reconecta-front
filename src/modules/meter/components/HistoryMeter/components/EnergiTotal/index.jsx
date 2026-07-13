import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { MenuItem, TextField } from '@mui/material'
import TableCustom from '../../../../../../components/TableCustom'
import {
	ColumnsTableEnergiImpExp,
	ColumnsTableReactivaxCuadrante,
	dataTableEnergiImpExp,
	dataTableReactivaxCuadrante,
} from './utils/DataTable'
import LoaderComponent from '../../../../../../components/Loader'
import { useEffect, useMemo, useState } from 'react'
import Swal from 'sweetalert2'
import { request } from '../../../../../../utils/js/request'
import { backend } from '../../../../../../utils/routes/app.routes'

function EnergiTotal({ info }) {
	const [isLoading, setIsLoading] = useState(true)
	const [rawData, setRawData] = useState(null)
	const [unitMode, setUnitMode] = useState('auto')

	const getInfoEnergyTotal = async (dateStart = null, dateFinished = null) => {
		try {
			setIsLoading(true)
			const response = await request(
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
			setRawData(response.data)
		} catch (error) {
			console.error(error)
			Swal.fire({
				title: 'Atención!',
				html: `Hubo un problema con la carga de los datos del Medidor.</br>Intente nuevamente...`,
				icon: 'error',
			})
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		if (info) getInfoEnergyTotal()
	}, [info])

	const dataImpExp = useMemo(
		() => (rawData ? dataTableEnergiImpExp(rawData, unitMode) : []),
		[rawData, unitMode]
	)
	const dataReactxCuadrante = useMemo(
		() => (rawData ? dataTableReactivaxCuadrante(rawData) : []),
		[rawData]
	)

	if (isLoading) return <LoaderComponent image={false} />
	return (
		<>
			<LocalizationProvider dateAdapter={AdapterDayjs}>
				<div className='w-full max-lg:w-full flex flex-col gap-4'>
					<div className='w-full flex items-center justify-between flex-wrap gap-2'>
						<p className='text-xl text-center font-bold flex-1'>Energia Importada/Exportadas</p>
						<TextField
							select
							size='small'
							label='Submúltiplo'
							value={unitMode}
							onChange={(e) => setUnitMode(e.target.value)}
							className='!w-32'
							title='Submúltiplo de energía (aplica a la tabla de importada/exportada)'
						>
							<MenuItem value='auto'>Auto</MenuItem>
							<MenuItem value='k'>kWh</MenuItem>
							<MenuItem value='M'>MWh</MenuItem>
							<MenuItem value='G'>GWh</MenuItem>
						</TextField>
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
