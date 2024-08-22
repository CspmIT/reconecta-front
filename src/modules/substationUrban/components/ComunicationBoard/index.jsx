import React from 'react'
import CardCustom from '../../../../components/CardCustom'

const ComunicationBoard = () => {
	return (
		<div className='flex flex-row justify-end w-full md:w-2/6 pt-5'>
			<CardCustom className='w-full md:w-11/12 min-h-28 border-l-[1rem] border-r-2 border-b-2 border-red-500  shadow-md !rounded-lg overflow-hidden p-5'>
				<h1 className='text-center font-bold'>COMUNICACIÓN</h1>
				<div className='w-full flex md:flex-row p-3'>
					<div className='w-full md:w-1/4 grid items-center md:max-w-1/4 bg-slate-200 m-1'>
						<b className='w-full text-center'>Módulo</b>
						<p className='w-full text-center'>Cooptech </p>
					</div>
					<div className='w-full md:w-1/4 grid items-center md:max-w-1/4 bg-slate-200 m-1'>
						<b className='w-full text-center'>IP</b>
						<p className='w-full text-center'>-</p>
					</div>
					<div className='w-full md:w-2/4 flex flex-col items-center justify-center md:max-w-2/4 m-1'>
						<div className='w-full'>
							<input type='checkbox' className='mr-2' />
						</div>
						<div>
							<input type='checkbox' className='mr-2' />
						</div>
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

export default ComunicationBoard
