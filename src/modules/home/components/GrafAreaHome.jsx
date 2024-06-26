import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
function GrafAreaHome({ data, numVal, title, colorStatus }) {
	const options = {
		chart: {
			type: 'area',
		},
		title: {
			text: title,
		},
		subtitle: {
			text: `<span style='font-size: 20px; color: black;'>${numVal || ''}<span>`,
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
