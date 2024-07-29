import { TextField } from '@mui/material'
import MapCustom from '../../../map/components/MapCustom'
function AddMarkerMap({ register, errors, listMarkers, setSelectMarkers }) {
	const center = [-30.680865, -62.011055]
	const getLatLngMarker = (lat, lng) => {
		setSelectMarkers({ lat, lng })
	}

	return (
		<>
			<div
				className={`!min-h-[inherit] h-[50vh] mt-3 w-full rounded-lg ${
					errors.lat_marker || errors.lng_marker ? 'outline !outline-2 !outline-red-500' : ''
				}`}
			>
				<TextField
					id='lat_marker'
					type='text'
					className='!hidden'
					{...register('lat_marker', { required: 'Debe agregar una ubicación' })}
				/>
				<TextField
					id='lng_marker'
					type='text'
					className='!hidden'
					{...register('lng_marker', { required: 'Debe agregar una ubicación' })}
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
				{(errors.lat_marker || errors.lng_marker) && 'Debe agregar una ubicación'}
			</p>
		</>
	)
}

export default AddMarkerMap
