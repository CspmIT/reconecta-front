import { TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import MapCustom from '../../../../map/components/MapCustom'
function AddMarkerMap({ register, errors, setValue, selectMarkers, listMarkers }) {
	const [latValue, setLatValue] = useState(selectMarkers.lat)
	const [lngValue, setLngValue] = useState(selectMarkers.lng)
	const center = [-30.680865, -62.011055]
	const getLatLngMarker = (lat, lng) => {
		setLngValue(lat)
		setLatValue(lng)
	}
	useEffect(() => {
		const validation = lngValue === undefined ? false : true
		setValue('lng_marker', lngValue || selectMarkers.lng, { shouldValidate: validation ? true : false })
		setValue('lat_marker', latValue || selectMarkers.lat, { shouldValidate: validation ? true : false })
	}, [lngValue, latValue, selectMarkers])
	return (
		<>
			<div
				className={`!min-h-[inherit] h-[50vh] mt-3 w-full rounded-lg ${
					errors.lat_marker || errors.lng_marker ? 'outline !outline-2 !outline-red-500' : ''
				}`}
			>
				<TextField
					id='lat_marker'
					type='hidden'
					className='!hidden'
					{...register('lat_marker', { required: 'Debe agregar una ubicación' })}
					value={latValue || ''}
				/>
				<TextField
					id='lng_marker'
					type='hidden'
					className='!hidden'
					{...register('lng_marker', { required: 'Debe agregar una ubicación' })}
					value={lngValue || ''}
				/>
				<MapCustom
					center={center}
					id={155}
					editor={!listMarkers.length ? true : false}
					zoom={11}
					getLatLngMarker={getLatLngMarker}
					markers={listMarkers}
				/>
			</div>
			<p className='text-red-500 text-xs mt-2 ml-3'>
				{(errors.lat_marker || errors.lng_marker) && (errors.lat_marker.message || errors.lng_marker.message)}
			</p>
		</>
	)
}

export default AddMarkerMap
