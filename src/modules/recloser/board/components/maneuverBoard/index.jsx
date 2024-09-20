import React from 'react'
import TableCustom from '../../../../../components/TableCustom'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { columnManeuver } from '../../utils/ColumnsManeuver'
import { FormLabel } from '@mui/material'
const ManeuverBoard = () => {
	return (
		<div className='w-full'>
			<div className='relative flex justify-between items-center mb-4'>
				<FormLabel className='w-full text-center !text-2xl'>Maniobras</FormLabel>
			</div>
			<div className='w-full max-w-full overflow-x-auto'>
				<LocalizationProvider dateAdapter={AdapterDayjs}>
					<TableCustom
						data={[]}
						columns={columnManeuver}
						density='comfortable'
						header={{
							background: 'rgb(91 151 248)',
							fontSize: '18px',
							fontWeight: 'bold',
						}}
						toolbarClass={{ background: 'rgb(91 151 248)' }}
						footer={{ background: 'rgb(223 233 249)' }}
						pageSize={10}
						topToolbar
						hide
						sort
						pagination
					/>
				</LocalizationProvider>
			</div>
		</div>
	)
}

export default ManeuverBoard
