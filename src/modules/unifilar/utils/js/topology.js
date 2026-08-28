// Recorridos sobre el modelo topológico que arma el backend (buildModel).
//
// El modelo son nodos con identidad y elementos que los referencian: dos
// elementos están conectados cuando comparten un nodo. Todo lo de acá es
// recorrer ese grafo — energización, aguas abajo, islas — y es lo que hace que
// abrir un aparato en el visor cambie los colores de verdad y no de mentira.

import { CATALOG, conduce } from './catalog'

export const adyacencia = (elementos) => {
	const adj = new Map()
	for (const e of elementos) {
		for (const n of e.t || []) {
			if (!adj.has(n)) adj.set(n, [])
			adj.get(n).push(e)
		}
	}
	return adj
}

// BFS desde un conjunto de nodos, atravesando sólo los elementos que `pasa`
// deja pasar. Devuelve los nodos alcanzados con su distancia.
export const recorrer = (adj, desde, pasa) => {
	const vistos = new Map(desde.map((n) => [n, 0]))
	const cola = [...desde]
	while (cola.length) {
		const n = cola.shift()
		const d = vistos.get(n)
		for (const e of adj.get(n) || []) {
			if (!pasa(e)) continue
			for (const m of e.t) {
				if (vistos.has(m)) continue
				vistos.set(m, d + 1)
				cola.push(m)
			}
		}
	}
	return vistos
}

// Estado eléctrico del modelo: qué nodos tienen tensión y a qué distancia
// topológica de la fuente están.
//
// Las fuentes son los elementos que declaran `fuente` en el catálogo. Si el
// plano todavía no tiene ninguna tipificada, se toma la barra más conectada:
// en una estación es de donde viene todo, y sin ese arranque el visor se vería
// entero apagado y no diría nada.
export const calcular = (modelo) => {
	const adj = adyacencia(modelo.elementos)
	const fuentes = modelo.elementos.filter((e) => CATALOG[e.tipo]?.fuente && !e.fueraServicio)
	const raices = fuentes.length
		? fuentes.flatMap((f) => f.t)
		: (modelo.elementos.filter((e) => e.tipo === 'barra').sort((a, b) => (b.t?.length || 0) - (a.t?.length || 0))[0]?.t || [])
	const energ = recorrer(adj, raices, conduce)
	const dist = recorrer(adj, raices, (e) => !CATALOG[e.tipo]?.fuente)
	return { adj, energizados: new Set(energ.keys()), dist, raices }
}

// Elementos que quedan aguas abajo de un aparato de maniobra: los que dejarían
// de alimentarse si se abriera.
export const aguasAbajo = (modelo, el, estado) => {
	if (!CATALOG[el?.tipo]?.maniobra || (el.t || []).length < 2) return new Set()
	const [a, b] = el.t
	const da = estado.dist.has(a) ? estado.dist.get(a) : Infinity
	const db = estado.dist.has(b) ? estado.dist.get(b) : Infinity
	const alcanzados = new Set(
		recorrer(estado.adj, [da <= db ? b : a], (e) => e.id !== el.id && conduce(e)).keys()
	)
	const out = new Set()
	for (const e of modelo.elementos) {
		if (e.id !== el.id && e.t?.length && e.t.every((n) => alcanzados.has(n))) out.add(e.id)
	}
	return out
}

// Contadores para el panel de estado de la red
export const resumen = (modelo, estado) => {
	const aparatos = modelo.elementos.filter((e) => e.tipo !== 'cond' && e.tipo !== 'barra')
	const cargas = aparatos.filter((e) => CATALOG[e.tipo]?.term === 1 && !CATALOG[e.tipo]?.fuente)
	const conTension = (e) => (e.t || []).some((n) => estado.energizados.has(n))
	return {
		aparatos: aparatos.length,
		conTension: aparatos.filter(conTension).length,
		sinTension: aparatos.filter((e) => !conTension(e)).length,
		cargas: cargas.length,
		cargasSinTension: cargas.filter((e) => !conTension(e)).length,
		abiertos: aparatos.filter((e) => CATALOG[e.tipo]?.maniobra && e.estado === 'abierto').length,
		// Sólo cuentan los que deberían estar conectados: un relé declara term 0
		// y no tener bornes es su estado normal, no una falla de importación.
		sinConectar: aparatos.filter((e) => CATALOG[e.tipo]?.term > 0 && !(e.t || []).length).length,
	}
}
