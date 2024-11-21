import React, { useEffect, useState } from 'react'
import DivData from '../DivData'
import { useNavigate } from 'react-router-dom'
import LoaderComponent from '../../../../../../components/Loader'
import { request } from '../../../../../../utils/js/request'
import { backend } from '../../../../../../utils/routes/app.routes'
import Swal from 'sweetalert2'
import { formatDataEnergyExp, formatDataEnergyImp } from './utils/actions'

function Energi({ info }) {
	const navigate = useNavigate()
	const [energyImp, setEnergyImp] = useState([])
	const [energyExp, setEnergyExp] = useState([])

	const [isLoading, setIsLoading] = useState(true)
	const getDataInsta = async () => {
		try {
			setIsLoading(true)
			const energy = await request(
				`${backend[`${import.meta.env.VITE_APP_NAME}`]}/getMetrologyEnergy?serial=${info.serial}&version=${
					info.version
				}&brand=${info.brand}`,
				'GET'
			)
			setEnergyImp(formatDataEnergyImp(energy.data))
			setEnergyExp(formatDataEnergyExp(energy.data))

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
	}, [info])
	return (
		<>
			{isLoading ? (
				<LoaderComponent image={false} />
			) : (
				<>
					<h1 className='text-xl mt-3'>Energia Importada</h1>
					<div className='w-full my-3 grid gap-3 grid-cols-3 px-4'>
						{energyImp.map((item, index) => (
							<DivData key={index} data={item} />
						))}
					</div>
					<h1 className='text-xl mt-3'>Energia Exportada</h1>
					<div className='w-full my-3 grid gap-3 grid-cols-3 px-4'>
						{energyExp.map((item, index) => (
							<DivData key={index} data={item} />
						))}
					</div>
				</>
			)}
		</>
	)
}

export default Energi
