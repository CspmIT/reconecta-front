// Estados normalizados de los equipos vinculados (ver backend liveData.js)
export const STATES = {
	closed: { label: 'Cerrado', chip: 'success', stroke: '#16a34a' },
	open: { label: 'Abierto', chip: 'warning', stroke: '#f59e0b' },
	fault: { label: 'Falla', chip: 'error', stroke: '#ef4444' },
	offline: { label: 'Fuera de línea', chip: 'default', stroke: '#6b7280' },
}
