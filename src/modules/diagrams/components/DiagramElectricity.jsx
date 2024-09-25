import { useEffect, useRef, useState } from 'react'
import { calcScale, draw, draw_line, getDataDetail, textosAdd } from '../utils/js/diagrama'
import { dataElectricity } from '../utils/objects/dataElectricidad'
import DetailMeter from './DetailMeter'
import { storage } from '../../../storage/storage'
import LoaderComponent from '../../../components/Loader'

function DiagramElectricity() {
	const canvasRef = useRef(null)
	const [canvas, setCanvas] = useState(null)
	const darkMode = storage.get('dark')
	let num = 0

	const [details, setDetails] = useState([])

	const [zoom, setZoom] = useState(0)

	const scaleSettings = [
		{ width: 425, scale: 'scale-[0.21]' },
		{ width: 640, scale: 'scale-[0.33]' },
		{ width: 768, scale: 'scale-[0.40]' },
		{ width: 1024, scale: 'scale-[0.53]' },
		{ width: 1280, scale: 'scale-[0.67]' },
		{ width: 1366, scale: 'scale-[0.71]' },
		{ width: 1440, scale: 'scale-[0.75]' },
		{ width: 1600, scale: 'scale-[0.83]' },
		{ width: 1920, scale: 'scale-[0.9]' },
		{ width: 2048, scale: 'scale-[1.10]' },
		{ width: 2560, scale: 'scale-[1.33]' },
		{ width: 3840, scale: 'scale-[2.00]' },
		{ width: Infinity, scale: 'scale-[2.00]' },
	]

	const changeZoom = () => {
		const matchedSetting = scaleSettings.find((setting) => window.innerWidth <= setting.width)
		const matchedIndex = scaleSettings.indexOf(matchedSetting)

		setZoom(matchedIndex)
	}

	useEffect(() => {
		window.addEventListener('resize', changeZoom)
		changeZoom() // Llama inicialmente para establecer el valor correcto según la resolución actual

		return () => window.removeEventListener('resize', changeZoom)
	}, [])

	useEffect(() => {
		const detail = getDataDetail(dataElectricity)
		setDetails(detail)
	}, [dataElectricity])

	useEffect(() => {
		if (!canvas) {
			setCanvas(canvasRef.current)
		}
		if (canvas) {
			const context = canvas.getContext('2d')
			draw(dataElectricity, canvas, context)
			draw_line(dataElectricity, context, 1)
			textosAdd(dataElectricity, context)
		}
	}, [canvas, darkMode])

	const loopLine = () => {
		if (num >= 16) {
			num = 0
		} else {
			num = num + 2
		}
		if (canvas) {
			const context = canvas.getContext('2d')
			draw_line(dataElectricity, context, num)
		}
	}

	useEffect(() => {
		const intervalId = setInterval(loopLine, 50)
		return () => {
			clearInterval(intervalId)
		}
	}, [canvas])

	return (
		<div className='w-full h-full flex justify-center items-center'>
			{details ? (
				<div id='div_canvas' className={`${scaleSettings[zoom].scale} ${scaleSettings[zoom].translate} `}>
					<canvas ref={canvasRef} id='canvas' className='z-40'></canvas>
					{details.map((detail, index) => (
						<DetailMeter key={index} position={detail.position} data={detail.data} />
					))}
				</div>
			) : (
				<>
					<LoaderComponent />
				</>
			)}
		</div>
	)
}

export default DiagramElectricity
