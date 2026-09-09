import { useCallback, useEffect, useRef, useState } from 'react'
import { request } from '../../../../utils/js/request'
import { backend } from '../../../../utils/routes/app.routes'
import { PREF_MODULE, buildCards, resolveCardPrefs } from './utils/listCard'
import CardsInfo from './components/CardsInfo'
import CardsConfig from './components/CardsConfig'
import LoaderComponent from '../../../../components/Loader'

/*
 * Las tarjetas salen de UN solo pedido a /dashboard, que devuelve TODOS los
 * contadores ya calculados. Antes eran tres pedidos —/getAllReclosers,
 * /recloserAlarm y /getAcReclosers— y los dos primeros consultaban Influx una
 * vez por equipo, cada 10 segundos (ver DashboardService en el backend). Los
 * dos ultimos ya no existen: este era su unico consumidor.
 *
 * Que tarjetas se ven y en que orden es preferencia de cada usuario y se guarda
 * en UserPref (modulo 'dashboard'), el mismo mecanismo que usa el mapa. El
 * backend manda todos los contadores siempre: ninguno cuesta una consulta
 * aparte, asi que la seleccion es puramente de presentacion y no viaja en el
 * pedido.
 *
 * El componente se monta UNA sola vez: en escritorio lo dibuja la vista del
 * Home y en mobile la barra de TabHome, las dos con el mismo corte de 600px.
 * Antes la version mobile se escondia con `md:hidden`, que es CSS y no
 * desmonta: en escritorio no se veia pero igual pedia todo por duplicado.
 */
function CardDashboard() {
	const [counters, setCounters] = useState(null)
	const [prefs, setPrefs] = useState(null)
	// El intervalo sigue corriendo aunque falle un pedido; el ref evita pisar el
	// estado despues de desmontar
	const montado = useRef(true)

	useEffect(() => {
		montado.current = true
		return () => {
			montado.current = false
		}
	}, [])

	useEffect(() => {
		const getPrefs = async () => {
			try {
				const { data } = await request(`${backend.Reconecta}/userPref/${PREF_MODULE}`, 'GET')
				if (montado.current) setPrefs(resolveCardPrefs(data))
			} catch (e) {
				// Sin preferencias guardadas se usan los defaults del catalogo
				console.log(e)
				if (montado.current) setPrefs(resolveCardPrefs(null))
			}
		}
		getPrefs()
	}, [])

	useEffect(() => {
		const getDashboard = async () => {
			try {
				const { data } = await request(`${backend.Reconecta}/dashboard`, 'GET')
				if (montado.current) setCounters(data)
			} catch (e) {
				// Se conservan los ultimos valores buenos: un pedido que falla no
				// tiene que dejar el panel en el loader para siempre
				console.log(e)
			}
		}
		getDashboard()
		const intervalId = setInterval(getDashboard, 10000)

		return () => clearInterval(intervalId)
	}, [])

	const handlePrefsChange = useCallback((next) => {
		// Se aplica en pantalla al toque y se persiste sin bloquear: si el guardado
		// falla, el usuario igual ve el cambio en esta sesion
		setPrefs(next)
		request(`${backend.Reconecta}/userPref/${PREF_MODULE}`, 'PUT', next).catch((e) =>
			console.error('No se pudieron guardar las preferencias del panel:', e?.message || e)
		)
	}, [])

	if (!counters || !prefs) {
		return (
			<div className='w-full flex justify-center items-center'>
				<LoaderComponent image={false} />
			</div>
		)
	}

	// La configuracion va PRIMERO y en su propia fila: si fuera un item mas de la
	// grilla se correria de lugar cada vez que se prende o apaga una tarjeta
	return (
		<>
			<CardsConfig order={prefs.order} hidden={prefs.hidden} onChange={handlePrefsChange} />
			{buildCards(counters, prefs.order, prefs.hidden).map((card) => (
				<CardsInfo key={card.key} title={card.title} infoData={card.info} colorTitle={card.colorTitle} />
			))}
		</>
	)
}

export default CardDashboard
