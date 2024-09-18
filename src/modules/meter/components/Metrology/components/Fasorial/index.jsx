import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import HighchartsMore from 'highcharts/highcharts-more'
import { getFasorial } from './utils/graficoFasorial'
import TableCustom from '../../../../../../components/TableCustom'
import { dataTable } from './utils/dataTable'
import { columns } from './utils/columnsTable'

HighchartsMore(Highcharts)
function Fasorial() {
	const optionsFasorial = getFasorial()
	return (
		<div className='flex flex-col w-full justify-center items-center'>
			<div className='flex flex-col w-full max-w-full justify-center items-center sm:w-3/4 md:w-1/2'>
				<HighchartsReact highcharts={Highcharts} options={optionsFasorial} />
			</div>
			<p className='font-bold'>Relación de Transformación</p>
			<p>Corriente: 2500 / 5</p>
			<p>Tensión: 13200 / 110</p>
			<div className='mt-3 w-full'>
				<TableCustom
					data={dataTable}
					columns={columns}
					density='compact'
					header={{
						background: 'rgb(190 190 190)',
						fontSize: '18px',
						fontWeight: 'bold',
					}}
					footer={{ minHeight: '0px' }}
					card={{
						boxShadow: `1px 1px 8px 0px #00000046`,
						borderRadius: '0.25rem',
					}}
				/>
			</div>
		</div>
	)
}

export default Fasorial
