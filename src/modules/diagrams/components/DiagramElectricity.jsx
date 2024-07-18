import { useEffect, useRef, useState } from 'react'
import { draw, draw_line, getDataDetail, textosAdd } from '../utils/js/diagrama'
import { dataElectricity } from '../utils/objects/dataElectricidad'
import DetailMeter from './DetailMeter'
import { storage } from '../../../storage/storage'

function DiagramElectricity() {
	const canvasRef = useRef(null)
	const [canvas, setCanvas] = useState(null)
	const darkMode = storage.get('dark')
	let num = 0

	const [details, setDetails] = useState([])

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
			// activeClick(dataElectricity, canvas, context)
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
		<div id='div_canvas' className='relative'>
			<canvas ref={canvasRef} id='canvas' className='z-40'></canvas>
			{details.map((detail, index) => (
				<DetailMeter key={index} position={detail.position} data={detail.data} />
			))}
		</div>
	)
}

export default DiagramElectricity
