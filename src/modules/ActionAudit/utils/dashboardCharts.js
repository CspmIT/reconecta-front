// Builders de configuración de ECharts. Son funciones puras: reciben datos y
// el flag de tema, y devuelven el objeto de config para <EChart config={...} />.
// Los gráficos no leen CSS, por eso `darkMode` viaja como parámetro.

// Toda línea de grilla y de eje del módulo usa este gris translúcido.
const GRID_LINE = 'rgba(148, 163, 184, 0.25)'

const textColor = (darkMode) => (darkMode ? '#9ca3af' : '#64748b')

const tooltipStyle = (darkMode) => ({
	backgroundColor: darkMode ? '#27272a' : '#ffffff',
	borderColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(15,42,68,0.1)',
	textStyle: { color: darkMode ? '#e5e7eb' : '#334155', fontSize: 12 },
})

// Grid pegado al borde: la tarjeta ya aporta el aire.
const GRID = { left: 8, right: 8, top: 24, bottom: 4, containLabel: true }

const axisBase = (darkMode) => ({
	axisTick: { show: false },
	axisLine: { lineStyle: { color: GRID_LINE } },
	axisLabel: { color: textColor(darkMode), fontSize: 11, hideOverlap: true },
})

/**
 * Barras verticales para series temporales.
 *
 * @param {Object} params - labels, values, color, darkMode, formatter y colors
 *   opcional (un color por barra, para el histograma de latencia).
 * @returns {Object} Config de ECharts.
 */
export const verticalBars = ({ labels, values, color, colors, darkMode, formatter, zoom = false }) => ({
	grid: zoom ? { ...GRID, bottom: 28 } : GRID,
	dataZoom: zoom
		? [
				{ type: 'inside' },
				{ type: 'slider', height: 20, bottom: 0, borderColor: GRID_LINE, handleSize: '80%' },
			]
		: undefined,
	tooltip: {
		trigger: 'axis',
		axisPointer: { type: 'shadow' },
		...tooltipStyle(darkMode),
		valueFormatter: formatter,
	},
	xAxis: { type: 'category', data: labels, ...axisBase(darkMode) },
	yAxis: {
		type: 'value',
		...axisBase(darkMode),
		splitLine: { lineStyle: { color: GRID_LINE } },
	},
	series: [
		{
			type: 'bar',
			data: colors ? values.map((v, i) => ({ value: v, itemStyle: { color: colors[i] } })) : values,
			barMaxWidth: 22,
			itemStyle: { color, borderRadius: [4, 4, 0, 0] },
		},
	],
})

/**
 * Barras apiladas. Sólo el segmento de arriba lleva el redondeo.
 *
 * @param {Object} params - labels, series ([{ name, values, color }]) y darkMode.
 * @returns {Object} Config de ECharts.
 */
export const stackedBars = ({ labels, series, darkMode }) => ({
	grid: { ...GRID, bottom: 24 },
	tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, ...tooltipStyle(darkMode) },
	legend: {
		bottom: 0,
		icon: 'circle',
		itemWidth: 8,
		itemHeight: 8,
		textStyle: { color: textColor(darkMode), fontSize: 11 },
	},
	xAxis: { type: 'category', data: labels, ...axisBase(darkMode) },
	yAxis: { type: 'value', ...axisBase(darkMode), splitLine: { lineStyle: { color: GRID_LINE } } },
	series: series.map((s, i) => ({
		name: s.name,
		type: 'bar',
		stack: 'total',
		data: s.values,
		barMaxWidth: 22,
		itemStyle: {
			color: s.color,
			borderRadius: i === series.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0],
		},
	})),
})

/**
 * Línea con área tenue, para tiempos y perfiles horarios.
 *
 * @param {Object} params - labels, values, color, darkMode y formatter.
 * @returns {Object} Config de ECharts.
 */
