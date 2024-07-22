import HighchartsReact from 'highcharts-react-official'
import Highcharts from 'highcharts'
import React, { useContext } from 'react'
import { MainContext } from '../../../../../context/MainContext'

const Linegraph = ({ ...props }) => {
	const { darkMode } = useContext(MainContext)
	const options = {
		title: {
			text: 'Historial',
			style: {
				color: !darkMode ? 'white' : 'black',
			},
		},
		legend: {
			enabled: true,
			align: 'center',
			verticalAlign: 'top',
			itemStyle: {
				color: !darkMode ? 'white' : 'black',
			},
		},
		chart: {
			backgroundColor: !darkMode ? '#373638' : 'white',
		},
		xAxis: {
			visible: true,
			labels: {
				style: {
					color: !darkMode ? 'white' : 'black',
				},
			},
		},
		yAxis: {
			visible: true,
			labels: {
				style: {
					color: !darkMode ? 'white' : 'black',
				},
			},
		},
		series: [
			{
				name: ' Developers',
				data: [43934, 48656, 65165, 81827, 112143, 142383, 171533, 165174, 155157, 161454, 154610],
			},
			{
				name: 'Manufacturing',
				data: [154610, 37941, 29742, 29851, 32490, 30282, 38121, 36885, 33726, 34243, 31050],
			},
			{
				name: 'Sales & Distribution',
				data: [11744, 30000, 16005, 19771, 20185, 24377, 32147, 30912, 29243, 29213, 25663],
			},
			{
				name: 'Operations & Maintenance',
				data: [11744, 30000, 16005, 154610, 20185, 24377, 154610, 13053, 11164, 11218, 10077],
			},
			{
				name: 'Other',
				data: [21908, 5548, 8105, 11248, 154610, 11816, 18274, 17300, 13053, 11906, 10073],
			},
		],
	}
	return (
		<div>
			<HighchartsReact highcharts={Highcharts} options={options} />
		</div>
	)
}

export default Linegraph
