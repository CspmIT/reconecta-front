import { ContentPaste } from '@mui/icons-material'
import { Button, Modal } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
function ModalDetail({ data, close }) {
	const [openModalDetail, setOpenModal] = useState(false)
	const [dataView, setDataView] = useState(null)
	const [detailData, setDetailData] = useState(null)
	const handleCloseModal = () => {
		setOpenModal(false)
		close()
	}

	useEffect(() => {
		if (data) {
			setOpenModal(true)
			setDataView(data.object)
		}
	}, [data])

	const nameMedidor = (number) => {
		let name = ''
		switch (number) {
			case 6:
				name = 'MEDICION EN BARRAS'
				break
			case 7:
				name = 'ALIMENTADOR 1'
				break
			case 9:
				name = 'ALIMENTADOR 2'
				break
			case 10:
				name = 'DISTRIBUIDOR 1'
				break
			case 11:
				name = 'DISTRIBUIDOR 2'
				break
			case 12:
				name = 'DISTRIBUIDOR 3'
				break
			case 13:
				name = 'DISTRIBUIDOR 4'
				break
		}
		return name
	}
	useEffect(() => {
		if (dataView?.instantaneos.length > 0) {
			const variables = []
			let CT_0 = ''
			let CT_1 = ''
			dataView.instantaneos.map((item) => {
				switch (item.field) {
					case 'IApP_3':
						const mva =
							item.valor < 20000
								? parseFloat(item.valor / 1000).toFixed(2)
								: parseFloat(item.valor / 10000000).toFixed(2)
						variables.push(mva + 'MVA')
						break
					case 'V_0':
					case 'V_1':
					case 'V_2':
						const V_0 = parseFloat(item.valor).toFixed(0)
						variables.push(V_0 + ' V')
						break
					case 'CFi_3':
						variables.push('Cos φ: ' + item.valor)
						break
					case 'CT_0':
						CT_0 = item.valor
						break
					case 'CT_1':
						CT_1 = item.valor
						break
					case 'I_0':
					case 'I_1':
					case 'I_2':
						variables.push(parseFloat(item.valor).toFixed(0) + ' A')
						break
					default:
						break
				}
			})
			variables.push('TI: ' + CT_0 + '/' + CT_1)
			const reorganizedVariables = [
				...variables.filter((v) => v.includes('MVA')),
				...variables.filter((v) => v.includes('Cos φ')),
				variables.find((v) => v.includes('TI')),
				...variables.filter((v) => v.includes(' V')),
				...variables.filter((v) => v.includes(' A')),
			]
			setDetailData(reorganizedVariables)
		}
	}, [dataView])
	return createPortal(
		<div
			className={`fixed top-0 left-0 bg-[#2e2e2ecd] z-[9999999] w-full flex-col justify-center items-center  h-full ${
				!openModalDetail ? 'hidden' : 'flex'
			}`}
			onClick={handleCloseModal}
		>
			{!dataView ? (
				<div className='loading'>Cargando...</div>
			) : (
				<div
					onClick={(event) => event.stopPropagation()}
					className={`bg-slate-200 relative p-3 rounded-xl w-11/12 sm:w-1/2 md:w-3/6 lg:w-2/6 h-64 flex flex-wrap justify-center items-center  ${
						dataView?.status === 1
							? 'border-red-500'
							: dataView?.status === 2
							? 'border-green-500'
							: 'border-slate-500'
					} border-l-[2rem] border-b-[0.2rem] border-r-[0.2rem] focus:!outline-none`}
				>
					<div className='flex flex-col justify-center items-center w-full'>
						<h1 className='text-2xl text-black font-bold'>{nameMedidor(parseInt(dataView.meter.id))}</h1>
					</div>
					{detailData && (
						<>
							{detailData.map((item, index) => {
								return (
									<div key={index} className='flex flex-wrap justify-center items-center w-1/3'>
										<p className='text-lg text-black font-bold'>{item}</p>
									</div>
								)
							})}
							<Button
								className='!bg-green-500 !text-white w-4/5 !text-base !text-left'
								onClick={() => console.log('hola')}
							>
								<ContentPaste className='!mr-4' /> Medidor: {dataView.meter.num_serie}
							</Button>
						</>
					)}
				</div>
			)}
		</div>,
		document.body
	)
}

export default ModalDetail
