import { useEffect, useState, useContext } from 'react'
import { request } from '../../../../../../utils/js/request'
import GrafLinea from '../../../../../../components/Graphs/linechart'
function GrafTensionABC({ idRecloser }) {
	const [dataGraf, setDataGraf] = useState([])
	const getTensionABC = async (id) => {
		const data = await request(`${import.meta.env.VITE_APP_BACK_RECONECTA}/tensionABC?id=${id}`, 'GET')
		if (!Object.keys(data).length) {
			Swal.fire({
				title: 'Atención!',
				html: `Hubo un problema con la carga de los datos del reconectador.</br>Intente nuevamente...`,
				icon: 'error',
			})
			return
		}

		const returnData = Object.keys(data.data).map((key, index) => {
			return {
				name: key,
				data: data.data[key].map(([time, value]) => [new Date(time).getTime(), value]),
			}
		})
		setDataGraf(returnData)
	}

	useEffect(() => {
		if (!idRecloser) {
			Swal.fire({
				title: 'Atención!',
				html: `Hubo un problema con la carga de los datos del reconectador.</br>Intente nuevamente...`,
				icon: 'error',
			})
		} else {
			getTensionABC(idRecloser)
			const intervalId = setInterval(() => {
				getTensionABC(idRecloser)
			}, 15000)
			return () => clearInterval(intervalId)
		}
	}, [idRecloser])

	return (
		<>
			<GrafLinea
				title={'Tensión ABC'}
				seriesData={dataGraf}
				configxAxis={{ type: 'datetime' }}
				labelxAxis={{ format: '{value:%Y-%m-%d %H:%M:%S}' }}
				tooltip={{
					tooltip: {
						xDateFormat: '%Y-%m-%d %H:%M:%S',
						shared: true,
					},
				}}
			/>
		</>
	)
}

export default GrafTensionABC
