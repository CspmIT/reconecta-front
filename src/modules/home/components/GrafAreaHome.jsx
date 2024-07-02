import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { useContext } from 'react'
import { MainContext } from '../../../context/MainContext'
function GrafAreaHome({ data, numVal, title, colorStatus, alert }) {
	const { darkMode } = useContext(MainContext)

	const options = {
		chart: {
			type: 'area',
			backgroundColor: null,
		},
		title: {
			text: title,
			style: {
				color: darkMode ? 'white' : 'black',
			},
		},
		subtitle: {
			text: `<span style='font-size: 20px; color: ${darkMode ? 'white' : 'black'};'>${numVal || ''}<span>`,
			floating: true,
			align: 'center',
			verticalAlign: 'middle',
		},
		legend: {
			enabled: false,
		},

		plotOptions: {
			area: {
				fillOpacity: 0.1,
				color: colorStatus || '',
				marker: {
					radius: 2,
				},
			},
			series: {
				marker: {
					radius: 3,
				},
			},
		},
		xAxis: {
			visible: false,
		},
		yAxis: {
			visible: false,
		},
		series: [
			{
				data,
			},
		],
	}

	return <HighchartsReact highcharts={Highcharts} options={options} />
}

export default GrafAreaHome
