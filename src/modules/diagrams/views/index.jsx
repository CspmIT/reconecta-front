import { useEffect, useState } from 'react'
import SunburstChart from '../components/sunburstChart'
import { request } from '../../../utils/js/request'
import { backend, front } from '../../../utils/routes/app.routes'
import { sunburstData } from '../utils/js/formatGraphics'
import Graphic from '../components/Graphic'
import { Button } from '@mui/material'
import { io } from 'socket.io-client'
import { storage } from '../../../storage/storage'
import { useNavigate } from 'react-router-dom'

const Diagrams = () => {
	const navigate = useNavigate()
	const [graphics, setGraphics] = useState([])
	const [hasAccess, setHasAccess] = useState(false)
	const user = storage.get('usuario').sub

	const getGraphics = async () => {
		try {
			const { data } = await request(`${backend.Reconecta}/Sunburst`, 'GET')
			const dataFormated = sunburstData(data)
			setGraphics(dataFormated)
		} catch (e) {
			console.log(e)
		}
	}

	useEffect(() => {
		getGraphics()
		const socket = io(front.Reconecta, { path: '/api/socket.io' })
		socket.on('connect', () => {
			console.log('Conectado al servidor de sockets')
		})

		// Solicitar acceso al conectar
		socket.emit('access-config', user, (response) => {
			setHasAccess(response)
			if (!response) {
				socket.disconnect()
			}
		})
		return () => {
			socket.disconnect()
		}
	}, [])
	return (
		<div className='w-full flex flex-wrap justify-center text-black dark:text-white relative'>
			<div className='w-full shadow-md  overflow-hidden relative rounded-md bg-white dark:bg-[#303b41] pb-5'>
				{hasAccess && (
					<div className='w-full flex justify-end'>
						<Button onClick={() => navigate("/addChart")} variant='contained' className='!m-5'>Nuevo gráfico</Button>
					</div>
				)}
				<div className='w-full flex justify-center flex-wrap'>
					{graphics.length > 0 && graphics.map((item, index) =>
						<Graphic key={index} data={item} />
					)}
				</div>
			</div>
		</div>
	)
}

export default Diagrams
