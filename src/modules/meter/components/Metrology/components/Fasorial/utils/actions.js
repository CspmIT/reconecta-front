import Highcharts from 'highcharts'

export const getFasorial2 = async (data) => {
	const CT_0 = data.VI.CT_0.value
	const CT_1 = data.VI.CT_1.value
	const VT_0 = data.VI.VT_0.value
	const VT_1 = data.VI.VT_1.value
	let L1 = data.VI.A_IV_L1.value * -1
	if (L1 > 0) {
		L1 = (360 - L1) * -1
	}
	const L2 = data.VI.A_IV_L2.value * -1
	const L3 = data.VI.A_IV_L3.value * -1

	let L2L1 = data.VI.A_V_L2L1.value
	let L2L1T = data.VI.A_V_L2L1.value
	if (L2L1T < 0) {
		L2L1T = L2L1T * -1
	}
	if (L2L1 > 0) {
		L2L1 = L2L1 * -1
	}

	let L3L2 = data.VI.A_V_L3L2.value
	let L3L2T = data.VI.A_V_L3L2.value
	if (L3L2T < 0) {
		L3L2T = L3L2T * -1
	}
	if (L3L2 > 0) {
		L3L2 = L3L2 * -1
	}

	let L3L1 = data.VI.A_V_L1L3.value
	let L3L1T = data.VI.A_V_L1L3.value
	if (L3L1T < 0) {
		L3L1T = L3L1T * -1
	}
	if (L3L1 > 0) {
		L3L1 = L3L1 * -1
	}

	const V1 = Math.round((((data.VI.V_0.value * VT_0) / VT_1) * 100) / 100)
	const V2 = Math.round((((data.VI.V_1.value * VT_0) / VT_1) * 100) / 100)
	const V3 = Math.round((((data.VI.V_2.value * VT_0) / VT_1) * 100) / 100)
	const C1 = Math.round((((data.VI.I_0.value * CT_0) / CT_1) * 100) / 100)
	const C2 = Math.round((((data.VI.I_1.value * CT_0) / CT_1) * 100) / 100)
	const C3 = Math.round((((data.VI.I_2.value * CT_0) / CT_1) * 100) / 100)
	L3L1 = L2L1 + L3L2
	let valor_max_V = Math.max(V1, V2, V3) || 1
	let valor_max_C = Math.max(C1, C2, C3) || 1
	const C1N = (C1 / valor_max_C) * 70
	const C2N = (C2 / valor_max_C) * 70
	const C3N = (C3 / valor_max_C) * 70
	const V1N = (V1 / valor_max_V) * 100
	const V2N = (V2 / valor_max_V) * 100
	const V3N = (V3 / valor_max_V) * 100
	// console.log(C1N, C2N, C3N)
	// console.log(V1N, V2N, V3N)
	const converters = {
		fa: (number, puntos) => {
			let paso = false
			let num_control = 0
			for (let i = 0; i < 6; i++) {
				let number_graf = number.split(' ')
				if (number_graf.length > 1) {
					num_control = number_graf[0] + number_graf[1]
				} else {
					num_control = number_graf[0]
				}
				if (
					puntos[i].yData[1] == num_control &&
					(puntos[i].name == 'I1' ||
						puntos[i].name == 'I2' ||
						puntos[i].name == 'I3' ||
						puntos[i].name == 'V1' ||
						puntos[i].name == 'V2' ||
						puntos[i].name == 'V3')
				) {
					if (puntos[i].name == 'I1') {
						return C1.toString()
					}
					if (puntos[i].name == 'I2') {
						return C2.toString()
					}
					if (puntos[i].name == 'I3') {
						return C3.toString()
					}
					if (puntos[i].name == 'V1') {
						return V1.toString()
					}
					if (puntos[i].name == 'V2') {
						return V2.toString()
					}
					if (puntos[i].name == 'V3') {
						return V3.toString()
					}
					paso = true
					i = 6
				}
			}
			if (paso == false) {
				return number
			}
		},
	}
	return {
		chart: {
			polar: true,
			width: window.innerWidth < 768 ? window.innerWidth * 0.5 : null,
			numberFormatter: function () {
				let ret = Highcharts.numberFormat.apply(0, arguments)
				let cantidad_chart = Highcharts.charts.length - 1
				let puntos = Highcharts.charts[cantidad_chart].series
				return converters.fa(ret, puntos)
			},
			backgroundColor: '#ffffff00',
			events: {
				fullscreenOpen: function () {
					this.update({
						title: {
							style: {
								fontSize: '30px',
							},
						},
					})
				},
				fullscreenClose: function () {
					this.update({
						title: {
							style: {
								fontSize: '18px',
							},
						},
					})
				},
			},
		},
		title: {
			text: 'Gráfico Fasorial',
		},
		pane: {
			startAngle: 90,
			endAngle: 450,
		},
		xAxis: {
			tickInterval: 45,
			min: -360,
			max: 0,
			gridLineColor: '#68606096',
			labels: {
				formatter: function () {
					let label = this.axis.defaultLabelFormatter.call(this)
					label = label * -1
					return label
				},
			},
		},
		yAxis: {
			gridLineColor: '#68606096',
			min: 0,
			tickAmount: 0,
			crosshair: true,
			labels: {
				style: {
					display: 'none',
				},
			},
		},
		tooltip: {
			formatter: function () {
				let L_diff = ''
				let uni = this.series.name.startsWith('I') ? 'A' : 'V'
				let value = 0

				switch (this.series.name) {
					case 'I1':
						value = C1
						L_diff = ' a V1'
						break
					case 'I2':
						value = C2
						L_diff = ' a V2'
						break
					case 'I3':
						value = C3
						L_diff = ' a V3'
						break
					case 'V1':
						value = V1
						break
					case 'V2':
						value = V2
						break
					case 'V3':
						value = V3
						break
				}

				return (
					`${this.series.name}: ${Highcharts.numberFormat(value, 2)} ${uni}<br/>` +
					`Ángulo relativo: ${Highcharts.numberFormat(this.x * -1, 2)}°${L_diff}`
				)
			},
			backgroundColor: 'rgba(0, 0, 0, .75)',
			borderWidth: 2,
			style: {
				color: '#CCCCCC',
			},
		},
		exporting: {
			buttons: {
				contextButton: {
					theme: {
						fill: '#ffffff',
					},
				},
			},
		},
		plotOptions: {
			background: '#ffffffff',
			series: {
				dataLabels: {
					enabled: true,
				},
				shadow: true,
				marker: { symbol: 'circle' },
				events: {
					hide: function (event) {
						show_and_hide_series(event.target._i, 1)
					},
					show: function (event) {
						show_and_hide_series(event.target._i, 2)
					},
				},
			},
			column: {
				pointPadding: 0,
				groupPadding: 0,
			},
		},
		series: [
			{
				type: 'line',
				name: 'V1',
				pointStart: 0,
				pointInterval: 0,
				color: '#000',
				data: [0, V1N],
			},
			{
				type: 'line',
				name: 'V2',
				pointStart: 0,
				pointInterval: L2L1,
				color: '#f00',
				data: [0, V2N],
			},
			{
				type: 'line',
				name: 'V3',
				pointStart: L2L1,
				pointInterval: L3L2,
				color: '#a21e00',
				data: [0, V3N],
			},
			{
				type: 'line',
				name: 'I1',
				pointStart: 0,
				pointInterval: L1,
				color: '#3e3c3c',
				data: [0, C1N],
			},
			{
				type: 'line',
				name: 'I2',
				pointStart: L2L1,
				pointInterval: L2,
				color: '#ff4141',
				data: [0, C2N],
			},
			{
				type: 'line',
				name: 'I3',
				pointStart: L3L1,
				pointInterval: L3,
				color: '#953823',
				data: [0, C3N],
			},
			{
				type: 'line',
				name: '',
				pointStart: 0,
				enableMouseTracking: false,
				dataLabels: {
					enabled: false,
				},
				shadow: false,
				pointInterval: -180,
				color: '#f0f8ff00',
				data: [0, 120],
			},
		],
	}
}

