import React from 'react'
import CardCustom from '../../../components/CardCustom'
import { MenuItem, TextField } from '@mui/material'
import { elements } from '../utils/data'

const Abm = () => {
	const handleChangeElement = (e) => {
		console.log(e.event.value)
	}
	return (
		<div className={'w-full flex justify-center items-center rounded-md text-black'}>
			<CardCustom className={'w-full rounded-md text-black'}>
				<div className='w-full flex-row gap-3 mb-5'>
					<div className='mt-3'>
						<p className='w-full text-center text-2xl'>Añadir nuevo elemento</p>
					</div>
				</div>
				<p className='w-full text-center text-xl mb-3'>Infraestructura</p>
				<TextField select label='Tipo de Infraestructura' onChange={handleChangeElement}>
					{elements.map((element) => (
						<MenuItem key={element.id} value={element.id}>
							{element.name}
						</MenuItem>
					))}
				</TextField>
			</CardCustom>
		</div>
	)
}

export default Abm
