import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { MainContext } from '../../../../context/MainContext'
import { CATALOG } from '../../utils/js/catalog'
import { arcPath, polylinePath } from '../../utils/js/geometry'
import { anclaRotulo, geo, nodoCerca, paso } from '../../utils/js/network'

// El lienzo del unifilar: el DWG de calco atrás y la red del usuario adelante.
//
// El viewport se maneja a mano (translate + scale sobre un <g>) en vez de con
// una librería de pan/zoom. Es a propósito: acá cada clic tiene que traducirse
// a coordenadas del plano para colocar un símbolo donde el usuario apuntó, y
// eso pide ser dueño de la matriz.

// Una paleta por tema. El lienzo es SVG y sus colores se calculan en JS, así
// que no alcanza con las variantes `dark:` de Tailwind: hay que elegir el juego
// a mano según el tema de la app. Los dos juegos mantienen el mismo significado
// —viva/muerta/abierto/alarma— y sólo cambia el contraste contra el fondo.
const PALETAS = {
	oscuro: {
		fondo: '#11161b',
		viva: '#c3cfda',
		muerta: '#414b55',
		sel: '#3aa6e8',
		abajo: '#4fc3f7',
		abierto: '#f0a73c',
		alarma: '#ff5a5a',
		instrumento: '#75756e',
		calco: '#2b353f',
		nodo: '#b98ce8',
		rotulo: '#8494a2',
	},
	claro: {
		fondo: '#ffffff',
		viva: '#334155',
		muerta: '#a8b2be',
		sel: '#1a7ac4',
		abajo: '#0e8ba8',
		abierto: '#c2760c',
		alarma: '#dc2626',
		instrumento: '#94948c',
		calco: '#cbd5e0',
		nodo: '#7c3aed',
		rotulo: '#64748b',
	},
}

const trazoCalco = (e) => {
	switch (e.type) {
		case 'line':
			return <line key={e.id} x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} />
		case 'circle':
			return <circle key={e.id} cx={e.cx} cy={e.cy} r={e.r} fill={e.filled ? 'currentColor' : 'none'} />
		case 'arc':
			return <path key={e.id} d={arcPath(e)} />
		case 'polyline':
			return <path key={e.id} d={polylinePath(e)} fill={e.filled ? 'currentColor' : 'none'} />
		case 'text':
			return (
				<text key={e.id} x={e.x} y={e.y} fontSize={e.size} textAnchor={e.anchor} fill="currentColor" stroke="none">
					{e.lines.join(' ')}
				</text>
			)
		default:
			return null
	}
}

