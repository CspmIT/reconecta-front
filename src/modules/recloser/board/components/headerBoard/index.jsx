import React, { useEffect, useState } from 'react'
import { FaCircle } from 'react-icons/fa'
import { boardStatus, boardFields } from '../../utils/objects'

const HeaderBoard = ({ info }) => {
	const [statusReco, setStatusReco] = useState(null)
	useEffect(() => {
		// Los estados del reconectador son 0= cerrado,1= abierto y 2= Sin señal
		if (info) {
			if (info.online === 0) {
				setStatusReco(2)
			} else {
				setStatusReco(info.recloser?.status_recloser)
			}
		}
	}, [info])
	return (
		<div className='w-full flex flex-wrap justify-around items-center'>
			<div className='w-full md:w-1/4 px-3'>
				{boardFields.map((item, i) => {
					return (
						<div className='flex flex-row my-1' key={i}>
							<h3 className='ml-5'>
								{info?.recloser[`${item.field}`] ? (
									<>
										{item.name}: <b>{info ? info?.recloser[`${item.field}`] : 'S/D'}</b>
									</>
								) : (
									<>
										{item.name}:
										{item.field == 'ac' ? (
											info?.instantaneo[item.field]?.[0].value ? (
												<b className='text-red-500 text-xl'> Red Electrica</b>
											) : (
												<b className='text-green-500 text-xl'> Batería</b>
											)
										) : (
											info?.instantaneo[item.field]?.[0].value
										)}
									</>
								)}
							</h3>
						</div>
					)
				})}
			</div>
			<div className='w-full sm:w-2/4 flex flex-row justify-center'>
				<div
					className={`rounded-full grid min-w-40 max-w-40 min-h-40 max-h-40  ${
						statusReco === 0 ? 'bg-red-500 shadow-red-700' : statusReco === 1 ? 'bg-green-500 shadow-green-700' : 'bg-yellow-500 shadow-yellow-700'
					} justify-center items-center shadow-md `}
				>
					<div onClick={() => alert('habilitacion y ejecucion')} className='text-center grid cursor-pointer bg-white rounded-full min-w-28 max-w-28 min-h-28 max-h-28 items-center shadow-md shadow-slate-500'>
						<b className='text-black'>{statusReco === 0 ? 'CERRADO' : statusReco === 1 ? 'ABIERTO' : 'SIN SEÑAL'}</b>
					</div>
				</div>
			</div>
			<div className='w-full sm:w-1/4'>
				{boardStatus.map((item, i) => {
					return (
						<div className='flex flex-row my-1' key={i}>
							<FaCircle color={info ? (info?.instantaneo[item.field]?.[0].value !== 0 ? 'red' : 'black') : 'black'} />
							<h3 className='ml-3'>{item.name}</h3>
						</div>
					)
				})}
			</div>
		</div>
	)
}

export default HeaderBoard
