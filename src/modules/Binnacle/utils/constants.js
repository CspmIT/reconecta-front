// Estados posibles de una orden.
export const ESTADOS = {
	programada: { label: 'Programada', color: 'info' },
	curso: { label: 'En curso', color: 'warning' },
	completada: { label: 'Completada', color: 'success' },
	cancelada: { label: 'Cancelada', color: 'default' },
	vencida: { label: 'Vencida', color: 'error' },
}

// Tipos de tarea posibles.
export const TIPOS_TAREA = [
	{ value: 'preventivo', label: 'Mantenimiento preventivo' },
	{ value: 'correctivo', label: 'Mantenimiento correctivo' },
	{ value: 'inspeccion', label: 'Inspección' },
	{ value: 'instalacion', label: 'Instalación / Puesta en servicio' },
	{ value: 'cambio', label: 'Cambio / Reemplazo de equipo' },
	{ value: 'reparacion', label: 'Reparación' },
	{ value: 'otro', label: 'Otro' },
]

// Mapeos UI ↔ backend.
// El backend guarda type_task como INTEGER (1..7) y status_task como string en español.
export const TIPO_TAREA_TO_INT = {
	preventivo: 1,
	correctivo: 2,
	inspeccion: 3,
	instalacion: 4,
	cambio: 5,
	reparacion: 6,
	otro: 7,
}
export const INT_TO_TIPO_TAREA = Object.fromEntries(
	Object.entries(TIPO_TAREA_TO_INT).map(([k, v]) => [v, k]),
)

export const ESTADO_TO_BACKEND = {
	programada: 'Programada',
	curso: 'En curso',
	completada: 'Completada',
	cancelada: 'Cancelada',
	vencida: 'Vencida',
}
export const BACKEND_TO_ESTADO = Object.fromEntries(
	Object.entries(ESTADO_TO_BACKEND).map(([k, v]) => [v, k]),
)

// type usado en Binnacle_pictures para diferenciar foto principal vs detalle.
export const PICTURE_TYPE = {
	PRINCIPAL: 1,
	DETALLE: 2,
}

// Tipos de equipo (alineados con equipmentmodels.type del backend:
// 0 Subestación rural, 1 Reconectador, 2 Medidor, 3 Analizador).
export const TIPOS_EQUIPO = [
	{ value: '', label: 'Todos los tipos de equipo' },
	{ value: 'subestacion', label: 'Subestación rural' },
	{ value: 'reconectador', label: 'Reconectador' },
	{ value: 'medidor', label: 'Medidor' },
	{ value: 'analizador', label: 'Analizador' },
]

// Mapeo del value del select TIPOS_EQUIPO al type numérico del backend.
export const TIPO_EQUIPO_TO_BACKEND_TYPE = {
	subestacion: 0,
	reconectador: 1,
	medidor: 2,
	analizador: 3,
}

export const ESTADOS_FILTRO = [
	{ value: 'all', label: 'Todas' },
	{ value: 'curso', label: 'En curso' },
	{ value: 'programada', label: 'Programadas' },
	{ value: 'completada', label: 'Completadas' },
	{ value: 'vencida', label: 'Vencidas' },
	{ value: 'cancelada', label: 'Canceladas' },
]
