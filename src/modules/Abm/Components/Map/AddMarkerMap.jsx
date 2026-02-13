import { MenuItem, TextField } from '@mui/material'
import MapCustom from '../../../map/components/MapCustom'
import { grayIcon } from '../../../map/utils/js/markerClass'
import { useEffect, useState } from 'react'
import { request } from '../../../../utils/js/request'
import { backend } from '../../../../utils/routes/app.routes'
import { polylines } from '../../utils/data'
function AddMarkerMap({ register, errors, dataEdit, setSelectMarkers }) {
	const [centerMap, setCenterMap] = useState([0, 0])
	const [markerDraw, setMarkerDraw] = useState(false)
	const [selectMap, setSelectMap] = useState(0)
	const [maps, setMaps] = useState([])
	const [lng, setLng] = useState(null)
	const [lat, setLat] = useState(null)
	const numberValue = null
	const getLatLngMarker = (lat, lng) => {
		setLng(lng)
		setLat(lat)
		setCenterMap([lat, lng])
		setSelectMarkers({ lat, lng })
	}
	const changeUbication = (lng, lat) => {
		const ubication = {
			icon: grayIcon(numberValue),
			info: {},
			lat,
			lng,
		}
		setCenterMap([lat, lng])
		setMarkerDraw([ubication])
	}
	const getMaps = async () => {
		const data = await request(`${backend.Reconecta}/getMaps`, 'GET')
		setMaps(data.data)
		if (data.data.length > 0) {
			setSelectMap(data.data[0].id)
		}
	}
	useEffect(() => {
		const ubication = maps.find((item) => item.id === selectMap)
		if (ubication?.lat_location && ubication?.lng_location) {
			setCenterMap([ubication.lat_location, ubication.lng_location])
		}
		if (selectMap && !markerDraw) {
			setMarkerDraw(true)
		}
	}, [selectMap])
	useEffect(() => {
		if (lng && lat) {
			changeUbication(lng, lat)
		}
	}, [lng, lat, numberValue])
	useEffect(() => {
		if (dataEdit.lat && dataEdit.lon) {
			setSelectMap(dataEdit.id_map)
			getLatLngMarker(dataEdit.lat, dataEdit.lon)
		}
	}, [dataEdit])
	useEffect(() => {
		getMaps()
	}, [])
	return (
		<>
			<div className='row gap-3 my-3 w-full'>
				{maps.length >= 1 ? (
					<TextField
						id='id_map'
						select
						className={`w-1/3 `}
						label={`Mapa`}
						{...register('id_map', { required: 'Debe seleccionar un mapa en el que se va a ver' })}
						error={errors.id_map ? true : false}
						helperText={errors.id_map && errors.id_map.message}
						onChange={(e) => {
							setSelectMap(e.target.value)
							register('id_map').onChange(e)
						}}
						value={selectMap}
					>
						<MenuItem value={0}>
							<em>Nombre de mapa</em>
						</MenuItem>
						{maps.map((item, index) => (
							<MenuItem key={`map-${index}`} value={item.id}>
								{item.name}
							</MenuItem>
						))}
					</TextField>
				) : null}
				<TextField
					id='lat_marker'
					type='number'
					className={`w-1/3 `}
					label={`Latitud`}
					{...register('lat_marker', { required: 'Debe agregar una ubicación' })}
					error={errors.lat_marker ? true : false}
					helperText={errors.lat_marker && errors.lat_marker.message}
					onChange={(e) => {
						setLat(e.target.value)
						register('lat_marker').onChange(e)
					}}
					InputLabelProps={{ shrink: lat ? true : false }}
					value={lat}
				/>
				<TextField
					id='lng_marker'
					type='number'
					className={`w-1/3 `}
					label={`Longitud`}
					{...register('lng_marker', { required: 'Debe agregar una ubicación' })}
					error={errors.lng_marker ? true : false}
					helperText={errors.lng_marker && errors.lng_marker.message}
					onChange={(e) => {
						setLng(e.target.value)
						register('lng_marker').onChange(e)
					}}
					InputLabelProps={{ shrink: lng ? true : false }}
					value={lng}
				/>
			</div>
			<div
				className={`!min-h-[inherit] h-[50vh] mt-3 w-full rounded-lg ${errors.lat_marker || errors.lng_marker ? 'outline !outline-2 !outline-red-500' : ''
					}`}
			>
				<MapCustom
					center={centerMap}
					id={155}
					editor={true}
					abm={true}
					activeZoom
					zoom={11}
					getLatLngMarker={getLatLngMarker}
					markers={markerDraw}
					polylines={polylines[selectMap] ? polylines[selectMap] : []}
				/>
			</div>
			<p className='text-red-500 text-xs mt-2 ml-3'>
				{(errors.lat_marker || errors.lng_marker) && 'Debe agregar una ubicación'}
			</p>
		</>
	)
}

export default AddMarkerMap
