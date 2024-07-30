import React from 'react'
import DivData from '../DivData'
import {
	dataActivaExp,
	dataActivaImp,
	dataAparenteExp,
	dataAparenteImp,
	dataReactivaCuadrante,
	dataReactivaExp,
	dataReactivaImp,
} from './data'
import { MenuItem, TextField } from '@mui/material'

function Power() {
	return (
		<>
			<h1 className='text-xl'>Potencia Importada</h1>
			<div className='w-full my-3 grid gap-3 grid-cols-4 px-4'>
				{dataActivaImp.map((item, index) => (
					<DivData key={index} data={item} />
				))}
				{dataAparenteImp.map((item, index) => (
					<DivData key={index} data={item} />
				))}
				{dataReactivaImp.map((item, index) => (
					<DivData key={index} data={item} />
				))}
			</div>
			<h1 className='text-xl'>Potencia Exportada</h1>
			<div className='w-full my-3 grid gap-4 grid-cols-4 px-4'>
				{dataActivaExp.map((item, index) => (
					<DivData key={index} data={item} />
				))}
				{dataAparenteExp.map((item, index) => (
					<DivData key={index} data={item} />
				))}
				{dataReactivaExp.map((item, index) => (
					<DivData key={index} data={item} />
				))}
			</div>
			<h1 className='text-xl'>Potencia Reactiva por Cuadrante</h1>
			<div className='w-full my-3 grid gap-3 grid-cols-4 px-4'>
				{dataReactivaCuadrante.map((item, index) => (
					<DivData key={index} data={item} />
				))}
			</div>
			<div className='w-2/3 my-3 grid gap-3 grid-cols-2 px-4'>
				<div className='w-full flex flex-col justify-center items-center'>
					<p className='text-lg'>Unidad de medida</p>
					<TextField select label='Unidad' name='selectUser' className='w-full' defaultValue={'K'}>
						<MenuItem value='K'>Kilo</MenuItem>
						<MenuItem value='M'>Mega</MenuItem>
					</TextField>
				</div>
				<div className='w-full flex flex-col justify-center items-center'>
					<p className='text-lg'>Cantidad de decimales</p>
					<TextField select label='Unidad' name='selectUser' className='w-full' defaultValue={2}>
						<MenuItem value={0}>Sin Decimales</MenuItem>
						<MenuItem value={1}>1</MenuItem>
						<MenuItem value={2}>2</MenuItem>
						<MenuItem value={3}>3</MenuItem>
						<MenuItem value={4}>4</MenuItem>
						<MenuItem value={5}>5</MenuItem>
					</TextField>
				</div>
			</div>
		</>
	)
}

export default Power
