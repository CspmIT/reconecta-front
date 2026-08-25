/*
 * Armado y validacion del layout que se persiste en UserPrefs (modulo 'map').
 *
 * Aparte del contexto para poder probarlo: el caso de la ventana que se cierra
 * mientras hay un guardado agendado es facil de romper y dificil de ver a ojo.
 */

/** Descarta entradas corruptas o de una version vieja del payload. */
export const sanitizeLupas = (list) => {
	if (!Array.isArray(list)) return []
	return list.filter(
		(l) =>
			l &&
			Number.isFinite(l.id) &&
			Number.isFinite(l.w) &&
			Number.isFinite(l.h) &&
			Number.isFinite(l.x) &&
			Number.isFinite(l.y) &&
			Array.isArray(l.bounds?.sw) &&
			l.bounds.sw.length === 2 &&
			Array.isArray(l.bounds?.ne) &&
			l.bounds.ne.length === 2 &&
			[...l.bounds.sw, ...l.bounds.ne].every(Number.isFinite)
	)
}

/*
 * Centro y zoom del mapa principal.
 *
 * Se redondea a proposito: la latitud a 6 decimales (unos 10 cm) y el zoom a 2.
 * Sin eso, medio pixel de arrastre cambia el payload y cada gesto minimo
 * termina en una escritura al backend.
 */
const r6 = (n) => Math.round(n * 1e6) / 1e6
const latDe = (c) => (Array.isArray(c) ? c[0] : c.lat)
const lonDe = (c) => (Array.isArray(c) ? c[1] : c.lng)

/** @param {[number,number]|{lat:number,lng:number}} center */
export const normalizeView = (center, zoom) => ({
	center: [r6(latDe(center)), r6(lonDe(center))],
	zoom: Math.round(zoom * 100) / 100,
})

export const sameView = (a, b) =>
	!!a && !!b && a.zoom === b.zoom && a.center[0] === b.center[0] && a.center[1] === b.center[1]

/**
 * Descarta una vista corrupta o de una version vieja del payload.
 *
 * Se validan los rangos y no solo el tipo: Leaflet acepta sin chistar una
 * latitud de 900 y deja el mapa en un lugar que el operador no puede
 * reconocer ni corregir, porque volveria ahi en cada arranque.
 */
export const sanitizeView = (view) => {
	if (!view || !Array.isArray(view.center) || view.center.length !== 2) return null
	if (!view.center.every(Number.isFinite) || !Number.isFinite(view.zoom)) return null
	const [lat, lon] = view.center
	if (lat < -90 || lat > 90 || lon < -180 || lon > 180) return null
	if (view.zoom < 0 || view.zoom > 22) return null
	return { center: [lat, lon], zoom: view.zoom }
}

/** El proximo id tiene que quedar por encima de todos los restaurados. */
export const nextIdFrom = (list) => list.reduce((max, l) => Math.max(max, l.id || 0), 0) + 1

/**
 * Arma el payload a guardar.
 *
 * Los limites de cada lupa se leen del registro de ventanas montadas, no del
 * estado: el estado tiene el encuadre con el que se creo, y lo que hay que
 * restaurar es lo que el operador esta viendo ahora. Si la ventana todavia no
 * se monto, se conserva el descriptor guardado en lugar de perderla.
 *
 * La vista del mapa principal llega aparte porque tampoco vive en el estado de
 * React: mover el mapa dispararia un render por frame.
 *
 * @param {Object} estado {baseKey, showGuides, panelCollapsed, lupas}
 * @param {Map} registry id -> {lmap, getGeom}
 * @param {{center:[number,number],zoom:number}|null} [view]
 */
export function buildPayload({ baseKey, showGuides, panelCollapsed, lupas }, registry, view = null) {
	return {
		baseKey,
		showGuides,
		panelCollapsed,
		view: sanitizeView(view),
		lupas: (lupas || []).map((l) => {
			const entry = registry?.get(l.id)
			if (!entry) return l
			const b = entry.lmap.getBounds()
			const g = entry.getGeom()
			return {
				id: l.id,
				name: l.name,
				x: g.x,
				y: g.y,
				w: g.w,
				h: g.h,
				bounds: { sw: [b.getSouth(), b.getWest()], ne: [b.getNorth(), b.getEast()] },
			}
		}),
	}
}
