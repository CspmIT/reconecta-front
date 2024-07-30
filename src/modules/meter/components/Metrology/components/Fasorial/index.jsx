import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import HighchartsMore from 'highcharts/highcharts-more'
import { getFasorial } from './graficoFasorial'

HighchartsMore(Highcharts)
function Fasorial() {
	const optionsFasorial = getFasorial()
	return <HighchartsReact highcharts={Highcharts} options={optionsFasorial} />
}

export default Fasorial