export const lineArea = ({ labels, values, color, darkMode, formatter }) => ({
	grid: GRID,
	tooltip: { trigger: 'axis', ...tooltipStyle(darkMode), valueFormatter: formatter },
	xAxis: { type: 'category', boundaryGap: false, data: labels, ...axisBase(darkMode) },
	yAxis: { type: 'value', ...axisBase(darkMode), splitLine: { lineStyle: { color: GRID_LINE } } },
	series: [
		{
			type: 'line',
			data: values,
			smooth: true,
			showSymbol: false,
			connectNulls: true,
			lineStyle: { width: 2, color },
			itemStyle: { color },
			areaStyle: { color, opacity: 0.12 },
		},
	],
})

/**
 * Barras horizontales para rankings. El primero queda arriba, así que se
 * invierten labels y valores.
 *
 * @param {Object} params - labels, values, color, darkMode, formatter y
 *   labelWidth para truncar nombres largos de endpoint.
 * @returns {Object} Config de ECharts.
 */
export const horizontalBars = ({ labels, values, color, darkMode, formatter, labelWidth = 110 }) => ({
	grid: { ...GRID, left: 4 },
	tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, ...tooltipStyle(darkMode), valueFormatter: formatter },
	xAxis: { type: 'value', ...axisBase(darkMode), splitLine: { lineStyle: { color: GRID_LINE } } },
	yAxis: {
		type: 'category',
		data: [...labels].reverse(),
		...axisBase(darkMode),
		axisLabel: {
			color: textColor(darkMode),
			fontSize: 11,
			width: labelWidth,
			overflow: 'truncate',
		},
	},
	series: [
		{
			type: 'bar',
			data: [...values].reverse(),
			barMaxWidth: 18,
			itemStyle: { color, borderRadius: [0, 4, 4, 0] },
		},
	],
})

/**
 * Mapa de calor día x hora. La rampa cambia por tema para que las celdas
 * vacías no queden más brillantes que el fondo.
 *
 * @param {Object} params - xLabels, yLabels, data ([[x, y, valor]]) y darkMode.
 * @returns {Object} Config de ECharts.
 */
export const heatmap = ({ xLabels, yLabels, data, darkMode, max }) => ({
	grid: { left: 8, right: 8, top: 16, bottom: 48, containLabel: true },
	tooltip: {
		...tooltipStyle(darkMode),
		formatter: (p) => `${yLabels[p.value[1]]} ${xLabels[p.value[0]]} h<br/><b>${p.value[2]}</b> requests`,
	},
	xAxis: { type: 'category', data: xLabels, splitArea: { show: false }, ...axisBase(darkMode) },
	yAxis: { type: 'category', data: yLabels, splitArea: { show: false }, ...axisBase(darkMode) },
	visualMap: {
		min: 0,
		max: max || 1,
		calculable: false,
		orient: 'horizontal',
		left: 'center',
		bottom: 4,
		itemWidth: 12,
		itemHeight: 90,
		textStyle: { color: textColor(darkMode), fontSize: 10 },
		inRange: { color: darkMode ? ['#27272a', '#1e40af', '#38bdf8'] : ['#eff6ff', '#60a5fa', '#1e3a8a'] },
	},
	series: [
		{
			type: 'heatmap',
			data,
			itemStyle: { borderRadius: 2, borderWidth: 1, borderColor: darkMode ? '#3f3f46' : '#ffffff' },
		},
	],
})

/**
 * Dona de composición. Sin etiquetas sobre los gajos: la leyenda de abajo hace
 * de etiquetado y el borde del color del fondo separa los segmentos.
 *
 * @param {Object} params - data ([{ name, value, itemStyle }]) y darkMode.
 * @returns {Object} Config de ECharts.
 */
export const donut = ({ data, darkMode }) => ({
	tooltip: { trigger: 'item', ...tooltipStyle(darkMode) },
	legend: {
		bottom: 0,
		icon: 'circle',
		itemWidth: 8,
		itemHeight: 8,
		textStyle: { color: textColor(darkMode), fontSize: 11 },
	},
	series: [
		{
			type: 'pie',
			radius: ['52%', '74%'],
			center: ['50%', '44%'],
			avoidLabelOverlap: false,
			label: { show: false },
			labelLine: { show: false },
			itemStyle: { borderWidth: 2, borderColor: darkMode ? '#3f3f46' : '#ffffff' },
			data,
		},
	],
})
