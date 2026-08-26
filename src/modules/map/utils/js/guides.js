/*
 * Geometria de las guias de lupa, en coordenadas del contenedor.
 *
 * Une la esquina k del recuadro de la zona ampliada con la esquina k de la
 * ventana. Una linea se omite si su punto medio cae dentro de cualquiera de los
 * dos recuadros: eso significa que la ventana esta encima o pegada a su zona y
 * la linea solo ensuciaria el dibujo.
 */

export const cornersOf = (r) => [
	[r.x, r.y],
	[r.x + r.w, r.y],
	[r.x + r.w, r.y + r.h],
	[r.x, r.y + r.h],
]

const contains = (p, r) => p[0] > r.x + 1 && p[0] < r.x + r.w - 1 && p[1] > r.y + 1 && p[1] < r.y + r.h - 1

/**
 * @returns {Array<{x1:number,y1:number,x2:number,y2:number}>} 0 a 4 lineas
 */
export function leaderLines(zona, ventana) {
	const cz = cornersOf(zona)
	const cv = cornersOf(ventana)
	const out = []
	for (let k = 0; k < 4; k++) {
		const a = cz[k]
		const b = cv[k]
		const mid = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
		if (contains(mid, zona) || contains(mid, ventana)) continue
		out.push({ x1: a[0], y1: a[1], x2: b[0], y2: b[1] })
	}
	return out
}

/** Recuadro de la zona ampliada, en coordenadas del contenedor del mapa. */
export function zoneRect(map, bounds) {
	const nw = map.latLngToContainerPoint(bounds.getNorthWest())
	const se = map.latLngToContainerPoint(bounds.getSouthEast())
	return {
		x: Math.min(nw.x, se.x),
		y: Math.min(nw.y, se.y),
		w: Math.abs(se.x - nw.x),
		h: Math.abs(se.y - nw.y),
	}
}
