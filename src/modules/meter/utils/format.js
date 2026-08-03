// 0xFFFFFFFF: valor "no disponible" que publica el firmware (registro u32 lleno).
// Se detecta tanto crudo como normalizado a kilo (los /EOB llegan divididos por 1000).
export const INVALID_U32 = 4294967295

export const isInvalidEnergy = (value) => {
	const num = parseFloat(value)
	if (isNaN(num)) return false
	return num === INVALID_U32 || num === INVALID_U32 / 1000
}

export const SIN_INFO = 'Sin Información'
