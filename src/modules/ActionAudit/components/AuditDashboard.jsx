import { useContext, useEffect, useMemo, useState } from 'react'

import EChart from '../../../components/Charts'
import LoaderComponent from '../../../components/Loader'
import CardCustom from '../../../components/CardCustom'
import { MainContext } from '../../../context/MainContext'
import { auditApi } from '../api/auditApi'
import { donut, heatmap, horizontalBars, lineArea, stackedBars, verticalBars } from '../utils/dashboardCharts'
import {
	COLOR,
	ChartCard,
	DAY_NAMES,
	DashboardFilters,
	EmptyChart,
	KpiCard,
	LATENCY_COLORS,
	LATENCY_ORDER,
	STATUS_META,
	fillDays,
	formatInt,
	formatMs,
} from '../utils/dashboardShared'
import { HELP } from '../utils/help'
import ErrorsDetail from './ErrorsDetail'

// Paleta de la dona de composición: variaciones del azul de conteo, para que
// siga leyéndose como "un solo tono por gráfico".
const MODULE_COLORS = ['#368bed', '#5ba3f2', '#7fb9f6', '#a3cffa', '#c7e2fd', '#94a3b8']

const userName = (row) => {
	const name = `${row.user?.first_name || ''} ${row.user?.last_name || ''}`.trim()
	return name || row.user?.email || 'Sistema'
}

