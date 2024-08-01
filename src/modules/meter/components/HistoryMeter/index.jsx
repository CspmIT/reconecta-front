import { IconButton, Modal } from '@mui/material'
import TabsMeter from '../tabsMeter'
import { FaArrowRightArrowLeft } from 'react-icons/fa6'
import { ImCross } from 'react-icons/im'
import { useState } from 'react'
import ModelInvoice from './components/ModelInvoice'
import TarifaEnergi from './components/TarifaEnergi'
import EnergiTotal from './components/EnergiTotal'
function HistoryMeter() {
	const [open, setOpen] = useState(false)
	const handleOpen = () => setOpen(true)
	const handleClose = () => setOpen(false)
	const tabs = [
		{
			id: 1,
			title: 'Modelo de Factura',
			component: <ModelInvoice />,
		},
		{
			id: 2,
			title: 'Tarífas de Enegía',
			component: <TarifaEnergi />,
		},
		{
			id: 3,
			title: 'Índice de Energía Total',
			component: <EnergiTotal />,
		},
	]
	return (
		<>
			<div className='w-full flex justify-around relative py-5 mb-5 border-y-2 border-solid border-gray-300'>
				<div>
					<p>Causa del último reinicio:</p>
					<p className='font-bold'>Finalización del periodo</p>
					<p>
						Número de reinicios: <span>24</span>
					</p>
				</div>
				<div>
					<p>Fecha del último reinicio</p>
					<p className='font-bold'>01/07/2024 00:00:00</p>
					<p>
						Días desde el último reinicio: <span>30</span>
					</p>
				</div>
				<IconButton
					className='!absolute !top-4 !right-11 !bg-blue-800 !text-white !p-3 !border-white !border-2 border-solid shadow-sm shadow-black'
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
				<div className=' w-1/3 max-md:w-2/3 max-sm:w-full !absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-white  rounded-md shadow-md'>
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
									MÍNIMA <span className='text-gray-700'>0.9157</span>
								</p>
								<p>24/06/2024 03:55:00</p>
							</div>
							<div className='text-center'>
								<p className='font-bold text-blue-600'>
									PROMEDIO <span className='text-gray-700'>0.9813</span>
								</p>
							</div>
						</div>
						<h1 className='font-bold text-blue-600'>FRECUENCIA</h1>
						<div className='flex justify-evenly gap-4'>
							<div className='text-center'>
								<p className='font-bold text-blue-600'>
									MÍNIMA <span className='text-gray-700'>49.6Hz</span>
								</p>
								<p>20/06/2024 09:53:22</p>
							</div>
							<div className='text-center'>
								<p className='font-bold text-blue-600'>
									MÁXIMA <span className='text-gray-700'>50.3Hz</span>
								</p>
								<p>03/06/2024 02:10:24</p>
							</div>
						</div>
						<h1 className='font-bold text-blue-600'>TEMPERATURA</h1>
						<div className='flex justify-evenly'>
							<div className='text-center'>
								<p className='font-bold text-blue-600'>
									MÍNIMA <span className='text-gray-700'>13ºC</span>
								</p>
								<p>29/06/2024 07:31:38</p>
							</div>
							<div className='text-center'>
								<p className='font-bold text-blue-600'>
									ACTUAL <span className='text-gray-700'>19ºC</span>
								</p>
							</div>
							<div className='text-center'>
								<p className='font-bold text-blue-600'>
									MÁXIMA <span className='text-gray-700'>41ºC</span>
								</p>
								<p>12/06/2024 16:36:02</p>
							</div>
						</div>
					</div>
				</div>
			</Modal>
		</>
	)
}

export default HistoryMeter
