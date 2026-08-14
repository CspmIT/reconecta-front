import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'
import { Button } from '@mui/material'

// Visor del plano: SVG inline con pan/zoom. El SVG llega ya generado por el
// backend (conversión DWG→SVG), acá solo se renderiza y se navega.
const PlanViewer = ({ svg }) => {
	return (
		<div className='w-full h-full bg-white rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600'>
			<TransformWrapper minScale={0.2} maxScale={40} limitToBounds={false} centerOnInit>
				{({ zoomIn, zoomOut, resetTransform }) => (
					<>
						<div className='absolute z-10 m-2 flex gap-1'>
							<Button size='small' variant='outlined' onClick={() => zoomIn()}>
								+
							</Button>
							<Button size='small' variant='outlined' onClick={() => zoomOut()}>
								-
							</Button>
							<Button size='small' variant='outlined' onClick={() => resetTransform()}>
								Centrar
							</Button>
						</div>
						<TransformComponent wrapperClass='!w-full !h-full' contentClass='!w-full !h-full'>
							<div
								className='w-full h-full [&>svg]:w-full [&>svg]:h-full'
								dangerouslySetInnerHTML={{ __html: svg }}
							/>
						</TransformComponent>
					</>
				)}
			</TransformWrapper>
		</div>
	)
}

export default PlanViewer
