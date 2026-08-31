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

/*
 * Etiquetas de los marcadores.
 *
 * Se muestran SIEMPRE, y se oculta unicamente la que se pisaria con otra ya
 * visible. Antes se escondian todas debajo de un zoom fijo (12), que no cumplia
 * lo que prometia: medido con los 13 elementos de desarrollo en un area de
 * 1540x900, a zoom 12 exacto ya habia 11 pares superpuestos, y al mismo tiempo
 * el encuadre por defecto (11,5, el que trae MapLocations) las escondia todas.
 * Un umbral de zoom no puede saber si dos elementos estan cerca en pantalla;
 * la geometria si.
 */

// Margen alrededor de cada etiqueta: dos que se tocan justo se leen pegadas
const TAG_GAP = 2

/*
 * Posiciones que se le prueban a una etiqueta antes de esconderla, en orden.
 * '' es la de por defecto (a la derecha del simbolo); las clases las define
 * operational.css. Probar las cuatro entra muchas mas etiquetas que quedarse
 * solo con la de por defecto: medido con los 13 elementos de desarrollo en
 * 1540x900, en el encuadre por defecto pasa de 6 a 12 nombres visibles.
 */
const TAG_POS = ['', 'iz', 'ar', 'ab']

/*
 * Costo: se compara cada etiqueta con las ya ubicadas, asi que crece con el
 * cuadrado de los marcadores. Medido en 1540x900: 3 ms con 13, 4 con 26, 17 con
 * 52 y 48 con 104. Con la red de Coopmorteros (13 hoy, ~30 previstos) son 3-4 ms
 * por zoomend; si algun dia entran cientos, hay que revisarlo.
 *
 * Se acomodan TODAS las etiquetas, tambien las de los marcadores que quedaron
 * fuera de la vista. Saltearlas seria mas barato pero deja etiquetas sin
 * resolver justo en el borde, y desplazar el mapa no dispara zoomend: entrarian
 * en pantalla pisandose. A esta escala el filtro no ahorraba nada medible
 * (2,7 ms contra 3,0), asi que no vale el riesgo.

/*
 * Prioridad para decidir quien gana cuando dos etiquetas se pisan. Desde
 * PRIO_FORZAR la etiqueta NO se esconde nunca: el equipo elegido o el que tiene
 * el mouse encima es el que el operador esta mirando, y puede quedar encajonado
 * entre los simbolos de sus vecinos sin ninguna posicion libre.
 */
const PRIO_FORZAR = 3

const prioridadDe = (device, selected, hovered) => {
	if (device.id === selected) return 4
	if (device.id === hovered) return 3
	if (device.alarm) return 2
	// Un elemento sin equipos (los BE/SETA sin nada cargado) es el menos
	// interesante de los tres, asi que cede la etiqueta antes que los demas
	if (device.st !== null || (device.equipments || []).length > 0) return 1
	return 0
}

const sePisan = (a, b) =>
	a.left - TAG_GAP < b.right && b.left - TAG_GAP < a.right && a.top - TAG_GAP < b.bottom && b.top - TAG_GAP < a.bottom

export const LINE_STYLE = { color: '#CF0927', weight: 2.6, opacity: 0.85 }
export const LINE_HALO = { color: '#0000006e', weight: 6, opacity: 0.5 }
/*
 * El tramo elegido se marca con un contorno y NO cambiandole el color: si lo
 * pisara, elegir un color en el editor no se veria hasta deseleccionarlo, que
 * es justo cuando hay que verlo.
 */
export const LINE_SELECTED = { color: '#283080', weight: 8, opacity: 0.9 }

