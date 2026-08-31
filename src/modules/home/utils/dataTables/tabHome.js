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
/*
 * `value` es el INDICE de la columna en HEADERS (ver TableGeneral) y es el que
 * se guarda por usuario en UserChecksHome: las columnas nuevas van al final y
 * no se reordenan, porque correr los indices le cambiaria las columnas ocultas
 * a todos los usuarios que ya guardaron su seleccion.
 */
export const COLUMN_OPTIONS = [
	{ value: 2, label: 'Nro de serie' },
	{ value: 3, label: 'Estado' },
	{ value: 4, label: 'Conexión' },
	{ value: 5, label: 'Latitud' },
	{ value: 6, label: 'Longitud' },
	{ value: 7, label: 'Pot. trafo' },
	{ value: 8, label: 'Alimentación' },
	{ value: 9, label: 'Modo' },
	{ value: 10, label: 'Potencia' },
	{ value: 11, label: 'Tensión' },
	{ value: 12, label: 'Corriente' },
]

export const DEFAULT_FILTERS = [true, true, true, true, true, true]
export const DEFAULT_EQUIPMENT_FILTERS = [true, true, true, true]
// Un true por columna de HEADERS, incluida la ultima de acciones: el encabezado
// solo se dibuja si su indice esta en true
export const DEFAULT_COLUMN_FILTERS = [true, true, true, true, true, true, true, true, true, true, true, true, true, true]
