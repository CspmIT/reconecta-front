import { useEffect, useRef } from 'react'
import { Marker, Popup } from 'react-leaflet'
import { useNavigate } from 'react-router-dom'
import CustomPopUp from './CustomPopUp'

const PopupMarker = ({ position, icon, popupData, id, layerControl, drawnItems }) => {
	const markerRef = useRef(null)
	const navigate = useNavigate()

	useEffect(() => {
		if (markerRef.current) {
			const marker = markerRef.current
			drawnItems.addLayer(marker) // Añadir el marcador a markersList
			layerControl.addLayer(marker) // Añadir el marcador a markersList
			const handleMouseClick = () => {
				navigate('/board/' + id)
				// marker.openPopup()
			}
			const handleMouseOver = () => {
				marker.openPopup()
			}
			const handleMouseOut = () => {
				marker.closePopup()
			}
			marker.on('click', handleMouseClick)
			marker.on('mouseover', handleMouseOver)
			marker.on('mouseout', handleMouseOut)
			return () => {
				marker.off('click', handleMouseClick)
				marker.off('mouseover', handleMouseOver)
				marker.off('mouseout', handleMouseOut)
			}
		}
	}, [popupData, layerControl, drawnItems])

	return (
		<Marker ref={markerRef} position={position} icon={icon}>
			<Popup>
				<CustomPopUp content={popupData} />
			</Popup>
		</Marker>
	)
}
export default PopupMarker
