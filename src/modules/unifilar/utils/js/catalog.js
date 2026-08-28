// Catálogo de tipos del unifilar: qué es cada cosa y cómo se dibuja.
//
// Espejo de back-reconecta/services/unifilar/catalog.js — los campos de
// comportamiento (term, maniobra, pasa, fuente) tienen que coincidir con los
// del backend, porque el modelo topológico lo arma él y el visor lo recorre
// acá. El dibujo vive sólo de este lado.
//
// Los símbolos siguen la IEC 60617 y están tomados del mockup del módulo. Se
// dibujan con EJE VERTICAL y origen en el centro, en una caja de ±24 unidades;
// el visor los escala y los gira según los bornes que trae cada elemento.

export const NOMINAL = 24

// `cuerpo(el)` devuelve markup SVG. Es string y no JSX a propósito: son 16
// símbolos de una o dos líneas cada uno y en JSX ocuparían cinco veces más.
export const CATALOG = {
	interruptor: {
		nom: 'Interruptor de potencia', gr: 'Maniobra y protección', term: 2, maniobra: true, h: 9,
		cuerpo: (e) => `<rect class="${e?.estado === 'cerrado' ? 'llena' : ''}" x="-9" y="-9" width="18" height="18"/>`,
	},
	recloser: {
		nom: 'Reconectador', gr: 'Maniobra y protección', term: 2, maniobra: true, h: 11,
		cuerpo: (e) => `<rect class="${e?.estado === 'cerrado' ? 'llena' : ''}" x="-11" y="-11" width="22" height="22"/>
			<path d="M16 -7A10 10 0 0 1 16 7"/><path class="llena" d="M16 8l-3.4-5h6.8z"/>`,
	},
	seccionador: {
		nom: 'Seccionador', gr: 'Maniobra y protección', term: 2, maniobra: true, h: 15,
		cuerpo: (e) => `<circle class="llena" cx="0" cy="-15" r="2.6"/><path d="M-6.5 15H6.5"/>` +
			(e?.estado === 'cerrado' ? `<path d="M0 -15V15"/>` : `<path d="M0 -15L17.2 9.6"/>`),
	},
	seccionadorCarga: {
		nom: 'Seccionador bajo carga', gr: 'Maniobra y protección', term: 2, maniobra: true, h: 15,
		cuerpo: (e) => `<circle class="llena" cx="0" cy="-15" r="2.6"/><path d="M-6.5 15H6.5"/>
			<path d="M-6 8.5a6 6 0 0 1 12 0"/>` +
			(e?.estado === 'cerrado' ? `<path d="M0 -15V15"/>` : `<path d="M0 -15L17.2 9.6"/>`),
	},
	fusible: {
		nom: 'Fusible', gr: 'Maniobra y protección', term: 2, maniobra: true, h: 13,
		cuerpo: (e) => `<rect x="-7" y="-13" width="14" height="26"/>` +
			(e?.estado === 'cerrado' ? `<path d="M0 -13V13"/>` : `<path d="M-5 -5L5 5M5 -5L-5 5"/>`),
	},
	trafo: {
		nom: 'Transformador de potencia', gr: 'Transformación', term: 2, pasa: true, h: 24,
		cuerpo: () => `<circle cx="0" cy="-11" r="13"/><circle cx="0" cy="11" r="13"/>
			<path d="M0 -16l4.6 8h-9.2z"/><path d="M0 11V16M0 11L-4.6 4M0 11L4.6 4"/>`,
	},
	trafoDist: {
		nom: 'Subestación de distribución', gr: 'Transformación', term: 1, off: 22,
		cuerpo: () => `<path d="M0 -22V-15"/><circle cx="0" cy="-6.5" r="8.5"/><circle cx="0" cy="6.5" r="8.5"/>`,
	},
	fuente: {
		nom: 'Alimentación de red', gr: 'Fuentes y cargas', term: 1, fuente: true, off: 17,
		cuerpo: () => `<circle cx="0" cy="0" r="17"/><path d="M0 -9V7M-5.5 1.5L0 8l5.5-6.5"/>`,
	},
	generador: {
		nom: 'Generación distribuida', gr: 'Fuentes y cargas', term: 1, fuente: true, off: 17,
		cuerpo: () => `<circle cx="0" cy="0" r="17"/>
			<path d="M6 -4.5a6.5 6.5 0 1 0 0 9h-4"/><path d="M6 4.5V0.5H2.5"/>`,
	},
	capacitor: {
		nom: 'Banco de capacitores', gr: 'Compensación', term: 1, off: 22,
		cuerpo: () => `<path d="M0 -22V-8.5"/><path style="stroke-width:3.4" d="M-11 -8.5H11M-11 0.5H11"/>
			<path d="M0 0.5V9M-8 9H8M-5 13.5H5M-2 18H2"/>`,
	},
	barra: { nom: 'Barra colectora', gr: 'Barras y conductores', term: 0, barra: true, pasa: true },
	cond: { nom: 'Conductor', gr: 'Barras y conductores', term: 2, conductor: true, pasa: true },

	// Tipos que están en los planos de la cooperativa y no en la IEC del mockup.
	pararrayos: {
		nom: 'Descargador / pararrayos', gr: 'Protección', term: 1, off: 20,
		cuerpo: () => `<path d="M0 -20V-11"/><rect x="-7" y="-11" width="14" height="18"/>
			<path d="M0 -7l5 9h-10z"/><path d="M0 7V14M-7 14H7"/>`,
	},
	ti: {
		nom: 'Transformador de corriente', gr: 'Medición', term: 2, pasa: true, h: 10,
		cuerpo: () => `<path d="M0 -10V10"/><circle cx="7" cy="0" r="7"/>`,
	},
	tv: {
		nom: 'Transformador de tensión', gr: 'Medición', term: 1, off: 20,
		cuerpo: () => `<path d="M0 -20V-13"/><circle cx="0" cy="-6" r="7"/><circle cx="0" cy="6" r="7"/>`,
	},
	relay: {
		nom: 'Relé de protección', gr: 'Protección', term: 0, off: 0,
		cuerpo: () => `<rect x="-14" y="-8" width="28" height="16"/><path d="M14 -4l6 4l-6 4z"/>`,
	},
	puestaTierra: {
		nom: 'Puesta a tierra', gr: 'Protección', term: 1, off: 16,
		cuerpo: () => `<path d="M0 -16V2"/><path d="M-10 2H10M-6 7H6M-2.5 12H2.5"/>`,
	},
}

export const KINDS = Object.fromEntries(Object.entries(CATALOG)
	.filter(([, t]) => !t.conductor && !t.barra)
	.map(([k, t]) => [k, t.nom]))

// Grupos de la paleta, en el orden en que conviene ofrecerlos
export const GRUPOS = Object.entries(CATALOG).reduce((acc, [key, t]) => {
	if (t.conductor) return acc
	;(acc[t.gr] = acc[t.gr] || []).push(key)
	return acc
}, {})

export const esManiobra = (tipo) => !!CATALOG[tipo]?.maniobra
export const conduce = (el) =>
	CATALOG[el.tipo]?.maniobra ? el.estado === 'cerrado' : !!CATALOG[el.tipo]?.pasa

// Markup del símbolo de un elemento, ya escalado al tamaño pedido.
export const simboloDe = (el, tamanio) => {
	const def = CATALOG[el?.tipo]
	if (!def?.cuerpo) return null
	return { markup: def.cuerpo(el), escala: tamanio / NOMINAL }
}
