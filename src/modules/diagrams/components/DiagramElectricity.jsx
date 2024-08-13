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

	const [zoom, setZoom] = useState(3)
	const changezoom = () => {
		if (window.innerWidth <= 1024) {
			setZoom(0)
			return
		}
		if (window.innerWidth <= 1280) {
			setZoom(1)
			return
		}
		if (window.innerWidth >= 1300) {
			setZoom(3)
		}
	}

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
			changezoom()
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
	const scale = ['scale-[0.52]', 'scale-[0.65]', 'scale-[0.75]', ' ']

	const traslate = [
		'-translate-x-40 -translate-y-52',
		'-translate-x-36 -translate-y-36',
		'-translate-x-28 -translate-y-24',
		' ',
	]
	console.log(zoom)
	return (
		<div id='div_canvas' className={`${scale[zoom]} ${traslate[zoom]} `}>
			<canvas ref={canvasRef} id='canvas' className='z-40'></canvas>
			{details.map((detail, index) => (
				<DetailMeter key={index} position={detail.position} data={detail.data} />
			))}
		</div>
	)
}

export default DiagramElectricity
