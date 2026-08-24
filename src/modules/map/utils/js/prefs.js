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
 * @param {Object} estado {baseKey, showGuides, panelCollapsed, lupas}
 * @param {Map} registry id -> {lmap, getGeom}
 */
export function buildPayload({ baseKey, showGuides, panelCollapsed, lupas }, registry) {
	return {
		baseKey,
		showGuides,
		panelCollapsed,
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
