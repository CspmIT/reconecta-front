import { useContext, useEffect, useRef } from 'react'
import { Marker, Popup, Tooltip } from 'react-leaflet'
import { useNavigate } from 'react-router-dom'
import CustomPopUp from './CustomPopUp'
import { yellowIcon } from '../utils/js/markerClass'
import { MainContext } from '../../../context/MainContext'
import Board from '../../recloser/board/views'

const PopupMarker = ({ position, icon, alert, popupData, id, layerControl, drawnItems }) => {
	const markerRef = useRef(null)
	const navigate = useNavigate()
	const intervalRef = useRef(null)
	const { tabs, setTabs, setTabCurrent } = useContext(MainContext)
	useEffect(() => {
		if (markerRef.current) {
			const marker = markerRef.current
			drawnItems.addLayer(marker)
			layerControl.addLayer(marker)
			const handleMouseClick = () => {
				setTabs((prevTabs) => [
					...prevTabs,
					{
						name: popupData.name,
						id: id,
						link: '/board',
						component: (
							<>
								<Board />
							</>
						),
					},
				])
				setTabCurrent(tabs.length)
				navigate('/tabs')
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

	useEffect(() => {
		if (alert) {
			intervalRef.current = setInterval(() => {
				if (markerRef.current) {
					const currentIcon = markerRef.current.options.icon
					markerRef.current.setIcon(currentIcon === icon ? yellowIcon(popupData.number) : icon)
				}
			}, 500) // Adjust the interval time as needed
		} else {
			if (intervalRef.current) {
				clearInterval(intervalRef.current)
				intervalRef.current = null
				if (markerRef.current) {
					markerRef.current.setIcon(icon)
				}
			}
		}
		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current)
			}
		}
	}, [alert, icon, id])

	return (
		<Marker ref={markerRef} position={position} icon={icon}>
			<Tooltip permanent={false}>
				<CustomPopUp content={popupData} />
			</Tooltip>
		</Marker>
	)
}

export default PopupMarker
