import { useEffect, useState } from 'react'
import { request } from '../../../../utils/js/request'
import { backend } from '../../../../utils/routes/app.routes'
import { cardDashboardClass } from './utils/listCard'
import CardsInfo from './components/CardsInfo'
import LoaderComponent from '../../../../components/Loader'

function CardDashboard() {
	const [cards, setCards] = useState(null)

	useEffect(() => {
		const dataDashboard = async () => {
			const [dataRecloser, dataAlarm] = await Promise.all([
				request(`${backend.Reconecta}/getAllReclosers`, 'GET'),
				request(`${backend.Reconecta}/recloserAlarm`, 'GET'),
			])
			const recloserIds = dataRecloser.data.map((item) => item.id)

			// Limitar el número de solicitudes simultáneas
			const maxConcurrentRequests = 5
			const recloserACStatuses = []
			for (let i = 0; i < recloserIds.length; i += maxConcurrentRequests) {
				const chunk = recloserIds.slice(i, i + maxConcurrentRequests)
				const responses = await Promise.all(
					chunk.map((id) => request(`${backend.Reconecta}/getAcRecloser?id=${id}`, 'GET'))
				)
				recloserACStatuses.push(...responses)
			}

			const recloserSN_AC = recloserACStatuses.reduce((acc, recloser) => {
				if (recloser?.data === 0) acc++
				return acc
			}, 0)

			const info = dataRecloser.data.reduce(
				(acc, val) => {
					if (val.status_recloser === 1) acc.recoOpen++
					else if (val.status_recloser === 3) acc.recoOffline++
					return acc
				},
				{
					recoOpen: 0,
					recoOffline: 0,
					recoAlarm: dataAlarm.data,
					recoAlimAC: recloserSN_AC,
					recoCant: dataRecloser.data.length,
				}
			)

			const cards = await cardDashboardClass(info)
			setCards(cards)
		}
		dataDashboard()
		const intervalId = setInterval(() => {
			dataDashboard()
		}, 10000)

		return () => clearInterval(intervalId)
	}, [])

	return (
		<>
			{!cards ? (
				<div className='w-full flex justify-center items-center'>
					<LoaderComponent image={false} />
				</div>
			) : (
				cards.map((item, index) => {
					return (
						<CardsInfo key={index} title={item.title} infoData={item.info} colorTitle={item.colorTitle} />
					)
				})
			)}
		</>
	)
}

export default CardDashboard
