import GrafLinea from '../../../../../../components/Graphs/linechart'
import {
	dataGrafCorriente,
	dataGrafCosenoFi,
	dataGrafPotenciaActiva,
	dataGrafPotenciaAparente,
	dataGrafPotenciaReactiva,
	dataGrafTension,
} from './utils/dataTensiones'

function Grafic() {
	const tensiones = [
		{
			name: 'Linea 1',
			data: dataGrafTension.Linea1,
		},
		{
			name: 'Linea 3',
			data: dataGrafTension.Linea3,
		},
		{
			name: 'Linea 4',
			data: dataGrafTension.Linea5,
		},
	]
	const corrientes = [
		{
			name: 'Linea 1',
			data: dataGrafCorriente.Linea1,
		},
		{
			name: 'Linea 3',
			data: dataGrafCorriente.Linea3,
		},
		{
			name: 'Linea 4',
			data: dataGrafCorriente.Linea5,
		},
	]
	const potenciaActiva = [
		{
			name: 'Linea 1',
			data: dataGrafPotenciaActiva.Linea1,
		},
		{
			name: 'Linea 3',
			data: dataGrafPotenciaActiva.Linea3,
		},
		{
			name: 'Linea 4',
			data: dataGrafPotenciaActiva.Linea5,
		},
	]
	const potenciaAparente = [
		{
			name: 'Linea 1',
			data: dataGrafPotenciaAparente.Linea1,
		},
		{
			name: 'Linea 3',
			data: dataGrafPotenciaAparente.Linea3,
		},
		{
			name: 'Linea 4',
			data: dataGrafPotenciaAparente.Linea5,
		},
	]
	const potenciaReactivas = [
		{
			name: 'Linea 1',
			data: dataGrafPotenciaReactiva.Linea1,
		},
		{
			name: 'Linea 3',
			data: dataGrafPotenciaReactiva.Linea3,
		},
		{
			name: 'Linea 4',
			data: dataGrafPotenciaReactiva.Linea5,
		},
	]
	const CosenoFi = [
		{
			name: 'Linea 1',
			data: dataGrafCosenoFi.Linea1,
		},
		{
			name: 'Linea 3',
			data: dataGrafCosenoFi.Linea3,
		},
		{
			name: 'Linea 4',
			data: dataGrafCosenoFi.Linea5,
		},
	]
	return (
		<>
			<div className='w-full'>
				<GrafLinea key={1} title='Tensiones (V)' seriesData={tensiones} axisX={dataGrafTension.DatePeriod} />
			</div>
			<div className='w-full my-3'>
				<hr />
			</div>
			<div className='w-full'>
				<GrafLinea
					key={2}
					title='Corrientes (A)'
					seriesData={corrientes}
					axisX={dataGrafCorriente.DatePeriod}
				/>
			</div>
			<div className='w-full my-3'>
				<hr />
			</div>
			<div className='w-full'>
				<GrafLinea
					key={3}
					title='Potencias Activas (kW)'
					seriesData={potenciaActiva}
					axisX={dataGrafPotenciaActiva.DatePeriod}
				/>
			</div>
			<div className='w-full my-3'>
				<hr />
			</div>
			<div className='w-full'>
				<GrafLinea
					key={4}
					title='Potencias Aparentes (kVA)'
					seriesData={potenciaAparente}
					axisX={dataGrafPotenciaAparente.DatePeriod}
				/>
			</div>
			<div className='w-full my-3'>
				<hr />
			</div>
			<div className='w-full'>
				<GrafLinea
					key={5}
					title='Potencias Reactivas (kVAr)'
					seriesData={potenciaReactivas}
					axisX={dataGrafPotenciaReactiva.DatePeriod}
				/>
			</div>
			<div className='w-full my-3'>
				<hr />
			</div>
			<div className='w-full'>
				<GrafLinea
					key={6}
					title='Coseno Fi'
					seriesData={CosenoFi}
					axisX={dataGrafCosenoFi.DatePeriod}
					configyAxis={{
						min: 0.75,
						max: 1,
						tickInterval: 0.035,
					}}
				/>
			</div>
		</>
	)
}

export default Grafic
