import React, { useEffect } from 'react'
import { LayersControl, MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-draw/dist/leaflet.draw.css'
import 'leaflet-draw'

// Icono personalizado con SVG inline: no depende de imágenes externas,
// que el bundler no resuelve en producción (causa el cuadrado vacío).
const substationIcon = new L.divIcon({
    className: 'substation-marker',
    iconSize: [32, 42],
    iconAnchor: [16, 42],
    popupAnchor: [0, -38],
    html: `
        <svg width="32" height="42" viewBox="0 0 32 42" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 0C7.16 0 0 7.16 0 16c0 11 16 26 16 26s16-15 16-26C32 7.16 24.84 0 16 0z" fill="#7c3aed" stroke="#ffffff" stroke-width="2"/>
            <path d="M17.5 9l-7 9h5l-1.5 7 7-9h-5z" fill="#ffffff"/>
        </svg>
    `,
})

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
            <Marker position={position} icon={substationIcon}>
                <Popup className='bg-white text-black p-3 font-bold'>
                    {element.name}
                </Popup>
            </Marker>

        </MapContainer>
    )
}

export default MapSubstation