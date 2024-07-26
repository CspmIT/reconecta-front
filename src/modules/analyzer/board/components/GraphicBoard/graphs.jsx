import React from 'react'
import GrafLinea from '../../../../../components/Graphs/linechart'
import { graphicData } from '../../utils/objects'

const Graphs = () => {
	const tensiones = [
		{
			name: 'Fase R',
			data: graphicData.tension.r,
		},
		{
			name: 'Fase S',
			data: graphicData.tension.s,
		},
		{
			name: 'Fase T',
			data: graphicData.tension.t,
		},
	]
	return (
		<div className='w-full'>
			<GrafLinea title='Tensiones (V)' seriesData={tensiones} axisX={graphicData.tension.time} />
			<GrafLinea title='Corrientes (A)' seriesData={tensiones} />
			<GrafLinea title='Potencias Activas (kW)' seriesData={tensiones} />
			<GrafLinea title='Potencias Aparentes (kVA)' seriesData={tensiones} />
			<GrafLinea title='Potencias Reactivas (kVAr)' seriesData={tensiones} />
			<GrafLinea title='Coseno Fi' seriesData={tensiones} />
		</div>
	)
}

export default Graphs