// Color de un tramo sin pintar: los que nunca pasaron por el selector
export const lineColor = (line) => line?.color || LINE_STYLE.color

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

	// Ultimo estado con el que se dibujo, para poder recalcular las etiquetas en
	// un zoomend sin que quien nos usa tenga que volver a pasarlo
	let ultimo = { devices: [], selected: null, hovered: null }

	/** Alta y baja de marcadores segun el conjunto visible. */
	const syncMarkers = (devices, { selected = null, hovered = null } = {}) => {
		ultimo = { devices, selected, hovered }
		const vivos = new Set()

		devices.forEach((device) => {
			if (device.lat === null || device.lon === null) return
			vivos.add(device.id)
			const opts = { selected: selected === device.id, hovered: hovered === device.id }
			// Al frente: si no, su etiqueta (y el punto agrandado) quedan debajo del
			// marcador de un vecino, que Leaflet apila por latitud
			const alFrente = opts.selected || opts.hovered ? 1000 : 0
			let marker = markers.get(device.id)
			if (!marker) {
				marker = L.marker([device.lat, device.lon], { icon: pinIcon(device, opts), zIndexOffset: alFrente }).addTo(map)
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
			if (marker.options.zIndexOffset !== alFrente) marker.setZIndexOffset(alFrente)
			// Si todavia no esta en el DOM se reemplaza el icono entero
			if (!patchPin(marker, device, opts)) marker.setIcon(pinIcon(device, opts))
		})

		markers.forEach((marker, id) => {
			if (!vivos.has(id)) {
				map.removeLayer(marker)
				markers.delete(id)
			}
		})

		syncTags()
	}

	/**
	 * Decide que etiquetas se ven, sin recrear marcadores.
	 *
	 * Se recorren por prioridad y, dentro de la misma, por id: el orden es
	 * estable, asi que al volver a un zoom se esconden exactamente las mismas y
	 * no parpadean. Se muestran todas primero para poder medirlas, y esconder una
	 * no mueve a las demas (van en position: absolute), asi que alcanza con una
	 * sola pasada de lectura.
	 */
	const syncTags = () => {
		const porId = new Map(ultimo.devices.map((d) => [d.id, d]))
		const candidatos = []
		markers.forEach((marker, id) => {
			const pin = marker.getElement()?.querySelector('.rc-pin')
			const tag = pin?.querySelector('.rc-tag')
			const dot = pin?.querySelector('.rc-dot')
			if (!pin || !tag || !dot) return
			pin.classList.remove('mini')
			tag.classList.remove(...TAG_POS.filter(Boolean))
			candidatos.push({
				id,
				pin,
				tag,
				dot: dot.getBoundingClientRect(),
				prio: prioridadDe(porId.get(id) || {}, ultimo.selected, ultimo.hovered),
			})
		})
		candidatos.sort((a, b) => b.prio - a.prio || a.id - b.id)

		/*
		 * Los simbolos tambien ocupan lugar: una etiqueta puesta encima de un
		 * marcador no se lee. Ya se midieron arriba, en la misma pasada que el
		 * filtro de vista, y no se mueven mientras se acomodan las etiquetas.
		 */
		const simbolos = candidatos.map((c) => ({ id: c.id, caja: c.dot }))

		const visibles = []
		candidatos.forEach((c) => {
			const forzada = c.prio >= PRIO_FORZAR

			/*
			 * Busca la primera posicion libre. `conSimbolos` en false ignora los
			 * marcadores vecinos: es el segundo intento de una etiqueta forzada,
			 * que preferimos leer sobre un simbolo antes que no leerla.
			 */
			const buscar = (conSimbolos) =>
				TAG_POS.find((pos) => {
					if (pos) c.tag.classList.add(pos)
					const caja = c.tag.getBoundingClientRect()
					const choca =
						visibles.some((v) => sePisan(v, caja)) ||
						// El simbolo propio no cuenta: la etiqueta va justo al lado de el
						(conSimbolos && simbolos.some((d) => d.id !== c.id && sePisan(d.caja, caja)))
					if (!choca) {
						visibles.push(caja)
						return true
					}
					if (pos) c.tag.classList.remove(pos)
					return false
				})

			if (buscar(true) !== undefined) return
			if (forzada) {
				// Aunque no quede lugar se muestra igual, en la posicion por defecto
				if (buscar(false) === undefined) visibles.push(c.tag.getBoundingClientRect())
				return
			}
			c.pin.classList.add('mini')
		})
	}

	/*
	 * El recalculo va enganchado aca y no en cada consumidor: el mapa principal y
	 * cada lupa tienen su propio zoom, y antes las lupas nunca lo recalculaban
	 * (sus etiquetas quedaban con el estado del momento en que se crearon).
	 */
	map.on('zoomend', syncTags)

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

			if (elegido) L.polyline(line.points, LINE_SELECTED).addTo(linesLayer)
			const estilo = { ...LINE_STYLE, color: lineColor(line) }
			if (elegido) Object.assign(estilo, { weight: 3.4, opacity: 1 })
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
		map.off('zoomend', syncTags)
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
