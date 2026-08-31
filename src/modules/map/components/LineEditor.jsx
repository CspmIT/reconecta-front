import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import { useMapContext } from '../context/MapContext'
import { draftToVertices, snapToDevice, suggestName } from '../utils/js/snap'
import { VERTEX_ANCHORED, VERTEX_FREE, lineColor } from '../utils/js/networkOverlay'

/*
 * Editor de tramos. Solo maneja interaccion y borrador; el dibujo de los tramos
 * ya guardados lo hace networkOverlay en modo edicion.
 *
 * El borrador vive en una capa aparte y se redibuja de forma imperativa: seguir
 * el cursor con el estado de React serian decenas de renders por segundo.
 */

const DRAFT_STYLE = { color: '#283080', weight: 3, opacity: 0.9 }

/*
 * Paleta del selector de color de tramos. Son colores que se distinguen entre
 * si y de la base: sirven para separar alimentadores de un vistazo, que es para
 * lo que se pide pintarlos. El selector nativo queda al final para cualquier
 * otro.
 */
const PALETTE = ['#cf0927', '#e07b00', '#c9a800', '#2e7d32', '#0288d1', '#283080', '#7b1fa2', '#37474f']

// El input nativo emite un evento por cada movimiento dentro de su paleta:
// sin esto seria un PUT por frame de arrastre.
const COLOR_DEBOUNCE_MS = 350

