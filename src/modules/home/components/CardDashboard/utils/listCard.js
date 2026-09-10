/*
 * Catalogo de tarjetas del panel del Home.
 *
 * Cada entrada junta las tres caras del mismo indicador para que no puedan
 * separarse: la clave del contador que devuelve /dashboard, como se presenta
 * (rotulo, `corto` para el riel del telefono, tono, unidad, nota, titular) y el
 * predicado con el que la tabla filtra cuando se toca la tarjeta. Si el numero y las filas filtradas no
 * coinciden, el error esta en una sola linea de este archivo.
 *
 * Las claves son la identidad de la tarjeta y quedan guardadas en la
 * preferencia de cada usuario: se pueden agregar tarjetas y reordenar el
 * catalogo, pero NO renombrar una clave existente sin dejar sin efecto lo que
 * el usuario ya eligio.
 */

// Sin dato: el backend devuelve null cuando no pudo resolver el contador
export const SIN_DATO = '-'

// Modulo de UserPref donde vive la preferencia de cada usuario
export const PREF_MODULE = 'dashboard'

/*
 * Escala de severidad del mockup. El color aparece SOLO cuando el contador deja
 * de ser cero; `dato` es informativo y no colorea nunca.
 */
export const TONOS = ['rojo', 'naranja', 'amarillo', 'dato']
const PESO = { rojo: 0, naranja: 1, amarillo: 2, ok: 3, dato: 4 }

/*
 * Configuracion del reconectador, la misma regla que lee el backend (ver
 * CONFIG_ESTANDAR en DashboardService): 1 es la estandar y cualquier otro valor
 * cuenta como anillado. NULL se toma como estandar, igual que alla.
 */
const CONFIG_ESTANDAR = 1

/*
 * Lectura del estado de un equipo con la forma que devuelve /Elements, que NO es
 * la de /dashboard: el reconectador trae un array por campo y el medidor y el
 * analizador un booleano en 'd/c' (ver listElements en el backend). De ahi que
 * "esta en linea" se pregunte por la presencia del campo y no por su valor, que
 * es lo mismo que hace la columna Conexion de la tabla.
 */
const esTipo = (equipment, tipo) => equipment?.equipmentmodels?.type === tipo
const campo = (equipment, nombre) => equipment?.influxData?.[nombre]?.[0]?.value
const enLinea = (equipment) => !!equipment?.influxData?.['d/c']
const esAnillado = (equipment) =>
	equipment?.configuration !== null &&
	equipment?.configuration !== undefined &&
	Number(equipment.configuration) !== CONFIG_ESTANDAR

const plural = (n, singular, sufijo = 's') => `${n} ${singular}${n > 1 ? sufijo : ''}`

/*
 * El orden del catalogo es el orden por defecto y `defaultVisible` decide cual
 * se dibuja mientras el usuario no haya elegido. Arrancan las cinco de siempre:
 * el resto se prende desde el panel y queda guardado.
 */
export const CARD_CATALOG = [
	{
		key: 'open',
		corto: 'abiertos',
		rotulo: 'Reconectadores abiertos',
		tono: 'rojo',
		defaultVisible: true,
		titular: (val) => `${plural(val, 'reconectador', 'es')} fuera de su configuración estándar`,
		// Los de anillado no entran en el numero, pero se aclaran debajo
		nota: (counters) =>
			counters.openPlanned > 0
				? `${plural(counters.openPlanned, 'abierto')} por configuración alternativa`
				: null,
		matches: (equipment) => esTipo(equipment, 1) && campo(equipment, 'd/c') === 0 && !esAnillado(equipment),
	},
	{
		key: 'alarm',
		corto: 'en alarma',
		rotulo: 'Reconectadores en alarma',
		tono: 'rojo',
		defaultVisible: true,
		matches: (equipment) => esTipo(equipment, 1) && !!equipment.flashAlarm,
	},
	{
		key: 'offline',
		corto: 'sin com.',
		rotulo: 'Equipos sin comunicación',
		tono: 'naranja',
		defaultVisible: true,
		matches: (equipment) => !enLinea(equipment),
	},
	{
		key: 'withoutAc',
		corto: 'sin AC',
		rotulo: 'Equipos sin alimentación AC',
		tono: 'amarillo',
		defaultVisible: true,
		matches: (equipment) => esTipo(equipment, 1) && campo(equipment, 'ac') === 0,
	},
	{
		key: 'total',
		corto: 'activos',
		rotulo: 'Activos monitoreados',
		tono: 'dato',
		unidad: 'equipos',
		defaultVisible: true,
		matches: () => true,
	},
	{
		key: 'offlineReclosers',
		corto: 'recon. sin com.',
		rotulo: 'Reconectadores sin comunicación',
		tono: 'naranja',
		matches: (equipment) => esTipo(equipment, 1) && !enLinea(equipment),
	},
	{
		key: 'offlineMeters',
		corto: 'medidores sin com.',
		rotulo: 'Medidores sin comunicación',
		tono: 'naranja',
		matches: (equipment) => esTipo(equipment, 2) && !enLinea(equipment),
	},
	{
		key: 'offlineAnalyzers',
		corto: 'analizadores sin com.',
		rotulo: 'Analizadores sin comunicación',
		tono: 'naranja',
		matches: (equipment) => esTipo(equipment, 3) && !enLinea(equipment),
	},
	{
		key: 'noVoltage',
		corto: 'sin tensión',
		rotulo: 'Cerrados sin tensión',
		tono: 'amarillo',
		matches: (equipment) =>
			esTipo(equipment, 1) && campo(equipment, 'd/c') === 1 && campo(equipment, 'ac') === 0,
	},
	{
		key: 'closed',
		corto: 'cerrados',
		rotulo: 'Reconectadores cerrados',
		tono: 'dato',
		unidad: 'equipos',
		matches: (equipment) => esTipo(equipment, 1) && campo(equipment, 'd/c') === 1,
	},
]

