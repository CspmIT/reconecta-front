import React from 'react'
import TimePickerCustom from '../../../../components/TimePickerCustom'
import TableCustom from '../../../../components/TableCustom'
import { Button } from '@mui/material'

const ManeuverBoard = () => {
	return (
		<div className='w-full'>
			<div className='w-full flex flex-row justify-center items-center'>
				<div className='w-1/6 text-center mx-5'>
					<TimePickerCustom text='Fecha de Inicio' />
				</div>
				<div className='w-1/6 text-center mx-5'>
					<TimePickerCustom text='Fecha de Fin' />
				</div>
				<div className='w-1/6'>
					<Button className='bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded w-1/2'>
						Filtrar
					</Button>
				</div>
			</div>
			<TableCustom columns={[]} data={[]} />
		</div>
	)
}

export default ManeuverBoard
