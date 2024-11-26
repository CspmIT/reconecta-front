import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import HighchartsMore from 'highcharts/highcharts-more'
import TableCustom from '../../../../../../components/TableCustom'
import { columns } from './utils/columnsTable'
import Swal from 'sweetalert2'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { request } from '../../../../../../utils/js/request'
import { backend } from '../../../../../../utils/routes/app.routes'
import { formatterDateTableFasorial, getFasorial2 } from './utils/actions'
import LoaderComponent from '../../../../../../components/Loader'

HighchartsMore(Highcharts)
function Fasorial({ info }) {
	const navigate = useNavigate()
	const [isLoading, setIsLoading] = useState(true)
	const [optionsFasorial, setOptionsFasorial] = useState([])
	const [dataTable, setdataTable] = useState([])
	const getDataInsta = async () => {
		try {
			setIsLoading(true)
			const meter = await request(
				`${backend[`${import.meta.env.VITE_APP_NAME}`]}/getMetrologyVI?serial=${info.serial}&version=${
					info.version
				}&brand=${info.brand}`,
				'GET'
			)

			const opciones = await getFasorial2(meter.data)
			setOptionsFasorial(opciones)
			setdataTable(formatterDateTableFasorial(meter.data))
			setIsLoading(false)
		} catch (error) {
			console.error(error)
			Swal.fire({
				title: 'Atención!',
				html: `Hubo un problema con la carga de los datos del Medidor.</br>Intente nuevamente...`,
				icon: 'error',
			})
			navigate('/Home')
		}
	}

	useEffect(() => {
		if (!info) {
			Swal.fire({
				title: 'Atención!',
				html: `Hubo un problema con la carga de los datos del Medidor.</br>Intente nuevamente...`,
				icon: 'error',
			})
			navigate('/Home')
		} else {
			getDataInsta()
		}
	}, [info])

	if (isLoading) return <LoaderComponent image={false} />
	return (
		<div className='flex flex-col w-full justify-center items-center'>
			<div className='flex flex-col w-full max-w-full justify-center items-center sm:w-3/4 md:w-1/2'>
				<HighchartsReact highcharts={Highcharts} options={optionsFasorial} />
			</div>
			<p className='font-bold'>Relación de Transformación</p>
			<p>Corriente: 2500 / 5</p>
			<p>Tensión: 13200 / 110</p>
			<div className='mt-3 '>
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
