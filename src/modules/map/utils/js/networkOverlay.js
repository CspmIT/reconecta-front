import L from 'leaflet'
import { patchPin, pinIcon } from './pins'

/*
 * Capa de red (marcadores + tramos) sobre una instancia de Leaflet.
 *
 * Lo usan el mapa principal y cada lupa: son mapas distintos que muestran la
 * misma red, asi que la logica de alta/baja/parcheo vive una sola vez aca.
 *
 * El contrato es imperativo a proposito. Los marcadores se crean una vez y
 * despues se les parchean las clases en el DOM; recrear los divIcon en cada
 * refresco es lo que hacia parpadear los markers en la version vieja.
 */

// Debajo de este zoom se ocultan las etiquetas para que no se pisen entre si
export const ZOOM_TAGS = 12

export const LINE_STYLE = { color: '#CF0927', weight: 2.6, opacity: 0.85 }
export const LINE_HALO = { color: '#0000006e', weight: 6, opacity: 0.5 }
export const LINE_SELECTED = { color: '#283080', weight: 5, opacity: 1 }

// Vertice anclado a un elemento (relleno) vs libre (hueco)
export const VERTEX_ANCHORED = { radius: 6, color: '#283080', fillColor: '#283080', fillOpacity: 1, weight: 2.5 }
export const VERTEX_FREE = { radius: 4, color: '#283080', fillColor: '#fff', fillOpacity: 1, weight: 2 }

export const PAN_HANDLERS = ['dragging', 'scrollWheelZoom', 'doubleClickZoom', 'touchZoom', 'boxZoom', 'keyboard']

/**
 * @param {L.Map} map
 * @param {Object} opts
 * @param {(id:number)=>void} [opts.onSelect] click en un marcador
 * @param {(id:number)=>void} [opts.onOpen] doble click en un marcador
 * @param {boolean} [opts.tooltips] tooltip con el nombre del tramo (solo mapa principal)
 */
export function createNetworkOverlay(map, { onSelect, onOpen, tooltips = true } = {}) {
	const markers = new Map() // id_element -> L.Marker
	// featureGroup y no layerGroup: bringToFront solo existe en FeatureGroup
	const linesLayer = L.featureGroup().addTo(map)

	const mini = () => map.getZoom() < ZOOM_TAGS

	/** Alta y baja de marcadores segun el conjunto visible. */
	const syncMarkers = (devices, { selected = null, hovered = null } = {}) => {
		const vivos = new Set()
		const chico = mini()

		devices.forEach((device) => {
			if (device.lat === null || device.lon === null) return
			vivos.add(device.id)
			const opts = { mini: chico, selected: selected === device.id, hovered: hovered === device.id }
			let marker = markers.get(device.id)
			if (!marker) {
				marker = L.marker([device.lat, device.lon], { icon: pinIcon(device, opts) }).addTo(map)
				if (onSelect) marker.on('click', () => onSelect(device.id))
				if (onOpen) {
					// L.DomEvent.stop corta la propagacion al mapa: si no, el doble
					// clic tambien haria zoom y quedaria el mapa moviendose mientras
					// se cambia de vista
					marker.on('dblclick', (ev) => {
						L.DomEvent.stop(ev)
						onOpen(device.id)
					})
				}
				markers.set(device.id, marker)
				return
			}
			const pos = marker.getLatLng()
			if (pos.lat !== device.lat || pos.lng !== device.lon) {
				marker.setLatLng([device.lat, device.lon])
			}
			// Si todavia no esta en el DOM se reemplaza el icono entero
			if (!patchPin(marker, device, opts)) marker.setIcon(pinIcon(device, opts))
		})

		markers.forEach((marker, id) => {
			if (!vivos.has(id)) {
				map.removeLayer(marker)
				markers.delete(id)
			}
		})
	}

	/** Muestra u oculta las etiquetas sin recrear marcadores (se llama en zoomend). */
	const syncTags = () => {
		const chico = mini()
		markers.forEach((marker) => {
			const pin = marker.getElement()?.querySelector('.rc-pin')
			if (pin) pin.classList.toggle('mini', chico)
		})
	}

	/**
	 * @param {Array} lines tramos con `points` ya resueltos
	 * @param {Object} [opts]
	 * @param {boolean} [opts.editMode] engrosa el area de click y habilita seleccion
	 * @param {number|null} [opts.selectedId]
	 * @param {(id:number)=>void} [opts.onSelectLine]
	 */
	const syncLines = (lines, { editMode = false, selectedId = null, onSelectLine } = {}) => {
		linesLayer.clearLayers()
		lines.forEach((line) => {
			if (!line.points || line.points.length < 2) return
			const elegido = line.id === selectedId

			if (editMode) {
				// Capa invisible y gruesa: acertarle a una linea de 2.6px con el
				// mouse es incomodo, sobre todo en zoom bajo
				const hit = L.polyline(line.points, { color: '#000', weight: 14, opacity: 0 }).addTo(linesLayer)
				if (onSelectLine) {
					hit.on('click', (ev) => {
						// Se corta la propagacion para que el mapa no reciba el clic;
						// por eso se pasa el latlng, asi quien decide puede usarlo
						// para agregar un vertice en medio de un trazado.
						L.DomEvent.stopPropagation(ev)
						onSelectLine(line.id, ev.latlng)
					})
				}
			} else {
				L.polyline(line.points, LINE_HALO).addTo(linesLayer)
			}

			const estilo = elegido ? LINE_SELECTED : LINE_STYLE
			const pl = L.polyline(line.points, estilo).addTo(linesLayer)
			if (tooltips) pl.bindTooltip(line.name, { sticky: true, direction: 'top' })

			// Los vertices del tramo elegido: relleno = anclado a un elemento
			if (elegido && editMode) {
				line.points.forEach((pt, i) => {
					const anclado = (line.anchors || [])[i] !== null && (line.anchors || [])[i] !== undefined
					L.circleMarker(pt, anclado ? VERTEX_ANCHORED : VERTEX_FREE).addTo(linesLayer)
				})
			}
		})
	}

	const bringLinesToFront = () => linesLayer.bringToFront()

	const destroy = () => {
		markers.forEach((marker) => map.removeLayer(marker))
		markers.clear()
		map.removeLayer(linesLayer)
	}

	return { syncMarkers, syncTags, syncLines, bringLinesToFront, destroy, markers }
}

/** Cambia la capa base devolviendo la nueva, sacando la anterior si habia. */
export function swapBaseLayer(map, previous, url) {
	if (previous) map.removeLayer(previous)
	return L.tileLayer(url, { maxZoom: 19 }).addTo(map)
}

/** Habilita o deshabilita todos los handlers de navegacion de un mapa. */
export function setNavEnabled(map, enabled) {
	PAN_HANDLERS.forEach((h) => {
		if (map[h]) map[h][enabled ? 'enable' : 'disable']()
	})
}
