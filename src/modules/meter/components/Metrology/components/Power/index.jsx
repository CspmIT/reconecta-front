import React, { useEffect, useState } from 'react'
import DivData from '../DivData'
import { MenuItem, TextField } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { request } from '../../../../../../utils/js/request'
import { backend } from '../../../../../../utils/routes/app.routes'
import Swal from 'sweetalert2'
import {
	formatDataActivaExp,
	formatDataActivaImp,
	formatDataAparenteExp,
	formatDataAparenteImp,
	formatDataReactivaCuadrante,
	formatDataReactivaExp,
	formatDataReactivaImp,
} from './utils/actions'
import LoaderComponent from '../../../../../../components/Loader'

function Power({ info }) {
	const navigate = useNavigate()
	const [activaImp, setActivaImp] = useState([])
	const [aparenteImp, setAparenteImp] = useState([])
	const [reactivaImp, setReactivaImp] = useState([])
	const [activaExp, setActivaExp] = useState([])
	const [aparenteExp, setAparenteExp] = useState([])
	const [reactivaExp, setReactivaExp] = useState([])
	const [reactivaCuadrante, setReactivaCuadrante] = useState([])
	const [unidad, setUnidad] = useState('kw')
	const [decimal, setDecimal] = useState(2)
	const [isLoading, setIsLoading] = useState(true)
	const getDataInsta = async () => {
		try {
			setIsLoading(true)
			const power = await request(
				`${backend[`${import.meta.env.VITE_APP_NAME}`]}/getMetrologyPower?serial=${info.serial}&version=${
					info.version
				}&brand=${info.brand}`,
				'GET'
			)
			setActivaImp(formatDataActivaImp(power.data, unidad, decimal))
			setAparenteImp(formatDataAparenteImp(power.data, unidad, decimal))
			setReactivaImp(formatDataReactivaImp(power.data, unidad, decimal))
			setActivaExp(formatDataActivaExp(power.data, unidad, decimal))
			setAparenteExp(formatDataAparenteExp(power.data, unidad, decimal))
			setReactivaExp(formatDataReactivaExp(power.data, unidad, decimal))
			setReactivaCuadrante(formatDataReactivaCuadrante(power.data, unidad, decimal))
			setIsLoading(false)
		} catch (error) {
			Swal.fire({
				title: 'Atención!',
				html: error,
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
	}, [info, unidad, decimal])

	return (
		<>
			{isLoading ? (
				<div className='w-full'>
					<LoaderComponent image={false} />
				</div>
			) : (
				<>
					<h1 className='text-xl'>Potencia Importada</h1>
					<div className='w-full my-3 grid gap-3 grid-cols-4 px-4'>
						{activaImp.map((item, index) => (
							<DivData key={index} data={item} />
						))}
						{aparenteImp.map((item, index) => (
							<DivData key={index} data={item} />
						))}
						{reactivaImp.map((item, index) => (
							<DivData key={index} data={item} />
						))}
					</div>
					<h1 className='text-xl'>Potencia Exportada</h1>
					<div className='w-full my-3 grid gap-4 grid-cols-4 px-4'>
						{activaExp.map((item, index) => (
							<DivData key={index} data={item} />
						))}
						{aparenteExp.map((item, index) => (
							<DivData key={index} data={item} />
						))}
						{reactivaExp.map((item, index) => (
							<DivData key={index} data={item} />
						))}
					</div>
					<h1 className='text-xl'>Potencia Reactiva por Cuadrante</h1>
					<div className='w-full my-3 grid gap-3 grid-cols-4 px-4'>
						{reactivaCuadrante.map((item, index) => (
							<DivData key={index} data={item} />
						))}
					</div>
				</>
			)}
			<div className='w-2/3 my-3 grid gap-3 grid-cols-2 px-4'>
				<div className='w-full flex flex-col justify-center items-center'>
					<p className='text-lg'>Unidad de medida</p>
					<TextField
						select
						label='Unidad'
						name='selectUser'
						onChange={(e) => setUnidad(e.target.value)}
						className='w-full'
						defaultValue={'kw'}
					>
						<MenuItem value='kw'>Kilo</MenuItem>
						<MenuItem value='MW'>Mega</MenuItem>
					</TextField>
				</div>
				<div className='w-full flex flex-col justify-center items-center'>
					<p className='text-lg'>Cantidad de decimales</p>
					<TextField
						select
						label='Unidad'
						name='selectUser'
						onChange={(e) => setDecimal(e.target.value)}
						className='w-full'
						defaultValue={2}
					>
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
