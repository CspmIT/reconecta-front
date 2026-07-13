/*
 * Configuración de variables de la curva de carga por medidor.
 * Cada medidor puede capturar canales distintos: el usuario tilda cuáles aplican
 * y la selección se guarda por serial en localStorage.
 * - canales: columnas de la tabla "Curva 1" (getCurva)
 * - grafs: títulos de gráficos de dataGraficos (getInfoGraf)
 */
export const CURVA_GROUPS = [
	{
		key: 'tension',
		label: 'Tensiones de fase (V)',
		canales: ['Canal1', 'Canal2', 'Canal3'],
		grafs: ['Tensiones (V)'],
	},
	{
		key: 'corriente',
		label: 'Corrientes (A)',
		canales: [],
		grafs: ['Corrientes (A)'],
	},
	{
		key: 'coseno',
		label: 'Coseno φ',
		canales: ['Canal4'],
		grafs: ['Coseno Fi'],
	},
	{
		key: 'activa',
		label: 'Potencia activa (kW)',
		canales: ['Canal5', 'Canal6', 'Canal7'],
		grafs: ['Potencias Activas Importada (kW)', 'Potencias Activas Exportada (kW)'],
	},
	{
		key: 'aparente',
		label: 'Potencia aparente (kVA)',
		canales: [],
		grafs: ['Potencias Aparentes Importada (kVA)', 'Potencias Aparentes Exportada (kVA)'],
	},
	{
		key: 'reactiva',
		label: 'Potencia reactiva (kVAr)',
		canales: [],
		grafs: ['Potencias Reactivas Importada (kVAr)', 'Potencias Reactivas Exportada (kVAr)'],
	},
	{
		key: 'canal8',
		label: 'Canal 8 (AIP)',
		canales: ['Canal8'],
		grafs: [],
	},
]

const storageKey = (serial) => `reconecta_curva_${serial}`

export const loadCurvaConfig = (serial) => {
	try {
		const raw = localStorage.getItem(storageKey(serial))
		if (!raw) return CURVA_GROUPS.map((group) => group.key)
		const saved = JSON.parse(raw)
		const valid = CURVA_GROUPS.map((group) => group.key).filter((key) => saved.includes(key))
		return valid.length ? valid : CURVA_GROUPS.map((group) => group.key)
	} catch (error) {
		return CURVA_GROUPS.map((group) => group.key)
	}
}

export const saveCurvaConfig = (serial, keys) => {
	try {
		localStorage.setItem(storageKey(serial), JSON.stringify(keys))
	} catch (error) {
		/* storage lleno o deshabilitado: la selección no persiste */
	}
}

export const enabledCanales = (keys) =>
	new Set(
		CURVA_GROUPS.filter((group) => keys.includes(group.key)).flatMap((group) => group.canales)
	)

export const enabledGrafTitles = (keys) =>
	new Set(CURVA_GROUPS.filter((group) => keys.includes(group.key)).flatMap((group) => group.grafs))
