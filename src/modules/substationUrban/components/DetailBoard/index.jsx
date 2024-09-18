import React from 'react'
import CardCustom from '../../../../components/CardCustom'
import { Button, TextField } from '@mui/material'
import { FaArrowRightArrowLeft } from 'react-icons/fa6'

const DetailBoard = () => {
	return (
		<div className='flex flex-row justify-center w-full md:w-5/6 lg:w-3/6 pt-5'>
			<CardCustom className='w-full min-h-28 border-l-[1rem] border-r-2 border-b-2 border-red-500  shadow-md !rounded-lg overflow-hidden p-5'>
				<h1 className='text-center font-bold'>DETALLE</h1>
				<div className='w-full  flex flex-wrap p-1 md:p-3 justify-center'>
					<div className='w-full md:w-[46%] xl:w-[23%] grid items-center p-2 rounded-md md:max-w-1/4 bg-slate-200 m-1'>
						<b className='w-full text-center'>TIPO</b>
						<p className='w-full text-center'>Aérea </p>
					</div>
					<div className='w-full md:w-[46%] xl:w-[23%] grid items-center p-2 rounded-md md:max-w-1/4 bg-slate-200 m-1'>
						<b className='w-full text-center' style={{wordBreak: 'break-word'}}>Distribuidor</b>
						<p className='w-full text-center'>D10</p>
					</div>
					<div className='w-full md:w-[46%] xl:w-[23%] grid items-center p-2 rounded-md md:max-w-1/4 bg-slate-200 m-1'>
						<b className='w-full text-center' style={{wordBreak: 'break-word'}}>Potencia del Transformador</b>
						<p className='w-full text-center'>0 KVA</p>
					</div>
					<div className='w-full md:w-[46%] xl:w-[23%] grid items-center p-2 rounded-md md:max-w-1/4 bg-slate-200 m-1'>
						<b className='w-full text-center'>Sentido</b>
						<p className='w-full text-center'>Horario</p>
					</div>
				</div>
				<div className='w-full'>
					<b>Observaciones:</b>
					<div className='w-full h-full p-2 rounded-md bg-slate-200 min-h-16'></div>
				</div>
			</CardCustom>
		</div>
	)
}

export default DetailBoard
