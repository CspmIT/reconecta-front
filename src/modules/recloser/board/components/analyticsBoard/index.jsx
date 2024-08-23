import { useEffect, useState } from 'react'
import CardCustom from '../../../../../components/CardCustom'
import TableCustom from '../../../../../components/TableCustom'
import GrafCorriente from './components/GrafCorriente'
import GrafTensionABC from './components/GrafTensionABC'
import { ColumnTableInt } from './utils/ColumnTableInt'
import { request } from '../../../../../utils/js/request'

const AnalyticsBoard = ({ idRecloser }) => {
	const [dataInterruption, setDataInterruption] = useState([])
	// const data = [
	// 	{
	// 		resetButton: 'Duración acumulada',
	// 		abcLargas: '2765 min.',
	// 		abcCortas: '677 seg.',
	// 		srtLargas: '2652 min.',
	// 		srtCortas: '671 seg.',
	// 	},
	// 	{
	// 		resetButton: 'Cantidad',
	// 		abcLargas: 41,
	// 		abcCortas: 30,
	// 		srtLargas: 42,
	// 		srtCortas: 49,
	// 	},
	// ]

	const getEvents = async (id) => {
		const data = await request(`${import.meta.env.VITE_APP_BACK_RECONECTA}/interruptions?id=${id}`, 'GET')
		if (!Object.keys(data).length) {
			Swal.fire({
				title: 'Atención!',
				html: `Hubo un problema con la carga de los datos del reconectador.</br>Intente nuevamente...`,
				icon: 'error',
			})
			return
		}
		const datareturn = [
			{
				resetButton: 'Duración acumulada',
				abcLargas: data.data.Int_ABC_0,
				abcCortas: data.data.Int_ABC_1,
				srtLargas: data.data.Int_SRT_0,
				srtCortas: data.data.Int_SRT_1,
			},
			{
				resetButton: 'Cantidad',
				abcLargas: data.data.Int_ABC_2,
				abcCortas: data.data.Int_ABC_3,
				srtLargas: data.data.Int_SRT_2,
				srtCortas: data.data.Int_SRT_3,
			},
		]

		setDataInterruption(datareturn)
	}
	useEffect(() => {
		if (!idRecloser) {
			Swal.fire({
				title: 'Atención!',
				html: `Hubo un problema con la carga de los datos del reconectador.</br>Intente nuevamente...`,
				icon: 'error',
			})
		} else {
			getEvents(idRecloser)
			const intervalId = setInterval(() => {
				getEvents(idRecloser)
			}, 15000)
			return () => clearInterval(intervalId)
		}
	}, [idRecloser])

	return (
		<div className='w-full'>
			<CardCustom className='mt-3 rounded-md p-2 border-t-8  border-blue-500 shadow-blue-500/55 shadow-[3px_3px_3px_2px]'>
				<GrafTensionABC idRecloser={idRecloser} />
			</CardCustom>
			<CardCustom className='mt-8 rounded-md p-2 border-t-8  border-blue-500 shadow-blue-500/55 shadow-[3px_3px_3px_2px]'>
				<GrafCorriente idRecloser={idRecloser} />
			</CardCustom>
			<CardCustom className='flex flex-col items-center mt-8 rounded-md p-4 border-t-8  border-blue-500 shadow-blue-500/55 shadow-[3px_3px_3px_2px]'>
				<h1 className='text-2xl mb-4'>Disparos de sobrecorriente</h1>
				<h1 className='text-xl mb-4'>En desarrollo...</h1>
			</CardCustom>
			<CardCustom className='flex flex-col items-center mt-8 rounded-md p-4 border-t-8  border-blue-500 shadow-blue-500/55 shadow-[3px_3px_3px_2px]'>
				<h1 className='text-2xl mb-4'>Interrupciones</h1>
				<div className='!w-3/4'>
					<TableCustom
						data={dataInterruption}
						columns={ColumnTableInt}
						header={{
							background: 'rgb(190 190 190)',
							fontSize: '18px',
							fontWeight: 'bold',
						}}
						toolbarClass={{ background: 'rgb(190 190 190)' }}
						bodyContent={{ fontSize: '16px', textAlign: 'center' }}
						body={{ backgroundColor: 'rgba(209, 213, 219, 0.31)' }}
						footer={{ background: 'rgb(190 190 190)' }}
						card={{
							boxShadow: `1px 1px 8px 0px #00000046`,
							borderRadius: '0.75rem',
						}}
					/>
				</div>
			</CardCustom>
		</div>
	)
}

export default AnalyticsBoard
