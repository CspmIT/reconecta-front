import { useEffect, useRef } from 'react'
import L from 'leaflet'
import { BASE_LAYERS, useMapContext } from '../context/MapContext'
import { MIN_LUPA_H, MIN_LUPA_W } from '../utils/js/freeSpot'
import { createNetworkOverlay, setNavEnabled, swapBaseLayer } from '../utils/js/networkOverlay'

/*
 * Lupa: ventana flotante con su propio mapa Leaflet, encuadrada en la zona que
 * el operador dibujo sobre el mapa principal.
 *
 * Arrastre y redimension se manejan de forma imperativa durante el gesto (se
 * toca el style directo y se avisa a las guias) y solo se confirman al estado
 * de React al soltar. Mover una ventana no tiene que rerenderizar el arbol.
 */

const zfmt = (z) => 'z' + (Math.round(z * 4) / 4).toFixed(2).replace(/\.?0+$/, '')

function LupaWindow({ lupa }) {
	const {
		onMap,
		lines,
		baseKey,
		locked,
		selected,
		setSelected,
		hovered,
		removeLupa,
		commitLupaGeom,
		lupaRegistry,
		lupaZ,
		emitGuidesChange,
		abrirTablero,
	} = useMapContext()

	const elRef = useRef(null)
	const bodyRef = useRef(null)
	const mapRef = useRef(null)
	const baseRef = useRef(null)
	const overlayRef = useRef(null)
	const zoomLabelRef = useRef(null)
	const devicesRef = useRef(onMap)
	// Geometria viva durante el gesto; el estado se actualiza al soltar
	const geomRef = useRef({ x: lupa.x, y: lupa.y, w: lupa.w, h: lupa.h })
	/*
	 * El overlay se crea una sola vez por lupa, asi que el handler no puede
	 * quedarse con la version de `abrirTablero` del montaje: esa funcion depende
	 * de las pestanas abiertas y una version vieja podria duplicar una pestana.
	 */
	const abrirRef = useRef(abrirTablero)
	useEffect(() => {
		abrirRef.current = abrirTablero
	}, [abrirTablero])

	/* ---------------- crear el mapa de la lupa ---------------- */
	useEffect(() => {
		const map = L.map(bodyRef.current, {
			zoomControl: false,
			attributionControl: false,
			zoomSnap: 0.25,
			zoomDelta: 0.25,
			wheelPxPerZoomLevel: 160,
			preferCanvas: true,
		})
		map.fitBounds(L.latLngBounds(lupa.bounds.sw, lupa.bounds.ne))
		baseRef.current = swapBaseLayer(map, null, BASE_LAYERS[baseKey].url)
		overlayRef.current = createNetworkOverlay(map, {
			onSelect: setSelected,
			onOpen: (id) => {
				const d = devicesRef.current.find((x) => x.id === id)
				if (d) abrirRef.current(d)
			},
			tooltips: false,
		})
		mapRef.current = map

		// Se captura en una local: el Map se crea una vez y solo se muta, nunca se
		// reasigna, asi que es el mismo objeto en el cleanup. Explicitarlo evita
		// el falso positivo de react-hooks/exhaustive-deps sobre refs.
		const registry = lupaRegistry.current
		registry.set(lupa.id, { lmap: map, getGeom: () => geomRef.current })

		const onMove = () => {
			if (zoomLabelRef.current) zoomLabelRef.current.textContent = zfmt(map.getZoom())
			emitGuidesChange()
		}
		map.on('move zoom moveend zoomend', onMove)
		onMove()

		// El contenedor arranca con tamano recien asignado por el navegador
		const t = setTimeout(() => {
			map.invalidateSize({ animate: false })
			emitGuidesChange()
		}, 30)

		return () => {
			clearTimeout(t)
			map.off('move zoom moveend zoomend', onMove)
			overlayRef.current?.destroy()
			map.remove()
			mapRef.current = null
			registry.delete(lupa.id)
			emitGuidesChange()
		}
		// Se monta una vez por lupa: el encuadre inicial no debe reaplicarse
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [lupa.id])

	/*
	 * La geometria tambien puede cambiar desde afuera: al achicarse el
	 * contenedor el contexto recorta las lupas que quedaron fuera. El ref tiene
	 * que seguir al estado o el proximo arrastre arrancaria desde la posicion
	 * vieja y la ventana daria un salto.
	 */
	useEffect(() => {
		geomRef.current = { x: lupa.x, y: lupa.y, w: lupa.w, h: lupa.h }
		mapRef.current?.invalidateSize({ animate: false })
	}, [lupa.x, lupa.y, lupa.w, lupa.h])

	/* ---------------- capa base ---------------- */
	useEffect(() => {
		const map = mapRef.current
		if (!map) return
		baseRef.current = swapBaseLayer(map, baseRef.current, BASE_LAYERS[baseKey].url)
		overlayRef.current?.bringLinesToFront()
	}, [baseKey])

	/* ---------------- red ---------------- */
	useEffect(() => {
		devicesRef.current = onMap
		overlayRef.current?.syncMarkers(onMap, { selected, hovered })
	}, [onMap, selected, hovered])

	useEffect(() => {
		overlayRef.current?.syncLines(lines)
	}, [lines])

	/* ---------------- bloqueo ---------------- */
	useEffect(() => {
		const map = mapRef.current
		if (!map) return
		setNavEnabled(map, !locked)
	}, [locked])

	/** Trae la lupa al frente sin tocar el orden del DOM. */
	const traerAlFrente = () => {
		if (elRef.current) elRef.current.style.zIndex = String(++lupaZ.current)
	}

	// Tocar cualquier parte de la lupa la trae al frente. En fase de captura para
	// que funcione aunque el clic lo consuma el mapa de adentro.
	useEffect(() => {
		const el = elRef.current
		if (!el) return
		const onDown = () => traerAlFrente()
		el.addEventListener('pointerdown', onDown, true)
		return () => el.removeEventListener('pointerdown', onDown, true)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	/* ---------------- arrastre por la cabecera ---------------- */
	useEffect(() => {
		const head = elRef.current?.querySelector('.rc-lupa-head')
		if (!head) return

		const onDown = (e) => {
			if (locked || e.target.closest('.rc-lupa-btn')) return
			elRef.current.classList.add('drag')
			const card = elRef.current.parentElement
			const dx = e.clientX - geomRef.current.x
			const dy = e.clientY - geomRef.current.y

			/*
			 * Los listeners van en window y no en la cabecera: asi el arrastre
			 * sigue funcionando aunque el cursor se salga de la barra (o de la
			 * ventana). setPointerCapture solo no alcanza — cualquier cosa que
			 * saque el nodo del documento la libera.
			 */
			const onMove = (ev) => {
				const g = geomRef.current
				g.x = Math.max(4, Math.min(card.clientWidth - g.w - 4, ev.clientX - dx))
				g.y = Math.max(4, Math.min(card.clientHeight - g.h - 4, ev.clientY - dy))
				elRef.current.style.left = `${g.x}px`
				elRef.current.style.top = `${g.y}px`
				emitGuidesChange()
			}
			const onUp = () => {
				window.removeEventListener('pointermove', onMove)
				window.removeEventListener('pointerup', onUp)
				window.removeEventListener('pointercancel', onUp)
				elRef.current?.classList.remove('drag')
				const { x, y } = geomRef.current
				commitLupaGeom(lupa.id, { x, y })
			}
			window.addEventListener('pointermove', onMove)
			window.addEventListener('pointerup', onUp)
			// pointercancel: el navegador puede abortar el gesto (gesto tactil, Alt+Tab)
			window.addEventListener('pointercancel', onUp)
		}

		head.addEventListener('pointerdown', onDown)
		return () => head.removeEventListener('pointerdown', onDown)
	}, [locked, lupa.id, commitLupaGeom, emitGuidesChange])

	/* ---------------- redimension por la manija ---------------- */
	useEffect(() => {
		const grip = elRef.current?.querySelector('.rc-lupa-grip')
		if (!grip) return

		const onDown = (e) => {
			if (locked) return
			e.stopPropagation()
			const card = elRef.current.parentElement
			const sx = e.clientX
			const sy = e.clientY
			const w0 = geomRef.current.w
			const h0 = geomRef.current.h

			// En window por lo mismo que el arrastre: la manija son 16px y es muy
			// facil que el cursor se le salga en un gesto rapido
			const onMove = (ev) => {
				const g = geomRef.current
				g.w = Math.max(MIN_LUPA_W, Math.min(card.clientWidth - g.x - 6, w0 + ev.clientX - sx))
				g.h = Math.max(MIN_LUPA_H, Math.min(card.clientHeight - g.y - 6, h0 + ev.clientY - sy))
				elRef.current.style.width = `${g.w}px`
				elRef.current.style.height = `${g.h}px`
				mapRef.current?.invalidateSize({ animate: false })
				emitGuidesChange()
			}
			const onUp = () => {
				window.removeEventListener('pointermove', onMove)
				window.removeEventListener('pointerup', onUp)
				window.removeEventListener('pointercancel', onUp)
				const { w, h } = geomRef.current
				commitLupaGeom(lupa.id, { w, h })
			}
			window.addEventListener('pointermove', onMove)
			window.addEventListener('pointerup', onUp)
			window.addEventListener('pointercancel', onUp)
		}

		grip.addEventListener('pointerdown', onDown)
		return () => grip.removeEventListener('pointerdown', onDown)
	}, [locked, lupa.id, commitLupaGeom, emitGuidesChange])

	return (
		<div
			ref={elRef}
			className={`rc-lupa${locked ? ' locked' : ''}`}
			style={{ left: lupa.x, top: lupa.y, width: lupa.w, height: lupa.h }}
		>
			<div className='rc-lupa-head'>
				<span className='rc-lupa-name'>{lupa.name}</span>
				{locked && (
					<span className='rc-lupa-lock' title='Lupa bloqueada'>
						<svg width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.2'>
							<rect x='4' y='10' width='16' height='11' rx='2' />
							<path d='M8 10V7a4 4 0 0 1 8 0v3' />
						</svg>
					</span>
				)}
				<span className='rc-lupa-zoom' ref={zoomLabelRef} />
				<button
					type='button'
					className='rc-lupa-btn'
					title='Alejar'
					disabled={locked}
					onClick={() => mapRef.current?.zoomOut()}
				>
					−
				</button>
				<button
					type='button'
					className='rc-lupa-btn'
					title='Acercar'
					disabled={locked}
					onClick={() => mapRef.current?.zoomIn()}
				>
					+
				</button>
				<button type='button' className='rc-lupa-btn' title='Cerrar' onClick={() => removeLupa(lupa.id)}>
					×
				</button>
			</div>
			<div className='rc-lupa-body'>
				<div className='rc-lupa-map' ref={bodyRef} />
			</div>
			{!locked && <div className='rc-lupa-grip' />}
		</div>
	)
}

export default LupaWindow
