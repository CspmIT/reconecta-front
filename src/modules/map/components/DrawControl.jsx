import { useEffect, useState } from 'react'
import L from 'leaflet'
import { useMap } from 'react-leaflet'
import PopupMarker from './PopupMarker'
import markerCustom, { redIcon } from '../utils/js/markerClass'

function DrawControl({ polylines, markers }) {
	const map = useMap()
	const [createdMarkers, setCreatedMarkers] = useState([])

	const drawnItems = new L.FeatureGroup()
	const markersList = new L.FeatureGroup()
	const polylineList = []

	useEffect(() => {
		map.addLayer(drawnItems)
		map.addLayer(markersList)

		polylines.forEach((poly) => {
			const borderPolyline = L.polyline(poly.points, {
				color: '#0000006e',
				weight: 6, // Ancho del borde
			})

			const polyline = L.polyline(poly.points, {
				color: '#f65353',
				weight: 3, // Ancho del borde
			})

			drawnItems.addLayer(borderPolyline)
			drawnItems.addLayer(polyline)
			polylineList.push({ borderPolyline, polyline })
		})

		// const layerControl = L.control.layers(
		// 	null,
		// 	{
		// 		Reconectadores: markersList,
		// 		Lines: drawnItems,
		// 	},
		// 	{
		// 		collapsed: true,
		// 	}
		// )

		const drawControl = new L.Control.Draw({
			edit: {
				featureGroup: drawnItems,
			},
			position: 'topright',
			draw: {
				polyline: true,
				polygon: false,
				circle: false,
				rectangle: false,
				marker: false,
				// marker: {
				// 	icon: redIcon(0),
				// },
				circlemarker: false,
			},
		})

		// map.addControl(layerControl)
		map.addControl(drawControl)

		map.on(L.Draw.Event.CREATED, function (event) {
			const layer = event.layer
			if (event.layerType === 'marker') {
				const { lat, lng } = layer.getLatLng()
				const newMarker = new markerCustom(0, lat, lng, 1) // Ajusta el número de opción aquí
				setCreatedMarkers((prevMarkers) => [...prevMarkers, newMarker])
			} else {
				drawnItems.addLayer(layer)
			}
			// adjustMapView()
		})

		map.on('draw:edited', function (event) {
			const layers = event.layers
			layers.eachLayer(function (layer) {
				if (layer instanceof L.Polyline) {
					const updatedLatLngs = layer.getLatLngs()
					polylineList.forEach((pair) => {
						if (pair.polyline === layer || pair.borderPolyline === layer) {
							drawnItems.removeLayer(pair.polyline)
							drawnItems.removeLayer(pair.borderPolyline)

							const newBorderPolyline = L.polyline(updatedLatLngs, {
								color: '#0000006e',
								weight: 6, // Ancho del borde
							})

							const newPolyline = L.polyline(updatedLatLngs, {
								color: '#f65353',
								weight: 3,
							})

							drawnItems.addLayer(newBorderPolyline)
							drawnItems.addLayer(newPolyline)

							pair.borderPolyline = newBorderPolyline
							pair.polyline = newPolyline
						}
					})
				}
			})
		})

		// adjustMapView()
	}, [map, polylines, markers])

	const adjustMapView = () => {
		const bounds = new L.LatLngBounds()
		markers.forEach((marker) => {
			bounds.extend([marker.lat, marker.lng])
		})
		polylines.forEach((poly) => {
			poly.points.forEach((point) => {
				bounds.extend(point)
			})
		})
		if (bounds.isValid()) {
			map.fitBounds(bounds)
		}
	}
	return (
		<>
			{markers.map((marker, index) => (
				<PopupMarker
					key={index}
					id={marker.id}
					position={[marker.lat, marker.lng]}
					icon={marker.icon}
					alert={marker.alert}
					popupData={marker.info}
					drawnItems={drawnItems}
					layerControl={markersList}
				/>
			))}
			{createdMarkers.map((marker, index) => (
				<PopupMarker
					key={index}
					id={marker.id}
					position={[marker.lat, marker.lng]}
					icon={marker.icon}
					popupData={marker.info}
					drawnItems={drawnItems}
					layerControl={markersList}
				/>
			))}
		</>
	)
}

export default DrawControl
