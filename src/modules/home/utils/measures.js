/*
 * Formato de las mediciones que trae /Elements en `equipment.measures`.
 *
 * La tension y la corriente vienen POR FASE y la potencia como las TRES
 * POTENCIAS del equipo — aparente, activa y reactiva —, que son las que muestra
 * su tablero: el reconectador no publica potencia por fase.
 *
 * La tension que se muestra es la DE FASE, en `measures.vPhase`, y va etiquetada
 * A/B/C. Es la que mide el equipo, sin cuentas de por medio. El backend manda
 * ademas la compuesta en `measures.v` (la que usa el mapa) con `measures.vDerived`
 * diciendo si la tomo del equipo o la derivo de la fase; aca no se usa.
 *
 * La corriente sigue etiquetada L1/L2/L3.
 *
 * Los valores llegan en las unidades de cada equipo, que no son homogeneas: el
 * reconectador manda la primaria real (13200 V) y las potencias en kVA/kW/kVAr,
 * el medidor manda el primario ya convertido por su relacion CT/VT (igual que su
 * tablero) y el analizador baja tension real (~228 V) con las potencias en
 * VA/W/VAr. Ver FAMILIES en services/LiveMeasureService.js.
 *
 * Aca se elige la escala con la que se lee mas facil: 13000 V se muestra como
 * 12,9 kV y 6642 W como 6,6 kW. Cuando se aplico una relacion de transformacion
 * viene en `measures.tx` y se aclara en el title de la celda.
 *
 * Hay dos presentaciones: `*Rows` apila los tres valores con su etiqueta (tabla
 * de escritorio) y `*Cell` los pone en una linea (tarjetas del celular).
 */
export const SIN_DATO = '—'

const PHASES = ['L1', 'L2', 'L3']
// La tension se nombra por fase, como la nombran los equipos y los tableros
const PHASES_ABC = ['A', 'B', 'C']

// Las tres potencias del equipo, en el orden del tablero
const POWERS = [
	{ key: 's', label: 'S', name: 'Aparente' },
	{ key: 'p', label: 'P', name: 'Activa' },
	{ key: 'q', label: 'Q', name: 'Reactiva' },
]

