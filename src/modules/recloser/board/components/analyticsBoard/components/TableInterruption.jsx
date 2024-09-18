import { useEffect, useState } from 'react'
import TableCustom from '../../../../../../components/TableCustom'
import { request } from '../../../../../../utils/js/request'
import { ColumnTableInt } from '../utils/ColumnTableInt'
import { backend } from '../../../../../../utils/routes/app.routes'

function TableInterruption({ idRecloser }) {
	const [dataInterruption, setDataInterruption] = useState([])

	const getEvents = async (id) => {
		const data = await request(`${backend[`${import.meta.env.VITE_APP_NAME}`]}/interruptions?id=${id}`, 'GET')
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
		if (idRecloser) {
			getEvents(idRecloser)
			const intervalId = setInterval(() => {
				getEvents(idRecloser)
			}, 15000)
			return () => clearInterval(intervalId)
		}
	}, [idRecloser])
	return (
		<>
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
		</>
	)
}

export default TableInterruption