const CLAVES = CARD_CATALOG.map((card) => card.key)
const POR_CLAVE = new Map(CARD_CATALOG.map((card) => [card.key, card]))

export const cardByKey = (key) => POR_CLAVE.get(key) ?? null

/**
 * Normaliza la preferencia guardada contra el catalogo actual.
 *
 * Se descarta toda clave que ya no exista, asi una tarjeta que se saque del
 * catalogo no deja basura en la preferencia de nadie. Las que se agregaron
 * DESPUES de que el usuario guardo entran con su `defaultVisible`, o sea que una
 * tarjeta nueva se comporta igual para el que ya personalizo que para el que
 * nunca abrio el panel.
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
		// Adelantar las que estan en alerta viene prendido, como en el mockup
		priorizar: typeof pref?.priorizar === 'boolean' ? pref.priorizar : true,
	}
}

/**
 * Las tarjetas visibles, listas para dibujar.
 *
 * `estado` es el tono EFECTIVO: el declarado cuando el contador es mayor a cero
 * y 'ok' cuando esta en cero, porque un indicador en cero no tiene por que
 * pintar nada. El informativo se queda en 'dato' pase lo que pase.
 *
 * `serie` son las ultimas lecturas de ese contador y `delta` la variacion contra
 * la anterior; salen del historial que junta el propio panel entre pedidos.
 */
export const buildCards = (counters, prefs, historial = []) => {
	const ocultas = new Set(prefs.hidden)
	const lecturas = historial.map((lectura) => lectura.counters)

	const cards = prefs.order
		.filter((key) => !ocultas.has(key))
		.map((key) => {
			const card = POR_CLAVE.get(key)
			const valor = counters[key]
			const sinDato = valor === null || valor === undefined
			const estado = card.tono === 'dato' ? 'dato' : sinDato || valor === 0 ? 'ok' : card.tono
			const serie = lecturas.map((l) => l[key]).filter((v) => v !== null && v !== undefined)
			const previo = serie.length > 1 ? serie[serie.length - 2] : null

			return {
				key,
				rotulo: card.rotulo,
				corto: card.corto,
				unidad: card.unidad ?? null,
				tono: card.tono,
				estado,
				info: sinDato ? SIN_DATO : valor,
				valor: sinDato ? null : valor,
				nota: card.nota ? card.nota(counters) : null,
				noData: sinDato,
				serie,
				delta: previo === null || sinDato ? null : valor - previo,
			}
		})

	if (!prefs.priorizar) return cards
	// El orden del usuario sigue valiendo como desempate
	return [...cards].sort((a, b) => PESO[a.estado] - PESO[b.estado] || cards.indexOf(a) - cards.indexOf(b))
}

/**
 * El veredicto de la franja: titular, detalle y tono del pulso.
 *
 * El titular sale de la tarjeta MAS severa que este en alerta y no de la suma
 * por tono: sumar "abiertos" con "en alarma" daba un titular que hablaba de
 * configuracion estandar cuando lo que habia era una alarma.
 */
export const buildVeredicto = (cards) => {
	const enAlerta = cards.filter((card) => card.estado !== 'ok' && card.estado !== 'dato')
	const sinDato = cards.filter((card) => card.noData)

	const ordenadas = [...enAlerta].sort((a, b) => PESO[a.estado] - PESO[b.estado] || b.valor - a.valor)
	const detalle = [
		...ordenadas.map((card) => `${card.rotulo.toLowerCase()}: ${card.valor}`),
		...sinDato.map((card) => `${card.rotulo.toLowerCase()}: sin dato`),
	].join(' · ')

	if (!ordenadas.length) {
		return {
			tono: sinDato.length ? 'sinDato' : 'normal',
			titular: sinDato.length
				? `Sin datos de ${plural(sinDato.length, 'indicador', 'es')}`
				: 'Sin novedades',
			detalle: detalle || 'Todos los indicadores dentro de lo normal',
		}
	}

	const primera = ordenadas[0]
	const card = POR_CLAVE.get(primera.key)
	return {
		tono: primera.estado,
		titular: card.titular ? card.titular(primera.valor) : `${primera.valor} ${card.rotulo.toLowerCase()}`,
		detalle,
	}
}
