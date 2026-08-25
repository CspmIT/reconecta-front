/*
 * Formateo de mediciones del panel. Aparte del componente para poder probarlo.
 *
 * Los equipos publican tension en volts (13200 = 13,2 kV) y corriente en amperes.
 */

// Corriente nominal aproximada por tipo de elemento, para resaltar sobrecarga
export const IMAX = { 1: 70, 2: 160, 3: 60, 4: 400, 5: 200 }

/** Volts -> kV. La columna esta rotulada en kV, asi que siempre se divide. */
export const fmtV = (v) => {
	if (v === null || v === undefined || Number.isNaN(v)) return '—'
	// En BT (cientos de volts) hace falta un decimal mas para que se lea algo
	return (v / 1000).toFixed(v >= 1000 ? 2 : 3)
}

export const fmtI = (i) => (i === null || i === undefined || Number.isNaN(i) ? '—' : i.toFixed(1))

/*
 * Los equipos NO publican todos en la misma unidad y no hay con que
 * normalizarlos (ver FAMILIES en services/MapLiveService.js):
 *  - el reconectador publica la primaria real, 13200 -> 13,20 kV;
 *  - el medidor publica el SECUNDARIO del transformador de medicion (~65 V);
 *  - el analizador publica baja tension real (~227 V).
 * Cada equipo viaja con su `unit` y se muestra tal como lo publica. Convertir
 * el medidor con un factor inventado seria peor que no convertirlo.
 */
export const fmtVUnit = (v, unit) => {
	if (v === null || v === undefined || Number.isNaN(v)) return '—'
	return unit === 'kV' ? fmtV(v) : v.toFixed(1)
}

/*
 * Cuando corresponde resaltar fuera de rango y sobrecarga.
 *
 * Solo el reconectador CERRADO. Dos motivos distintos:
 *  - el medidor y el analizador no tienen nominal conocida (la del medidor
 *    depende de una relacion de transformacion que los ITRON no publican, y la
 *    del analizador de una tolerancia de BT que nadie definio);
 *  - un reconectador ABIERTO esta en cero por definicion, asi que marcarlo como
 *    fuera de rango pinta de naranja lo normal.
 * En los dos casos, un umbral inventado entrena al operador a ignorar el color.
 */
export const seResalta = (unit, st) => unit === 'kV' && st === 'cerrado'

/** Desvio de mas del 3% respecto de la nominal (13,2 kV en MT, 400 V en BT). */
export const vFueraDeRango = (v) => {
	if (v === null || v === undefined || Number.isNaN(v)) return false
	const nominal = v >= 1000 ? 13200 : 400
	return Math.abs(v - nominal) / nominal > 0.03
}

export const iSobrecargada = (i, type) => {
	if (i === null || i === undefined || Number.isNaN(i)) return false
	return i > (IMAX[type] || 70)
}
