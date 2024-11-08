import React, { useEffect, useState } from 'react'
import { FaCircle } from 'react-icons/fa'
import { boardFields, boardStatus } from '../../utils/Objects'
import { enableControl, sendAction } from '../controlsBoard/utils/js/Controls'

const HeaderBoard = ({ info }) => {
	const [statusReco, setStatusReco] = useState(null)
	const [dataHead, setDataHead] = useState({})
	useEffect(() => {
		// Los estados del reconectador son 0= abierto, 1= cerrado y 2= Sin señal
		if (info) {
			if (info.instantaneo.length === 0) {
				setStatusReco(2)
			} else {
				setStatusReco(
					typeof info.instantaneo?.['d/c']?.[0]?.value == 'number' ? info.instantaneo?.['d/c']?.[0]?.value : 3
				)
			}
			setDataHead({
				name: info?.recloser?.relation?.nodes?.['name'] || 'S/D',
				number: info?.recloser?.relation?.nodes?.['number'] || 'S/D',
				serial: info?.recloser?.['serial'] || 'S/D',
				brand: info?.recloser?.['brand'] || 'S/D',
				ac: info?.instantaneo['ac']?.[0].value,
				local: info?.instantaneo['local']?.[0].value,
			})
		}
	}, [info])

	return (
		<div className='w-full flex flex-wrap justify-around items-center'>
			<div className='w-full md:w-1/4 px-3'>
				{boardFields.map((item, i) => {
					return (
						<div className='flex flex-row my-1' key={i}>
							<h3 className='ml-5'>
								<>
									{item.name}:{' '}
									{!item.options ? <b>{dataHead[item.field]}</b> : item.options[dataHead[item.field]]}
								</>
							</h3>
						</div>
					)
				})}
			</div>
			<div className='w-full sm:w-2/4 flex flex-row justify-center'>
				<div
					className={`rounded-full grid min-w-40 max-w-40 min-h-40 max-h-40  ${
						statusReco === 1
							? 'bg-red-500 shadow-red-700'
							: statusReco === 0
							? 'bg-green-500 shadow-green-700'
							: 'bg-yellow-500 shadow-yellow-700'
					} justify-center items-center shadow-md `}
				>
					<div
						onClick={async () => {
							const enable = await enableControl(false)
							if (enable) sendAction('d/c', statusReco, false, info)
						}}
						className='text-center grid cursor-pointer bg-white rounded-full min-w-28 max-w-28 min-h-28 max-h-28 items-center shadow-md shadow-slate-500'
					>
						<b className='text-black'>
							{statusReco === 1 ? 'CERRADO' : statusReco === 0 ? 'ABIERTO' : 'SIN SEÑAL'}
						</b>
					</div>
				</div>
			</div>
			<div className='w-full sm:w-1/4'>
				{boardStatus.map((item, i) => {
					let color = info ? (info?.instantaneo[item.field]?.[0].value != 1 ? 'black' : 'red') : 'black'
					if (!info?.instantaneo[item.field]) return false
					return (
						<div className='flex flex-row my-1' key={i}>
							<FaCircle color={color} />
							<h3 className='ml-3'>{item.name}</h3>
						</div>
					)
				})}
			</div>
		</div>
	)
}

export default HeaderBoard
