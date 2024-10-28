import { useEffect, useState } from 'react'
import { Card, FormLabel } from '@mui/material'
import Accordion from '../components/Accordion'
import { FaArrowRight } from 'react-icons/fa6'
import { formatterConfig, getConfigNotify } from '../utils/js'
import LoaderComponent from '../../../components/Loader'
import { request } from '../../../utils/js/request'
import { backend } from '../../../utils/routes/app.routes'

function ConfigNotifications() {
	const [devices, setDevices] = useState([])
	const [hasAccess, setHasAccess] = useState(false)
	const [loading, setLoading] = useState(true)

	const getConfig = async () => {
		const config = await getConfigNotify()
		const configFormatter = await formatterConfig(config)
		setDevices(configFormatter)
		setLoading(false)
	}

	useEffect(() => {
		const checkAccess = async () => {
			try {
				await getConfig()
				const response = await request(
					`${backend[`${import.meta.env.VITE_APP_NAME}`]}/check-access-Config`,
					'GET'
				)
				if (response.status === 200) {
					setHasAccess(true)
				}
			} catch (err) {
				setHasAccess(false)
			}
		}

		checkAccess()

		const intervalId = setInterval(async () => {
			if (hasAccess) {
				try {
					await request(`${backend[`${import.meta.env.VITE_APP_NAME}`]}/renew-access-Config`, 'POST')
				} catch (error) {
					console.error('Error renewing access:', error)
					setHasAccess(false)
				}
			}
		}, 60 * 1000)
		return () => {
			clearInterval(intervalId)
			if (hasAccess) {
				request(`${backend[`${import.meta.env.VITE_APP_NAME}`]}/release-access-Config`, 'POST')
			}
		}
	}, [hasAccess])

	if (loading) return <LoaderComponent />
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
									access={hasAccess}
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
