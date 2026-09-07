/*
 * Catalogo de tarjetas del Home.
 *
 * Cada tarjeta es una clave del objeto que devuelve /dashboard mas su titulo y,
 * si corresponde, la regla de color. El backend manda SIEMPRE todos los
 * contadores —ninguno cuesta una consulta aparte— y aca se decide cuales se
 * dibujan y en que orden, segun la preferencia del usuario.
 *
 * Las claves son la identidad de la tarjeta y quedan guardadas en la
 * preferencia de cada usuario: se pueden agregar tarjetas nuevas y reordenar
 * este catalogo, pero NO renombrar una clave existente sin dejar sin efecto lo
 * que el usuario ya eligio.
 */

// Sin dato: el backend devuelve null cuando no pudo resolver el contador
export const SIN_DATO = '-'

// Modulo de UserPref donde vive la seleccion y el orden de cada usuario
export const PREF_MODULE = 'dashboard'

// Hay algo que atender / no hay nada que atender
const alerta = (val) => (val > 0 ? 'red' : 'green')
const aviso = (val) => (val > 0 ? 'yellow' : 'green')

/*
 * El orden del catalogo es el orden por defecto, y `defaultVisible` decide cual
 * se dibuja mientras el usuario no haya elegido.
 *
 * Arranca mostrando las cinco de siempre: las diez juntas ocupan dos filas en
 * escritorio y cinco en tablet, y las nuevas son en buena medida un desglose de
 * las que ya estaban (los tres offline por familia suman lo mismo que "Equipos
 * Offline"). El que las quiera las prende desde el panel y le quedan guardadas.
 */
export const CARD_CATALOG = [
	{ key: 'open', title: 'Reconectadores abiertos', defaultVisible: true },
	{ key: 'alarm', title: 'Reconectadores en alarma', defaultVisible: true, color: (val) => (val > 0 ? 'yellow' : 'black') },
	{ key: 'offline', title: 'Equipos Offline', defaultVisible: true, color: alerta },
	{ key: 'withoutAc', title: 'Equipos sin alimentacion AC', defaultVisible: true, color: aviso },
	{ key: 'total', title: 'Cantidad total de activos', defaultVisible: true },
	{ key: 'closed', title: 'Reconectadores cerrados' },
	{ key: 'noVoltage', title: 'Cerrados sin tension', color: aviso },
	{ key: 'offlineReclosers', title: 'Reconectadores Offline', color: alerta },
	{ key: 'offlineMeters', title: 'Medidores Offline', color: alerta },
	{ key: 'offlineAnalyzers', title: 'Analizadores Offline', color: alerta },
]

const CLAVES = CARD_CATALOG.map((card) => card.key)
const POR_CLAVE = new Map(CARD_CATALOG.map((card) => [card.key, card]))

/**
 * Normaliza la preferencia guardada contra el catalogo actual.
 *
 * Se descarta toda clave que ya no exista, asi una tarjeta que se saque del
 * catalogo no deja basura en la preferencia de nadie. Las que se agregaron
 * DESPUES de que el usuario guardo van al final y entran con su `defaultVisible`,
 * o sea que una tarjeta nueva se comporta igual para el que ya personalizo que
 * para el que nunca abrio el panel.
 *
 * Sin preferencia guardada no hay caso especial: `pref` en null deja todas las
 * claves como "nuevas" y el resultado son las cinco de siempre, en su orden.
 */
export const resolveCardPrefs = (pref) => {
	const guardado = Array.isArray(pref?.order) ? pref.order.filter((key) => CLAVES.includes(key)) : []
	const nuevas = CARD_CATALOG.filter((card) => !guardado.includes(card.key))
	const ocultas = Array.isArray(pref?.hidden) ? pref.hidden.filter((key) => CLAVES.includes(key)) : []
	return {
		order: [...guardado, ...nuevas.map((card) => card.key)],
		hidden: [...ocultas, ...nuevas.filter((card) => !card.defaultVisible).map((card) => card.key)],
	}
}

/**
 * Las tarjetas visibles, en orden, listas para dibujar.
 */
export const buildCards = (counters, order, hidden) => {
	const ocultas = new Set(hidden)
	return order
		.filter((key) => !ocultas.has(key))
		.map((key) => {
			const card = POR_CLAVE.get(key)
			const valor = counters[key]
			const sinDato = valor === null || valor === undefined
			return {
				key,
				title: card.title,
				info: sinDato ? SIN_DATO : valor,
				// Un contador sin dato no se pinta: no dice ni que esta bien ni que esta mal
				colorTitle: !sinDato && card.color ? card.color(valor) : 'black',
			}
		})
}
