import { MapContainer, TileLayer, LayersControl } from 'react-leaflet'

import 'leaflet/dist/leaflet.css'
import 'leaflet.fullscreen/Control.FullScreen.js'
import 'leaflet.fullscreen/Control.FullScreen.css'
import '../utils/css/marker.modules.css'
import 'leaflet-draw/dist/leaflet.draw.css'
import 'leaflet-draw'
import { markersRecloser } from '../utils/js/markers'
import FullScreenControl from './FullScreen'
import { polylines } from '../utils/js/polilines'
import DrawControl from './DrawControl'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useEffect } from 'react'
import '../utils/css/toastCustom.modules.css'
import '../utils/css/AlertSwal.modules.css'
import { Button } from '@mui/material'
import Swal from 'sweetalert2'
function MapPrueba({ center, id, zoom }) {
	const showToastMessage = () => {
		toast.warn('Nueva Alerta!', {
			className: 'toastCustom',
		})
	}
	// useEffect(() => {
	// 	showToastMessage()
	// }, [])
	const swalAlert = () => {
		Swal.fire({
			title: 'Alerta!',
			text: 'Nueva Alerta!',
			icon: 'warning',
			confirmButtonText: 'OK',
			customClass: {
				popup: 'fondoAlerta rounded-xl',
				title: 'text-white text-4xl',
				icon: '!text-white !border-white',
				htmlContainer: '!text-white !text-xl !font-semibold',
			},
			willClose: () => {
				const popup = document.querySelector('.swal2-popup')
				if (popup) {
					popup.classList.remove('fondoAlerta')
				}
			},
		})
	}

	return (
		<>
			{/* <Button onClick={() => swalAlert()}>swall</Button> */}
			<MapContainer
				key={id}
				center={center}
				preferCanvas={true}
				zoom={zoom}
				wheelPxPerZoomLevel={500}
				zoomSnap={0.1}
				maxZoom={zoom}
				minZoom={zoom}
				fullscreenControl={false}
				zoomControl={false}
				touchZoom={false}
				scrollWheelZoom={false}
				dragging={false}
				doubleClickZoom={false}
				style={{ minHeight: '100%', width: '100%', borderRadius: '10px' }}
			>
				<LayersControl position='topright'>
					<LayersControl.BaseLayer checked name='Street'>
						{/* <TileLayer url='https://tile.openstreetmap.org/{z}/{x}/{y}.png?{foo}' foo='bar' /> */}
						<TileLayer
							url='https://wms.ign.gob.ar/geoserver/gwc/service/tms/1.0.0/capabaseargenmap@EPSG%3A3857@png/{z}/{x}/{-y}.png'
							foo='bar'
						/>
					</LayersControl.BaseLayer>
					<LayersControl.BaseLayer name='Satelital'>
						<TileLayer url='https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}' />
					</LayersControl.BaseLayer>
				</LayersControl>
				<DrawControl polylines={polylines} markers={markersRecloser} />
				{/* <FullScreenControl /> */}
			</MapContainer>
		</>
	)
}

export default MapPrueba
