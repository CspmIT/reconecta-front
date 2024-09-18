import React from 'react'
import CardCustom from '../../../../components/CardCustom'
import { Button, TextField } from '@mui/material'
import { FaArrowRightArrowLeft } from 'react-icons/fa6'

const HeaderBoard = () => {
	return (
		<div className='flex flex-row justify-center w-full'>
			<CardCustom className='w-full md:w-5/6 min-h-28 border-l-[1rem] border-r-2 border-b-2 border-red-500  shadow-md !rounded-lg overflow-hidden p-5'>
				<div className='w-full flex flex-wrap p-1 md:p-3'>
					<div className='w-full md:w-[48%] lg:w-[32%] p-2 rounded-md grid items-center md:max-w-1/3 bg-slate-200 m-1'>
						<b className='w-full text-center'>Nombre</b>
						<p className='w-full text-center'>SETA </p>
					</div>
					<div className='w-full md:w-[48%] lg:w-[65%] grid p-2 rounded-md items-center md:max-w-2/3 bg-slate-200 m-1'>
						<b className='w-full text-center'>Ubicación</b>
						<p className='w-full text-center'>En algun lugar </p>
					</div>
				</div>
				<div className='w-full flex flex-wrap p-1 md:p-3'>
					<div className='w-full md:w-[48%] lg:w-[32%] grid p-2 rounded-md items-center md:max-w-1/3 bg-slate-200 m-1'>
						<b className='w-full text-center'>Medidor</b>
						<div className='w-full flex flex-row justify-evenly'>
							<TextField className='w-9/12' size='small' disabled />
							<Button className='w-1/12' variant='contained' color='success'>
								<FaArrowRightArrowLeft />
							</Button>
						</div>
					</div>
					<div className='w-full md:w-[48%] lg:w-[32%] grid p-2 rounded-md items-center md:max-w-1/3 bg-slate-200 m-1'>
						<b className='w-full text-center'>Relación de Transformación</b>
						<p className='w-full text-center'>Corriente: </p>
						<p className='w-full text-center'>Tensión: </p>
					</div>
					<div className='w-full lg:w-[32%] grid p-2 rounded-md items-center md:max-w-2/3 bg-slate-200 m-1'>
						<b className='w-full text-center'>Comentario</b>
						<p className='w-full text-center'>Hola </p>
					</div>
				</div>
			</CardCustom>
		</div>
	)
}

export default HeaderBoard