export const formatterDateTableFasorial = (data) => {
	const dataTable = [
		{ description: 'Tensión L1', cod: '1.1.32.7.0.255', value: `${data.VI.V_0.value} V` },
		{ description: 'Tensión L2', cod: '1.1.52.7.0.255', value: `${data.VI.V_1.value} V` },
		{ description: 'Tensión L3', cod: '1.1.72.7.0.255', value: `${data.VI.V_2.value} V` },
		{ description: 'Corriente L1', cod: '1.1.31.7.0.255', value: `${data.VI.I_0.value} A` },
		{ description: 'Corriente L2', cod: '1.1.51.7.0.255', value: `${data.VI.I_1.value} A` },
		{ description: 'Corriente L3', cod: '1.1.71.7.0.255', value: `${data.VI.I_2.value} A` },
		{ description: 'Cos ϕ L1', cod: '1.1.33.7.0.255', value: `${data.VI.CFi_0.value}` },
		{ description: 'Cos ϕ L2', cod: '1.1.53.7.0.255', value: `${data.VI.CFi_1.value}` },
		{ description: 'Cos ϕ L3', cod: '1.1.73.7.0.255', value: `${data.VI.CFi_2.value}` },
		{ description: 'Frecuencia', cod: '1.1.14.7.0.255', value: `${data.VI.F.value} Hz` },
		{ description: 'Ángulo Corriente / Tensión L1', cod: '1.1.81.7.40.255', value: `${data.VI.A_IV_L1.value}°` },
		{ description: 'Ángulo Corriente / Tensión L2', cod: '1.1.81.7.51.255', value: `${data.VI.A_IV_L2.value}°` },
		{ description: 'Ángulo Corriente / Tensión L3', cod: '1.1.81.7.62.255', value: `${data.VI.A_IV_L3.value}°` },
		{ description: 'Ángulo Tensión L2 a L1', cod: '1.1.81.7.10.255', value: `${data.VI.A_V_L2L1.value}°` },
		{ description: 'Ángulo Tensión L3 a L2', cod: '1.1.81.7.21.255', value: `${data.VI.A_V_L3L2.value}°` },
		{ description: 'Ángulo Tensión L1 a L3', cod: '1.1.81.7.02.255', value: `${data.VI.A_V_L1L3.value}°` },
	]
	return dataTable
}
