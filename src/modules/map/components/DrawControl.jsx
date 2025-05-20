import { useEffect, useState, useRef } from 'react'
import L from 'leaflet'
import { useMap } from 'react-leaflet'
import PopupMarker from './PopupMarker'
import markerCustom, { getIcon } from '../utils/js/markerClass'

function DrawControl({ polylines, markers = [], editor, getLatLngMarker }) {
	const map = useMap()
	const [createdMarkers, setCreatedMarkers] = useState(markers)
	const drawnItemsRef = useRef(new L.FeatureGroup())
	const markersListRef = useRef(new L.FeatureGroup())
	const polylineListRef = useRef([])

	useEffect(() => {
		const drawnItems = drawnItemsRef.current
		const markersList = markersListRef.current
		const polylineList = polylineListRef.current

		map.addLayer(drawnItems)
		map.addLayer(markersList)

		if (polylines?.length) {
			polylines.forEach((poly) => {
				const borderPolyline = L.polyline(poly.points, {
					color: '#0000006e',
					weight: 6,
				})

				const polyline = L.polyline(poly.points, {
					color: '#f65353',
					weight: 3,
				})

				drawnItems.addLayer(borderPolyline)
				drawnItems.addLayer(polyline)
				polylineList.push({ borderPolyline, polyline })
			})
		}

		const drawControl = new L.Control.Draw({
			edit: {
				featureGroup: drawnItems,
			},
			position: 'topright',
			draw: {
				polyline: false,
				polygon: false,
				circle: false,
				rectangle: false,
				marker: {
					icon: getIcon(3, ''),
				},
				circlemarker: false,
			},
		})
		if (editor) {
			map.addControl(drawControl)
		}

		const handleDrawCreated = async (event) => {
			const layer = event.layer
			if (event.layerType === 'marker') {
				const { lat, lng } = layer.getLatLng()
				const newMarker = new markerCustom('', lat, lng, 1)
				console.log(newMarker)
				if (getLatLngMarker) {
					getLatLngMarker(lat, lng)
				}
				setCreatedMarkers([newMarker])
				console.log(newMarker)
				// Add the marker to the drawnItems group to enable editing
				drawnItems.clearLayers()
				drawnItems.addLayer(layer)
			} else {
				drawnItems.addLayer(layer)
			}
		}

		const handleDrawEdited = async (event) => {
			const layers = event.layers
			layers.eachLayer((layer) => {
				if (layer instanceof L.Polyline) {
					const updatedLatLngs = layer.getLatLngs()
					polylineList.forEach((pair) => {
						if (pair.polyline === layer || pair.borderPolyline === layer) {
							drawnItems.removeLayer(pair.polyline)
							drawnItems.removeLayer(pair.borderPolyline)

							const newBorderPolyline = L.polyline(updatedLatLngs, {
								color: '#0000006e',
								weight: 6,
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
				if (layer instanceof L.Marker) {
					const { lat, lng } = layer.getLatLng()
					const newMarker = new markerCustom('', '', lat, lng, 3)
					console.log(newMarker)
					if (getLatLngMarker) {
						getLatLngMarker(lat, lng)
					}
					setCreatedMarkers([newMarker])
				}
			})
		}

		const handleDrawDelete = async () => {
			setCreatedMarkers([])
			drawnItems.clearLayers()
			getLatLngMarker(null, null)
		}
		map.on(L.Draw.Event.CREATED, handleDrawCreated)
		map.on('draw:edited', handleDrawEdited)
		map.on('draw:deleted', handleDrawDelete)

		return () => {
			map.removeControl(drawControl)
			map.removeLayer(drawnItems)
			map.removeLayer(markersList)
			map.off(L.Draw.Event.CREATED, handleDrawCreated)
			map.off('draw:edited', handleDrawEdited)
			map.off('draw:deleted', handleDrawDelete)
		}
	}, [map, polylines, editor])
	useEffect(() => {
		setCreatedMarkers(markers)
	}, [])
	return (
		<>
			{createdMarkers.length > 0 &&
				createdMarkers.map((marker, index) => (
					<PopupMarker
						key={index}
						position={[marker.lat, marker.lng]}
						icon={marker.icon}
						popupData={marker}
						drawnItems={drawnItemsRef.current}
						layerControl={markersListRef.current}
					/>
				))}
		</>
	)
}

export default DrawControl
