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