function LineEditor() {
	const {
		lineMode,
		toggleLineMode,
		draft,
		draftRef,
		onMapRef,
		addPointFromMap,
		undoDraftVertex,
		clearDraft,
		selectedLine,
		setSelectedLine,
		lines,
		linesRef,
		mainMapRef,
		createLine,
		renameLine,
		setLineColor,
		deleteLine,
		savingLine,
	} = useMapContext()

	const draftLayerRef = useRef(null)
	const [renaming, setRenaming] = useState(null)
	const [picking, setPicking] = useState(false)
	const colorTimer = useRef(null)
	// draftRef y onMapRef vienen del contexto: los handlers de Leaflet se
	// registran una vez y necesitan leer los valores frescos, no los del render
	// en que se registraron.

	/* ---------------- capa del borrador ---------------- */
	useEffect(() => {
		const map = mainMapRef.current
		if (!map || !lineMode) return
		const layer = L.layerGroup().addTo(map)
		draftLayerRef.current = layer
		return () => {
			map.removeLayer(layer)
			draftLayerRef.current = null
		}
	}, [lineMode, mainMapRef])

	/** Redibuja el borrador, con el segmento punteado hasta el cursor. */
	const drawDraft = (cursor) => {
		const layer = draftLayerRef.current
		const map = mainMapRef.current
		if (!layer || !map) return
		layer.clearLayers()
		const actual = draftRef.current
		if (!actual.length) return

		const enganche = cursor ? snapToDevice(map, cursor, onMapRef.current) : null
		const puntos = actual.map((v) => [v.lat, v.lon])
		if (enganche) puntos.push([enganche.lat, enganche.lon])

		L.polyline(puntos, { ...DRAFT_STYLE, dashArray: enganche ? '6 5' : null }).addTo(layer)
		actual.forEach((v) => {
			L.circleMarker([v.lat, v.lon], v.id_element ? VERTEX_ANCHORED : VERTEX_FREE).addTo(layer)
		})
		// Halo sobre el equipo al que se engancharia si se hace clic ahora
		if (enganche?.id_element) {
			L.circleMarker([enganche.lat, enganche.lon], {
				radius: 11,
				color: '#283080',
				weight: 2,
				fill: false,
				dashArray: '3 3',
			}).addTo(layer)
		}
	}

	useEffect(() => {
		drawDraft()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [draft, lineMode])

	/* ---------------- clic y movimiento sobre el mapa ---------------- */
	useEffect(() => {
		const map = mainMapRef.current
		if (!map || !lineMode) return

		const onClick = (e) => {
			// Con un tramo elegido, el primer clic al aire solo deselecciona
			if (selectedLine !== null) {
				setSelectedLine(null)
				return
			}
			addPointFromMap(e.latlng)
		}
		const onMove = (e) => {
			if (draftRef.current.length) drawDraft(e.latlng)
		}
		const onDblClick = () => {
			if (draftRef.current.length >= 2) terminar()
		}

		map.on('click', onClick)
		map.on('mousemove', onMove)
		map.on('dblclick', onDblClick)
		map.doubleClickZoom.disable()
		return () => {
			map.off('click', onClick)
			map.off('mousemove', onMove)
			map.off('dblclick', onDblClick)
			map.doubleClickZoom.enable()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [lineMode, selectedLine, addPointFromMap, mainMapRef])

	const terminar = () => {
		const actual = draftRef.current
		if (actual.length < 2) return
		// linesRef y no lines: el handler de dblclick captura el render en que se registro
		createLine(suggestName(actual, linesRef.current.length + 1), draftToVertices(actual))
	}

	/* ---------------- atajos de teclado ---------------- */
	useEffect(() => {
		if (!lineMode) return
		const onKey = (e) => {
			// No secuestrar el teclado mientras se renombra
			if (e.target.tagName === 'INPUT') return
			if (e.key === 'Enter') terminar()
			else if (e.key === 'Backspace' && draftRef.current.length) {
				e.preventDefault()
				undoDraftVertex()
			} else if ((e.key === 'Delete' || e.key === 'Backspace') && selectedLine !== null) {
				deleteLine(selectedLine)
			} else if (e.key === 'Escape') {
				if (draftRef.current.length) clearDraft()
				// Esc cierra primero el selector de color, y recien despues suelta
				// el tramo: si no, salir de la paleta perderia la seleccion
				else if (picking) setPicking(false)
				else if (selectedLine !== null) setSelectedLine(null)
				else toggleLineMode(false)
			}
		}
		document.addEventListener('keydown', onKey)
		return () => document.removeEventListener('keydown', onKey)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [lineMode, selectedLine, picking, draft, undoDraftVertex, clearDraft, deleteLine, toggleLineMode])

	// Cambiar de tramo (o soltarlo) cierra los sub-modos: si no, el panel de
	// color quedaria abierto apuntando al tramo anterior
	useEffect(() => {
		setRenaming(null)
		setPicking(false)
	}, [selectedLine])

	useEffect(() => () => clearTimeout(colorTimer.current), [])

	if (!lineMode) return null

	const elegido = lines.find((l) => l.id === selectedLine)
	const colorActual = lineColor(elegido)
	const pintar = (color, demorar) => {
		clearTimeout(colorTimer.current)
		if (demorar) colorTimer.current = setTimeout(() => setLineColor(elegido.id, color), COLOR_DEBOUNCE_MS)
		else setLineColor(elegido.id, color)
	}

	const anclados = draft.filter((v) => v.id_element).length
	const ultimo = draft[draft.length - 1]?.name

	return (
		<div className='rc-hint show'>
			{draft.length > 0 ? (
				<>
					Trazando · <b>{draft.length}</b> vértice{draft.length > 1 ? 's' : ''}
					{anclados > 0 && (
						<>
							{' '}
							· <b>{anclados}</b> anclado{anclados > 1 ? 's' : ''}
						</>
					)}
					{ultimo && (
						<>
							{' '}
							· último en <b>{ultimo}</b>
						</>
					)}
					<span className='sep'>·</span>
					<button type='button' className='rc-hbtn' onClick={undoDraftVertex}>
						Deshacer
					</button>
					<button type='button' className='rc-hbtn' onClick={terminar} disabled={draft.length < 2 || savingLine}>
						Terminar
					</button>
					<button type='button' className='rc-hbtn' onClick={clearDraft}>
						Cancelar
					</button>
				</>
			) : elegido ? (
				<>
					{picking ? (
						<>
							<b>{elegido.name}</b> · color
							<span className='sep'>·</span>
							<span className='rc-swatches'>
								{PALETTE.map((c) => (
									<button
										key={c}
										type='button'
										title={c}
										className={`rc-swatch${colorActual === c ? ' on' : ''}`}
										style={{ background: c }}
										onClick={() => pintar(c, false)}
									/>
								))}
								{/* Cualquier otro color: el selector del sistema */}
								<label className='rc-swatch custom' title='Otro color' style={{ background: colorActual }}>
									<input type='color' value={colorActual} onChange={(e) => pintar(e.target.value, true)} />
								</label>
							</span>
							<button
								type='button'
								className='rc-hbtn'
								disabled={!elegido.color}
								onClick={() => pintar(null, false)}
							>
								Por defecto
							</button>
							<button type='button' className='rc-hbtn' onClick={() => setPicking(false)}>
								Listo
							</button>
						</>
					) : renaming === null ? (
						<>
							<b>{elegido.name}</b> · {elegido.vertices.length} vértices
							{elegido.anchors.filter(Boolean).length > 0 && (
								<> · {elegido.anchors.filter(Boolean).length} anclados</>
							)}
							<span className='sep'>·</span>
							<button type='button' className='rc-hbtn' onClick={() => setRenaming(elegido.name)}>
								Renombrar
							</button>
							<button type='button' className='rc-hbtn' onClick={() => setPicking(true)}>
								<span className='rc-swatch mini' style={{ background: colorActual }} />
								Color
							</button>
							<button
								type='button'
								className='rc-hbtn danger'
								onClick={() => deleteLine(elegido.id)}
								disabled={savingLine}
							>
								Eliminar
							</button>
							<button type='button' className='rc-hbtn' onClick={() => setSelectedLine(null)}>
								Deseleccionar
							</button>
						</>
					) : (
						<>
							{/* datalist con los nombres existentes: evita "Alim. Norte" vs "Alim Norte" */}
							<input
								className='rc-hinput'
								autoFocus
								list='rc-line-names'
								value={renaming}
								onChange={(e) => setRenaming(e.target.value)}
								onKeyDown={(e) => {
									if (e.key === 'Enter' && renaming.trim()) {
										renameLine(elegido.id, renaming.trim())
										setRenaming(null)
									} else if (e.key === 'Escape') setRenaming(null)
								}}
							/>
							<datalist id='rc-line-names'>
								{[...new Set(lines.map((l) => l.name))].map((n) => (
									<option key={n} value={n} />
								))}
							</datalist>
							<button
								type='button'
								className='rc-hbtn'
								disabled={!renaming.trim() || savingLine}
								onClick={() => {
									renameLine(elegido.id, renaming.trim())
									setRenaming(null)
								}}
							>
								Guardar
							</button>
							<button type='button' className='rc-hbtn' onClick={() => setRenaming(null)}>
								Cancelar
							</button>
						</>
					)}
				</>
			) : (
				<>
					Clic para trazar · los vértices se anclan solos al pasar sobre un equipo
					<span className='sep'>·</span>
					<b>Enter</b> termina
					<span className='sep'>·</span>
					<b>Esc</b> sale
				</>
			)}
		</div>
	)
}

export default LineEditor
