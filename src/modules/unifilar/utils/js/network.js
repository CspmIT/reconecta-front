// La red: nodos con identidad y elementos que los referencian.
//
// Es el modelo de la maqueta del módulo, y la decisión que lo sostiene es que
// los elementos guardan IDS DE NODO y nunca coordenadas. Por eso se puede mover
// un símbolo sin romper la conectividad: al moverlo se mueven sus nodos, y los
// conductores que cuelgan de esos nodos se redibujan solos.
//
// El DWG importado NO participa de esto. Va de calco, atrás, y el usuario
// dibuja la red encima. Se probó deducir la red del dibujo —por cercanía, por
// firma de forma y por la grilla de copy-paste— y andaba en el plano para el
// que se calibraba, pero se caía en el siguiente: cada plano trae su propia
// convención, su densidad y su escala. El que sabe qué representa cada trazo es
// el usuario, y decirlo le lleva un clic.
//
// Todas las funciones devuelven un modelo NUEVO en vez de mutar el que reciben:
// así React ve el cambio y el historial de deshacer es una pila de modelos.

import { CATALOG } from './catalog'

// Los símbolos del catálogo se dibujan en una caja de ±24 unidades. `escala`
// lleva esa caja al tamaño que corresponde en las unidades del plano, que
// varían muchísimo de un DWG a otro.
export const NOMINAL = 24

export const modeloVacio = (escala = 1) => ({ escala, nodos: {}, elementos: [], seq: 0 })

// Trabajar sobre una copia: los cambios se aplican acá y el modelo original
// queda intacto para el deshacer.
const copia = (m) => ({ ...m, nodos: { ...m.nodos }, elementos: [...m.elementos] })

const proximoId = (m, prefijo) => {
	let i = 1
	const usados = new Set(m.elementos.map((e) => e.id))
	while (usados.has(`${prefijo}-${i}`)) i++
	return `${prefijo}-${i}`
}

const nuevoNodo = (m, x, y) => {
	const id = `n${++m.seq}`
	m.nodos[id] = { x: redondear(x), y: redondear(y) }
	return id
}

const redondear = (v) => Number(v.toFixed(4))

// Ajuste a una retícula proporcional al símbolo: fina como para que dos cosas
// distintas no se peguen, gruesa como para que dos que deberían coincidir,
// coincidan.
export const paso = (m) => m.escala * 2
export const ajustar = (m, v) => Math.round(v / paso(m)) * paso(m)

// --- geometría de dibujo ---------------------------------------------------
//
// La posición del cuerpo de un elemento se DERIVA de sus nodos, no se guarda.
// Un aparato intercalado se dibuja en el punto medio de sus dos bornes y girado
// según el eje que forman, así que arrastrar un borne lo reorienta solo.
export const geo = (m, e) => {
	const T = CATALOG[e.tipo] || {}
	const P = (id) => m.nodos[id]
	const esc = m.escala
	if (T.conductor) {
		const a = P(e.t[0])
		const b = P(e.t[1])
		return a && b ? { a, b } : null
	}
	if (T.barra) {
		const n = P(e.t[0])
		return n ? { y: n.y, x1: e.x1, x2: e.x2 } : null
	}
	if (T.term === 1 || T.term === 0) {
		const n = P(e.t[0])
		if (!n) return null
		const r = ((e.dir || 0) * Math.PI) / 180
		const ux = -Math.sin(r)
		const uy = Math.cos(r)
		const off = (T.off || 0) * esc
		return { n, cx: n.x + ux * off, cy: n.y + uy * off, rot: e.dir || 0 }
	}
	const a = P(e.t[0])
	const b = P(e.t[1])
	if (!a || !b) return null
	const dx = b.x - a.x
	const dy = b.y - a.y
	const len = Math.hypot(dx, dy) || 1
	return {
		a, b,
		cx: (a.x + b.x) / 2,
		cy: (a.y + b.y) / 2,
		rot: (Math.atan2(-dx, dy) * 180) / Math.PI,
		ux: dx / len,
		uy: dy / len,
		h: (T.h || 0) * esc,
	}
}

// Punto donde se apoya el rótulo, según de qué lado lo quiera el usuario.
export const anclaRotulo = (m, e) => {
	const T = CATALOG[e.tipo] || {}
	const g = geo(m, e)
	if (!g) return null
	const esc = m.escala
	const lado = e.lbl || 'der'
	if (T.barra) return { x: e.x2 - esc, y: g.y - esc * 1.1, anc: 'end' }
	const cx = T.conductor ? (g.a.x + g.b.x) / 2 : g.cx
	const cy = T.conductor ? (g.a.y + g.b.y) / 2 : g.cy
	const ancho = esc * (T.term === 1 ? 0.9 : Math.max(1, (T.h || 12) / 14))
	if (lado === 'der') return { x: cx + ancho, y: cy, anc: 'start' }
	if (lado === 'izq') return { x: cx - ancho, y: cy, anc: 'end' }
	if (lado === 'arriba') return { x: cx, y: cy - ancho, anc: 'middle' }
	return { x: cx, y: cy + ancho * 1.4, anc: 'middle' }
}

