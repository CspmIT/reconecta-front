import React from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import HighchartsMore from 'highcharts/highcharts-more'
import SolidGauge from 'highcharts/modules/solid-gauge'

// Inicializar HighchartsMore y SolidGauge
HighchartsMore(Highcharts)
SolidGauge(Highcharts)

const Gauges = () => {
    const options = {
        chart: {
            type: 'solidgauge'
        },
        title: {
            text: 'Gráfico de tipo Gauge'
        },
        pane: {
            startAngle: -90,
            endAngle: 90,
            background: {
                backgroundColor: '#EEE',
                innerRadius: '60%',
                outerRadius: '100%',
                shape: 'arc'
            }
        },
        yAxis: {
            min: 0,
            max: 100,
            title: {
                text: '%'
            }
        },
        series: [
            {
                name: '%',
                data: [60],
                dataLabels: {
                    format: '<div style="text-align:center"><span style="font-size:25px">{y}</span><br/><span style="font-size:12px;opacity:0.4">%</span></div>'
                }
            }
        ]
    }

    return <HighchartsReact highcharts={Highcharts} options={options} />
}

export default Gauges
