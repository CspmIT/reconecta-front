export const NODE_OPTIONS = [
	{ value: 4, label: 'ET' },
	{ value: 1, label: 'Reconexión' },
	{ value: 2, label: 'Subestación urbana' },
	{ value: 3, label: 'Subestación rural' },
	{ value: 5, label: 'Consumos puntuales' },
]
export const EQUIPMENT_OPTIONS = [
	{ value: 1, label: 'Reconectadores', color: 'accent-amber-600' },
	{ value: 2, label: 'Medidores', color: 'accent-red-600' },
	{ value: 3, label: 'Analizadores de red', color: 'accent-purple-600' },
]
export const COLUMN_OPTIONS = [
	{ value: 2, label: 'Nro de serie' },
	{ value: 3, label: 'Estado' },
	{ value: 4, label: 'Conexión' },
	{ value: 5, label: 'Latitud' },
	{ value: 6, label: 'Longitud' },
	{ value: 7, label: 'Potencia' },
	{ value: 8, label: 'Alimentación' },
	{ value: 9, label: 'Modo' },
]

export const DEFAULT_FILTERS = [true, true, true, true, true, true]
export const DEFAULT_EQUIPMENT_FILTERS = [true, true, true, true]
export const DEFAULT_COLUMN_FILTERS = [true, true, true, true, true, true, true, true, true, true, true, true]
