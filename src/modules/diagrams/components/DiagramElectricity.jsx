import { useEffect, useRef } from 'react'
import { draw, draw_line } from '../utils/js/diagrama'
import { dataElectricity } from '../utils/objects/dataElectricidad'

function DiagramElectricity() {
	const canvasRef = useRef(null)

	useEffect(() => {
		const canvas = canvasRef.current
		const context = canvas.getContext('2d')
		var elem = document.getElementById('canvas')
		draw(dataElectricity, elem, context)
		draw_line(dataElectricity, elem, context)
	}, [])
	return (
		<div id='div_canvas' className='bg-slate-300'>
			<canvas ref={canvasRef} id='canvas' className='z-50 relative'></canvas>
		</div>
	)
}

export default DiagramElectricity
