import { useEffect, useRef, useState } from 'react'
import { calcScale, draw, draw_line, getDataDetail, textosAdd } from '../utils/js/diagrama'
import { dataElectricity } from '../utils/objects/dataElectricidad'
import DetailMeter from './DetailMeter'
import { storage } from '../../../storage/storage'

function DiagramElectricity() {
	const canvasRef = useRef(null)
	const [canvas, setCanvas] = useState(null)
	const darkMode = storage.get('dark')
	let num = 0

	const [details, setDetails] = useState([])

	const [zoom, setZoom] = useState(0)

	const scaleSettings = [
		{ width: 640, scale: 'scale-[0.33]', translate: '-translate-x-44 -translate-y-52' },
		{ width: 768, scale: 'scale-[0.40]', translate: '-translate-x-44 -translate-y-48' },
		{ width: 1024, scale: 'scale-[0.53]', translate: '-translate-x-40 -translate-y-48' },
		{ width: 1280, scale: 'scale-[0.67]', translate: '-translate-x-36 -translate-y-36' },
		{ width: 1366, scale: 'scale-[0.71]', translate: '-translate-x-36 -translate-y-28' },
		{ width: 1440, scale: 'scale-[0.75]', translate: '-translate-x-32 -translate-y-24' },
		{ width: 1600, scale: 'scale-[0.83]', translate: '-translate-x-24 -translate-y-16' },
		{ width: 1920, scale: 'scale-[1.00]', translate: ' ' },
		{ width: 2560, scale: 'scale-[1.33]', translate: 'translate-x-72 translate-y-40' },
		{ width: 3840, scale: 'scale-[2.00]', translate: 'translate-x-40 translate-y-40' },
		{ width: Infinity, scale: 'scale-[2.00]', translate: 'translate-x-40 translate-y-40' },
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
		<div>
			<div id='div_canvas' className={`${scaleSettings[zoom].scale} ${scaleSettings[zoom].translate} `}>
				<canvas ref={canvasRef} id='canvas' className='z-40'></canvas>
				{details.map((detail, index) => (
					<DetailMeter key={index} position={detail.position} data={detail.data} />
				))}
			</div>
		</div>
	)
}

export default DiagramElectricity
