import React from 'react'
import TableCustom from '../../../../../../components/TableCustom'
import { ColumnsTable, dataTable } from './utils/DataTable'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
function Curva() {
	return (
		<div className='w-full'>
			<LocalizationProvider dateAdapter={AdapterDayjs}>
				<TableCustom
					data={dataTable}
					columns={ColumnsTable}
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
					toolbarClass={{ background: 'rgb(190 190 190)' }}
					body={{ backgroundColor: 'rgba(209, 213, 219, 0.31)' }}
					footer={{ background: 'rgb(190 190 190)' }}
					pageSize={10}
					topToolbar
					filter
					exportPdf
					exportExcel
					pagination
				/>
			</LocalizationProvider>
		</div>
	)
}

export default Curva
