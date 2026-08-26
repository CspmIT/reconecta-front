/*
 * Anclaje de vertices a elementos de la red.
 *
 * El radio se mide en pixeles de pantalla, no en metros: lo que el operador
 * percibe como "estoy encima del equipo" depende del zoom. A z11 dos nodos
 * separados por 500 m estan a pocos pixeles; a z17 estan lejisimos.
 */

export const SNAP_PX = 18

/**
 * Busca el elemento mas cercano al punto dado, dentro del radio.
 *
 * @param {Object} map instancia de Leaflet (se usa latLngToContainerPoint)
 * @param {{lat:number,lng:number}} latlng posicion del cursor
 * @param {Array} devices equipos candidatos (los visibles en el mapa)
 * @param {number} radiusPx
 * @returns {{lat:number,lon:number,id_element:number|null,name:string|null}}
 */
export function snapToDevice(map, latlng, devices, radiusPx = SNAP_PX) {
	const p = map.latLngToContainerPoint(latlng)
	let mejor = null

	for (const d of devices) {
		if (d.lat === null || d.lon === null) continue
		const q = map.latLngToContainerPoint([d.lat, d.lon])
		const dist = Math.hypot(p.x - q.x, p.y - q.y)
		if (dist <= radiusPx && (!mejor || dist < mejor.dist)) mejor = { dist, d }
	}

	if (mejor) {
		return { lat: mejor.d.lat, lon: mejor.d.lon, id_element: mejor.d.id, name: mejor.d.name }
	}
	return { lat: latlng.lat, lon: latlng.lng, id_element: null, name: null }
}

/** Evita vertices duplicados por un doble clic o un temblor del mouse. */
export function tooCloseToLast(map, draft, point, minPx = 6) {
	const last = draft[draft.length - 1]
	if (!last) return false
	const a = map.latLngToContainerPoint([last.lat, last.lon])
	const b = map.latLngToContainerPoint([point.lat, point.lon])
	return Math.hypot(a.x - b.x, a.y - b.y) < minPx
}

/**
 * Nombre sugerido para un tramo nuevo. Si los extremos quedaron anclados, se
 * arma con ellos; si no, un generico que el operador puede renombrar.
 */
export function suggestName(draft, fallbackIndex) {
	const a = draft[0]?.name
	const b = draft[draft.length - 1]?.name
	if (a && b && a !== b) return `${a} → ${b}`
	if (a) return `Desde ${a}`
	return `Tramo ${fallbackIndex}`
}

/** Convierte el borrador al formato que espera POST/PUT /map/lines. */
export function draftToVertices(draft) {
	return draft.map((v) => (v.id_element ? { id_element: v.id_element } : { lat: v.lat, lon: v.lon }))
}
