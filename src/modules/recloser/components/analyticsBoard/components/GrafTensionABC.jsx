import { useEffect, useState, useContext } from 'react'
import { request } from '../../../../../utils/js/request'
import GrafLinea from '../../../../../components/Graphs/linechart'
import { backend } from '../../../../../utils/routes/app.routes'
import LoaderComponent from '../../../../../components/Loader'
import RecloserLineChart from './linecharts'
function GrafTensionABC({ idRecloser }) {
	const [dataGraf, setDataGraf] = useState(null)
	const getTensionABC = async (id) => {
		const { data } = await request(`${backend[`${import.meta.env.VITE_APP_NAME}`]}/tensionABC?id=${id}`, 'GET')
		if (!Object.keys(data).length) {
			Swal.fire({
				title: 'Atención!',
				html: `Hubo un problema con la carga de los datos del reconectador.</br>Intente nuevamente...`,
				icon: 'error',
			})
			return
		}
		setDataGraf(data)
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
			{dataGraf ? (
				<RecloserLineChart
					title={'Tensión ABC'}
					values={dataGraf}
				/>
			) : (
				<LoaderComponent image={false} />
			)}
		</>
	)
}

export default GrafTensionABC
