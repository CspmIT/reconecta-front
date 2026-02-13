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

	const getGraphics = async () => {
		try {
			const { data } = await request(`${backend.Reconecta}/Sunburst`, 'GET')
			const dataFormated = sunburstData(data)
			setGraphics(dataFormated)
		} catch (e) {
			console.log(e)
		}
	}

	const userProfile = async () => {
		try {
			const userId = storage.get('usuario').sub
			const { data } = await request(`${backend[`${import.meta.env.VITE_APP_NAME}`]}/getUser/${userId}`, 'GET')
			setHasAccess(data.profile === 1)
		} catch (e) {
			console.error(e.errors)
			setHasAccess(false)
		}
	}

	useEffect(() => {
		getGraphics()
		userProfile()
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
