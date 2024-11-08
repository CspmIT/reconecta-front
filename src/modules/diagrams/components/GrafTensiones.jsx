import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import HighchartsAccessibility from 'highcharts/modules/accessibility'
HighchartsAccessibility(Highcharts)
import { useContext, useEffect } from 'react'
import { MainContext } from '../../../context/MainContext'
function GrafTensiones({ data, title }) {
	const { darkMode } = useContext(MainContext)
	const categories = data.map((point) => new Date(point.date).toLocaleString())
	const seriesData = data.map((point) => point.value)
	const options = {
		chart: {
			type: 'line',
			backgroundColor: null,
		},

		title: {
			text: title,
			style: {
				color: darkMode ? 'white' : 'black',
			},
		},
		legend: {
			enabled: false,
		},
		xAxis: {
			categories,
			title: {
				style: {
					color: darkMode ? 'white' : 'black',
				},
			},
			lineColor: darkMode ? 'white' : 'black',
			tickColor: darkMode ? 'white' : 'black',
			labels: {
				style: {
					color: darkMode ? 'white' : 'black',
				},
			},
		},
		yAxis: {
			title: {
				text: 'MVA',
				style: {
					color: darkMode ? 'white' : 'black',
				},
			},
			lineColor: darkMode ? 'white' : 'black',
			tickColor: darkMode ? 'white' : 'black',
			labels: {
				style: {
					color: darkMode ? 'white' : 'black',
				},
			},
		},
		series: [
			{
				data: seriesData,
			},
		],
	}
	useEffect(() => {
		const chartElements = document.querySelectorAll('[data-highcharts-chart]')
		chartElements.forEach((chartElement) => {
			chartElement.style.width = '100%'
		})
	}, [])
	return <HighchartsReact highcharts={Highcharts} options={options} />
}

export default GrafTensiones
