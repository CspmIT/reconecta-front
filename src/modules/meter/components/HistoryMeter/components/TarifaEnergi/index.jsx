import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { ColumnsTableDifEnergi, ColumnsTableEnergi, dataTableDifEnergi, dataTableEnergi } from './utils/DataTable'
import TableCustom from '../../../../../../components/TableCustom'
function TarifaEnergi() {
	return (
		<>
			<LocalizationProvider dateAdapter={AdapterDayjs}>
				<div className='w-3/4 max-lg:w-full flex flex-col gap-4'>
					<div className='w-full'>
						<p className='text-xl text-center font-bold w-full'>Registro de Tarifas de Energía</p>
					</div>
					<TableCustom
						data={dataTableEnergi}
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
				<div className='w-3/4 max-lg:w-full flex flex-col gap-4 mt-4'>
					<div className='w-full'>
						<p className='text-xl text-center font-bold w-full'>Diferencia mensual de Tarifas de Energía</p>
					</div>
					<TableCustom
						data={dataTableDifEnergi}
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
