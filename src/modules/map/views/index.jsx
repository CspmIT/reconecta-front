import MapCustom from '../components/MapCustom'
// import { ToastContainer, toast } from 'react-toastify'
import { useEffect, useState } from 'react'
import { polylines } from '../utils/js/polilines'
import { request } from '../../../utils/js/request'
import { backend } from '../../../utils/routes/app.routes'
import markerCustom from '../utils/js/markerClass'
import { IconButton, Skeleton } from '@mui/material'
import { Lock, LockOpen } from '@mui/icons-material'
function Map() {
	const center = [-30.680865, -62.011055]
	const centerCity = [-30.712865, -62.006255]
	const [markersRecloser, setMarkersRecloser] = useState(null)
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
	const getdisplay = async () => {
		try {
			const nodes = await request(`${backend[`${import.meta.env.VITE_APP_NAME}`]}/getListNode`, 'GET')
			const markers = await Promise.all(
				nodes.data.map(async (item) => {
					const info = {
						name: item.name,
						number: item.number,
					}
					const recloser = item.node_history.filter((item) => item.type_device == 1)
					const marker = new markerCustom(item.id, item.number, item.lat_location, item.lng_location, 3, item.alert, info, recloser)
					if (recloser.length > 0) {
						await marker.fetchInfo()
					}
					return marker
				})
			)
			setMarkersRecloser(markers)
		} catch (error) {
			console.error('Error al obtener los nodos:', error)
		}
	}
	const [zoomActive, setZoomActive] = useState(true)
	const [zoomActive2, setZoomActive2] = useState(true)
	const handleActiveZoom = (map) => {
		if (map === 1) {
			setZoomActive((prev) => !prev)
		} else if (map === 2) {
			setZoomActive2((prev) => !prev)
		}
	}
	useEffect(() => {
		changeZoom()
		getdisplay()
	}, [])
	return (
		<>
			{markersRecloser ? (
				<div className={`!min-h-[90vh] relative w-full flex flex-wrap pb-3`}>
					{/* <ToastContainer className={'absolute top-0'} stacked /> */}
					<div className='!min-h-[inherit] !shadow-md !shadow-black/40 !rounded-2xl p-2 md:w-1/2 w-full relative'>
						<IconButton className={`!absolute !top-5 !left-4 z-[9999] !bg-slate-300`} onClick={() => handleActiveZoom(1)}>
							{zoomActive ? <Lock /> : <LockOpen />}
						</IconButton>
						<MapCustom
							id={1}
							center={center}
							activeZoom={zoomActive}
							zoom={scaleSettings[zoom].scaleRural}
							markers={markersRecloser}
							polylines={polylines}
						/>
					</div>
					<div className='min-h-[inherit]  !shadow-md !shadow-black/40 !rounded-2xl p-2 md:w-1/2 w-full relative'>
						<IconButton className={`!absolute !top-5 !left-4 z-[9999] !bg-slate-300`} onClick={() => handleActiveZoom(2)}>
							{!zoomActive2 ? <Lock /> : <LockOpen />}
						</IconButton>
						<MapCustom
							id={2}
							center={centerCity}
							activeZoom={zoomActive2}
							zoom={scaleSettings[zoom].scaleCity}
							markers={markersRecloser}
							polylines={polylines}
						/>
					</div>
				</div>
			) : (
				<>
					<Skeleton animation='pulse' variant='rectangular' className='w-1/2 mr-2 !h-[80vh]' />
					<Skeleton animation='pulse' variant='rectangular' className='w-1/2 !h-[80vh]' />
				</>
			)}
		</>
	)
}

export default Map
