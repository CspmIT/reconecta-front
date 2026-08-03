/*
 * Configuración de variables de la curva de carga por medidor.
 * Cada medidor puede capturar canales distintos: el usuario tilda cuáles aplican
 * y la selección se guarda por serial en localStorage.
 * key = field de Influx del topic /status/curva (endpoint getCurva).
 * tx = conversión que aplica el toggle Convertido ('vt' multiplica por la
 * relación de tensión; el resto ya viene en la escala publicada).
 */
export const CURVA_CATALOG = [
	{ key: 'v_l1', label: 'V₁ (V)', unit: 'V', group: 'Tensiones de fase', tx: 'vt' },
	{ key: 'v_l2', label: 'V₂ (V)', unit: 'V', group: 'Tensiones de fase', tx: 'vt' },
	{ key: 'v_l3', label: 'V₃ (V)', unit: 'V', group: 'Tensiones de fase', tx: 'vt' },
	{ key: 'cfi', label: 'cos φ', group: 'Coseno φ' },
	{ key: 'fp', label: 'Factor de potencia', group: 'Factor de potencia' },
	{ key: 'kwh_l1', label: 'E. activa L₁ (kWh)', unit: 'kWh', group: 'Energía activa' },
	{ key: 'kwh_l2', label: 'E. activa L₂ (kWh)', unit: 'kWh', group: 'Energía activa' },
	{ key: 'kwh_l3', label: 'E. activa L₃ (kWh)', unit: 'kWh', group: 'Energía activa' },
	{ key: 'pa_i', label: 'Activa imp. (kWh)', unit: 'kWh', group: 'Energía activa' },
	{ key: 'pa_e', label: 'Activa exp. (kWh)', unit: 'kWh', group: 'Energía activa' },
	{ key: 'kvah', label: 'E. aparente (kVAh)', unit: 'kVAh', group: 'Energía aparente' },
	{ key: 'eap_i', label: 'Aparente imp. (kVAh)', unit: 'kVAh', group: 'Energía aparente' },
	{ key: 'pr_i', label: 'Reactiva imp. (kvarh)', unit: 'kvarh', group: 'Energía reactiva' },
	{ key: 'pr_e', label: 'Reactiva exp. (kvarh)', unit: 'kvarh', group: 'Energía reactiva' },
	{ key: 'pr_i2', label: 'Reactiva imp. 2 (kvarh)', unit: 'kvarh', group: 'Energía reactiva' },
	{ key: 'pr_e2', label: 'Reactiva exp. 2 (kvarh)', unit: 'kvarh', group: 'Energía reactiva' },
]

// Set típico que captura un medidor (mockup): se usa como default hasta que
// el usuario tilde lo que aplica a su medidor
export const CURVA_DEFAULT_ON = ['v_l1', 'v_l2', 'v_l3', 'cfi', 'kwh_l1', 'kwh_l2', 'kwh_l3', 'kvah']

const storageKey = (serial) => `reconecta_curva_${serial}`

export const loadCurvaConfig = (serial) => {
	try {
		const raw = localStorage.getItem(storageKey(serial))
		if (!raw) return [...CURVA_DEFAULT_ON]
		const saved = JSON.parse(raw)
		// Sanitiza contra el catálogo (configs viejas con claves de grupo caen al default)
		const valid = CURVA_CATALOG.map((item) => item.key).filter((key) => saved.includes(key))
		return valid.length ? valid : [...CURVA_DEFAULT_ON]
	} catch (error) {
		return [...CURVA_DEFAULT_ON]
	}
}

export const saveCurvaConfig = (serial, keys) => {
	try {
		localStorage.setItem(storageKey(serial), JSON.stringify(keys))
	} catch (error) {
		/* storage lleno o deshabilitado: la selección no persiste */
	}
}

// Variables habilitadas, en el orden del catálogo
export const enabledVariables = (keys) => CURVA_CATALOG.filter((item) => keys.includes(item.key))
