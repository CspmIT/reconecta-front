import React from 'react'
import TableCustom from '../../../../../components/TableCustom'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { columnManeuver } from '../../utils/ColumnsManeuver'
import { rowManeuver } from '../../utils/objects'
const ManeuverBoard = () => {
	return (
		<div className='w-full'>
			<LocalizationProvider dateAdapter={AdapterDayjs}>
				<TableCustom
					data={rowManeuver}
					columns={columnManeuver}
					density='comfortable'
					header={{
						background: 'rgb(190 190 190)',
						fontSize: '18px',
						fontWeight: 'bold',
					}}
					toolbarClass={{ background: 'rgb(190 190 190)' }}
					body={{ backgroundColor: 'rgba(209, 213, 219, 0.31)' }}
					footer={{ background: 'rgb(190 190 190)' }}
					pageSize={10}
					topToolbar
					hide
					sort
					pagination
				/>
			</LocalizationProvider>
		</div>
	)
}

export default ManeuverBoard
