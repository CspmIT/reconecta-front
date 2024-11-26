import HighchartsReact from 'highcharts-react-official'
import Highcharts from 'highcharts'
import React, { useContext } from 'react'
import { MainContext } from '../../context/MainContext'
import Exporting from 'highcharts/modules/exporting'
import OfflineExporting from 'highcharts/modules/offline-exporting'

Exporting(Highcharts)
OfflineExporting(Highcharts)
const GrafLinea = ({ ...props }) => {
	const { darkMode } = useContext(MainContext)
	let ticksGraf = new Array()
	ticksGraf.push(0.75)
	let valorBase = 0.715
	for (let i = 0; i <= 10; i++) {
		ticksGraf.push(valorBase + 0.035)
		valorBase = valorBase + 0.035
	}
	const colorDefault = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00']
	const options = {
		chart: {
			backgroundColor: darkMode ? '#373638' : 'white',
		},
		title: {
			text: props.title || 'Grafico de Linea',
			style: {
				color: darkMode ? 'white' : 'black',
			},
		},
		legend: {
			enabled: true,
			align: 'center',
			verticalAlign: 'top',
			itemStyle: {
				color: darkMode ? 'white' : 'black',
			},
		},
		tooltip: {
			shared: true,
			formatter: function () {
				let s = `<b>${this.x}</b><br/>`
				this.points.forEach((point) => {
					s += `<span style="color:${point.color}">\u25CF</span> ${point.series.name}: <b>${point.y}</b><br/>`
				})
				return s
			},
		},
		xAxis: {
			visible: true,
			categories: props.axisX,
			labels: {
				style: {
					color: darkMode ? 'white' : 'black',
				},
				...props.labelxAxis,
			},
			...props.configxAxis,
		},

		yAxis: {
			title: {
				text: '',
			},
			visible: true,
			labels: {
				style: {
					color: darkMode ? 'white' : 'black',
				},
			},
			...props.configyAxis,
		},
		series: props.seriesData.map((item, index) => {
			return {
				name: item.name,
				data: item.data,
				color: props.colors?.[index] || colorDefault[index],
				marker: {
					...props.configMarks,
				},
			}
		}),
		...props.tooltip,
		exporting: { enabled: props.exporting || false },
	}

	return (
		<div className='mb-3'>
			<HighchartsReact highcharts={Highcharts} options={options} />
		</div>
	)
}

export default GrafLinea
