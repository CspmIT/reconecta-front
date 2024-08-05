import React from 'react'
import CardCustom from '../../../../components/CardCustom'
import { Button, TextField } from '@mui/material'
import { FaArrowRightArrowLeft } from 'react-icons/fa6'

const DetailBoard = () => {
	return (
		<div className='flex flex-row justify-center w-full md:w-3/6 pt-5'>
			<CardCustom className='w-full min-h-28 border-l-[1rem] border-r-2 border-b-2 border-red-500  shadow-md !rounded-lg overflow-hidden p-5'>
				<h1 className='text-center font-bold'>DETALLE</h1>
				<div className='w-full flex md:flex-row p-3'>
					<div className='w-full md:w-1/4 grid items-center md:max-w-1/4 bg-slate-200 m-1'>
						<b className='w-full text-center'>TIPO</b>
						<p className='w-full text-center'>Aérea </p>
					</div>
					<div className='w-full md:w-1/4 grid items-center md:max-w-1/4 bg-slate-200 m-1'>
						<b className='w-full text-center'>Distribuidor</b>
						<p className='w-full text-center'>D10</p>
					</div>
					<div className='w-full md:w-1/4 grid items-center md:max-w-1/4 bg-slate-200 m-1'>
						<b className='w-full text-center'>Potencia del Transformador</b>
						<p className='w-full text-center'>0 KVA</p>
					</div>
					<div className='w-full md:w-1/4 grid items-center md:max-w-1/4 bg-slate-200 m-1'>
						<b className='w-full text-center'>Sentido</b>
						<p className='w-full text-center'>Horario</p>
					</div>
				</div>
				<div className='w-full'>
					<b>Observaciones:</b>
					<div className='w-full h-full bg-slate-200 min-h-16'></div>
				</div>
			</CardCustom>
		</div>
	)
}

export default DetailBoard