const AuditDashboard = () => {
	const { darkMode } = useContext(MainContext)
	const [days, setDays] = useState(7)
	const [data, setData] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')
	// En un teléfono el dashboard completo abruma: se muestra lo esencial y el
	// resto queda detrás de un tap. En escritorio esta clase no hace nada.
	const [showDetail, setShowDetail] = useState(false)
	const det = showDetail ? '' : ' max-md:hidden'

	useEffect(() => {
		let active = true
		setLoading(true)
		auditApi
			.getDashboard(days)
			.then((response) => {
				if (active) {
					setData(response)
					setError('')
				}
			})
			.catch((e) => active && setError(e?.message || 'No se pudo cargar la auditoría'))
			.finally(() => active && setLoading(false))
		return () => {
			active = false
		}
	}, [days])

	const charts = useMemo(() => {
		if (!data) return null
		const { traffic, rankings, errors } = data

		const requests = fillDays(traffic.by_day, days)
		const response = fillDays(traffic.by_day, days, 'avg_ms')
		const errorsDay = fillDays(traffic.by_day, days, 'errors')
		const logins = fillDays(traffic.logins_by_day, days)
		const mqtt = fillDays(traffic.mqtt_by_day, days)

		// Perfil horario: se completan las 24 horas para que las horas sin
		// actividad se vean planas y no se salteen.
		const hourMap = new Map((traffic.by_hour || []).map((r) => [Number(r.hour), Number(r.total)]))
		const hourLabels = Array.from({ length: 24 }, (_, h) => `${String(h).padStart(2, '0')}`)

		const heatCells = (traffic.heatmap || []).map((r) => [Number(r.hour), Number(r.weekday), Number(r.total)])
		const heatMax = heatCells.reduce((max, cell) => Math.max(max, cell[2]), 0)

		const topModules = (rankings.modules || []).slice(0, 5)
		const restTotal = (rankings.modules || []).slice(5).reduce((sum, m) => sum + Number(m.total), 0)

		const latencyMap = new Map((rankings.latency || []).map((r) => [r.bucket, Number(r.total)]))
		const statusData = (rankings.status || [])
			.filter((r) => STATUS_META[r.bucket])
			.map((r) => ({
				name: STATUS_META[r.bucket].label,
				value: Number(r.total),
				itemStyle: { color: STATUS_META[r.bucket].color },
			}))

		return {
			requestsByDay: verticalBars({
				labels: requests.labels,
				values: requests.values,
				color: COLOR.count,
				darkMode,
				zoom: days > 30,
			}),
			composition: donut({
				data: [
					...topModules.map((m, i) => ({
						name: m.module,
						value: Number(m.total),
						itemStyle: { color: MODULE_COLORS[i] },
					})),
					...(restTotal ? [{ name: 'Otros', value: restTotal, itemStyle: { color: MODULE_COLORS[5] } }] : []),
				],
				darkMode,
			}),
			humanActivity: stackedBars({
				labels: logins.labels,
				series: [
					{ name: 'Inicios de sesión', values: logins.values, color: COLOR.activity },
					{ name: 'Acciones a equipos', values: mqtt.values, color: COLOR.count },
				],
				darkMode,
			}),
			responseByDay: lineArea({
				labels: response.labels,
				values: response.values.map((v) => Math.round(v) || null),
				color: COLOR.duration,
				darkMode,
				formatter: formatMs,
			}),
			hourly: lineArea({
				labels: hourLabels,
				values: hourLabels.map((_, h) => hourMap.get(h) ?? 0),
				color: COLOR.count,
				darkMode,
			}),
			heat: heatmap({
				xLabels: hourLabels,
				yLabels: DAY_NAMES,
				data: heatCells,
				max: heatMax,
				darkMode,
			}),
			latency: verticalBars({
				labels: LATENCY_ORDER,
				values: LATENCY_ORDER.map((bucket) => latencyMap.get(bucket) ?? 0),
				colors: LATENCY_ORDER.map((bucket) => LATENCY_COLORS[bucket]),
				darkMode,
			}),
			modulesUsed: horizontalBars({
				labels: (rankings.modules || []).map((m) => m.module),
				values: (rankings.modules || []).map((m) => Number(m.total)),
				color: COLOR.count,
				darkMode,
			}),
			modulesDemanding: horizontalBars({
				labels: [...(rankings.modules || [])]
					.sort((a, b) => Number(b.total_ms) - Number(a.total_ms))
					.map((m) => m.module),
				values: [...(rankings.modules || [])]
					.sort((a, b) => Number(b.total_ms) - Number(a.total_ms))
					.map((m) => Math.round(Number(m.total_ms) / 60000)),
				color: COLOR.duration,
				darkMode,
				formatter: (v) => `${v} min`,
			}),
			endpoints: horizontalBars({
				labels: (rankings.endpoints || []).map((e) => e.path),
				values: (rankings.endpoints || []).map((e) => Number(e.total)),
				color: COLOR.count,
				darkMode,
				labelWidth: 180,
			}),
			slowest: horizontalBars({
				labels: (rankings.slowest || []).map((e) => e.path),
				values: (rankings.slowest || []).map((e) => Math.round(Number(e.avg_ms))),
				color: COLOR.duration,
				darkMode,
				formatter: formatMs,
				labelWidth: 180,
			}),
			logins: verticalBars({
				labels: logins.labels,
				values: logins.values,
				color: COLOR.activity,
				darkMode,
			}),
			activeUsers: horizontalBars({
				labels: (rankings.users || []).map(userName),
				values: (rankings.users || []).map((u) => Number(u.total)),
				color: COLOR.activity,
				darkMode,
			}),
			status: donut({ data: statusData, darkMode }),
			errorsByDay: verticalBars({
				labels: errorsDay.labels,
				values: errorsDay.values,
				color: COLOR.error,
				darkMode,
			}),
			errorsByModule: horizontalBars({
				labels: (errors.by_module || []).map((m) => m.module),
				values: (errors.by_module || []).map((m) => Number(m.total)),
				color: COLOR.error,
				darkMode,
			}),
		}
	}, [data, days, darkMode])

	if (loading && !data) return <LoaderComponent image={false} />

	if (error) {
		return (
			<CardCustom className='rounded-xl p-6 text-sm text-slate-500 dark:text-gray-300'>
				No se pudo cargar la auditoría: {error}
			</CardCustom>
		)
	}

	if (!data) return null

	const { kpis, rankings, errors } = data
	const period = `(últimos ${days} días)`
	const noData = !kpis.requests_month

	return (
		<div className='flex flex-col gap-3'>
			<div className='flex justify-end max-md:justify-center'>
				<DashboardFilters days={days} onChange={setDays} />
			</div>

			{noData && (
				<CardCustom className='rounded-xl p-4 text-sm text-slate-500 dark:text-gray-300'>
					Todavía no hay actividad registrada. Las métricas se empiezan a acumular desde que se instala esta
					versión, así que los primeros días el tablero va a estar casi vacío.
				</CardCustom>
			)}

			<div className='grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3'>
				<KpiCard label='Sesiones hoy' value={formatInt(kpis.sessions_today)} help={HELP.sessions} />
				<KpiCard label='Sesiones del mes' value={formatInt(kpis.sessions_month)} help={HELP.sessions} />
				<KpiCard label='Pedidos hoy' value={formatInt(kpis.requests_today)} help={HELP.requests} />
				<KpiCard label='Pedidos del mes' value={formatInt(kpis.requests_month)} help={HELP.requests} />
				<KpiCard label='Respuesta promedio' value={formatMs(kpis.avg_ms)} hint={period} help={HELP.avg} />
				<KpiCard label='Errores' value={formatInt(kpis.errors)} hint={period} help={HELP.errors} />
			</div>

			<div className='grid grid-cols-1 lg:grid-cols-3 gap-3'>
				<ChartCard
					title='¿En qué se usa Reconecta?'
					subtitle={`Pedidos por módulo ${period}`}
					help={HELP.composition}
					className='h-64'
				>
					{rankings.modules?.length ? <EChart config={charts.composition} /> : <EmptyChart text='Sin datos' />}
				</ChartCard>
				<ChartCard
					title='Actividad de las personas'
					subtitle={`Inicios de sesión y órdenes a equipos ${period}`}
					help={HELP.mqtt}
					className={`h-64 lg:col-span-2${det}`}
				>
					<EChart config={charts.humanActivity} />
				</ChartCard>
			</div>

			<div className='grid grid-cols-1 lg:grid-cols-2 gap-3'>
				<ChartCard
					title='Uso del sistema'
					subtitle={`Pedidos por día ${period}${days > 30 ? ' · arrastrá para hacer zoom' : ''}`}
					help={HELP.traffic}
					className='h-80 lg:col-span-2'
				>
					<EChart config={charts.requestsByDay} />
				</ChartCard>
				<ChartCard
					title='¿Está respondiendo rápido?'
					subtitle={`Tiempo de respuesta promedio por día ${period}`}
					help={HELP.responseDay}
					className={`h-64${det}`}
				>
					<EChart config={charts.responseByDay} />
				</ChartCard>
				<ChartCard
					title='¿A qué hora se usa?'
					subtitle={`Pedidos por hora del día ${period}`}
					help={HELP.hourly}
					className={`h-64${det}`}
				>
					<EChart config={charts.hourly} />
				</ChartCard>
			</div>

			<div className='grid grid-cols-1 lg:grid-cols-3 gap-3'>
				<ChartCard
					title='Cuándo pega el pico'
					subtitle={`Día de la semana por hora ${period}`}
					help={HELP.heatmap}
					className={`h-80 lg:col-span-2${det}`}
				>
					<EChart config={charts.heat} />
				</ChartCard>
				<ChartCard
					title='¿Cuánto tardan los pedidos?'
					subtitle={`Reparto por tiempo de respuesta ${period}`}
					help={HELP.latency}
					className={`h-80${det}`}
				>
					<EChart config={charts.latency} />
				</ChartCard>
			</div>

			<div className='grid grid-cols-1 lg:grid-cols-2 gap-3'>
				<ChartCard
					title='Módulos más usados'
					subtitle={`Cantidad de pedidos ${period}`}
					help={HELP.modulesUsed}
					className={`h-72${det}`}
				>
					<EChart config={charts.modulesUsed} />
				</ChartCard>
				<ChartCard
					title='Módulos que más trabajo dan'
					subtitle={`Tiempo total de servidor ${period}`}
					help={HELP.modulesDemanding}
					className={`h-72${det}`}
				>
					<EChart config={charts.modulesDemanding} />
				</ChartCard>
				<ChartCard
					title='Consultas más frecuentes'
					subtitle={`Top 10 ${period}`}
					help={HELP.endpoints}
					className={`h-80 lg:col-span-2${det}`}
				>
					<EChart config={charts.endpoints} />
				</ChartCard>
				<ChartCard
					title='Consultas más lentas'
					subtitle={`Promedio por consulta, mínimo 20 llamadas ${period}`}
					help={HELP.slowest}
					className={`h-80 lg:col-span-2${det}`}
				>
					{rankings.slowest?.length ? (
						<EChart config={charts.slowest} />
					) : (
						<EmptyChart text='Todavía no hay consultas con suficientes llamadas para promediar' />
					)}
				</ChartCard>
			</div>

			<div className='grid grid-cols-1 lg:grid-cols-3 gap-3'>
				<ChartCard
					title='Inicios de sesión'
					subtitle={`Por día ${period}`}
					help={HELP.logins}
					className={`h-64${det}`}
				>
					<EChart config={charts.logins} />
				</ChartCard>
				<ChartCard
					title='Usuarios más activos'
					subtitle={`Pedidos generados ${period}`}
					help={HELP.activeUsers}
					className={`h-64${det}`}
				>
					{rankings.users?.length ? <EChart config={charts.activeUsers} /> : <EmptyChart text='Sin datos' />}
				</ChartCard>
				<ChartCard
					title='¿Cómo terminaron los pedidos?'
					subtitle={`Resultado de cada pedido ${period}`}
					help={HELP.status}
					className={`h-64${det}`}
				>
					<EChart config={charts.status} />
				</ChartCard>
			</div>

			<div className='grid grid-cols-1 lg:grid-cols-2 gap-3'>
				<ChartCard title='Errores por día' subtitle={period} help={HELP.errorsByDay} className='h-64'>
					<EChart config={charts.errorsByDay} />
				</ChartCard>
				<ChartCard
					title='Errores por módulo'
					subtitle={period}
					help={HELP.errorsByModule}
					className={`h-64${det}`}
				>
					{errors.by_module?.length ? (
						<EChart config={charts.errorsByModule} />
					) : (
						<EmptyChart text='Sin errores en el período 🎉' />
					)}
				</ChartCard>
			</div>

			<button
				type='button'
				className='md:hidden mx-auto rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-semibold text-slate-500 dark:border-gray-600 dark:bg-zinc-800 dark:text-gray-300'
				onClick={() => setShowDetail((value) => !value)}
			>
				{showDetail ? 'Ocultar análisis detallado' : 'Ver análisis detallado'}
			</button>

			<div className={det}>
				<ErrorsDetail errors={errors} days={days} />
			</div>
		</div>
	)
}

export default AuditDashboard
