import React from 'react'
import { dataEnergyExp, dataEnergyImp } from './data'
import DivData from '../DivData'

function Energi() {
	return (
		<>
			<h1 className='text-xl mt-3'>Energia Importada</h1>
			<div className='w-full my-3 grid gap-3 grid-cols-3 px-4'>
				{dataEnergyImp.map((item, index) => (
					<DivData key={index} data={item} />
				))}
			</div>
			<h1 className='text-xl mt-3'>Energia Exportada</h1>
			<div className='w-full my-3 grid gap-3 grid-cols-3 px-4'>
				{dataEnergyExp.map((item, index) => (
					<DivData key={index} data={item} />
				))}
			</div>
		</>
	)
}

export default Energi
