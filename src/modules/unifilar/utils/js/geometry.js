// Geometría del documento unifilar. Las coordenadas ya vienen en espacio SVG
// (el backend invierte el eje Y del DWG al convertir).
// Espejo de back-reconecta/services/unifilar/documentToSvg.js.

const num = (v) => Number(v.toFixed(4))

// punto(a) = (cx + r·cos a, cy − r·sin a); arcos DWG son CCW → sweep=0
export const arcPath = (e) => {
	const x1 = e.cx + e.r * Math.cos(e.a1)
	const y1 = e.cy - e.r * Math.sin(e.a1)
	const x2 = e.cx + e.r * Math.cos(e.a2)
	const y2 = e.cy - e.r * Math.sin(e.a2)
	const delta = (e.a2 - e.a1 + Math.PI * 2) % (Math.PI * 2)
	const largeArc = delta > Math.PI ? 1 : 0
	return `M ${num(x1)} ${num(y1)} A ${num(e.r)} ${num(e.r)} 0 ${largeArc} 0 ${num(x2)} ${num(y2)}`
}

export const polylinePath = (e) => {
	const { points, bulges, closed } = e
	let d = `M ${num(points[0][0])} ${num(points[0][1])}`
	const segments = closed ? points.length : points.length - 1
	for (let i = 0; i < segments; i++) {
		const p1 = points[i]
		const p2 = points[(i + 1) % points.length]
		const bulge = bulges?.[i] || 0
		if (!bulge) {
			d += ` L ${num(p2[0])} ${num(p2[1])}`
			continue
		}
		const theta = 4 * Math.atan(bulge)
		const chord = Math.hypot(p2[0] - p1[0], p2[1] - p1[1])
		const r = Math.abs(chord / (2 * Math.sin(theta / 2)))
		const largeArc = Math.abs(theta) > Math.PI ? 1 : 0
		const sweep = bulge > 0 ? 0 : 1
		d += ` A ${num(r)} ${num(r)} 0 ${largeArc} ${sweep} ${num(p2[0])} ${num(p2[1])}`
	}
	if (closed) d += ' Z'
	return d
}

export const entityBBox = (e) => {
	switch (e.type) {
		case 'line':
			return [Math.min(e.x1, e.x2), Math.min(e.y1, e.y2), Math.max(e.x1, e.x2), Math.max(e.y1, e.y2)]
		case 'circle':
		case 'arc':
			return [e.cx - e.r, e.cy - e.r, e.cx + e.r, e.cy + e.r]
		case 'polyline': {
			const xs = e.points.map((p) => p[0])
			const ys = e.points.map((p) => p[1])
			return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)]
		}
		case 'text': {
			const width = e.size * 0.6 * Math.max(...e.lines.map((l) => l.length))
			const x1 = e.anchor === 'end' ? e.x - width : e.anchor === 'middle' ? e.x - width / 2 : e.x
			return [x1, e.y - e.size, x1 + width, e.y + e.size * 1.2 * e.lines.length]
		}
		case 'symbol': {
			const half = (e.scale || 1) * 0.6
			return [e.x - half, e.y - half, e.x + half, e.y + half]
		}
		default:
			return null
	}
}

export const documentBBox = (entities) => {
	const bbox = [Infinity, Infinity, -Infinity, -Infinity]
	for (const entity of entities) {
		const b = entityBBox(entity)
		if (!b) continue
		bbox[0] = Math.min(bbox[0], b[0])
		bbox[1] = Math.min(bbox[1], b[1])
		bbox[2] = Math.max(bbox[2], b[2])
		bbox[3] = Math.max(bbox[3], b[3])
	}
	return bbox[0] === Infinity ? [0, 0, 100, 100] : bbox
}

export const bboxIntersects = (a, b) => a[0] <= b[2] && a[2] >= b[0] && a[1] <= b[3] && a[3] >= b[1]

export const unionBBox = (entities) => {
	const bbox = [Infinity, Infinity, -Infinity, -Infinity]
	for (const entity of entities) {
		const b = entityBBox(entity)
		if (!b) continue
		bbox[0] = Math.min(bbox[0], b[0])
		bbox[1] = Math.min(bbox[1], b[1])
		bbox[2] = Math.max(bbox[2], b[2])
		bbox[3] = Math.max(bbox[3], b[3])
	}
	return bbox[0] === Infinity ? null : bbox
}

// Expande un clic a todo el símbolo: BFS por proximidad de bboxes desde la
// entidad tocada. Los planos DWG vienen "sueltos" (un seccionador son varias
// líneas/arcos independientes); esto los agrupa al seleccionar.
//
// Para que la selección no se propague por los cables a todo el plano se
// aprovecha una convención de los esquemas eléctricos: los conductores son
// líneas verticales/horizontales, mientras que los trazos de símbolo son
// oblicuos, curvos o muy cortos. Las líneas axiales no expanden el cluster.
export const clusterFromSeed = (entities, seedId, viewSize) => {
	const seed = entities.find((e) => e.id === seedId)
	if (!seed) return [seedId]
	const tolerance = viewSize * 0.002
	const maxSize = viewSize * 0.05
	const size = (b) => Math.max(b[2] - b[0], b[3] - b[1])

	const isAxial = (e) => {
		if (e.type !== 'line') return false
		const eps = viewSize * 0.0005
		return Math.abs(e.x1 - e.x2) < eps || Math.abs(e.y1 - e.y2) < eps
	}
	// Un trazo "de símbolo": chico, y si es línea axial tiene que ser muy corta
	const isSymbolStroke = (e) => {
		if (e.type === 'text' || e.type === 'symbol') return false
		const s = size(entityBBox(e))
		if (s > maxSize) return false
		if (isAxial(e)) return s <= viewSize * 0.012
		return true
	}

	const seedBox = entityBBox(seed)
	// Si se tocó un conductor u otra entidad grande, no expandir
	if (size(seedBox) > maxSize || seed.type === 'text') return [seedId]
	const candidates = entities.filter(isSymbolStroke)
	const selected = new Set([seedId])
	const queue = [seedBox]
	while (queue.length && selected.size < 30) {
		const box = queue.pop()
		const inflated = [box[0] - tolerance, box[1] - tolerance, box[2] + tolerance, box[3] + tolerance]
		for (const candidate of candidates) {
			if (selected.has(candidate.id)) continue
			const candidateBox = entityBBox(candidate)
			if (bboxIntersects(inflated, candidateBox)) {
				selected.add(candidate.id)
				queue.push(candidateBox)
			}
		}
	}
	// Cluster desbordado: mejor devolver solo lo tocado que un grupo absurdo
	if (selected.size >= 30) return [seedId]
	return [...selected]
}

export const translateEntity = (e, dx, dy) => {
	switch (e.type) {
		case 'line':
			return { ...e, x1: num(e.x1 + dx), y1: num(e.y1 + dy), x2: num(e.x2 + dx), y2: num(e.y2 + dy) }
		case 'circle':
		case 'arc':
			return { ...e, cx: num(e.cx + dx), cy: num(e.cy + dy) }
		case 'polyline':
			return { ...e, points: e.points.map(([x, y]) => [num(x + dx), num(y + dy)]) }
		case 'text':
		case 'symbol':
			return { ...e, x: num(e.x + dx), y: num(e.y + dy) }
		default:
			return e
	}
}
