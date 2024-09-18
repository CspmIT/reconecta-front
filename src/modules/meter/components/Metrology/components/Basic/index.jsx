import React from 'react'
import DivData from '../DivData'

function Basic() {
	const dataTension = [
		{
			title: 'Tensión L1',
			ip: '1.1.32.7.0.255',
			value: '230.9',
			uni: 'V',
			infoAdic: {
				month: {
					value: '246.9',
					uni: 'V',
				},
				maxHistory: {
					value: '262.1',
					uni: 'V',
				},
			},
		},
		{
			title: 'Tensión L2',
			ip: '1.1.52.7.0.255',
			value: '231.2',
			uni: 'V',
			infoAdic: {
				month: {
					value: '247.1',
					uni: 'V',
				},
				maxHistory: {
					value: '263.4',
					uni: 'V',
				},
			},
		},
		{
			title: 'Tensión L3',
			ip: '1.1.72.7.0.255',
			value: '231.7',
			uni: 'V',
			infoAdic: {
				month: {
					value: '246.7',
					uni: 'V',
				},
				maxHistory: {
					value: '262.2',
					uni: 'V',
				},
			},
		},
		{
			title: 'Tensión N',
			ip: '1.1.92.7.0.255',
			value: '2.8',
			uni: 'V',
		},
	]
	const dataCorriente = [
		{
			title: 'Corriente L1',
			ip: '1.1.31.7.0.255',
			value: '128',
			uni: 'A',
			infoAdic: {
				month: {
					value: '482',
					uni: 'A',
				},
				maxHistory: {
					value: '742',
					uni: 'A',
				},
			},
		},
		{
			title: 'Corriente L2',
			ip: '1.1.51.7.0.255',
			value: '118',
			uni: 'A',
			infoAdic: {
				month: {
					value: '376',
					uni: 'A',
				},
				maxHistory: {
					value: '694',
					uni: 'A',
				},
			},
		},
		{
			title: 'Corriente L3',
			ip: '1.1.71.7.0.255',
			value: '152',
			uni: 'A',
			infoAdic: {
				month: {
					value: '424',
					uni: 'A',
				},
				maxHistory: {
					value: '740',
					uni: 'A',
				},
			},
		},
		{
			title: 'Corriente N',
			ip: '1.1.91.7.0.255',
			value: '58',
			uni: 'A',
		},
	]
	const dataCoseno = [
		{
			title: 'Cos ϕ L1',
			ip: '1.1.33.7.0.255',
			value: '0.99',
			uni: '',
		},
		{
			title: 'Cos ϕ L2',
			ip: '1.1.53.7.0.255',
			value: '0.98',
			uni: '',
		},
		{
			title: 'Cos ϕ L3',
			ip: '1.1.73.7.0.255',
			value: '1',
			uni: '',
		},
		{
			title: 'Cos ϕ Total',
			ip: '1.1.13.7.0.255',
			value: '0.99',
			uni: '',
		},
	]
	const dataDemanda = [
		{
			title: 'Actual',
			ip: '1.1.1.4.0.255',
			value: '95',
			uni: 'kW',
		},
		{
			title: 'Último promedio',
			ip: '1.1.1.5.0.255',
			value: '93',
			uni: 'kW',
		},
	]
	return (
		<>
			<div className='w-full my-3 grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 px-4'>
				{dataTension.map((item, index) => (
					<DivData key={index} data={item} />
				))}
				{dataCorriente.map((item, index) => (
					<DivData key={index} data={item} />
				))}
				{dataCoseno.map((item, index) => (
					<DivData key={index} data={item} />
				))}
			</div>
			<div className='w-full flex flex-col justify-center items-center'>
				<hr className='w-full mb-3' />
				<h1 className='text-xl'>Registro de demanda</h1>
				<div className='w-2/3 my-3 grid gap-3 grid-cols-2 px-4'>
					{dataDemanda.map((item, index) => (
						<DivData key={index} data={item} />
					))}
				</div>
			</div>
		</>
	)
}

export default Basic
