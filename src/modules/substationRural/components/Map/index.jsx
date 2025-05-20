import React, { useEffect } from 'react'
import { LayersControl, MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-draw/dist/leaflet.draw.css'
import 'leaflet-draw'

const MapUpdate = ({ position }) => {
    const map = useMap()

    useEffect(() => {
        if (position) {
            map.setView(position, 15)
        }
    }, [position, map])
    return null
}
const MapSubstation = ({ element }) => {
    const position = [element.lat, element.lon]
    return (
        <MapContainer center={position} zoom={15} scrollWheelZoom={true} className='!min-h-full !min-w-full'>
            <MapUpdate position={position} />
            <LayersControl position='topright'>
                <LayersControl.BaseLayer checked name='Street'>
                    <TileLayer url='https://wms.ign.gob.ar/geoserver/gwc/service/tms/1.0.0/capabaseargenmap@EPSG%3A3857@png/{z}/{x}/{-y}.png' />
                </LayersControl.BaseLayer>
                <LayersControl.BaseLayer name='Satelital'>
                    <TileLayer url='https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}' />
                </LayersControl.BaseLayer>
            </LayersControl>
            <Marker position={position}>
                <Popup className='bg-white text-black p-3 font-bold'>
                    {element.name}
                </Popup>
            </Marker>

        </MapContainer>
    )
}

export default MapSubstation