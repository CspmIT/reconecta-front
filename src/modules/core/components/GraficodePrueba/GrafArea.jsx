import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
function GrafArea() {
    const options = {
        chart: {
            type: 'area'
        },
        title: {
            text: 'Grafico de area'
        },
        legend: {
            enabled: false
        },

        plotOptions: {
            series: {
                marker: {
                    radius: 1
                }
            }
        },
        xAxis: {
            visible: false
        },
        yAxis: {
            visible: false
        },
        series: [
            {
                data: [3, 2, 3, 5, 10, 8, 9, 3, 5]
            },
            {
                data: [8, 9, 3, 5, 3, 2, 3, 5, 10]
            }
        ]
    }

    return <HighchartsReact highcharts={Highcharts} options={options} />
}

export default GrafArea
