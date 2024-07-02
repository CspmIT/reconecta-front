import { useEffect, useState } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'
const FullScreenControl = () => {
	const [isFullScreenControlAdded, setIsFullScreenControlAdded] = useState(false)
	const map = useMap()
	useEffect(() => {
		if (!isFullScreenControlAdded) {
			L.control.fullscreen().addTo(map)
			setIsFullScreenControlAdded(true)
		}
		const handleOverlayAdd = (event) => {
			if (event.name === 'Reconectadores') {
				console.log('Markers layer added')
			}
		}
		const handleOverlayRemove = (event) => {
			if (event.name === 'Reconectadores') {
				console.log('Markers layer removed')
			}
		}
		map.on('overlayadd', handleOverlayAdd)
		map.on('overlayremove', handleOverlayRemove)
		return () => {
			map.off('overlayadd', handleOverlayAdd)
			map.off('overlayremove', handleOverlayRemove)
		}
	}, [isFullScreenControlAdded, map])
	return null
}

export default FullScreenControl
