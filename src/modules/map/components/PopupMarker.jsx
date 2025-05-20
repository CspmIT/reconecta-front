import { useEffect, useRef, useState } from 'react'
import { Marker, Tooltip } from 'react-leaflet'
import CustomPopUpRecloser from './CustomPopUp'

const PopupMarker = ({ position, icon, popupData, layerControl, drawnItems }) => {
    const markerRef = useRef(null)
    const [open, setOpen] = useState(false)
    const handleClose = () => {
        setOpen(false)
    }
    useEffect(() => {
        if (markerRef.current) {
            const marker = markerRef.current
            drawnItems.addLayer(marker)
            layerControl.addLayer(marker)
            if (Object.keys(popupData).length <= 1) return
            marker.on('click', () => {
                setOpen((prev) => !prev)
            })
            /* const handleMouseClick = () => {
                marker.openPopup()
            }
            marker.on('click', handleMouseClick)
            return () => {
                marker.off('click', handleMouseClick)
            } */
        }
    }, [popupData, layerControl, drawnItems])

    return (
        <Marker ref={markerRef} position={position} icon={icon}>
            {Object.keys(popupData).length > 1 && (
                <Tooltip permanent={false}>
                    <CustomPopUpRecloser content={popupData} open={open} handleClose={handleClose} />
                </Tooltip>
            )}
        </Marker>
    )
}

export default PopupMarker