const NetworkCanvas = ({
	documento,
	modelo,
	estado,
	live = {},
	modo = 'operar',
	herramienta = null,
	seleccion = null,
	verCalco = true,
	abajo = new Set(),
	onSelect,
	onColocar,
	onConectar,
	onMoverElemento,
	onMoverNodo,
	onFusionar,
}) => {
	const { darkMode } = useContext(MainContext)
	const COLOR = darkMode ? PALETAS.oscuro : PALETAS.claro

	const svgRef = useRef(null)
	const [vista, setVista] = useState({ x: 0, y: 0, s: 1 })
	const [conectandoDesde, setConectandoDesde] = useState(null)
	const [agarrando, setAgarrando] = useState(false)
	const arrastre = useRef(null)

	const bbox = useMemo(() => {
		const puntos = Object.values(modelo.nodos)
		const ents = documento?.entities || []
		let b = [Infinity, Infinity, -Infinity, -Infinity]
		for (const e of ents) {
			const x = e.x1 ?? e.cx ?? e.x ?? e.points?.[0]?.[0]
			if (x == null) continue
			const caja = cajaDe(e)
			if (!caja) continue
			b = [Math.min(b[0], caja[0]), Math.min(b[1], caja[1]), Math.max(b[2], caja[2]), Math.max(b[3], caja[3])]
		}
		for (const p of puntos) {
			b = [Math.min(b[0], p.x), Math.min(b[1], p.y), Math.max(b[2], p.x), Math.max(b[3], p.y)]
		}
		if (!Number.isFinite(b[0])) b = [0, 0, 100, 100]
		const pad = Math.max(b[2] - b[0], b[3] - b[1]) * 0.04
		return [b[0] - pad, b[1] - pad, b[2] - b[0] + pad * 2, b[3] - b[1] + pad * 2]
	}, [documento, modelo.nodos])

	const lado = Math.max(bbox[2], bbox[3])
	const trazo = lado / 900
	const escSimbolo = modelo.escala

	// El clic tiene que caer en coordenadas del plano, no de la pantalla.
	const aUsuario = (ev) => {
		const svg = svgRef.current
		const pt = svg.createSVGPoint()
		pt.x = ev.clientX
		pt.y = ev.clientY
		const p = pt.matrixTransform(svg.getScreenCTM().inverse())
		return { x: (p.x - vista.x) / vista.s, y: (p.y - vista.y) / vista.s }
	}

	// Zoom sobre el puntero: lo que está bajo el cursor se queda quieto.
	useEffect(() => {
		const svg = svgRef.current
		if (!svg) return
		const rueda = (ev) => {
			ev.preventDefault()
			const pt = svg.createSVGPoint()
			pt.x = ev.clientX
			pt.y = ev.clientY
			const p = pt.matrixTransform(svg.getScreenCTM().inverse())
			setVista((v) => {
				const s = Math.min(60, Math.max(0.2, v.s * (ev.deltaY < 0 ? 1.15 : 1 / 1.15)))
				return { x: p.x - (p.x - v.x) * (s / v.s), y: p.y - (p.y - v.y) * (s / v.s), s }
			})
		}
		svg.addEventListener('wheel', rueda, { passive: false })
		return () => svg.removeEventListener('wheel', rueda)
	}, [])

	const alcanceNodo = paso(modelo) * 1.5

	const alBajar = (ev) => {
		// Sin esto el navegador arranca una selección de texto con el arrastre y
		// deja medio diagrama y el panel resaltados en azul.
		ev.preventDefault()
		const u = aUsuario(ev)

		if (modo === 'editar' && herramienta) {
			if (herramienta === 'cond') {
				const nodo = nodoCerca(modelo, u.x, u.y, alcanceNodo)
				if (!nodo) return
				if (!conectandoDesde) setConectandoDesde(nodo)
				else {
					onConectar(conectandoDesde, nodo)
					setConectandoDesde(null)
				}
				return
			}
			onColocar(herramienta, u.x, u.y)
			return
		}

		if (modo === 'editar') {
			const nodo = nodoCerca(modelo, u.x, u.y, alcanceNodo)
			if (nodo) {
				arrastre.current = { tipo: 'nodo', id: nodo }
				setAgarrando(true)
				ev.currentTarget.setPointerCapture(ev.pointerId)
				return
			}
		}

		const destino = ev.target.closest?.('[data-el]')
		if (destino) {
			const id = destino.getAttribute('data-el')
			onSelect(id)
			if (modo === 'editar') {
				arrastre.current = { tipo: 'elemento', id, x: u.x, y: u.y }
				setAgarrando(true)
				ev.currentTarget.setPointerCapture(ev.pointerId)
			}
			return
		}

		onSelect(null)
		arrastre.current = { tipo: 'pan', x: ev.clientX, y: ev.clientY, vx: vista.x, vy: vista.y }
		setAgarrando(true)
		ev.currentTarget.setPointerCapture(ev.pointerId)
	}

	const alMover = (ev) => {
		const a = arrastre.current
		if (!a) return
		if (a.tipo === 'pan') {
			const m = svgRef.current.getScreenCTM()
			setVista((v) => ({ ...v, x: a.vx + (ev.clientX - a.x) / m.a, y: a.vy + (ev.clientY - a.y) / m.d }))
			return
		}
		const u = aUsuario(ev)
		if (a.tipo === 'nodo') {
			onMoverNodo(a.id, u.x, u.y)
			return
		}
		const dx = u.x - a.x
		const dy = u.y - a.y
		if (Math.hypot(dx, dy) < paso(modelo) / 2) return
		onMoverElemento(a.id, dx, dy)
		a.x = u.x
		a.y = u.y
	}

	const alSoltar = () => {
		const a = arrastre.current
		if (a?.tipo === 'nodo') onFusionar(a.id)
		arrastre.current = null
		setAgarrando(false)
	}

	// Escapar cancela lo que esté a medio hacer
	useEffect(() => {
		if (!herramienta) setConectandoDesde(null)
	}, [herramienta])

	const colorDe = (el) => {
		if (el.id === seleccion) return COLOR.sel
		if (abajo.has(el.id)) return COLOR.abajo
		const datos = live[el.id]
		if (datos?.alarm) return COLOR.alarma
		if (!CATALOG[el.tipo]?.term) return COLOR.instrumento
		if (CATALOG[el.tipo]?.maniobra && el.estado === 'abierto') return COLOR.abierto
		if (!(el.t || []).length) return COLOR.instrumento
		return el.t.some((n) => estado.energizados.has(n)) ? COLOR.viva : COLOR.muerta
	}

	const conductores = modelo.elementos.filter((e) => e.tipo === 'cond')
	const barras = modelo.elementos.filter((e) => CATALOG[e.tipo]?.barra)
	const aparatos = modelo.elementos.filter((e) => e.tipo !== 'cond' && !CATALOG[e.tipo]?.barra)

	return (
		<div className="relative w-full h-full rounded-lg overflow-hidden select-none border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#11161b]">
			<svg
				ref={svgRef}
				viewBox={bbox.join(' ')}
				className="w-full h-full block"
				style={{ cursor: herramienta ? 'crosshair' : agarrando ? 'grabbing' : 'grab', touchAction: 'none' }}
				fill="none"
				strokeLinecap="round"
				strokeLinejoin="round"
				onPointerDown={alBajar}
				onPointerMove={alMover}
				onPointerUp={alSoltar}
				onPointerCancel={alSoltar}
			>
				<style>{'.llena{fill:currentColor;stroke:none}'}</style>
				<g transform={`translate(${vista.x} ${vista.y}) scale(${vista.s})`}>
					{/* Calco: el DWG tal como vino. No se toca ni responde al clic. */}
					{verCalco && documento?.entities && (
						<g color={COLOR.calco} stroke="currentColor" strokeWidth={trazo * 0.8} pointerEvents="none">
							{documento.entities.map(trazoCalco)}
						</g>
					)}

					<g strokeWidth={trazo * 1.3}>
						{conductores.map((c) => {
							const g = geo(modelo, c)
							if (!g) return null
							const d =
								g.a.x === g.b.x || g.a.y === g.b.y || c.codo === 'recto'
									? `M${g.a.x} ${g.a.y}L${g.b.x} ${g.b.y}`
									: c.codo === 'VH'
										? `M${g.a.x} ${g.a.y}L${g.a.x} ${g.b.y}L${g.b.x} ${g.b.y}`
										: `M${g.a.x} ${g.a.y}L${g.b.x} ${g.a.y}L${g.b.x} ${g.b.y}`
							return (
								<g key={c.id} data-el={c.id}>
									<path d={d} stroke={colorDe(c)} />
									<path d={d} stroke="transparent" strokeWidth={trazo * 8} />
								</g>
							)
						})}
					</g>

					<g strokeWidth={trazo * 4}>
						{barras.map((b) => {
							const g = geo(modelo, b)
							if (!g) return null
							return (
								<g key={b.id} data-el={b.id}>
									<line x1={g.x1} y1={g.y} x2={g.x2} y2={g.y} stroke={colorDe(b)} />
									<line x1={g.x1} y1={g.y} x2={g.x2} y2={g.y} stroke="transparent" strokeWidth={trazo * 8} />
								</g>
							)
						})}
					</g>

					{aparatos.map((el) => {
						const g = geo(modelo, el)
						const def = CATALOG[el.tipo]
						if (!g || !def?.cuerpo) return null
						const color = colorDe(el)
						const esc = escSimbolo
						// Los cables cortos que unen el borne con el cuerpo: sin ellos el
						// símbolo flota entre sus nodos.
						const patas =
							def.term === 2
								? `M${g.a.x} ${g.a.y}L${g.cx - g.ux * g.h} ${g.cy - g.uy * g.h}M${g.b.x} ${g.b.y}L${g.cx + g.ux * g.h} ${g.cy + g.uy * g.h}`
								: null
						return (
							<g key={el.id} data-el={el.id} color={color} stroke={color}>
								{patas && <path d={patas} strokeWidth={trazo * 1.3} />}
								<g
									transform={`translate(${g.cx} ${g.cy}) rotate(${g.rot || 0}) scale(${esc})`}
									strokeWidth={(trazo * 1.6) / esc}
									dangerouslySetInnerHTML={{ __html: def.cuerpo(el) }}
								/>
								<circle cx={g.cx} cy={g.cy} r={esc * 16} fill="transparent" stroke="transparent" />
							</g>
						)
					})}

					{/* Rótulos */}
					<g pointerEvents="none">
						{aparatos.map((el) => {
							if (!el.nombre) return null
							const a = anclaRotulo(modelo, el)
							if (!a) return null
							const datos = live[el.id]
							const medida = datos?.values?.[0]
							return (
								<g key={`r${el.id}`}>
									<text
										x={a.x} y={a.y} textAnchor={a.anc}
										fontSize={escSimbolo * 11} fill={el.id === seleccion ? COLOR.sel : COLOR.viva}
										stroke="none" fontFamily="Barlow Semi Condensed, sans-serif"
									>
										{el.nombre}
									</text>
									{medida && (
										<text
											x={a.x} y={a.y + escSimbolo * 11} textAnchor={a.anc}
											fontSize={escSimbolo * 9} fill={COLOR.rotulo} stroke="none"
											fontFamily="IBM Plex Mono, monospace"
										>
											{medida.value} {medida.unit}
										</text>
									)}
								</g>
							)
						})}
					</g>

					{/* Manijas de nodo: sólo en edición, que es cuando sirven para algo */}
					{modo === 'editar' && (
						<g>
							{Object.entries(modelo.nodos).map(([id, p]) => (
								<circle
									key={id} cx={p.x} cy={p.y} r={escSimbolo * 3}
									fill={conectandoDesde === id ? COLOR.nodo : COLOR.fondo}
									stroke={COLOR.nodo} strokeWidth={trazo}
								/>
							))}
						</g>
					)}
				</g>
			</svg>

			<div className="absolute right-2 bottom-2 flex flex-col gap-px rounded-md overflow-hidden border border-gray-300 dark:border-gray-600">
				{[
					['+', () => setVista((v) => zoomCentro(v, bbox, 1.25))],
					['−', () => setVista((v) => zoomCentro(v, bbox, 1 / 1.25))],
					['FIT', () => setVista({ x: 0, y: 0, s: 1 })],
				].map(([texto, fn]) => (
					<button
						key={texto} onClick={fn}
						className="w-9 h-8 bg-white hover:bg-gray-100 text-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200 text-xs font-medium"
					>
						{texto}
					</button>
				))}
			</div>

			{conectandoDesde && (
				<div className="absolute left-1/2 -translate-x-1/2 top-3 px-3 py-1.5 rounded-md bg-purple-100 dark:bg-purple-900/80 border border-purple-400 dark:border-purple-500 text-purple-800 dark:text-purple-100 text-xs font-medium">
					Ahora tocá el nodo de destino
				</div>
			)}
		</div>
	)
}

// bbox de una entidad del calco, sin depender del helper del documento
const cajaDe = (e) => {
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
		case 'text':
			return [e.x, e.y - e.size, e.x + e.size, e.y]
		default:
			return null
	}
}

const zoomCentro = (v, bbox, factor) => {
	const c = { x: bbox[0] + bbox[2] / 2, y: bbox[1] + bbox[3] / 2 }
	const s = Math.min(60, Math.max(0.2, v.s * factor))
	return { x: c.x - (c.x - v.x) * (s / v.s), y: c.y - (c.y - v.y) * (s / v.s), s }
}

export default NetworkCanvas
