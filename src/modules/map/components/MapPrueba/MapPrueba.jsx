import { MapContainer, TileLayer, LayersControl, useMap } from 'react-leaflet'
import { useState, useEffect } from 'react'
import 'leaflet/dist/leaflet.css'
import 'leaflet.fullscreen/Control.FullScreen.js'
import 'leaflet.fullscreen/Control.FullScreen.css'

const FullScreenControl = () => {
    const [isFullScreenControlAdded, setIsFullScreenControlAdded] = useState(false)
    const map = useMap()

    useEffect(() => {
        if (!isFullScreenControlAdded) {
            L.control.fullscreen().addTo(map)
            setIsFullScreenControlAdded(true)
        }
    }, [isFullScreenControlAdded, map])

    return null
}

function MapPrueba() {
    return (
        <MapContainer center={[-30.709565, -62.011055]} zoom={15} style={{ minHeight: '100%', width: '100%' }}>
            <LayersControl position='topright'>
                <LayersControl.BaseLayer checked name='Street'>
                    <TileLayer url='https://tile.openstreetmap.org/{z}/{x}/{y}.png?{foo}' foo='bar' />
                </LayersControl.BaseLayer>
                <LayersControl.BaseLayer name='Satelital'>
                    <TileLayer url='https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}' />
                </LayersControl.BaseLayer>
            </LayersControl>
            <FullScreenControl />
        </MapContainer>
    )
}

export default MapPrueba
