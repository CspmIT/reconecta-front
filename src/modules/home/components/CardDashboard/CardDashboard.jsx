import { useCallback, useEffect, useRef, useState } from 'react'
import { useMediaQuery } from '@mui/material'
import { Close } from '@mui/icons-material'
import { request } from '../../../../utils/js/request'
import { backend } from '../../../../utils/routes/app.routes'
import { useDashboardFilter } from '../../context/DashboardFilterContext'
import { PREF_MODULE, buildCards, buildVeredicto, cardByKey, resolveCardPrefs } from './utils/listCard'
import CardsInfo from './components/CardsInfo'
import CardsChips from './components/CardsChips'
import CardsConfig from './components/CardsConfig'
import Veredicto from './components/Veredicto'
import LoaderComponent from '../../../../components/Loader'

const REFRESCO_MS = 10000
// Alcanza para que la curva muestre los ultimos minutos sin acumular de mas
const LECTURAS_MAX = 20

/*
 * La franja de estado operativo del Home.
 *
 * Todo sale de UN pedido a /dashboard, que devuelve los diez contadores ya
 * calculados con cuatro consultas a Influx fijas (ver DashboardService). Antes
 * eran tres endpoints y los dos primeros consultaban Influx una vez por equipo,
 * cada 10 segundos.
 *
 * Que tarjetas se ven, en que orden y si las que estan en alerta se adelantan es
 * preferencia de cada usuario y se guarda en UserPref (modulo 'dashboard'), el
 * mismo mecanismo que usa el mapa. El backend manda todos los contadores
 * siempre: ninguno cuesta una consulta aparte, asi que la seleccion es
 * presentacion y no viaja en el pedido.
 *
 * El historial de la curva y el chip de variacion se juntan ACA, en memoria,
 * entre pedidos: no hay serie persistida de estos contadores, asi que arranca
 * vacio en cada carga y la curva aparece con la segunda lectura.
 *
 * El componente se monta UNA sola vez: en escritorio lo dibuja la vista del Home
 * y en el telefono la barra de TabHome, las dos con el mismo corte de 600px.
 */
function CardDashboard() {
	const isMobile = useMediaQuery('(max-width: 600px)')
	const { filtro, setFiltro } = useDashboardFilter()
	const [lecturas, setLecturas] = useState([])
	const [prefs, setPrefs] = useState(null)
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
				if (!montado.current) return
				setLecturas((previas) => [...previas, { counters: data, hora: new Date() }].slice(-LECTURAS_MAX))
			} catch (e) {
				// Se conservan las lecturas buenas: un pedido que falla no tiene que
				// dejar la franja en el loader ni cortar la curva
				console.log(e)
			}
		}
		getDashboard()
		const intervalId = setInterval(getDashboard, REFRESCO_MS)

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

	const handleSelect = useCallback(
		(key) => setFiltro((actual) => (actual === key ? null : key)),
		[setFiltro]
	)

	const ultima = lecturas[lecturas.length - 1]

	if (!ultima || !prefs) {
		return (
			<div className='w-full flex justify-center items-center py-4'>
				<LoaderComponent image={false} />
			</div>
		)
	}

	const cards = buildCards(ultima.counters, prefs, lecturas)
	const veredicto = buildVeredicto(cards)
	const config = <CardsConfig prefs={prefs} onChange={handlePrefsChange} compact={isMobile} />
	const filtrada = filtro ? cardByKey(filtro) : null

	if (isMobile) {
		return (
			<div className='w-full'>
				{/* El control va al lado de la hora, en la linea del titular: en el riel
				    se iba con el scroll de los chips y quedaba fuera de vista */}
				<Veredicto veredicto={veredicto} actualizado={ultima.hora} compact>
					{config}
				</Veredicto>
				<CardsChips cards={cards} activo={filtro} onSelect={handleSelect} />
			</div>
		)
	}

	return (
		<section className='w-full bg-white dark:bg-gray-800 border border-linea dark:border-gray-700 rounded-lg px-4 pt-3.5 pb-4'>
			<Veredicto veredicto={veredicto} actualizado={ultima.hora}>
				{config}
			</Veredicto>

			{/*
			  * Rejilla que se acomoda sola: las tarjetas no tienen un ancho en
			  * porcentaje, asi que prender una mas no reacomoda las otras a un ancho
			  * distinto ni deja huecos.
			  *
			  * `auto-fit` y no el `auto-fill` del mockup: con pocas tarjetas en una
			  * pantalla ancha, auto-fill deja las columnas vacias reservadas y la
			  * fila termina a media pantalla con un hueco a la derecha. auto-fit las
			  * colapsa y reparte el ancho entre las que hay.
			  */}
			<div className='grid gap-2.5 [grid-template-columns:repeat(auto-fit,minmax(190px,1fr))]'>
				{cards.map((card) => (
					<CardsInfo key={card.key} card={card} activo={filtro === card.key} onSelect={handleSelect} />
				))}
			</div>

			{filtrada && (
				<div className='flex items-center gap-2.5 mt-3 px-3 py-1.5 rounded border border-[#CFD4EA] bg-[#EEF0F8] text-[13.5px] text-acento'>
					<span>
						Tabla filtrada por <strong>{filtrada.rotulo.toLowerCase()}</strong>
					</span>
					<button
						type='button'
						onClick={() => setFiltro(null)}
						aria-label='Quitar filtro'
						className='ml-auto text-acento flex items-center'
					>
						<Close style={{ fontSize: '1.1rem' }} />
					</button>
				</div>
			)}
		</section>
	)
}

export default CardDashboard
