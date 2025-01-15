import { IconButton, Modal } from '@mui/material'
import TabsMeter from '../tabsMeter'
import { FaArrowRightArrowLeft } from 'react-icons/fa6'
import { ImCross } from 'react-icons/im'
import { useEffect, useState } from 'react'
import ModelInvoice from './components/ModelInvoice'
import TarifaEnergi from './components/TarifaEnergi'
import EnergiTotal from './components/EnergiTotal'
import { request } from '../../../../utils/js/request'
import { backend } from '../../../../utils/routes/app.routes'
import Swal from 'sweetalert2'
import LoaderComponent from '../../../../components/Loader'
function HistoryMeter({ info }) {
	const [open, setOpen] = useState(false)
	const handleOpen = () => setOpen(true)
	const handleClose = () => setOpen(false)
	const tabs = [
		{
			id: 1,
			title: 'Modelo de Factura',
			component: <ModelInvoice info={info} />,
		},
		{
			id: 2,
			title: 'Tarífas de Enegía',
			component: <TarifaEnergi info={info} />,
		},
		{
			id: 3,
			title: 'Índice de Energía Total',
			component: <EnergiTotal info={info} />,
		},
	]
	const [isLoading, setIsLoading] = useState(true)
	const [dataRestart, setDataRestart] = useState({})
	const [dataSummary, setDataSummary] = useState({})
	const getInfoRestart = async (dateStart = null, dateFinished = null) => {
		try {
			setIsLoading(true)
			const dataRestart = await request(
				`${backend[`${import.meta.env.VITE_APP_NAME}`]}/getHistoryReset`,
				'POST',
				{
					serial: info.serial,
					version: info.version,
					brand: info.brand,
					dateStart,
					dateFinished,
				}
			)
			setDataRestart(dataRestart.data)
			const dataSummary = await request(
				`${backend[`${import.meta.env.VITE_APP_NAME}`]}/getHistorySummary`,
				'POST',
				{
					serial: info.serial,
					version: info.version,
					brand: info.brand,
					dateStart,
					dateFinished,
				}
			)
			setDataSummary(dataSummary.data)
		} catch (error) {
			console.error(error)
			Swal.fire({
				title: 'Atención!',
				html: `Hubo un problema con la carga de los datos del Medidor.</br>Intente nuevamente...`,
				icon: 'error',
			})
			// navigate('/Home')
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
			getInfoRestart()
		}
	}, [info])
	if (isLoading) return <LoaderComponent image={false} />
	return (
		<>
			<div className='w-full flex flex-wrap justify-center relative py-5 mb-5 border-y-2 border-solid border-gray-300'>
				<div className='w-full flex flex-col items-center md:w-1/2'>
					<p>Causa del último reinicio:</p>
					<p className='font-bold'>
						{dataRestart.uR_0.value == '1'
							? 'Mediante opresión de tecla'
							: dataRestart.uR_0.value == '20'
							? 'Finalización del periodo'
							: ` Nuevo valor de reinicio ${dataRestart.uR_0.value}`}
					</p>
					<p>
						Número de reinicios: <span>{dataRestart.uR_2.value}</span>
					</p>
				</div>
				<div className='w-full flex flex-col items-center md:w-1/2'>
					<p>Fecha del último reinicio</p>
					<p className='font-bold'>{dataRestart.uR_1.value}</p>
					<p>
						Días desde el último reinicio: <span>{dataRestart.uR_3.value}</span>
					</p>
				</div>
				<IconButton
					className='!absolute !top-4 !right-0 md:!right-11 !bg-blue-800 !text-white !p-3 !border-white !border-2 border-solid shadow-sm shadow-black'
					onClick={handleOpen}
				>
					<FaArrowRightArrowLeft size={25} />
				</IconButton>
			</div>
			<TabsMeter tabs={tabs} />
			<Modal
				open={open}
				onClose={handleClose}
				aria-labelledby='modal-modal-title'
				aria-describedby='modal-modal-description'
			>
				<div className='w-full md:w-1/2 lg:w-1/3 !absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 p-2'>
					<div className='bg-white rounded-md shadow-md w-full'>
						<div className='p-4 bg-[#243f8c] rounded-t-md relative'>
							<h1 className='text-xl font-bold'>Resumen</h1>
							<IconButton onClick={handleClose} className='!absolute !top-4 !right-4'>
								<ImCross size={15} />
							</IconButton>
						</div>
						<div className='flex flex-col text-black p-7 gap-4'>
							<h1 className='font-bold text-blue-600'>FACTOR DE POTENCIA</h1>
							<div className='flex justify-evenly'>
								<div className='text-center'>
									<p className='font-bold text-blue-600'>
										MÍNIMA <span className='text-gray-700'>{dataSummary.FP_0.value}</span>
									</p>
									<p>{dataSummary.FP_1.value}</p>
								</div>
								<div className='text-center'>
									<p className='font-bold text-blue-600'>
										PROMEDIO <span className='text-gray-700'>{dataSummary.FP_2.value}</span>
									</p>
								</div>
							</div>
							<h1 className='font-bold text-blue-600'>FRECUENCIA</h1>
							<div className='flex justify-evenly gap-4'>
								<div className='text-center'>
									<p className='font-bold text-blue-600'>
										MÍNIMA <span className='text-gray-700'>{dataSummary.Freq_0.value}Hz</span>
									</p>
									<p>{dataSummary.Freq_1.value}</p>
								</div>
								<div className='text-center'>
									<p className='font-bold text-blue-600'>
										MÁXIMA <span className='text-gray-700'>{dataSummary.Freq_2.value}Hz</span>
									</p>
									<p>{dataSummary.Freq_3.value}</p>
								</div>
							</div>
							<h1 className='font-bold text-blue-600'>TEMPERATURA</h1>
							<div className='flex justify-evenly'>
								<div className='text-center'>
									<p className='font-bold text-blue-600'>
										MÍNIMA <span className='text-gray-700'>{dataSummary.Temp_0.value}ºC</span>
									</p>
									<p>{dataSummary.Temp_1.value}</p>
								</div>
								<div className='text-center'>
									<p className='font-bold text-blue-600'>
										ACTUAL <span className='text-gray-700'>{dataSummary.Op_1.value}ºC</span>
									</p>
								</div>
								<div className='text-center'>
									<p className='font-bold text-blue-600'>
										MÁXIMA <span className='text-gray-700'>{dataSummary.Temp_2.value}ºC</span>
									</p>
									<p>{dataSummary.Temp_3.value}</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</Modal>
		</>
	)
}

export default HistoryMeter
