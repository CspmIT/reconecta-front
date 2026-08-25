/*
 * Encuadre de la red.
 *
 * Abarca TODO lo que esta dibujado: los marcadores visibles y los vertices de
 * los tramos. Dejar los tramos afuera no es un detalle — muchos vertices son
 * libres y se extienden bastante mas alla del ultimo equipo, asi que un
 * encuadre solo por marcadores deja buena parte de la red fuera de pantalla.
 *
 * Los marcadores ocultos por el filtro de tipo NO cuentan: si no se dibujan,
 * no tiene sentido reservarles lugar.
 */

/**
 * @param {Array} devices equipos visibles (ya filtrados por tipo)
 * @param {Array} lines tramos con `points` resueltos
 * @returns {Array<[number,number]>} puntos para pasarle a fitBounds
 */
export function networkPoints(devices = [], lines = []) {
	const pts = []
	for (const d of devices) {
		if (Number.isFinite(d.lat) && Number.isFinite(d.lon)) pts.push([d.lat, d.lon])
	}
	for (const l of lines) {
		for (const p of l.points || []) {
			if (Array.isArray(p) && Number.isFinite(p[0]) && Number.isFinite(p[1])) pts.push([p[0], p[1]])
		}
	}
	return pts
}

/** Caja envolvente, o null si no hay nada que encuadrar. */
export function networkBounds(devices, lines) {
	const pts = networkPoints(devices, lines)
	if (!pts.length) return null
	let s = 90
	let n = -90
	let w = 180
	let e = -180
	for (const [lat, lon] of pts) {
		if (lat < s) s = lat
		if (lat > n) n = lat
		if (lon < w) w = lon
		if (lon > e) e = lon
	}
	return { sw: [s, w], ne: [n, e], count: pts.length }
}
