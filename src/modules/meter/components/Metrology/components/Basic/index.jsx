import React, { useEffect, useState } from 'react'
import DivData from '../DivData'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'
import {
	DataInsta,
	formatDataCorriente,
	formatDataCosenoFi,
	formatDataDemanda,
	formatDataTension,
} from './utils/actions'
import LoaderComponent from '../../../../../../components/Loader'

function Basic({ info }) {
	const navigate = useNavigate()
	const [tensionInfo, setTensionInfo] = useState([])
	const [corrienteInfo, setCorrienteInfo] = useState([])
	const [cosenoInfo, setCosenoInfo] = useState([])
	const [demandaInfo, setDemandaInfo] = useState([])
	const [isLoading, setIsLoading] = useState(true)
	const getDataInsta = async () => {
		try {
			const meter = await DataInsta(info)
			setTensionInfo(formatDataTension(meter))
			setCorrienteInfo(formatDataCorriente(meter))
			setCosenoInfo(formatDataCosenoFi(meter))
			setDemandaInfo(formatDataDemanda(meter))
		} catch (error) {
			Swal.fire({
				title: 'Atención!',
				html: error.message,
				icon: 'error',
			})
		} finally {
			setIsLoading(false)
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

	return (
		<>
			{isLoading ? (
				<LoaderComponent image={false} />
			) : (
				<>
					<div className='w-full my-3 grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 px-4'>
						{tensionInfo.map((item, index) => (
							<DivData key={index} data={item} />
						))}
						{corrienteInfo.map((item, index) => (
							<DivData key={index} data={item} />
						))}
						{cosenoInfo.map((item, index) => (
							<DivData key={index} data={item} />
						))}
					</div>
					<div className='w-full flex flex-col justify-center items-center'>
						<hr className='w-full mb-3' />
						<h1 className='text-xl'>Registro de demanda</h1>
						<div className='w-2/3 my-3 grid gap-3 grid-cols-2 px-4'>
							{demandaInfo.map((item, index) => (
								<DivData key={index} data={item} />
							))}
						</div>
					</div>
				</>
			)}
		</>
	)
}

export default Basic
