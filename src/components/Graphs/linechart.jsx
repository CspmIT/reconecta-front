import HighchartsReact from 'highcharts-react-official'
import Highcharts from 'highcharts'
import React, { useContext } from 'react'
import { MainContext } from '../../context/MainContext'

const GrafLinea = ({ ...props }) => {
	const { darkMode } = useContext(MainContext)
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
		xAxis: {
			visible: true,
			categories: props.axisX,
			labels: {
				style: {
					color: darkMode ? 'white' : 'black',
				},
			},
		},
		yAxis: {
			title: {
				text: 'Valores',
			},
			visible: true,
			labels: {
				style: {
					color: darkMode ? 'white' : 'black',
				},
			},
		},
		series: props.seriesData.map((item) => {
			return {
				name: item.name,
				data: item.data,
			}
		}),
	}
	return (
		<div className='mb-3'>
			<HighchartsReact highcharts={Highcharts} options={options} />
		</div>
	)
}

export default GrafLinea
