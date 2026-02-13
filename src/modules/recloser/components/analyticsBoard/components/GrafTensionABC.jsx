import { useEffect, useState, useContext } from 'react'
import { request } from '../../../../../utils/js/request'
import { backend } from '../../../../../utils/routes/app.routes'
import LoaderComponent from '../../../../../components/Loader'
import RecloserLineChart from './linecharts'
import dayjs from 'dayjs'
function GrafTensionABC({ idRecloser, dateStart, dateFinished, search, realTime }) {
	const [dataGraf, setDataGraf] = useState(null)
	useEffect(() => {
		const getTensionABC = async (id) => {
			if (realTime) {
				dateFinished = dayjs()
			}
			const { data } = await request(
				`${backend[`${import.meta.env.VITE_APP_NAME}`]}/tensionABC?id=${id}`,
				'POST',
				{ dateStart, dateFinished }
			)

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

		if (idRecloser) {
			getTensionABC(idRecloser)
		}
	}, [search, idRecloser, dateStart, dateFinished, realTime])

	useEffect(() => {
		const getTensionABC = async (id) => {
			if (realTime) {
				dateFinished = dayjs()
			}
			const { data } = await request(
				`${backend[`${import.meta.env.VITE_APP_NAME}`]}/tensionABC?id=${id}`,
				'POST',
				{ dateStart, dateFinished }
			)

			if (!Object.keys(data).length) {
				return
			}

			setDataGraf(data)
		}

		if (idRecloser) {
			const intervalId = setInterval(() => {
				getTensionABC(idRecloser)
			}, 15000)

			return () => clearInterval(intervalId)
		}
	}, [idRecloser, dateStart, dateFinished, realTime])

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
