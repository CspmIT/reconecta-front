import { useState } from 'react'
import { Card } from '@mui/material'
import Accordion from '../components/Accordion'
import { FaArrowRight } from "react-icons/fa6";


function ConfigNotifications() {

	const arraydevice = [
		{
			name: 'Reconectador',
			type: 'NOJA',
			number: 'RC01'
		},
		{
			name: 'Reconectador',
			type: 'NOJA',
			number: 'RC10'
		},
		{
			name: 'Reconectador',
			type: 'COOPER',
			number: 'F5'
		},
		{
			name: 'Reconectador',
			type: 'COOPER',
			number: 'F6'
		},
	]
	return (
		<Card
			className={
				'w-full h-full flex flex-col items-center justify-center text-black dark:text-white relative p-3 rounded-md'
			}
		>
			<div className='w-full  md:p-5'>
				<h1 className='text-2xl mb-3'>Configuración de eventos y notificaciones</h1>
				<div className='flex flex-col gap-3'>
					{arraydevice.map((item, index) => {
						return (
							<Accordion title={<> {item.name} <FaArrowRight className='mt-1 mx-2' /> {item.type} → {item.number} </>}  />
						)
					})}
				</div>
			</div>
		</Card>
	)
}

export default ConfigNotifications
