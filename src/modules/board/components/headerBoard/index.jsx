import React, { useEffect, useState } from 'react'
import { FaCircle } from 'react-icons/fa'
import { boardStatus, boardFields, recloser } from '../../utils/objects'

const HeaderBoard = ({ info }) => {
	const [statusReco, setStatusReco] = useState(null)
	useEffect(() => {
		// Los estados del reconectador son 0= cerrado,1= abierto y 2= Sin señal
		if (info) {
			if (info.online === 0) {
				setStatusReco(2)
			} else {
				setStatusReco(info.status)
			}
		}
	}, [info])
	return (
		<div className='w-full flex flex-row justify-around items-center'>
			<div className='w-1/4 px-3'>
				{boardFields.map((item, i) => (
					<div className='flex flex-row my-1' key={i}>
						<h3 className='ml-5'>
							{item.name}: <b>{info ? info[`${item.field}`] : 'S/D'}</b>
						</h3>
					</div>
				))}
			</div>
			<div className='w-2/4 flex flex-row justify-center'>
				<div
					className={`rounded-full grid min-w-40 max-w-40 min-h-40 max-h-40  ${
						statusReco === 0
							? 'bg-red-500 shadow-red-700'
							: statusReco === 1
							? 'bg-green-500 shadow-green-700'
							: 'bg-yellow-500 shadow-yellow-700'
					} justify-center items-center shadow-md `}
				>
					<div className='text-center grid cursor-pointer bg-white rounded-full min-w-28 max-w-28 min-h-28 max-h-28 items-center shadow-md shadow-slate-500'>
						<b className='text-black'>
							{statusReco === 0 ? 'CERRADO' : statusReco === 1 ? 'ABIERTO' : 'SIN SEÑAL'}
						</b>
					</div>
				</div>
			</div>
			<div className='w-1/4'>
				{boardStatus.map((item, i) => {
					return (
						<div className='flex flex-row my-1' key={i}>
							<FaCircle color={info ? (info[`${item.field}`] === 0 ? 'red' : 'black') : 'black'} />
							<h3 className='ml-3'>{item.name}</h3>
						</div>
					)
				})}
			</div>
			{/* <div className='w-1/4 flex justify-end items-end flex-col pr-10'>
				{boardStatus.map((item, i) => {
					return (
						<div className='flex flex-row my-1' key={i}>
							<h3 className='mr-3'>{item.name}</h3>
							<FaCircle color={info ? (info[`${item.field}`] === 0 ? 'red' : 'black') : 'black'} />
						</div>
					)
				})}
			</div> */}
		</div>
	)
}

export default HeaderBoard