// --- edición ---------------------------------------------------------------

export const colocar = (modelo, tipo, x, y) => {
	const m = copia(modelo)
	const T = CATALOG[tipo] || {}
	const px = ajustar(m, x)
	const py = ajustar(m, y)
	const esc = m.escala
	const id = proximoId(m, T.pref || 'EQ')
	const base = { id, tipo, nombre: id, sub: '', nivel: 13.2, lbl: 'der' }
	let elemento
	if (T.barra) {
		elemento = { ...base, nombre: 'Barra', lbl: 'barra', x1: px - esc * 8, x2: px + esc * 8, t: [nuevoNodo(m, px, py)] }
	} else if (T.term === 1 || T.term === 0) {
		elemento = { ...base, dir: 0, lbl: 'abajo', t: [nuevoNodo(m, px, py)] }
	} else {
		// Los dos bornes salen separados por el alto del cuerpo más un poco de
		// cable, para que el símbolo entre entre ellos sin quedar apretado.
		const brazo = ((T.h || 10) + 8) * esc
		elemento = { ...base, estado: T.maniobra ? 'cerrado' : undefined, t: [nuevoNodo(m, px, py - brazo), nuevoNodo(m, px, py + brazo)] }
	}
	m.elementos.push(elemento)
	return { modelo: m, id }
}

export const conectar = (modelo, nodoA, nodoB) => {
	if (nodoA === nodoB) return modelo
	const yaEsta = modelo.elementos.some(
		(e) => e.tipo === 'cond' && e.t.includes(nodoA) && e.t.includes(nodoB)
	)
	if (yaEsta) return modelo
	const m = copia(modelo)
	const a = m.nodos[nodoA]
	const b = m.nodos[nodoB]
	// Si los nodos no están alineados, el tramo va en escuadra: un unifilar no
	// se dibuja con diagonales salvo que sean parte de un símbolo.
	const codo = a.x === b.x || a.y === b.y ? 'recto' : 'HV'
	m.elementos.push({ id: `c${++m.seq}`, tipo: 'cond', nivel: 13.2, codo, t: [nodoA, nodoB] })
	return m
}

export const borrar = (modelo, id) => {
	const m = copia(modelo)
	m.elementos = m.elementos.filter((e) => e.id !== id)
	return limpiarNodos(m)
}

// Los nodos que dejaron de tener dueño no se muestran ni conectan nada: se van.
export const limpiarNodos = (modelo) => {
	const m = copia(modelo)
	const usados = new Set(m.elementos.flatMap((e) => e.t || []))
	for (const id of Object.keys(m.nodos)) if (!usados.has(id)) delete m.nodos[id]
	return m
}

export const mover = (modelo, id, dx, dy) => {
	const m = copia(modelo)
	const el = m.elementos.find((e) => e.id === id)
	if (!el) return modelo
	for (const n of el.t || []) {
		m.nodos[n] = { x: redondear(m.nodos[n].x + dx), y: redondear(m.nodos[n].y + dy) }
	}
	if (CATALOG[el.tipo]?.barra) {
		m.elementos = m.elementos.map((e) =>
			e.id === id ? { ...e, x1: redondear(e.x1 + dx), x2: redondear(e.x2 + dx) } : e
		)
	}
	return m
}

export const moverNodo = (modelo, nodoId, x, y) => {
	const m = copia(modelo)
	m.nodos[nodoId] = { x: redondear(ajustar(m, x)), y: redondear(ajustar(m, y)) }
	return m
}

export const girar = (modelo, id) => {
	const m = copia(modelo)
	const el = m.elementos.find((e) => e.id === id)
	if (!el) return modelo
	const T = CATALOG[el.tipo] || {}
	if (T.term === 1 || T.term === 0) {
		m.elementos = m.elementos.map((e) => (e.id === id ? { ...e, dir: ((e.dir || 0) + 90) % 360 } : e))
		return m
	}
	// Un aparato intercalado gira rotando sus bornes 90° alrededor del centro:
	// el cuerpo sigue al eje, así que no hay ángulo que guardar.
	const [a, b] = el.t.map((n) => m.nodos[n])
	const cx = (a.x + b.x) / 2
	const cy = (a.y + b.y) / 2
	el.t.forEach((n) => {
		const p = m.nodos[n]
		m.nodos[n] = { x: redondear(ajustar(m, cx - (p.y - cy))), y: redondear(ajustar(m, cy + (p.x - cx))) }
	})
	return m
}

