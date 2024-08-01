import { TextField } from '@mui/material'
import React from 'react'

function Header() {
	return (
		<>
			<div className='w-full mt-3 grid gap-3 grid-cols-2 px-4'>
				<TextField type='text' label='Name' className='w-full' defaultValue={'SETA 1'} />
				<TextField type='text' label='Nro Serie' className='w-full' defaultValue={'36037636'} />
				<TextField
					type='text'
					label='Ubicación'
					className='w-full'
					defaultValue={'BV. EVA PERON ESQ. BV. 9 DE JULIO '}
				/>
				<div className='w-full grid gap-3 grid-cols-2'>
					<TextField type='text' label='Marca' className='w-full' defaultValue={'ITRON'} />
					<TextField type='text' label='Version' className='w-full' defaultValue={'SL7000'} />
				</div>
			</div>
			<div className='w-full flex justify-center items-center'>
				<div className='w-2/4 border-2 border-solid border-slate-400 rounded-md flex p-4 mt-5'>
					<div className='w-full'>
						<p className='font-semibold w-full text-center'>Tensión de batería:</p>
						<p className='font-semibold w-full text-center'>0 V</p>
					</div>
					<div className='w-full'>
						<p className='font-semibold w-full text-center'>Diferencia de Hora</p>
						<p className='font-semibold w-full text-center'>00:01:38</p>
					</div>
				</div>
			</div>
		</>
	)
}

export default Header
