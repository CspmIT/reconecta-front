import React, { useEffect, useState } from 'react'
import { boardMetrology } from '../../utils/objects'
import CardCustom from '../../../../../components/CardCustom'
import { request } from '../../../../../utils/js/request'
import Swal from 'sweetalert2'
import { backend } from '../../../../../utils/routes/app.routes'

const MetrologyBoard = ({ idRecloser }) => {
	const [dataMetrology, setDataMetrology] = useState({})
	const getDataMetrology = async (id) => {
		const data = await request(`${backend[`${import.meta.env.VITE_APP_NAME}`]}/metrologiaIntantanea?id=${id}`, 'GET')
		if (!Object.keys(data).length) {
			Swal.fire({
				title: 'Atención!',
				html: `Hubo un problema con la carga de los datos del reconectador.</br>Intente nuevamente...`,
				icon: 'error',
			})
			return
		}
		setDataMetrology(data.data)
	}

	useEffect(() => {
		if (idRecloser) {
			getDataMetrology(idRecloser)
			const intervalId = setInterval(() => {
				getDataMetrology(idRecloser)
			}, 15000)
			return () => clearInterval(intervalId)
		}
	}, [idRecloser])
	return (
		<div className='w-full flex flex-row flex-wrap justify-center '>
			{boardMetrology.map((item, i) => (
				<div className={`w-full md:w-1/2 lg:w-1/3 flex justify-center items-center p-3`} key={i}>
					<CardCustom className='w-5/6 min-h-52 border-t-[1rem] border-r-2 border-b-2 border-blue-500  shadow-md !rounded-lg overflow-hidden'>
						<h1 className='font-bold text-xl my-3'>{item.name}</h1>
						<div className={`w-full h-full text-center flex flex-row flex-wrap items-center`}>
							{item.children.map((child, j) => {
								let value = ''
								if (Object.keys(dataMetrology).length) {
									for (const item in dataMetrology) {
										if (child.field === item) {
											value = `${dataMetrology[item][0].value}  ${child.unit}`
											break
										}
									}
								}
								return (
									<div
										key={j}
										className={`my-1 flex flex-row justify-center text-sm md:text-lg ${
											item.children.length > 4 ? 'w-1/2' : 'w-full'
										}`}
									>
										<p>
											{child.name}: <b>{value}</b>
										</p>
									</div>
								)
							})}
						</div>
					</CardCustom>
				</div>
			))}
		</div>
	)
}

export default MetrologyBoard
