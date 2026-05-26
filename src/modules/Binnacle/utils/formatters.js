// Formatea ISO YYYY-MM-DD a DD/MM/YYYY.
export const fmtDate = (iso) => {
	if (!iso) return '—'
	const [y, m, d] = iso.split('-')
	return `${d}/${m}/${y}`
}

// Formatea duración { dias, horas, minutos } a string corto: "2h 30m".
export const fmtDuracion = (dur) => {
	if (!dur) return '—'
	const parts = []
	if (dur.dias) parts.push(`${dur.dias}d`)
	if (dur.horas) parts.push(`${dur.horas}h`)
	if (dur.minutos) parts.push(`${dur.minutos}m`)
	return parts.join(' ') || '—'
}

// Iniciales (máx 2) de un nombre completo.
export const iniciales = (nombre) => {
	if (!nombre) return '?'
	return nombre.split(/\s+/).map((s) => s[0]).join('').slice(0, 2).toUpperCase()
}
