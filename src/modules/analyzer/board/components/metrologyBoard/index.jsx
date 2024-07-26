import React from 'react'
import RowsValues from './rowsValues'

const MetrologyBoard = () => {
	return (
		<div className='w-full flex flex-row flex-wrap justify-center'>
			<div className='w-full flex flex-row mb-5'>
				<div className='w-2/6'></div>
				<RowsValues valueR='Fase R' valueS='Fase S' valueT='Fase T' valueTotal='Totales' />
			</div>
			<div className='w-2/6'>
				<h1>Tensión</h1>
			</div>
			<RowsValues valueR='Fase R' valueS='Fase S' valueT='Fase T' valueTotal='Totales' />
			<div className='w-2/6'>
				<h1>Corriente</h1>
			</div>
			<RowsValues valueR='Fase R' valueS='Fase S' valueT='Fase T' valueTotal='Totales' />
			<div className='w-2/6'>
				<h1>Cos Ø</h1>
			</div>
			<RowsValues valueR='Fase R' valueS='Fase S' valueT='Fase T' valueTotal='Totales' />
		</div>
	)
}

export default MetrologyBoard
