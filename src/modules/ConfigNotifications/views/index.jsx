import { useEffect, useState } from 'react'
import { Card, FormLabel } from '@mui/material'
import Accordion from '../components/Accordion'
import { FaArrowRight } from 'react-icons/fa6'
import { formatterConfig, getConfigNotify } from '../utils/js'
import LoaderComponent from '../../../components/Loader'

function ConfigNotifications() {
	const [devices, setDevices] = useState([])
	const getConfig = async () => {
		const config = await getConfigNotify()
		console.log(config)
		const configFormatter = await formatterConfig(config)
		console.log(configFormatter)
		setDevices(configFormatter)
	}
	useEffect(() => {
		getConfig()
	}, [])

	// console.log(devices)
	return (
		<Card
			className={
				'w-full h-full flex flex-col items-center justify-center text-black dark:text-white relative p-3 rounded-md'
			}
		>
			<div className='w-full  md:p-5'>
				<h1 className='text-2xl mb-3'>Configuración de eventos y notificaciones</h1>
				<div className='flex flex-col gap-3'>
					{!devices ? (
						<LoaderComponent />
					) : (
						devices.map((item, index) => {
							return (
								<Accordion
									key={index}
									title={
										<>
											<FormLabel>{item.router.device}</FormLabel>
											<FaArrowRight className='mt-1 mx-2' />
											<FormLabel>{item.router.brand}</FormLabel>
											<FaArrowRight className='mt-1 mx-2' />
											<FormLabel>{item.router.version}</FormLabel>
										</>
									}
									dataTable={item.objets}
								/>
							)
						})
					)}
				</div>
			</div>
		</Card>
	)
}

export default ConfigNotifications
