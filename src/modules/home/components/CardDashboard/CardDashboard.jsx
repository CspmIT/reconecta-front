import { useEffect, useState } from 'react'
import { request } from '../../../../utils/js/request'
import { backend } from '../../../../utils/routes/app.routes'
import { cardDashboardClass } from './utils/listCard'
import CardsInfo from './components/CardsInfo'
import LoaderComponent from '../../../../components/Loader'

/*
 * Las tarjetas salen de UN solo pedido a /dashboard, que devuelve los cinco
 * contadores ya calculados. Antes eran tres pedidos —/getAllReclosers,
 * /recloserAlarm y /getAcReclosers— y los dos primeros consultaban Influx una
 * vez por equipo, cada 10 segundos (ver DashboardService en el backend).
 *
 * El componente se monta UNA sola vez: en escritorio lo dibuja la vista del
 * Home y en mobile la barra de TabHome, las dos con el mismo corte de 600px.
 * Antes la version mobile se escondia con `md:hidden`, que es CSS y no
 * desmonta: en escritorio no se veia pero igual pedia todo por duplicado.
 */
function CardDashboard() {
	const [cards, setCards] = useState(null)

	useEffect(() => {
		let cancelled = false
		const getDashboard = async () => {
			try {
				const { data } = await request(`${backend.Reconecta}/dashboard`, 'GET')
				if (cancelled) return
				setCards(cardDashboardClass(data))
			} catch (e) {
				// Se conservan los ultimos valores buenos: un pedido que falla no
				// tiene que dejar el panel en el loader para siempre
				console.log(e)
			}
		}
		getDashboard()
		const intervalId = setInterval(getDashboard, 10000)

		return () => {
			cancelled = true
			clearInterval(intervalId)
		}
	}, [])

	if (!cards) {
		return (
			<div className='w-full flex justify-center items-center'>
				<LoaderComponent image={false} />
			</div>
		)
	}

	return cards.map((item) => (
		<CardsInfo key={item.title} title={item.title} infoData={item.info} colorTitle={item.colorTitle} />
	))
}

export default CardDashboard
