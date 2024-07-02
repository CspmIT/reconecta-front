import { useEffect } from 'react'
import L from 'leaflet'
import { useMap } from 'react-leaflet'
import PopupMarker from './PopupMarker'

function DrawControl({ polylines, markers }) {
	const map = useMap()

	const drawnItems = new L.FeatureGroup()
	const markersList = new L.FeatureGroup()
	const polylineList = new L.FeatureGroup()

	useEffect(() => {
		map.addLayer(drawnItems)
		map.addLayer(markersList)
		map.addLayer(polylineList)

		polylines.forEach((poly) => {
			const borderPolyline = L.polyline(poly.points, {
				color: '#0000006e',
				weight: 7, // Ancho del borde
			})

			const polyline = L.polyline(poly.points, {
				color: '#ffea00',
				weight: 3, // Ancho del borde
				border: '1px solid black',
			})

			drawnItems.addLayer(borderPolyline)
			drawnItems.addLayer(polyline)
			polylineList.addLayer(borderPolyline)
			polylineList.addLayer(polyline)
		})

		const layerControl = L.control.layers(
			null,
			{
				Reconectadores: markersList,
				Lines: polylineList,
			},
			{
				collapsed: true,
			}
		)

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
				marker: true,
				circlemarker: false,
			},
		})

		map.addControl(layerControl)
		map.addControl(drawControl)

		map.on(L.Draw.Event.CREATED, function (event) {
			const layer = event.layer
			drawnItems.addLayer(layer)
			adjustMapView()
		})

		adjustMapView()
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
					popupData={marker.info}
					drawnItems={drawnItems}
					layerControl={markersList}
				/>
			))}
		</>
	)
}

export default DrawControl
