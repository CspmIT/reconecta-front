import { useEffect, useState } from 'react'
import { request } from '../../../../../../utils/js/request'
import GrafLinea from '../../../../../../components/Graphs/linechart'
import { backend } from '../../../../../../utils/routes/app.routes'
import Swal from 'sweetalert2'
function GrafCorriente({ idRecloser }) {
	const [dataGraf, setDataGraf] = useState([])
	const getTensionABC = async (id) => {
		const data = await request(`${backend[`${import.meta.env.VITE_APP_NAME}`]}/corrientesGraf?id=${id}`, 'GET')
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
		if (idRecloser) {
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
				title={'Corrientes'}
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

export default GrafCorriente
