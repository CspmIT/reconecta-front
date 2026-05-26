// Servicio API del módulo Bitácora.
//
// Cuando USE_MOCK = true se devuelven los datos ficticios de mockData.js
// simulando un delay de red. Cuando USE_MOCK = false se hace request real
// contra backend.Reconecta + path.
//
// Endpoints contemplados:
//   GET    /Binnacle/Ordenes              → listar (con filtros y paginación)
//   GET    /Binnacle/Ordenes/:id          → detalle
//   POST   /Binnacle/Ordenes              → crear
//   PATCH  /Binnacle/Ordenes/:id          → actualizar
//   DELETE /Binnacle/Ordenes/:id          → eliminar
//   GET    /Binnacle/Stats                → métricas (header)
//   GET    /Binnacle/Equipos
//   GET    /Binnacle/Personal
//   GET    /Binnacle/Vehiculos

import { request } from '../../../utils/js/request'
import { backend } from '../../../utils/routes/app.routes'
import {
	BACKEND_TO_ESTADO,
	ESTADO_TO_BACKEND,
	INT_TO_TIPO_TAREA,
	PICTURE_TYPE,
	TIPO_TAREA_TO_INT,
} from '../utils/constants'
import { mockEquipos, mockOrdenes, mockPersonal, mockStats, mockVehiculos } from './mockData'

// Mapea un registro Binnacle del backend al shape UI consumido por el módulo.
// El backend persiste:
//   - id_equipment   → cuando el mantenimiento es sobre un Equipment (reconectador, medidor, etc.)
//   - id_element     → cuando el mantenimiento es sobre un Element sin Equipment (subestación rural)
// Sólo uno de los dos viene poblado por registro.
const mapOrdenFromBackend = (b) => ({
	id: b.id,
	numeroOM: b.order || '',
	equipoId: b.id_equipment || null,
	elementoId: b.id_element || null,
	equipoNombre: b.name_element || '',
	tipoTarea: INT_TO_TIPO_TAREA[b.type_task] || 'otro',
	descripcion: b.description || '',
	fechaRealizacion: b.date_task ? String(b.date_task).slice(0, 10) : '',
	duracion: {
		dias: b.day_task ?? 0,
		horas: b.hours_task ?? 0,
		minutos: b.minutes_task ?? 0,
	},
	personalIds: (b.users || []).map((u) => u.id),
	estado: BACKEND_TO_ESTADO[b.status_task] || 'curso',
	fotoGeneral:
		(b.pictures || []).find((p) => p.type === PICTURE_TYPE.PRINCIPAL)?.name_file || null,
	fotosDetalle: (b.pictures || [])
		.filter((p) => p.type === PICTURE_TYPE.DETALLE)
		.map((p) => p.name_file),
})

// Inverso de mapOrdenFromBackend: arma el payload que espera /Binnacle/Ordenes.
// Polimorfismo: si la orden está atada a un Equipment se envía id_equipment;
// si está atada a un Element (subestación) se envía id_element. Mutuamente exclusivos.
const mapOrdenToBackend = (u) => {
	const pictures = [
		...(u.fotoGeneral
			? [{ name_file: u.fotoGeneral, type: PICTURE_TYPE.PRINCIPAL }]
			: []),
		...(u.fotosDetalle || []).map((name_file) => ({
			name_file,
			type: PICTURE_TYPE.DETALLE,
		})),
	]
	return {
		id_equipment: u.equipoId ? Number(u.equipoId) : null,
		id_element: u.elementoId ? Number(u.elementoId) : null,
		name_element: u.equipoNombre || null,
		order: u.numeroOM?.trim() || null,
		type_task: TIPO_TAREA_TO_INT[u.tipoTarea] ?? null,
		date_task: u.fechaRealizacion,
		status_task: ESTADO_TO_BACKEND[u.estado] || 'En curso',
		day_task: Number(u.duracion?.dias) || 0,
		hours_task: Number(u.duracion?.horas) || 0,
		minutes_task: Number(u.duracion?.minutos) || 0,
		description: u.descripcion,
		users: u.personalIds || [],
		pictures,
	}
}

