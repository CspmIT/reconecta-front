import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { useEffect } from 'react'

function GrafTensiones() {
	const options = {
		chart: {
			type: 'line',
		},
		title: {
			text: 'Grafico de Barra2',
		},
		legend: {
			enabled: false,
		},
		xAxis: {
			visible: true,
		},
		yAxis: {
			visible: true,
		},
		series: [
			{
				data: [3, 2, 3, 5, 10, 8, 9, 3, 5],
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
