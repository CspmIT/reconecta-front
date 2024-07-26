import React from 'react'
import { LayersControl, MapContainer, TileLayer } from 'react-leaflet'
import DrawControl from '../../../../map/components/DrawControl'

function MapUbication({ center, id, zoom, activeZoom = true, markersData, polylinesData }) {
	return (
		<MapContainer
			key={id}
			center={center}
			preferCanvas={true}
			zoom={zoom}
			wheelPxPerZoomLevel={500}
			zoomSnap={0.1}
			maxZoom={!activeZoom ? zoom : 100}
			minZoom={!activeZoom ? zoom : 0}
			fullscreenControl={activeZoom}
			zoomControl={activeZoom}
			touchZoom={activeZoom}
			scrollWheelZoom={activeZoom}
			dragging={activeZoom}
			doubleClickZoom={activeZoom}
			style={{ minHeight: '100%', width: '100%', borderRadius: '10px' }}
		>
			<LayersControl position='topright'>
				<LayersControl.BaseLayer checked name='Street'>
					<TileLayer url='https://wms.ign.gob.ar/geoserver/gwc/service/tms/1.0.0/capabaseargenmap@EPSG%3A3857@png/{z}/{x}/{-y}.png' />
				</LayersControl.BaseLayer>
				<LayersControl.BaseLayer name='Satelital'>
					<TileLayer url='https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}' />
				</LayersControl.BaseLayer>
			</LayersControl>
			<DrawControl polylines={polylinesData} markers={markersData} />
		</MapContainer>
	)
}

export default MapUbication
