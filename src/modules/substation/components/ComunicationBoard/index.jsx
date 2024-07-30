import React from 'react'
import CardCustom from '../../../../components/CardCustom'

const ComunicationBoard = () => {
	return (
		<div className='flex flex-row justify-end w-full md:w-2/6 pt-5'>
			<CardCustom className='w-full md:w-11/12 min-h-28 border-l-[1rem] border-r-2 border-b-2 border-red-500  shadow-md !rounded-lg overflow-hidden p-5'>
				<h1 className='text-center font-bold'>VALORES INSTANTÁNEOS</h1>
				<div className='w-full flex flex-wrap items-center justify-center p-3'>
					<div className='w-full grid items-center bg-slate-200 p-1'>
						<b className='w-full text-center'>Corrientes Generales</b>
						<div className='flex flex-row w-full'>
							<div className='w-1/2 grid items-center bg-slate-200 m-1'>
								<b className='w-full text-center'>Fase 1</b>
								<p className='w-full text-center'>0.0 A</p>
							</div>
							<div className='w-1/2 grid items-center bg-slate-200 m-1'>
								<b className='w-full text-center'>Fase 2</b>
								<p className='w-full text-center'>0.0 A</p>
							</div>
							<div className='w-1/2 grid items-center bg-slate-200 m-1'>
								<b className='w-full text-center'>Fase 3</b>
								<p className='w-full text-center'>0.0 A</p>
							</div>
						</div>
					</div>
					<div className='w-full grid items-center bg-slate-200 mt-2 p-1'>
						<b className='w-full text-center'>Tensiones Generales</b>
						<div className='flex flex-row w-full'>
							<div className='w-1/2 grid items-center bg-slate-200 m-1'>
								<b className='w-full text-center'>Fase 1</b>
								<p className='w-full text-center'>0.0 V</p>
							</div>
							<div className='w-1/2 grid items-center bg-slate-200 m-1'>
								<b className='w-full text-center'>Fase 2</b>
								<p className='w-full text-center'>0.0 V</p>
							</div>
							<div className='w-1/2 grid items-center bg-slate-200 m-1'>
								<b className='w-full text-center'>Fase 3</b>
								<p className='w-full text-center'>0.0 V</p>
							</div>
						</div>
					</div>
				</div>
			</CardCustom>
		</div>
	)
}

export default ComunicationBoard
