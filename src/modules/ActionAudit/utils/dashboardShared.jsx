// Piezas compartidas del dashboard de auditoría: paleta, tarjetas, filtros y
// helpers de formato. Todo lo visual del módulo sale de acá.
import { Tooltip } from '@mui/material'
import { FaInfoCircle } from 'react-icons/fa'

import CardCustom from '../../../components/CardCustom'

// Paleta semántica. La regla que mantiene ordenado un dashboard de ~15
// gráficos: UN SOLO TONO POR GRÁFICO, y la identidad la da el eje, no el color.
// Conteos siempre azul, tiempos siempre naranja, actividad humana violeta.
// Verde / ámbar / rojo quedan RESERVADOS para estado (status HTTP, latencia
// buena o mala) y nunca se usan como "color de serie 4".
export const COLOR = {
	count: '#368bed',
	duration: '#d8621d',
	activity: '#8b5cf6',
	ok: '#10B981',
	error: '#ef4444',
}

// Estos dos tienen semántica fija y no se tocan.
export const STATUS_META = {
	'2xx': { label: 'Éxito (2xx)', color: '#10B981' },
	'3xx': { label: 'Redirección (3xx)', color: '#94a3b8' },
	'4xx': { label: 'Error de cliente (4xx)', color: '#f59e0b' },
	'5xx': { label: 'Error de servidor (5xx)', color: '#ef4444' },
}

// Verde → rojo: cuanto más a la derecha, más lento.
export const LATENCY_COLORS = {
	'0-100ms': '#10B981',
	'100-300ms': '#84cc16',
	'300ms-1s': '#f59e0b',
	'1-3s': '#f97316',
	'3s+': '#ef4444',
}

export const LATENCY_ORDER = ['0-100ms', '100-300ms', '300ms-1s', '1-3s', '3s+']

export const DAY_NAMES = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

/**
 * Entero con separador de miles; null o undefined se muestran como guion.
 *
 * @param {number} n
 * @returns {string}
 */
export const formatInt = (n) => (n === null || n === undefined ? '—' : Number(n).toLocaleString('es-AR'))

/**
 * Duración legible: hasta 1000 ms en milisegundos, después en segundos.
 *
 * @param {number} ms
 * @returns {string}
 */
export const formatMs = (ms) => {
	if (ms === null || ms === undefined) return '—'
	const value = Number(ms)
	return value < 1000 ? `${Math.round(value)} ms` : `${(value / 1000).toFixed(1)} s`
}

/**
 * Clave de día (YYYY-MM-DD) en hora local, que es como agrupa el backend.
 *
 * @param {Date} date
 * @returns {string}
 */
export const dayKey = (date) => {
	const y = date.getFullYear()
	const m = String(date.getMonth() + 1).padStart(2, '0')
	const d = String(date.getDate()).padStart(2, '0')
	return `${y}-${m}-${d}`
}

/**
 * Todas las claves de día de los últimos N días.
 *
 * Sirve para rellenar con 0 los días sin datos: sin esto las series quedan
 * engañosamente continuas y un día caído no se ve.
 *
 * @param {number} n
 * @returns {string[]}
 */
export const lastNDayKeys = (n) => {
	const keys = []
	const today = new Date()
	for (let i = n - 1; i >= 0; i--) {
		keys.push(dayKey(new Date(today.getFullYear(), today.getMonth(), today.getDate() - i)))
	}
	return keys
}

/**
 * '2026-08-24' → '24/08', para los ejes.
 *
 * @param {string} key
 * @returns {string}
 */
export const dayLabel = (key) => {
	const [, m, d] = String(key).split('-')
	return `${d}/${m}`
}

/**
 * Rellena una serie diaria con 0 en los días sin datos.
 *
 * @param {Array} rows - Filas del backend, con la clave de día y un total.
 * @param {number} days - Días del período.
 * @param {string} [valueKey] - Campo del total.
 * @returns {{ labels: string[], values: number[] }}
 */
export const fillDays = (rows, days, valueKey = 'total') => {
	const map = new Map((rows || []).map((r) => [String(r.day).slice(0, 10), Number(r[valueKey]) || 0]))
	const keys = lastNDayKeys(days)
	return { labels: keys.map(dayLabel), values: keys.map((k) => map.get(k) ?? 0) }
}

/**
 * El signo de pregunta con la explicación. Los delays táctiles hacen que el
 * tooltip también sirva en pantalla: un tap corto lo abre y queda 5 segundos.
 */
export const HelpIcon = ({ help }) => (
	<Tooltip title={help} arrow placement='top' enterTouchDelay={50} leaveTouchDelay={5000}>
		<span className='flex items-center text-slate-400 dark:text-gray-400 cursor-help'>
			<FaInfoCircle size={13} />
		</span>
	</Tooltip>
)

/**
 * Tarjeta de número. `tabular-nums` evita que los dígitos bailen al refrescar.
 */
export const KpiCard = ({ label, value, hint, help }) => (
	<CardCustom className='rounded-xl p-4 flex flex-col gap-0.5'>
		<span className='flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400 dark:text-gray-400'>
			{label}
			{help && <HelpIcon help={help} />}
		</span>
		<span className='text-2xl font-semibold text-slate-800 dark:text-gray-100 tabular-nums'>{value}</span>
		{hint && <span className='text-xs text-slate-400 dark:text-gray-400'>{hint}</span>}
	</CardCustom>
)

/**
 * Tarjeta de gráfico. La altura la fija quien la usa por `className` (h-64,
 * h-72, h-80) y el gráfico llena el resto con flex-1 min-h-0.
 */
export const ChartCard = ({ title, subtitle, help, className = '', children }) => (
	<CardCustom className={`rounded-xl p-4 flex flex-col ${className}`}>
		<div className='flex items-center gap-1.5'>
			<h3 className='text-sm font-semibold text-slate-700 dark:text-gray-200'>{title}</h3>
			{help && <HelpIcon help={help} />}
		</div>
		{subtitle && <p className='text-xs text-slate-400 dark:text-gray-400 mb-1 max-md:truncate'>{subtitle}</p>}
		<div className='w-full flex-1 min-h-0'>{children}</div>
	</CardCustom>
)

/**
 * Mensaje centrado para las tarjetas sin datos en el período.
 */
export const EmptyChart = ({ text }) => (
	<div className='h-full flex items-center justify-center text-xs text-slate-400 dark:text-gray-400 text-center px-4'>
		{text}
	</div>
)

// Pill toggle: es EL selector del módulo, se repite en el rango y en el
// detalle de errores. El activo va en el primario; el texto queda oscuro
// porque el primario de Reconecta es claro.
export const pillClass = (active) =>
	`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
		active
			? 'border-primary bg-primary text-slate-900'
			: 'border-slate-200 bg-white text-slate-500 hover:border-primary hover:text-slate-700 dark:border-gray-600 dark:bg-zinc-800 dark:text-gray-300'
	}`

/**
 * Filtro de rango del dashboard. Sin selector de cooperativa: cada instalación
 * de Reconecta ve su propia base, el tenant ya viene resuelto en el token.
 */
export const DashboardFilters = ({ days, onChange }) => (
	<div className='flex items-center gap-2 max-md:w-full max-md:justify-center'>
		<span className='text-xs text-slate-400 dark:text-gray-400 max-md:hidden'>Rango</span>
		{[7, 30, 90].map((value) => (
			<button key={value} type='button' className={pillClass(days === value)} onClick={() => onChange(value)}>
				{value} días
			</button>
		))}
	</div>
)
