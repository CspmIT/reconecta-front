import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { getFasorial } from './graficoFasorial'
function Fasorial() {
	return <HighchartsReact highcharts={Highcharts} options={getFasorial()} />
}

export default Fasorial