// Filtros client-side aplicados a ordenes ya mapeadas a UI.
// (El backend de /Binnacle/Ordenes hoy sólo filtra por id/id_element/status_task/type_task,
// por lo que q/desde/hasta se resuelven acá.)
const filtrarOrdenesUI = (ordenes, params = {}) => {
	let res = [...ordenes]
	if (params.q) {
		const q = String(params.q).toLowerCase()
		res = res.filter((o) =>
			[o.id, o.numeroOM, o.equipoNombre, o.descripcion, ...(o.personalIds || [])]
				.filter((v) => v !== null && v !== undefined && v !== '')
				.join(' ')
				.toLowerCase()
				.includes(q),
		)
	}
	if (params.estado && params.estado !== 'all') {
		res = res.filter((o) => o.estado === params.estado)
	}
	if (params.desde) res = res.filter((o) => o.fechaRealizacion && o.fechaRealizacion >= params.desde)
	if (params.hasta) res = res.filter((o) => o.fechaRealizacion && o.fechaRealizacion <= params.hasta)
	res.sort((a, b) => (b.fechaRealizacion || '').localeCompare(a.fechaRealizacion || ''))
	return res
}

// Para desactivar el modo mock cuando el backend esté listo,
// poner USE_MOCK = false (o leerlo de import.meta.env).
export const USE_MOCK = false

const delay = (ms = 250) => new Promise((r) => setTimeout(r, ms))

// --- Almacén in-memory para simular persistencia ---
let mockStore = [...mockOrdenes]
let mockSequence = 143

const generarIdOrden = () => {
	const year = new Date().getFullYear()
	const num = String(mockSequence++).padStart(4, '0')
	return `BIT-${year}-${num}`
}

const filtrarYPaginar = (ordenes, params = {}) => {
	let res = [...ordenes]

	if (params.q) {
		const q = params.q.toLowerCase()
		res = res.filter((o) =>
			[o.id, o.numeroOM, o.equipoId, o.descripcion, ...(o.personalIds || [])]
				.filter(Boolean)
				.join(' ')
				.toLowerCase()
				.includes(q)
		)
	}
	if (params.estado && params.estado !== 'all') {
		res = res.filter((o) => o.estado === params.estado)
	}
	if (params.tipoEquipo) {
		const idsDelTipo = new Set(mockEquipos.filter((e) => e.tipo === params.tipoEquipo).map((e) => e.id))
		res = res.filter((o) => idsDelTipo.has(o.equipoId))
	}
	if (params.desde) res = res.filter((o) => o.fechaRealizacion >= params.desde)
	if (params.hasta) res = res.filter((o) => o.fechaRealizacion <= params.hasta)

	res.sort((a, b) => b.fechaRealizacion.localeCompare(a.fechaRealizacion))
	return res
}

// --- API pública ---

export const bitacoraApi = {
	async listarOrdenes(params = {}) {
		if (USE_MOCK) {
			await delay()
			return filtrarYPaginar(mockStore, params)
		}
		// El backend hoy filtra por status_task/type_task/id/id_element. Si en algún
		// momento se quiere derivar filtros al servidor, traducirlos acá. Por ahora
		// se trae todo y se filtra en UI.
		const { data } = await request(`${backend.Reconecta}/Binnacle/Ordenes`, 'GET')
		const ordenes = (data || []).map(mapOrdenFromBackend)
		return filtrarOrdenesUI(ordenes, params)
	},

	// Lista las bitácoras de un Equipment (reconectador, medidor, etc.).
	async listarOrdenesPorEquipment(idEquipment) {
		if (!idEquipment) return []
		if (USE_MOCK) {
			await delay(120)
			return mockStore.filter((o) => o.equipoId === idEquipment)
		}
		const { data } = await request(
			`${backend.Reconecta}/Binnacle/Ordenes?id_equipment=${idEquipment}`,
			'GET',
		)
		return (data || []).map(mapOrdenFromBackend)
	},

	// Lista las bitácoras de un Element sin Equipment (subestación rural).
	async listarOrdenesPorElement(idElement) {
		if (!idElement) return []
		if (USE_MOCK) {
			await delay(120)
			return mockStore.filter((o) => o.elementoId === idElement)
		}
		const { data } = await request(
			`${backend.Reconecta}/Binnacle/Ordenes?id_element=${idElement}`,
			'GET',
		)
		return (data || []).map(mapOrdenFromBackend)
	},

	async obtenerOrden(id) {
		if (USE_MOCK) {
			await delay(120)
			const orden = mockStore.find((o) => o.id === id)
			if (!orden) throw new Error(`Orden ${id} no encontrada`)
			return orden
		}
		const { data } = await request(`${backend.Reconecta}/Binnacle/Ordenes/${id}`, 'GET')
		// El backend devuelve un array de bitácoras filtrado por id; normalizamos a 1.
		const row = Array.isArray(data) ? data[0] : data
		if (!row) throw new Error(`Orden ${id} no encontrada`)
		return mapOrdenFromBackend(row)
	},

	async crearOrden(orden) {
		if (USE_MOCK) {
			await delay()
			const nueva = { ...orden, id: generarIdOrden() }
			mockStore = [nueva, ...mockStore]
			return nueva
		}
		const payload = mapOrdenToBackend(orden)
		const { data } = await request(`${backend.Reconecta}/Binnacle/Ordenes`, 'POST', payload)
		return data
	},

	async actualizarOrden(id, orden) {
		if (USE_MOCK) {
			await delay()
			const idx = mockStore.findIndex((o) => o.id === id)
			if (idx === -1) throw new Error(`Orden ${id} no encontrada`)
			mockStore[idx] = { ...mockStore[idx], ...orden, id }
			return mockStore[idx]
		}
		const payload = mapOrdenToBackend(orden)
		const { data } = await request(
			`${backend.Reconecta}/Binnacle/Ordenes/${id}`,
			'PATCH',
			payload,
		)
		return data
	},

	async eliminarOrden(id) {
		if (USE_MOCK) {
			await delay()
			mockStore = mockStore.filter((o) => o.id !== id)
			return
		}
		await request(`${backend.Reconecta}/Binnacle/Ordenes/${id}`, 'DELETE')
	},

	async obtenerStats() {
		if (USE_MOCK) {
			await delay(120)
			return mockStats
		}
		const { data } = await request(`${backend.Reconecta}/Binnacle/Stats`, 'GET')
		return data
	},
}

