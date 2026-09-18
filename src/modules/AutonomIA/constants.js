// AutonomIA dentro de Reconecta — constantes compartidas.
//
// Criterio heredado del Tablero (Leonardo + Lorenzo, 12/08): una versión de
// firmware es EXACTAMENTE para un modelo de placa y cada modelo tiene UN chip
// fijo. Placa nueva en el parque = una línea acá (y en el catálogo del área).
// Acá se listan solo los equipos que un instalador de Reconecta puede tocar;
// los lectores RS485 de +Agua quedan en el Tablero de ingeniería.
export const EQUIPOS_FW = [
	{ modelo: 'Multivac 1.0/7.1', chip: 'esp32' },
	{ modelo: 'Multivac 8.0', chip: 'esp32s3' },
	{ modelo: 'DLMS Itron (medidores)', chip: 'esp32' },
]

export const CHIP_LABEL = { esp32: 'ESP32 clásico', esp32s3: 'ESP32-S3', esp32c3: 'ESP32-C3 mini' }
export const MODE_LABEL = { qio: 'QIO', dio: 'DIO', qout: 'QOUT', dout: 'DOUT' }
export const FREQ_LABEL = { '80m': '80MHz', '40m': '40MHz', '26m': '26MHz', '20m': '20MHz' }

// Del nombre que devuelve esptool-js ("ESP32-D0WD-V3", "ESP32-S3", …) al chip
// del manifiesto. Cualquier otra familia (S2, C6, H2) se rechaza.
export const normalizarChip = (nombre) => {
	const n = String(nombre || '').toUpperCase()
	if (n.includes('S3')) return 'esp32s3'
	if (n.includes('C3')) return 'esp32c3'
	if (n.includes('S2') || n.includes('C6') || n.includes('H2')) return 'otro'
	return n.includes('ESP32') ? 'esp32' : 'otro'
}

// Agrupa los releases por equipo para las tablas colapsables. `_i` conserva el
// índice REAL en el catálogo (la selección apunta ahí).
export const agruparPorEquipo = (lista) => {
	const conocidos = new Set(EQUIPOS_FW.map((e) => e.modelo))
	const orden = (rs) => rs.sort((a, b) => String(b.fecha || '').localeCompare(String(a.fecha || '')))
	const grupos = EQUIPOS_FW.map((eq) => ({
		modelo: eq.modelo,
		chip: eq.chip,
		releases: orden(lista.filter((f) => f.modelo === eq.modelo)),
	}))
	const otros = lista.filter((f) => !conocidos.has(f.modelo))
	if (otros.length) grupos.push({ modelo: 'Otros equipos', chip: null, releases: orden(otros) })
	return grupos.filter((g) => g.releases.length)
}

export const descArchivos = (f) =>
	`${f.segmentos?.length || 0} bin${f.merged ? ' + fábrica' : ''}`
