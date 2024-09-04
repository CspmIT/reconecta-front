import { Button } from '@mui/material'
import MapCustom from '../components/MapCustom'
import { ToastContainer, toast } from 'react-toastify'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { markersRecloser } from '../utils/js/markers'
import { polylines } from '../utils/js/polilines'
function Map() {
	const center = [-30.680865, -62.011055]
	const centerCity = [-30.712865, -62.006255]
	// const navigate = useNavigate()
	// const showToastMessage = () => {
	// 	toast.warn(`Nueva Alerta para ID!`, {
	// 		position: 'top-right',
	// 		autoClose: false,
	// 		onClick: () => {
	// 			navigate('/Alert')
	// 		},
	// 		className: 'mt-3',
	// 		theme: 'colored',
	// 	})
	// }
	// useEffect(() => {
	// 	showToastMessage()
	// }, [])
	const [zoom, setZoom] = useState(0)

	const scaleSettings = [
		{ width: 640, scaleRural: 10.4, scaleCity: 15 },
		{ width: 768, scaleRural: 10.5, scaleCity: 11 },
		{ width: 1024, scaleRural: 10.7, scaleCity: 13.5 },
		{ width: 1280, scaleRural: 11.1, scaleCity: 13.8 },
		{ width: 1366, scaleRural: 11.2, scaleCity: 14 },
		{ width: 1440, scaleRural: 11.3, scaleCity: 14 },
		{ width: 1600, scaleRural: 11.4, scaleCity: 14.2 },
		{ width: 1920, scaleRural: 11.7, scaleCity: 14.5 },
		{ width: 2560, scaleRural: 12.2, scaleCity: 14.8 },
		{ width: 3840, scaleRural: 12.3, scaleCity: 15 },
		{ width: Infinity, scaleRural: 12.5, scaleCity: 16 },
	]

	const changeZoom = () => {
		const matchedSetting = scaleSettings.find((setting) => window.innerWidth <= setting.width)
		const matchedIndex = scaleSettings.indexOf(matchedSetting)

		setZoom(matchedIndex)
	}

	useEffect(() => {
		window.addEventListener('resize', changeZoom)
		changeZoom() // Llama inicialmente para establecer el valor correcto según la resolución actual

		return () => window.removeEventListener('resize', changeZoom)
	}, [])
	return (
		<div className={`!min-h-[90vh] relative w-full flex flex-wrap pb-3`}>
			<ToastContainer className={'absolute top-0'} stacked />
			<div className='!min-h-[inherit] !shadow-md !shadow-black/40 !rounded-2xl p-2 md:w-1/2 w-full'>
				<MapCustom
					id={1}
					center={center}
					activeZoom={false}
					zoom={scaleSettings[zoom].scaleRural}
					markers={markersRecloser}
					polylines={polylines}
				/>
			</div>
			<div className='min-h-[inherit]  !shadow-md !shadow-black/40 !rounded-2xl p-2 md:w-1/2 w-full'>
				<MapCustom
					id={2}
					center={centerCity}
					activeZoom={false}
					zoom={scaleSettings[zoom].scaleCity}
					markers={markersRecloser}
					polylines={polylines}
				/>
			</div>
		</div>
	)
}

export default Map
