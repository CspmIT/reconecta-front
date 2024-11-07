import React, { useEffect, useState } from 'react'
import { boardMetrology } from '../../utils/Objects'
import CardCustom from '../../../../../components/CardCustom'
import { request } from '../../../../../utils/js/request'
import Swal from 'sweetalert2'
import { backend } from '../../../../../utils/routes/app.routes'
import LoaderComponent from '../../../../../components/Loader'

const MetrologyBoard = ({ idRecloser }) => {
	const [dataMetrology, setDataMetrology] = useState(null)
	const getDataMetrology = async (id) => {
		const data = await request(
			`${backend[`${import.meta.env.VITE_APP_NAME}`]}/metrologiaIntantanea?id=${id}`,
			'GET'
		)
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
		<div className='w-full grid grid-cols-3 max-lg:flex max-lg:flex-col gap-6 justify-center'>
			{dataMetrology ? (
				boardMetrology.map((item, i) => {
					const content = item.children.filter((child, j) => {
						let value = ''
						if (Object.keys(dataMetrology).length) {
							for (const item in dataMetrology) {
								if (child.field === item) {
									value = `${dataMetrology[item][0].value}  ${child.unit}`
									break
								}
							}
						}
						if (value == '') return false
						return true
					})
					if (!content.length) return false
					return (
						// <div className={`w-full md:w-1/2 lg:w-1/3 flex justify-center items-center py-3`} key={i}>
						<CardCustom
							key={i}
							className='w-full min-h-52 border-t-[0.5rem] border-r-2 border-b-2 border-blue-500  shadow-md !rounded-lg overflow-hidden'
						>
							<h1 className='font-bold text-xl my-3'>{item.name}</h1>
							<div className={`w-full text-center px-1 ${content.length > 4 ? 'grid grid-cols-2' : ''}`}>
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
									if (value == '') return null
									return (
										<div
											key={j}
											className={`my-2 flex flex-row justify-center text-sm md:text-base w-full`}
										>
											<p>
												{child.name}: <b>{value}</b>
											</p>
										</div>
									)
								})}
							</div>
						</CardCustom>
						// </div>
					)
				})
			) : (
				<LoaderComponent />
			)}
		</div>
	)
}

export default MetrologyBoard
