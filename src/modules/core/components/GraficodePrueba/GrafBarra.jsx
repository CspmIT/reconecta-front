import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
function GrafBarra() {
    const options = {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Grafico de Barra2'
        },
        legend: {
            enabled: false
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
            }
        ]
    }

    return <HighchartsReact highcharts={Highcharts} options={options} />
}

export default GrafBarra