export const duplicar = (modelo, id) => {
	const m = copia(modelo)
	const el = m.elementos.find((e) => e.id === id)
	if (!el) return { modelo, id: null }
	const T = CATALOG[el.tipo] || {}
	const salto = m.escala * 6
	const copiaEl = { ...el, id: proximoId(m, T.pref || 'EQ') }
	if (copiaEl.nombre === el.id || !copiaEl.nombre) copiaEl.nombre = copiaEl.id
	copiaEl.t = el.t.map((n) => nuevoNodo(m, m.nodos[n].x + salto, m.nodos[n].y + salto))
	if (copiaEl.x1 != null) {
		copiaEl.x1 += salto
		copiaEl.x2 += salto
	}
	// La copia no hereda el vínculo: es otro aparato físico.
	delete copiaEl.equipmentId
	delete copiaEl.equipmentName
	m.elementos.push(copiaEl)
	return { modelo: m, id: copiaEl.id }
}

// Soltar un nodo encima de otro los une: es la forma de conectar arrastrando.
export const fusionar = (modelo, nodoId) => {
	const p = modelo.nodos[nodoId]
	if (!p) return modelo
	const tol = paso(modelo) * 1.2
	const destino = Object.entries(modelo.nodos).find(
		([id, q]) => id !== nodoId && Math.hypot(p.x - q.x, p.y - q.y) <= tol
	)
	if (!destino) return modelo
	const m = copia(modelo)
	m.elementos = m.elementos
		.map((e) => ({ ...e, t: (e.t || []).map((n) => (n === nodoId ? destino[0] : n)) }))
		// Un conductor con los dos extremos en el mismo nodo dejó de ser cable.
		.filter((e) => !(e.tipo === 'cond' && e.t[0] === e.t[1]))
	delete m.nodos[nodoId]
	return m
}

export const editar = (modelo, id, cambios) => {
	const m = copia(modelo)
	m.elementos = m.elementos.map((e) => (e.id === id ? { ...e, ...cambios } : e))
	return m
}

// Nodo más cercano a un punto, dentro del alcance del clic.
export const nodoCerca = (modelo, x, y, alcance) => {
	let mejor = null
	for (const [id, p] of Object.entries(modelo.nodos)) {
		const d = Math.hypot(p.x - x, p.y - y)
		if (d <= alcance && (!mejor || d < mejor.d)) mejor = { id, d }
	}
	return mejor?.id || null
}

// Escala inicial del símbolo, medida contra la DENSIDAD del dibujo.
//
// Ni el lado mayor del plano ni el menor sirven. Medido sobre tres planos
// reales, el tamaño de un símbolo dibujado no tiene relación con lo grande que
// sea la hoja: uno de 180×192 unidades tiene símbolos de 2 a 5, y otro de
// 15.594×1.967 los tiene de 100. Lo que sí escala con ellos es la MEDIANA del
// largo de los trazos, porque es la medida del detalle con el que está
// dibujado el plano:
//
//   E.T. Morteros      mediana 0,91  → símbolo 3,6   (los suyos miden 2 a 5)
//   Estructura de Red  mediana 26,9  → símbolo 107   (derivaciones cada ~150)
//   vr-38              mediana 1,75  → símbolo 7,0
//
// Se usa la mediana y no el promedio porque los planos traen unos pocos trazos
// larguísimos —la barra, el marco de la hoja— que arrastrarían el promedio.
const FACTOR = 4

export const escalaSugerida = (entities = []) => {
	const largos = []
	for (const e of entities) {
		if (e.type === 'text') continue
		const c = cajaEntidad(e)
		if (!c) continue
		const t = Math.max(c[2] - c[0], c[3] - c[1])
		if (t > 0) largos.push(t)
	}
	if (!largos.length) return 1
	largos.sort((a, b) => a - b)
	const mediana = largos[Math.floor(largos.length / 2)]
	return (mediana * FACTOR) / (NOMINAL * 2)
}

const cajaEntidad = (e) => {
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
		default:
			return null
	}
}

// Cambiar el tamaño del símbolo NO mueve nada: los nodos quedan donde están y
// sólo se redibuja el cuerpo, que se deriva de ellos.
export const conEscala = (modelo, escala) => ({ ...modelo, escala: Number(escala.toFixed(6)) })