const fmt = (value, decimals) => value.toLocaleString('es-AR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })

const esValor = (v) => v !== null && v !== undefined && !isNaN(v)

const conDato = (values) => (values || []).filter(esValor)

/**
 * Decimales, decididos con el valor mas grande ya escalado para que los tres
 * queden con el mismo formato. Los equipos que publican valores enteros (el NOJA
 * manda amperes redondos) no se llenan de ",0".
 */
const decimalesPor = (escalados) => {
	if (escalados.every((v) => Number.isInteger(v))) return 0
	const max = Math.max(...escalados.map(Math.abs))
	return max < 10 ? 2 : max < 100 ? 1 : 0
}

// factor: por cuanto se divide para llegar a la unidad que se muestra
const escalaTension = (max) =>
	// El reconectador publica volts de la primaria: 13000 V se lee mejor en kV
	max >= 1000 ? { factor: 1000, unit: 'kV' } : { factor: 1, unit: 'V' }

const escalaCorriente = () => ({ factor: 1, unit: 'A' })

// Las unidades chicas (VA/W/VAr) escalan a k cuando el valor lo justifica; el
// reconectador ya publica en kVA/kW/kVAr y se deja como esta
const escalaPotencia = (max, unit) =>
	!String(unit).startsWith('k') && max >= 1000 ? { factor: 1000, unit: `k${unit}` } : { factor: 1, unit: unit || 'W' }

/*
 * Desbalance entre fases: la diferencia entre la mayor y la menor, sobre la
 * mayor. Arriba del umbral la tabla pinta los tres valores en ambar; no es una
 * alarma, es para que salte a la vista cual de las tres se fue.
 */
const DESBALANCE = 0.02

export const hayDesbalance = (values) => {
	const validos = conDato(values)
	if (validos.length < 2) return false
	const max = Math.max(...validos)
	const min = Math.min(...validos)
	return max > 0 && (max - min) / max > DESBALANCE
}

/* ------------------------------------------------------------------ fases */

/**
 * Las tres fases como filas, para la tabla de escritorio, que las apila: cada
 * una con su etiqueta y su valor ya formateado. Una fase sin dato queda como
 * raya para que las otras no se corran de lugar; sin ninguna, una sola fila con
 * la raya.
 */
const filasFases = (values, escala, labels = PHASES) => {
	const validos = conDato(values)
	if (!validos.length) return [{ label: null, value: SIN_DATO, unit: null, text: SIN_DATO }]
	const { factor, unit } = escala(Math.max(...validos.map(Math.abs)))
	const decimals = decimalesPor(validos.map((v) => v / factor))
	return values.map((v, index) => ({
		label: labels[index],
		value: esValor(v) ? fmt(v / factor, decimals) : SIN_DATO,
		unit: esValor(v) ? unit : null,
		text: esValor(v) ? `${fmt(v / factor, decimals)} ${unit}` : SIN_DATO,
	}))
}

/**
 * Las tres fases en una linea: `12,9 · 12,8 · 12,9 kV`, con la unidad una sola
 * vez.
 */
const lineaFases = (values, escala) => {
	const validos = conDato(values)
	if (!validos.length) return SIN_DATO
	const { factor, unit } = escala(Math.max(...validos.map(Math.abs)))
	const decimals = decimalesPor(validos.map((v) => v / factor))
	return `${values.map((v) => (esValor(v) ? fmt(v / factor, decimals) : SIN_DATO)).join(' · ')} ${unit}`
}

/* --------------------------------------------------------------- potencia */

/**
 * Una potencia con su unidad. Cada una lleva la suya (kVA/kW/kVAr), asi que no
 * comparten escala ni decimales como si hacen las fases.
 */
const unaPotencia = (value, unidadPublicada) => {
	if (!esValor(value)) return { value: SIN_DATO, unit: null, text: SIN_DATO }
	const { factor, unit } = escalaPotencia(Math.abs(value), unidadPublicada)
	const escalado = value / factor
	const texto = fmt(escalado, decimalesPor([escalado]))
	return { value: texto, unit, text: `${texto} ${unit}` }
}

const filasPotencia = (measures) => {
	const power = measures?.power
	const units = measures?.units
	if (!POWERS.some(({ key }) => esValor(power?.[key]))) return [{ label: null, value: SIN_DATO, unit: null, text: SIN_DATO }]
	return POWERS.map(({ key, label }) => ({ label, ...unaPotencia(power?.[key], units?.[key]) }))
}

/* ---------------------------------------------------------------- titles */

/**
 * Relacion de transformacion aplicada, para aclarar en el title por que un
 * medidor de 65 V de secundario muestra 7,8 kV. Es la misma conversion que hace
 * su tablero, que tambien la avisa.
 */
const notaTx = (measures) => (measures?.tx ? `Convertido: ${measures.tx}` : null)

const detalleFases = (measures, values, escala, nota, labels = PHASES) => {
	const tx = notaTx(measures)
	const validos = conDato(values)
	if (!validos.length) return tx ?? undefined
	const { factor, unit } = escala(Math.max(...validos.map(Math.abs)))
	const decimals = decimalesPor(validos.map((v) => v / factor))
	const partes = labels.map((fase, index) => {
		const v = values[index]
		return `${fase} ${esValor(v) ? `${fmt(v / factor, decimals)} ${unit}` : SIN_DATO}`
	})
	if (nota) partes.push(nota)
	if (tx) partes.push(tx)
	return partes.join(' · ')
}

/* ----------------------------------------------------------------- api */

export const voltageRows = (measures) => filasFases(measures?.vPhase, escalaTension, PHASES_ABC)
export const currentRows = (measures) => filasFases(measures?.i, escalaCorriente)
export const powerRows = (measures) => filasPotencia(measures)

// Version en una linea, para las tarjetas del celular: ahi la fila ya es
// vertical y apilar los tres valores las haria larguisimas
export const voltageCell = (measures) => lineaFases(measures?.vPhase, escalaTension)
export const currentCell = (measures) => lineaFases(measures?.i, escalaCorriente)
export const powerCell = (measures) => {
	const filas = filasPotencia(measures)
	if (filas.length === 1) return filas[0].text
	return filas.map(({ label, text }) => `${label} ${text}`).join(' · ')
}

/*
 * Se aclara que es de fase: entre modelos hay una diferencia de raiz(3) segun se
 * mire fase o linea, y sin decirlo parece que un modelo mide distinto que otro,
 * que es justo lo que se venia viendo.
 */
export const voltageDetail = (measures) =>
	detalleFases(measures, measures?.vPhase, escalaTension, 'Tensión de fase, publicada por el equipo', PHASES_ABC)
export const currentDetail = (measures) => detalleFases(measures, measures?.i, escalaCorriente)
// Los nombres completos, que en la celda no entran
export const powerDetail = (measures) => {
	const tx = notaTx(measures)
	if (!POWERS.some(({ key }) => esValor(measures?.power?.[key]))) return tx ?? undefined
	const partes = POWERS.map(({ key, name }) => `${name} ${unaPotencia(measures?.power?.[key], measures?.units?.[key]).text}`)
	if (tx) partes.push(tx)
	return partes.join(' · ')
}
