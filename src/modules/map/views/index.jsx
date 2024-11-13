import MapCustom from '../components/MapCustom'
import { useEffect, useState } from 'react'
import { polylines } from '../utils/js/polilines'
import { request } from '../../../utils/js/request'
import { backend } from '../../../utils/routes/app.routes'
import markerCustom from '../utils/js/markerClass'
import { IconButton } from '@mui/material'
import { Lock, LockOpen } from '@mui/icons-material'
import LoaderComponent from '../../../components/Loader'
function Map() {
	const [markersRecloser, setMarkersRecloser] = useState(null)
	const [dataMap, setDataMap] = useState([])
	const [zoomActive, setZoomActive] = useState([])
	const [activeMove, setActiveMove] = useState([])
	const [changeZoom, setChangeZoom] = useState(false)
	// Cargar datos iniciales de la base de datos
	useEffect(() => {
		const getCenter = async () => {
			const url = `${backend.Reconecta}/getDataMap`
			const responseData = await request(url, 'GET').then((res) => res.data)
			let data = []
			for (const element of responseData) {
				data.push({
					center: [element.lat_location, element.lng_location],
					zoom: adjustZoomToScreenSize(element.zoom),
					id: element.id,
				})
			}
			setDataMap(data)
			setZoomActive(Array(data.length).fill(true))
			setActiveMove(Array(data.length).fill(true))
		}
		getCenter()
	}, [])

	// Escalas para el ajuste de zoom
	const scaleSettings = [
		{ width: 330, scaleFactor: 0.87 },
		{ width: 425, scaleFactor: 0.91 },
		{ width: 640, scaleFactor: 0.92 },
		{ width: 768, scaleFactor: 0.97 },
		{ width: 1024, scaleFactor: 0.93 },
		{ width: 1280, scaleFactor: 0.96 },
		{ width: 1366, scaleFactor: 0.97 },
		{ width: 1440, scaleFactor: 0.98 },
		{ width: 1600, scaleFactor: 0.99 },
		{ width: 1920, scaleFactor: 1 },
		{ width: 2560, scaleFactor: 1.035 },
		{ width: 3840, scaleFactor: 1.09 },
		{ width: Infinity, scaleFactor: 1.1 },
	]

	// Función para ajustar el zoom según el tamaño de la pantalla
	const adjustZoomToScreenSize = (baseZoom) => {
		const matchedSetting = scaleSettings.find((setting) => window.innerWidth <= setting.width)
		const scaleFactor = matchedSetting ? matchedSetting.scaleFactor : 1
		return baseZoom * scaleFactor
	}

	const getdisplay = async () => {
		try {
			const nodes = await request(`${backend[`${import.meta.env.VITE_APP_NAME}`]}/getListNode`, 'GET')
			// Group markers by id_map
			const markersByMap = {}
			if (nodes.data.length > 0) {
				await Promise.all(
					nodes.data.map(async (item) => {
						const info = item.node_history.length
							? {
									name: item.name,
									number: item.number,
							  }
							: {}
						const recloser = item.node_history.filter(
							(historyItem) => historyItem.type_device == 'Reconectador'
						)

						// Create a new marker
						const marker = new markerCustom(
							item.id,
							item.number,
							item.lat_location,
							item.lng_location,
							3,
							info,
							item.alert,
							recloser
						)

						// Fetch additional information if needed
						if (recloser.length > 0) {
							await marker.fetchInfo()
						}

						// Group markers by id_map
						if (!markersByMap[item.id_map]) {
							markersByMap[item.id_map] = []
						}
						markersByMap[item.id_map].push(marker)
					})
				)
			}

			setMarkersRecloser(markersByMap)
		} catch (error) {
			console.error('Error al obtener los nodos:', error)
		}
	}

	const handleActiveZoom = (index) => {
		setZoomActive((prevState) => {
			const newState = [...prevState]
			newState[index] = !newState[index]
			return newState
		})

		setActiveMove((prevState) => {
			const newState = [...prevState]
			newState[index] = !newState[index]
			return newState
		})
		setChangeZoom(true)
	}
	useEffect(() => {
		if (markersRecloser && dataMap && !changeZoom) {
			setZoomActive(Array(dataMap.length).fill(false))
			setActiveMove(Array(dataMap.length).fill(false))
		}
	}, [markersRecloser])
	useEffect(() => {
		getdisplay()

		const intervalId = setInterval(() => {
			getdisplay()
		}, 15000)
		return () => clearInterval(intervalId)
	}, [])
	const widthMap = ['lg:w-1/2', 'lg:w-full']
	return (
		<>
			{markersRecloser && dataMap ? (
				<div className={`!min-h-[90vh] relative w-full flex flex-wrap pb-3`}>
					{dataMap.map((map, index) => {
						return (
							<div
								key={index}
								className={`!min-h-[inherit] !shadow-md !shadow-black/40 !rounded-2xl p-2 sm:m-0 m-2 ${
									widthMap[dataMap.length > 1 ? 0 : 1]
								} w-full relative`}
							>
								<IconButton
									className={`!absolute !top-5 !left-4 z-[9999] !bg-slate-300`}
									onClick={() => handleActiveZoom(index)}
								>
									{!zoomActive[index] ? <Lock /> : <LockOpen />}
								</IconButton>
								<MapCustom
									key={index}
									center={map.center}
									activeZoom={zoomActive[index] || false}
									activeMove={activeMove[index] || false}
									zoom={map.zoom}
									markers={markersRecloser[map.id]}
									polylines={polylines[map.id]}
								/>
							</div>
						)
					})}
				</div>
			) : (
				<div className='w-full'>
					<LoaderComponent />
				</div>
			)}
		</>
	)
}

export default Map
