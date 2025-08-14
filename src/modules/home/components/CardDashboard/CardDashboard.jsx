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
			const [dataRecloser, dataAlarm, dataAc] = await Promise.all([
				request(`${backend.Reconecta}/getAllReclosers`, 'GET'),
				request(`${backend.Reconecta}/recloserAlarm`, 'GET'),
				request(`${backend.Reconecta}/getAcReclosers`, 'GET')
			])
			const numberAc = (Array.isArray(dataAc?.data) && dataAc.data.length > 0) ? dataAc.data.reduce((acc, r) => parseInt(r._value) === 0 ? acc + 1 : 0, 0) : 0
			const info = dataRecloser.data.reduce(
				(acc, val) => {
					if (val.status_recloser === 1) acc.recoOpen++
					if (val.status_recloser === 3) acc.recoOffline++
					return acc
				},
				{
					recoOpen: 0,
					recoOffline: 0,
					recoAlarm: Object.keys(dataAlarm.data).length,
					recoAlimAC: numberAc,
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
