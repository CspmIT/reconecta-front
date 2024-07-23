import { Button } from '@mui/material'
import MapCustom from '../components/MapCustom'
import { ToastContainer, toast } from 'react-toastify'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { markersRecloser } from '../utils/js/markers'
import { polylines } from '../utils/js/polilines'
function Map() {
	const center = [-30.680865, -62.011055]
	const centerCity = [-30.712865, -62.011055]
	const navigate = useNavigate()
	const showToastMessage = () => {
		toast.warn(`Nueva Alerta para ID!`, {
			position: 'top-right',
			autoClose: false,
			onClick: () => {
				navigate('/Alert')
			},
			className: 'mt-3',
			theme: 'colored',
		})
	}
	useEffect(() => {
		showToastMessage()
	}, [])

	return (
		<div className={`!min-h-[90vh] relative w-full flex`}>
			<ToastContainer className={'absolute top-0'} stacked />
			<div className='!min-h-[inherit] !shadow-md !shadow-black/40 !rounded-2xl p-2 w-1/2'>
				<MapCustom
					id={1}
					center={center}
					activeZoom={false}
					zoom={11.6}
					markers={markersRecloser}
					polylines={polylines}
				/>
			</div>
			<div className='min-h-[inherit]  !shadow-md !shadow-black/40 !rounded-2xl p-2 w-1/2'>
				<MapCustom
					id={2}
					center={centerCity}
					activeZoom={false}
					zoom={14.5}
					markers={markersRecloser}
					polylines={polylines}
				/>
			</div>
		</div>
	)
}

export default Map
