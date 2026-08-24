import L from 'leaflet'

/*
 * Marcadores del mapa operativo.
 *
 * CONVENCION DE COLORES (confirmada por los operadores): cerrado = rojo,
 * abierto = verde, sin comunicacion = gris, sin reconectador = azul.
 * El mockup del rediseno los tiene invertidos: esta MAL, no seguirlo.
 *
 * La alarma es una dimension aparte del estado: se muestra como anillo amarillo
 * pulsante alrededor del punto, sin tapar el color de estado.
 */

// ElementTypes: 1 Reconexion, 2 SET urbana, 3 SET rural, 4 ET, 5 Consumos puntuales
export const SHAPE_BY_TYPE = { 1: 'ci', 2: 'di', 3: 'di', 4: 'sq', 5: 'tr' }

export const STATE_LABEL = {
	cerrado: 'Cerrado',
	abierto: 'Abierto',
	sincom: 'Sin comunicación',
}

export const shapeOf = (type) => SHAPE_BY_TYPE[type] || 'ci'

// `st` en null = el elemento no tiene reconectador, no es un estado desconocido
export const stateClass = (st) => (st ? `s-${st}` : 's-nodev')

/**
 * Clases del punto. Se aplican sobre un marcador ya creado para no recrear el
 * divIcon en cada poll (eso era lo que hacia parpadear los markers).
 */
export const pinClasses = (device, { mini = false, selected = false, hovered = false } = {}) =>
	[
		'rc-pin',
		`sh-${shapeOf(device.type)}`,
		mini ? 'mini' : '',
		selected ? 'sel' : '',
		hovered ? 'hi' : '',
		device.alarm ? 'alarm' : '',
	]
		.filter(Boolean)
		.join(' ')

// Los nombres los escribe el operador desde el ABM y aca se inyectan como HTML
const escapeHtml = (str) =>
	String(str ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])

export const pinIcon = (device, opts = {}) =>
	L.divIcon({
		className: '',
		iconSize: [0, 0],
		html: `<div class="${pinClasses(device, opts)}" data-id="${device.id}">
			<div class="rc-dot ${stateClass(device.st)}"></div>
			<div class="rc-tag">${escapeHtml(device.name)}</div>
		</div>`,
	})

/**
 * Parchea un marcador existente en el DOM. Devuelve false si el elemento
 * todavia no esta montado (Leaflet no lo dibujo aun).
 */
export const patchPin = (marker, device, opts = {}) => {
	const el = marker.getElement && marker.getElement()
	if (!el) return false
	const pin = el.querySelector('.rc-pin')
	if (!pin) return false
	pin.className = pinClasses(device, opts)
	const dot = pin.querySelector('.rc-dot')
	if (dot) dot.className = `rc-dot ${stateClass(device.st)}`
	const tag = pin.querySelector('.rc-tag')
	if (tag && tag.textContent !== (device.name ?? '')) tag.textContent = device.name ?? ''
	return true
}
