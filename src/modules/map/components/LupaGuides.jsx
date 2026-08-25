import { useCallback, useEffect, useRef } from 'react'
import { useMapContext } from '../context/MapContext'
import { leaderLines, zoneRect } from '../utils/js/guides'

/*
 * Guias de las lupas: por cada lupa dibuja el recuadro de la zona que esta
 * ampliando sobre el mapa principal, y hasta cuatro lineas punteadas que unen
 * ese recuadro con las esquinas de la ventana.
 *
 * Todo va en un solo SVG en coordenadas del contenedor, redibujado de forma
 * imperativa cuando cambia cualquier geometria (pan/zoom del mapa principal, de
 * una lupa, o arrastre de una ventana). No pasa por el estado de React porque
 * durante un arrastre eso serian decenas de renders por segundo.
 */

const AZUL = '#283080'

function LupaGuides() {
	const { lupas, showGuides, lupaRegistry, onGuidesChange, mainMapRef, cardRef } = useMapContext()
	const svgRef = useRef(null)

	const redraw = useCallback(() => {
		const svg = svgRef.current
		const map = mainMapRef.current
		const card = cardRef.current
		if (!svg || !map || !card) return

		const W = card.clientWidth
		const H = card.clientHeight
		svg.setAttribute('viewBox', `0 0 ${W} ${H}`)
		svg.setAttribute('width', W)
		svg.setAttribute('height', H)

		if (!showGuides) {
			svg.innerHTML = ''
			return
		}

		let out = ''
		lupaRegistry.current.forEach((entry) => {
			const zona = zoneRect(map, entry.lmap.getBounds())
			const g = entry.getGeom()
			const ventana = { x: g.x, y: g.y, w: g.w, h: g.h }

			out += `<rect x="${zona.x}" y="${zona.y}" width="${zona.w}" height="${zona.h}" fill="${AZUL}" fill-opacity="0.05" stroke="${AZUL}" stroke-width="1.2" stroke-dasharray="4 3"/>`

			leaderLines(zona, ventana).forEach((l) => {
				out += `<line x1="${l.x1}" y1="${l.y1}" x2="${l.x2}" y2="${l.y2}" stroke="${AZUL}" stroke-opacity="0.38" stroke-width="1" stroke-dasharray="5 4"/>`
			})
		})
		svg.innerHTML = out
	}, [showGuides, lupaRegistry, mainMapRef, cardRef])

	// Cambios de geometria emitidos por las lupas (zoom, pan, arrastre, resize)
	useEffect(() => onGuidesChange(redraw), [onGuidesChange, redraw])

	// Cambios del mapa principal y altas/bajas de lupas
	useEffect(() => {
		const map = mainMapRef.current
		redraw()
		if (!map) return
		map.on('move zoom moveend zoomend resize', redraw)
		return () => map.off('move zoom moveend zoomend resize', redraw)
	}, [redraw, lupas, mainMapRef])

	return <svg className='rc-guides' ref={svgRef} />
}

export default LupaGuides
