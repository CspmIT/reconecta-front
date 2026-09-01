/*
 * Formato de las mediciones que trae /Elements en `equipment.measures`
 * (potencia, tension y corriente POR FASE, mas la potencia total del equipo).
 *
 * Los valores llegan en las unidades de cada equipo, que no son homogeneas: el
 * reconectador manda la primaria real (13000 V) y la activa en kW, el medidor
 * manda el primario ya convertido por su relacion CT/VT (igual que su tablero) y
 * el analizador baja tension real (~228 V) con la activa en W. Ver FAMILIES en
 * services/LiveMeasureService.js.
 *
 * Cuando se aplico una relacion de transformacion viene en `measures.tx` y se
 * aclara en el title de la celda.
 *
 * Aca se elige la escala con la que se lee mas facil: 13000 V se muestra como
 * 12,9 kV y 6642 W como 6,6 kW. La escala y los decimales se deciden por celda,
 * con la fase mas grande, para que las tres queden comparables de un vistazo.
 *
 * Hay dos presentaciones: `*Rows` apila las fases con su etiqueta (tabla de
 * escritorio) y `*Cell` las pone en una linea (tarjetas del celular).
 */
export const SIN_DATO = '—'

// Mismas etiquetas que el tablero del medidor, para no llamar a la misma fase
// de dos maneras distintas segun la pantalla
const PHASES = ['L1', 'L2', 'L3']

const fmt = (value, decimals) => value.toLocaleString('es-AR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })

const esValor = (v) => v !== null && v !== undefined && !isNaN(v)

const conDato = (values) => (values || []).filter(esValor)

// factor: por cuanto se divide para llegar a la unidad que se muestra
const escalaTension = (max) =>
	// El reconectador publica volts de la primaria: 13000 V se lee mejor en kV
	max >= 1000 ? { factor: 1000, unit: 'kV' } : { factor: 1, unit: 'V' }

const escalaCorriente = () => ({ factor: 1, unit: 'A' })

const escalaPotencia = (max, unit) =>
	unit === 'W' && max >= 1000 ? { factor: 1000, unit: 'kW' } : { factor: 1, unit: unit || 'W' }

/**
 * Decimales de la celda, decididos con la fase mas grande ya escalada para que
 * las tres queden con el mismo formato. Los equipos que publican valores
 * enteros (el NOJA manda amperes redondos) no se llenan de ",0".
 */
const decimalesPor = (escalados) => {
	if (escalados.every((v) => Number.isInteger(v))) return 0
	const max = Math.max(...escalados.map(Math.abs))
	return max < 10 ? 2 : max < 100 ? 1 : 0
}

/**
 * Las tres fases en una celda: `12,9 · 12,8 · 12,9 kV`. Una fase sin dato queda
 * como raya para que las otras no se corran de lugar; sin ninguna, la celda
 * entera es una raya.
 */
const celda = (values, escala, unidadPublicada, total) => {
	const validos = conDato(values)
	if (!validos.length) {
		// Sin fases pero con total: el equipo publica la potencia entera y no
		// abierta (el reconectador que no reporta el factor de potencia). Se
		// muestra igual, aclarando que es el total y no una fase
		if (!esValor(total)) return SIN_DATO
		const { factor, unit } = escala(Math.abs(total), unidadPublicada)
		return `${fmt(total / factor, decimalesPor([total / factor]))} ${unit} (total)`
	}
	const max = Math.max(...validos.map(Math.abs))
	const { factor, unit } = escala(max, unidadPublicada)
	const escalados = values.filter(esValor).map((v) => v / factor)
	const decimals = decimalesPor(escalados)
	const fases = values.map((v) => (esValor(v) ? fmt(v / factor, decimals) : SIN_DATO))
	return `${fases.join(' · ')} ${unit}`
}

/**
 * Relacion de transformacion aplicada, para aclarar en el title por que un
 * medidor de 65 V de secundario muestra 7,8 kV. Es la misma conversion que hace
 * su tablero, que tambien la avisa.
 */
const notaTx = (measures) => (measures?.tx ? `Convertido: ${measures.tx}` : null)

/**
 * Detalle con el nombre de cada fase para el title de la celda, que es lo que
 * aclara el orden R/S/T de los tres numeros.
 */
const detalle = (measures, values, escala, unidadPublicada, total) => {
	const tx = notaTx(measures)
	const validos = conDato(values)
	if (!validos.length) {
		if (!esValor(total)) return tx ?? undefined
		return ['El equipo no publica esta medición por fase; el valor es el total', tx].filter(Boolean).join(' · ')
	}
	const max = Math.max(...validos.map(Math.abs), Math.abs(total ?? 0))
	const { factor, unit } = escala(max, unidadPublicada)
	const decimals = decimalesPor([...validos, ...(esValor(total) ? [total] : [])].map((v) => v / factor))
	const uno = (v) => (esValor(v) ? `${fmt(v / factor, decimals)} ${unit}` : SIN_DATO)
	const fases = PHASES.map((fase, index) => `${fase} ${uno(values[index])}`)
	if (esValor(total)) fases.push(`Total ${uno(total)}`)
	if (tx) fases.push(tx)
	return fases.join(' · ')
}

/**
 * Las fases como filas, para la tabla de escritorio, que las apila: cada una
 * con su etiqueta y su valor ya formateado. Devuelve una sola fila sin etiqueta
 * cuando no hay dato, y una fila `Total` cuando el equipo publica la potencia
 * entera y no abierta por fase.
 */
const filas = (values, escala, unidadPublicada, total) => {
	const validos = conDato(values)
	if (!validos.length) {
		if (!esValor(total)) return [{ label: null, text: SIN_DATO }]
		const { factor, unit } = escala(Math.abs(total), unidadPublicada)
		return [{ label: 'Total', text: `${fmt(total / factor, decimalesPor([total / factor]))} ${unit}` }]
	}
	const max = Math.max(...validos.map(Math.abs))
	const { factor, unit } = escala(max, unidadPublicada)
	const decimals = decimalesPor(values.filter(esValor).map((v) => v / factor))
	return values.map((v, index) => ({
		label: PHASES[index],
		text: esValor(v) ? `${fmt(v / factor, decimals)} ${unit}` : SIN_DATO,
	}))
}

export const powerRows = (measures) => filas(measures?.p, escalaPotencia, measures?.units?.p, measures?.total)
export const voltageRows = (measures) => filas(measures?.v, escalaTension)
export const currentRows = (measures) => filas(measures?.i, escalaCorriente)

// Version en una linea (`12,9 · 12,8 · 12,9 kV`), para las tarjetas del celular:
// ahi la fila ya es vertical y apilar las fases las haria larguisimas
export const voltageCell = (measures) => celda(measures?.v, escalaTension)
export const currentCell = (measures) => celda(measures?.i, escalaCorriente)
export const powerCell = (measures) => celda(measures?.p, escalaPotencia, measures?.units?.p, measures?.total)

export const voltageDetail = (measures) => detalle(measures, measures?.v, escalaTension)
export const currentDetail = (measures) => detalle(measures, measures?.i, escalaCorriente)
// El total de la potencia va en el title: en el reconectador es el unico valor
// que publica el equipo, las fases son derivadas
export const powerDetail = (measures) => detalle(measures, measures?.p, escalaPotencia, measures?.units?.p, measures?.total)
