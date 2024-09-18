import Highcharts from 'highcharts'
import { dataInflux } from './dataInflux'
export const getFasorial = () => {
	let L1 = 0,
		L2 = 0,
		L3 = 0,
		L2L1 = 0,
		L3L2 = 0,
		L3L1 = 0
	let V1 = 0,
		V2 = 0,
		V3 = 0
	let C1 = 0,
		C2 = 0,
		C3 = 0
	let CT_0 = '',
		CT_1 = '',
		VT_0 = '',
		VT_1 = ''
	let L3L1T = 0,
		L3L2T = 0,
		L2L1T = 0
	let Cfi_0 = 0,
		Cfi_1 = 0,
		Cfi_2 = 0
	let F = 0
	let C1N = 0,
		C2N = 0,
		C3N = 0,
		V1N = 0,
		V2N = 0,
		V3N = 0
	dataInflux[1].forEach((item) => {
		let cantidad = item.records.length
		cantidad = cantidad - 1
		if (item.records[cantidad].values._field == 'CT_0') {
			CT_0 = item.records[cantidad].values._value
		}
		if (item.records[cantidad].values._field == 'CT_1') {
			CT_1 = item.records[cantidad].values._value
		}
		if (item.records[cantidad].values._field == 'VT_0') {
			VT_0 = item.records[cantidad].values._value
		}
		if (item.records[cantidad].values._field == 'VT_1') {
			VT_1 = item.records[cantidad].values._value
		}
		if (item.records[cantidad].values._field == 'A_IV_L1') {
			L1 = item.records[cantidad].values._value
			L1 = L1 * -1
			if (L1 > 0) {
				L1 = (360 - L1) * -1
			}
		}
		if (item.records[cantidad].values._field == 'A_IV_L2') {
			L2 = item.records[cantidad].values._value
			L2 = L2 * -1
		}
		if (item.records[cantidad].values._field == 'A_IV_L3') {
			L3 = item.records[cantidad].values._value
			L3 = L3 * -1
		}
		if (item.records[cantidad].values._field == 'A_V_L2L1') {
			L2L1 = item.records[cantidad].values._value
			L2L1T = item.records[cantidad].values._value
			if (L2L1T < 0) {
				L2L1T = L2L1T * -1
			}
			if (L2L1 > 0) {
				L2L1 = L2L1 * -1
			}
		}
		if (item.records[cantidad].values._field == 'A_V_L3L2') {
			L3L2 = item.records[cantidad].values._value
			L3L2T = item.records[cantidad].values._value
			if (L3L2T < 0) {
				L3L2T = L3L2T * -1
			}
			if (L3L2 > 0) {
				L3L2 = L3L2 * -1
			}
		}
		if (item.records[cantidad].values._field == 'A_V_L1L3') {
			L3L1 = item.records[cantidad].values._value
			L3L1T = item.records[cantidad].values._value
			if (L3L1T < 0) {
				L3L1T = L3L1T * -1
			}
			if (L3L1 > 0) {
				L3L1 = L3L1 * -1
			}
		}
	})

	dataInflux[0].forEach((item) => {
		let cantidad = item.records.length
		let valor = ''
		cantidad = cantidad - 1
		if (
			item.records[cantidad].values._field == 'V_0' ||
			item.records[cantidad].values._field == 'V_1' ||
			item.records[cantidad].values._field == 'V_2' ||
			item.records[cantidad].values._field == 'V_3'
		) {
			valor = (item.records[cantidad].values._value * VT_0) / VT_1
			valor = Math.round((valor + Number.EPSILON) * 100) / 100
			if (item.records[cantidad].values._field == 'V_0') {
				V1 = valor
			} else if (item.records[cantidad].values._field == 'V_1') {
				V2 = valor
			} else if (item.records[cantidad].values._field == 'V_2') {
				V3 = valor
			}
		} else if (
			item.records[cantidad].values._field == 'I_0' ||
			item.records[cantidad].values._field == 'I_1' ||
			item.records[cantidad].values._field == 'I_2' ||
			item.records[cantidad].values._field == 'I_3'
		) {
			valor = (item.records[cantidad].values._value * CT_0) / CT_1
			valor = Math.round((valor + Number.EPSILON) * 100) / 100
			if (item.records[cantidad].values._field == 'I_0') {
				C1 = valor
			} else if (item.records[cantidad].values._field == 'I_1') {
				C2 = valor
			} else if (item.records[cantidad].values._field == 'I_2') {
				C3 = valor
			}
		}
		if (item.records[cantidad].values._field == 'CFi_0') {
			Cfi_0 = item.records[cantidad].values._value
		} else if (item.records[cantidad].values._field == 'CFi_1') {
			Cfi_1 = item.records[cantidad].values._value
		} else if (item.records[cantidad].values._field == 'CFi_2') {
			Cfi_2 = item.records[cantidad].values._value
		} else if (item.records[cantidad].values._field == 'F') {
			F = item.records[cantidad].values._value
		}
	})
	L3L1 = L2L1 + L3L2
	let valor_max_V = Math.max(V1, V2, V3)
	let valor_max_C = Math.max(C1, C2, C3)
	C1N = (C1 / valor_max_C) * 70
	C2N = (C2 / valor_max_C) * 70
	C3N = (C3 / valor_max_C) * 70
	V1N = (V1 / valor_max_V) * 100
	V2N = (V2 / valor_max_V) * 100
	V3N = (V3 / valor_max_V) * 100

	const converters = {
		fa: function (number, puntos) {
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
				let heading = this.series.pointInterval
				let L_diff = ''
				let uni = 'V'
				let value = Highcharts.numberFormat(this.y, 0)
				heading = heading * -1
				if (this.series.name == 'I1') {
					if (heading > 90) {
						heading = (360 - heading).toFixed(2) * -1
					}
					L_diff = ' a V1'
					uni = 'A'
					value = C1
				}
				if (this.series.name == 'I2') {
					L_diff = ' a V2'
					uni = 'A'
					value = C2
				}
				if (this.series.name == 'I3') {
					L_diff = ' a V3'
					uni = 'A'
					value = C3
				}
				if (this.series.name == 'V1') {
					value = V1
				}
				if (this.series.name == 'V2') {
					value = V2
				}
				if (this.series.name == 'V3') {
					value = V3
				}

				return heading + '°' + L_diff + '<br/><b>' + this.series.name + ': ' + value + ' ' + uni + '</b>'
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
