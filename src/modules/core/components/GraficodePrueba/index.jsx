import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

const GraficodePrueba = () => {
    const options = {
        title: {
            text: 'My chart'
        },
        series: [
            {
                data: [3, 2, 3, 5, 10, 8, 9, 3, 5]
            }
        ]
    }
    return <HighchartsReact highcharts={Highcharts} options={options} />
}
export default GraficodePrueba