// Catálogos consumidos por el módulo
// Tipos de equipo según equipmentmodels.type (alineado con el resto del sistema:
// CustomPopUp.jsx → 0 SubestaciónRural, 1 Reconectador, 2 Medidor, 3 Analizador).
const EQUIPMENT_TYPE_LABEL = {
	0: 'Subestación rural',
	1: 'Reconectador',
	2: 'Medidor',
	3: 'Analizador',
}

export const equiposApi = {
	async listar() {
		if (USE_MOCK) {
			await delay(120)
			return mockEquipos
		}
		const { data } = await request(`${backend.Reconecta}/Equipments`, 'GET')
		// Mapeo al shape consumido por el módulo: { id, nombre, tipoLabel, ubicacion }.
		// id = Equipment.id porque Binnacle persiste id_equipment (no id_element)
		// cuando el mantenimiento es sobre un Equipment.
		const items = (data || []).map((eq) => {
			const modelo = eq.equipmentmodels
			const elemento = eq.elements
			const nombre = `${elemento?.name ?? ''} - ${eq.observation ?? ''}`.trim()
			return {
				id: eq.id,
				id_element: eq.id_element ?? null,
				nombre,
				type: modelo?.type,
				tipoLabel: EQUIPMENT_TYPE_LABEL[modelo?.type] ?? 'Equipo',
				ubicacion: elemento?.description || eq.serial || '',
				serial: eq.serial ?? null,
			}
		})
		// El Autocomplete de MUI agrupa por adyacencia: necesita estar ordenado por
		// tipoLabel para que cada tipo aparezca como un único grupo.
		items.sort((a, b) => a.type - b.type || a.nombre.localeCompare(b.nombre))
		return items
	},
}

export const personalApi = {
	async listar() {
		if (USE_MOCK) {
			await delay(120)
			return mockPersonal
		}
		const { data } = await request(`${backend.Reconecta}/listUsers`, 'GET')
		// Adaptación al shape consumido por el módulo: { id, nombre, rol }
		return (data || []).map((u) => ({
			id: u.id,
			nombre: `${u.first_name ?? ''} ${u.last_name ?? ''}`.trim(),
			rol: u.profile ?? null,
			email: u.email ?? null,
		}))
	},
}

export const vehiculosApi = {
	async listar() {
		if (USE_MOCK) {
			await delay(120)
			return mockVehiculos
		}
		const { data } = await request(`${backend.Reconecta}/Binnacle/Vehiculos`, 'GET')
		return data
	},
}

function buildQS(params) {
	const usp = new URLSearchParams()
	Object.entries(params).forEach(([k, v]) => {
		if (v === undefined || v === null || v === '' || v === 'all') return
		usp.append(k, v)
	})
	const s = usp.toString()
	return s ? `?${s}` : ''
}
