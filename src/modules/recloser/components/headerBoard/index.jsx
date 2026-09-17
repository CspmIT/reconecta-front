import React, { useEffect, useState } from 'react'
import { FaCircle } from 'react-icons/fa'
import { boardFields, boardStatus } from '../../utils/Objects'
import { enableControl, sendAction } from '../controlsBoard/utils/js/Controls'
import { request } from '../../../../utils/js/request'
import { backend } from '../../../../utils/routes/app.routes'

const HeaderBoard = ({ info }) => {
	const [statusReco, setStatusReco] = useState(null)
	const [dataHead, setDataHead] = useState({})
	/*
	 * Copia local de `info` que se refresca sola cada 15 seg, igual que hacen los
	 * tableros de CardBoard (MetrologyBoard y compania). El prop solo se consulta
	 * una vez en DataBoard, asi que sin esto la cabecera quedaba congelada.
	 */
	const [dataInfo, setDataInfo] = useState(info)

	const getDataRecloser = async (id) => {
		try {
			const { data } = await request(
				`${backend[`${import.meta.env.VITE_APP_NAME}`]}/getDataRecloser?id=${id}`,
				'GET'
			)
			setDataInfo(data)
		} catch (error) {
			// Si falla un refresco se mantiene la ultima lectura valida
			console.error(error)
		}
	}

	// Cuando DataBoard vuelve a pedir los datos (boton de recarga) se toma el prop
	useEffect(() => {
		setDataInfo(info)
	}, [info])

	useEffect(() => {
		const id = info?.recloser?.id
		if (!id) return
		const intervalId = setInterval(() => {
			getDataRecloser(id)
		}, 15000)
		return () => clearInterval(intervalId)
	}, [info?.recloser?.id])

	useEffect(() => {
		// Los estados del reconectador son 0= abierto, 1= cerrado y 2= Sin señal
		if (dataInfo) {
			if (dataInfo.instantaneo.length === 0) {
				setStatusReco(2)
			} else {
				setStatusReco(
					typeof dataInfo.instantaneo?.['d/c']?.[0]?.value == 'number'
						? dataInfo.instantaneo?.['d/c']?.[0]?.value
						: 3
				)
			}
			setDataHead({
				name: dataInfo?.recloser?.name || 'S/D',
				number: dataInfo?.recloser?.element || 'S/D',
				serial: dataInfo?.recloser?.number || 'S/D',
				brand: dataInfo?.recloser?.brand || 'S/D',
				version: dataInfo?.recloser?.version || 'S/D',
				ac: dataInfo?.instantaneo['ac']?.[0].value,
				local: dataInfo?.instantaneo['local']?.[0].value,
			})
		}
	}, [dataInfo])

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
					className={`rounded-full grid min-w-40 max-w-40 min-h-40 max-h-40  ${statusReco === 1
						? 'bg-red-500 shadow-red-700'
						: statusReco === 0
							? 'bg-green-500 shadow-green-700'
							: 'bg-yellow-500 shadow-yellow-700'
						} justify-center items-center shadow-md `}
				>
					<div
						onClick={async () => {
							const enable = await enableControl(false)
							if (enable) sendAction('d/c', statusReco, false, dataInfo)
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
					let color = dataInfo
						? dataInfo?.instantaneo[item.field]?.[0].value != 1
							? 'black'
							: 'red'
						: 'black'
					if (!dataInfo?.instantaneo[item.field]) return false
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
