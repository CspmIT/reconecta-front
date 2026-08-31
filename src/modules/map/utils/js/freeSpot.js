/*
 * Busca donde soltar una lupa nueva sin tapar equipos ni otras lupas.
 *
 * Recorre el contenedor en pasos y puntua cada posicion: penaliza fuerte el
 * solape con lupas existentes, algo el solape con marcadores, y agrega un
 * desempate suave que acerca la ventana al centro. Devuelve la de menor puntaje.
 */

const PASO = 26
const PAD = 14
const TOP = 14

const PENALIDAD_OCUPADO = 200
const PENALIDAD_MARCADOR = 12
const MARGEN_OCUPADO = 18
const MARGEN_MARCADOR = 30

/**
 * @param {Object} o
 * @param {Array<{x,y,w,h}>} [o.blockedRects] zonas a evitar que no son lupas
 *        (barra de herramientas, chip de lupas, control de zoom): una ventana
 *        encima de ellas tapa controles y no se pueden usar.
 */
export function freeSpot({ w, h, cardWidth, cardHeight, markerPoints = [], lupaRects = [], blockedRects = [] }) {
	const maxX = cardWidth - w - PAD
	const maxY = cardHeight - h - PAD
	if (maxX < PAD || maxY < TOP) return { x: PAD, y: TOP }

	let mejor = null
	for (let x = PAD; x <= maxX; x += PASO) {
		for (let y = TOP; y <= maxY; y += PASO) {
			let puntaje = 0

			for (const p of markerPoints) {
				if (
					p.x > x - MARGEN_MARCADOR &&
					p.x < x + w + MARGEN_MARCADOR &&
					p.y > y - MARGEN_MARCADOR &&
					p.y < y + h + MARGEN_MARCADOR
				) {
					puntaje += PENALIDAD_MARCADOR
				}
			}

			for (const r of [...lupaRects, ...blockedRects]) {
				if (
					x < r.x + r.w + MARGEN_OCUPADO &&
					x + w + MARGEN_OCUPADO > r.x &&
					y < r.y + r.h + MARGEN_OCUPADO &&
					y + h + MARGEN_OCUPADO > r.y
				) {
					puntaje += PENALIDAD_OCUPADO
				}
			}

			// Desempate: a igual estorbo, mas cerca del centro
			puntaje += (Math.abs(x + w / 2 - cardWidth / 2) + Math.abs(y + h / 2 - cardHeight / 2)) * 0.004

			if (!mejor || puntaje < mejor.puntaje) mejor = { x, y, puntaje }
		}
	}
	return mejor ? { x: mejor.x, y: mejor.y } : { x: PAD, y: TOP }
}

/*
 * Minimos de una ventana de lupa. Viven aca y no en el componente porque los
 * usan tanto la redimension a mano como el recorte de abajo.
 */
export const MIN_LUPA_W = 170
export const MIN_LUPA_H = 150

/**
 * Recorta una lupa para que entre en el contenedor.
 *
 * Hace falta al salir de pantalla completa: una ventana arrastrada hasta el
 * borde del monitor queda fuera del mapa chico y, como el contenedor recorta
 * lo que sobra, quedaria invisible y sin forma de recuperarla.
 *
 * @param {{x:number,y:number,w:number,h:number}} g
 * @returns {{x:number,y:number,w:number,h:number}} geometria ya adentro
 */
export function clampToCard(g, cardWidth, cardHeight) {
	const w = Math.max(MIN_LUPA_W, Math.min(g.w, cardWidth - PAD * 2))
	const h = Math.max(MIN_LUPA_H, Math.min(g.h, cardHeight - PAD * 2))
	return {
		w,
		h,
		x: Math.max(4, Math.min(g.x, cardWidth - w - 4)),
		y: Math.max(4, Math.min(g.y, cardHeight - h - 4)),
	}
}
