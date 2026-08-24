import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { BASE_LAYERS, useMapContext } from '../context/MapContext'
import { freeSpot } from '../utils/js/freeSpot'
import { normalizeView } from '../utils/js/prefs'
import { createNetworkOverlay, setNavEnabled, swapBaseLayer } from '../utils/js/networkOverlay'

/*
 * Mapa principal sobre Leaflet puro (sin react-leaflet).
 *
 * El mapa se crea una sola vez; los marcadores y tramos los maneja
 * networkOverlay, el mismo modulo que usa cada lupa.
 */

const LUPA_W = 268
const LUPA_H = 210
// Recuadros mas chicos que esto se toman como un clic al aire, no como un gesto
const MIN_GESTO = 16

function OperationalMap() {
	const {
		config,
		onMap,
		lines,
		baseKey,
		locked,
		selected,
		setSelected,
		hovered,
		armed,
		setArmed,
		addLupa,
		lupas,
		clampLupas,
		mainMapRef,
		cardRef,
		viewRef,
		commitView,
		lupaRegistry,
		emitGuidesChange,
		lineMode,
		lineModeRef,
		selectedLine,
		setSelectedLine,
		addPointFromMap,
		draftRef,
		abrirTablero,
	} = useMapContext()

	const containerRef = useRef(null)
	const baseRef = useRef(null)
	const overlayRef = useRef(null)
	const devicesRef = useRef([])
	const lupasRef = useRef([])
	const addPointRef = useRef(addPointFromMap)
	useEffect(() => {
		addPointRef.current = addPointFromMap
	}, [addPointFromMap])
	const abrirRef = useRef(abrirTablero)
	useEffect(() => {
		abrirRef.current = abrirTablero
	}, [abrirTablero])

	useEffect(() => {
		devicesRef.current = onMap
	}, [onMap])
	useEffect(() => {
		lupasRef.current = lupas
	}, [lupas])

	/* ---------------- crear el mapa una sola vez ---------------- */
	useEffect(() => {
		if (!config || mainMapRef.current) return
		/*
		 * La vista que dejo el operador gana sobre el encuadre por defecto del
		 * mapa (MapLocations), que es global. Si no hay nada guardado se usa el
		 * default, y ese es tambien el caso de un usuario nuevo.
		 */
		const guardada = viewRef.current
		const map = L.map(containerRef.current, {
			zoomControl: false,
			attributionControl: false,
			zoomSnap: 0.25,
			zoomDelta: 0.25,
			wheelPxPerZoomLevel: 160,
			preferCanvas: true,
		}).setView(guardada?.center ?? config.center, guardada?.zoom ?? config.zoom)
		L.control.zoom({ position: 'bottomright' }).addTo(map)

		baseRef.current = swapBaseLayer(map, null, BASE_LAYERS[baseKey].url)
		overlayRef.current = createNetworkOverlay(map, {
			// El handler se crea una vez: lee el modo del ref, no del estado
			onSelect: (id) => {
				if (lineModeRef.current) {
					// Clic sobre un equipo: el vertice se ancla ahi. Se pasa por
					// addPointFromMap para que valgan las mismas reglas que un
					// clic al aire (anclaje y descarte de vertices repetidos).
					const d = devicesRef.current.find((x) => x.id === id)
					if (d && d.lat !== null) addPointRef.current(L.latLng(d.lat, d.lon))
					return
				}
				setSelected(id)
			},
			// Doble clic sobre un equipo: se va a su tablero
			onOpen: (id) => {
				// En modo edicion el doble clic esta agregando vertices
				if (lineModeRef.current) return
				const d = devicesRef.current.find((x) => x.id === id)
				if (d) abrirRef.current(d)
			},
		})
		mainMapRef.current = map
		/*
		 * Se asienta la vista aplicada ANTES de escuchar los cambios. El
		 * invalidateSize del ResizeObserver dispara moveend, y sin esto el primer
		 * arranque de un usuario sin preferencias guardaria el encuadre por
		 * defecto como si lo hubiera elegido el.
		 */
		viewRef.current = guardada ?? normalizeView(map.getCenter(), map.getZoom())

		const onZoom = () => overlayRef.current?.syncTags()
		map.on('zoomend', onZoom)

		/*
		 * commitView es estable (guardarPrefs no tiene dependencias), asi que se
		 * puede capturar en este efecto que corre una sola vez.
		 */
		const onViewChange = () => commitView(map.getCenter(), map.getZoom())
		map.on('moveend zoomend', onViewChange)

		return () => {
			map.off('zoomend', onZoom)
			map.off('moveend zoomend', onViewChange)
			overlayRef.current?.destroy()
			map.remove()
			mainMapRef.current = null
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [config])

	/* ---------------- capa base ---------------- */
	useEffect(() => {
		const map = mainMapRef.current
		if (!map) return
		baseRef.current = swapBaseLayer(map, baseRef.current, BASE_LAYERS[baseKey].url)
		overlayRef.current?.bringLinesToFront()
	}, [baseKey, mainMapRef])

	/* ---------------- bloqueo de la vista ---------------- */
	useEffect(() => {
		const map = mainMapRef.current
		if (!map) return
		// En modo dibujo el arrastre queda deshabilitado aparte
		setNavEnabled(map, !locked)
		if (armed) map.dragging.disable()
		const zc = containerRef.current?.querySelector('.leaflet-control-zoom')
		if (zc) zc.style.display = locked ? 'none' : ''
	}, [locked, armed, mainMapRef])

	/* ---------------- red ---------------- */
	useEffect(() => {
		overlayRef.current?.syncMarkers(onMap, { selected, hovered })
	}, [onMap, selected, hovered])

	useEffect(() => {
		overlayRef.current?.syncLines(lines, {
			editMode: lineMode,
			selectedId: selectedLine,
			onSelectLine: (id, latlng) => {
				// En medio de un trazado el clic sobre un tramo agrega un vertice;
				// solo selecciona cuando no hay borrador abierto.
				if (draftRef.current.length) addPointRef.current(latlng)
				else setSelectedLine(id)
			},
		})
	}, [lines, lineMode, selectedLine, setSelectedLine, draftRef])

	/* ---------------- centrar en la seleccion ---------------- */
	useEffect(() => {
		const map = mainMapRef.current
		if (!map || selected === null || locked) return
		const device = devicesRef.current.find((d) => d.id === selected)
		if (!device || device.lat === null) return
		const punto = [device.lat, device.lon]

		// Si ya se ve en el mapa principal o dentro de alguna lupa, no se mueve nada
		if (map.getBounds().pad(-0.05).contains(punto)) return
		for (const entry of lupaRegistry.current.values()) {
			if (entry.lmap.getBounds().contains(punto)) return
		}
		map.panTo(punto)
	}, [selected, locked, mainMapRef, lupaRegistry])

	/* ---------------- dibujar el recuadro de una lupa nueva ---------------- */
	useEffect(() => {
		const map = mainMapRef.current
		const card = cardRef.current
		if (!map || !armed || !card) return
		const container = map.getContainer()
		let inicio = null
		let caja = null

		const limpiar = () => {
			caja?.remove()
			caja = null
			inicio = null
		}

		const onDown = (e) => {
			const r = card.getBoundingClientRect()
			inicio = { x: e.clientX - r.left, y: e.clientY - r.top }
			caja = document.createElement('div')
			caja.className = 'rc-lupa-sel'
			card.appendChild(caja)
		}
		const onMove = (e) => {
			if (!inicio || !caja) return
			const r = card.getBoundingClientRect()
			const x = e.clientX - r.left
			const y = e.clientY - r.top
			caja.style.left = `${Math.min(x, inicio.x)}px`
			caja.style.top = `${Math.min(y, inicio.y)}px`
			caja.style.width = `${Math.abs(x - inicio.x)}px`
			caja.style.height = `${Math.abs(y - inicio.y)}px`
		}
		const onUp = (e) => {
			if (!inicio) return
			const r = card.getBoundingClientRect()
			const x = e.clientX - r.left
			const y = e.clientY - r.top
			const w = Math.abs(x - inicio.x)
			const h = Math.abs(y - inicio.y)
			const a = inicio
			limpiar()
			setArmed(false)
			if (w < MIN_GESTO || h < MIN_GESTO) return

			const p1 = map.containerPointToLatLng([Math.min(x, a.x), Math.min(y, a.y)])
			const p2 = map.containerPointToLatLng([Math.max(x, a.x), Math.max(y, a.y)])
			const bounds = { sw: [Math.min(p1.lat, p2.lat), Math.min(p1.lng, p2.lng)], ne: [Math.max(p1.lat, p2.lat), Math.max(p1.lng, p2.lng)] }

			// Los controles del mapa son zonas prohibidas: una ventana encima los tapa
			const cardRect = card.getBoundingClientRect()
			const blockedRects = ['.rc-tools', '.rc-tools-r', '.leaflet-control-zoom']
				.map((sel) => card.querySelector(sel)?.getBoundingClientRect())
				.filter(Boolean)
				.map((b) => ({ x: b.left - cardRect.left, y: b.top - cardRect.top, w: b.width, h: b.height }))

			const spot = freeSpot({
				w: LUPA_W,
				h: LUPA_H,
				cardWidth: card.clientWidth,
				cardHeight: card.clientHeight,
				markerPoints: devicesRef.current
					.filter((d) => d.lat !== null)
					.map((d) => map.latLngToContainerPoint([d.lat, d.lon])),
				lupaRects: lupasRef.current.map((l) => ({ x: l.x, y: l.y, w: l.w, h: l.h })),
				blockedRects,
			})
			addLupa(bounds, { ...spot, w: LUPA_W, h: LUPA_H })
			emitGuidesChange()
		}

		container.addEventListener('pointerdown', onDown)
		container.addEventListener('pointermove', onMove)
		container.addEventListener('pointerup', onUp)
		return () => {
			container.removeEventListener('pointerdown', onDown)
			container.removeEventListener('pointermove', onMove)
			container.removeEventListener('pointerup', onUp)
			limpiar()
		}
	}, [armed, addLupa, setArmed, mainMapRef, cardRef, emitGuidesChange])

	/* ---------------- cursor del modo dibujo ---------------- */
	useEffect(() => {
		const map = mainMapRef.current
		if (!map) return
		map.getContainer().style.cursor = armed || lineMode ? 'crosshair' : ''
	}, [armed, lineMode, mainMapRef])

	/*
	 * Leaflet no se entera si su contenedor cambia de tamano. Un ResizeObserver
	 * cubre todos los casos (plegar el panel, resize de ventana, layout que se
	 * acomoda despues del montaje) en lugar de perseguir cada uno por separado.
	 */
	useEffect(() => {
		const el = containerRef.current
		if (!el || typeof ResizeObserver === 'undefined') return
		const ro = new ResizeObserver(() => {
			mainMapRef.current?.invalidateSize({ animate: false })
			// Si el contenedor se achico (salir de pantalla completa, ventana mas
			// chica) hay que rescatar las lupas que quedaron fuera del recorte
			const card = cardRef.current
			if (card) clampLupas(card.clientWidth, card.clientHeight)
			emitGuidesChange()
		})
		ro.observe(el)
		return () => ro.disconnect()
	}, [config, mainMapRef, cardRef, clampLupas, emitGuidesChange])

	return <div className='rc-canvas' ref={containerRef} />
}

export default OperationalMap
