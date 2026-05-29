import MapCustom from '../components/MapCustom'
import { useEffect, useMemo, useRef, useState } from 'react'
import { polylines } from '../utils/js/polilines'
import { request } from '../../../utils/js/request'
import { backend } from '../../../utils/routes/app.routes'
import markerCustom from '../utils/js/markerClass'
import { IconButton } from '@mui/material'
import { Lock, LockOpen } from '@mui/icons-material'
import LoaderComponent from '../../../components/Loader'
import FilterNodesButton from '../components/FilterNodes'
function Map() {
	const [markersRecloser, setMarkersRecloser] = useState(null)
	const [dataMap, setDataMap] = useState([])
	const [zoomActive, setZoomActive] = useState([])
	const [activeMove, setActiveMove] = useState([])
	const [changeZoom, setChangeZoom] = useState(false)
	const [filtersMap, setFiltersMap] = useState(false)
	const filtersRef = useRef(filtersMap)
	// Firma de los datos del último render. Si un poll trae lo mismo, no
	// actualizamos el estado y evitamos reconstruir/parpadear los markers.
	const markersSignatureRef = useRef(null)

	// Markers visibles derivados del set completo + los checks activos.
	// Cambiar un filtro recalcula esto sin tocar la red ni remontar el mapa.
	const visibleMarkers = useMemo(() => {
		if (!markersRecloser) return markersRecloser
		const result = {}
		for (const mapId of Object.keys(markersRecloser)) {
			const status = filtersMap?.[mapId]?.status
			result[mapId] = status
				? markersRecloser[mapId].filter((marker) => status[marker.type])
				: markersRecloser[mapId]
		}
		return result
	}, [markersRecloser, filtersMap])
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

	const getdisplay = async (currentFilters = filtersRef.current) => {
		try {
			const nodes = await request(`${backend[`${import.meta.env.VITE_APP_NAME}`]}/Elements`, 'GET')
			// Firma de solo los campos que afectan al render (estado/posición/topología).
			const signature = JSON.stringify(
				(nodes.data || [])
					.filter((it) => it && it.type !== 0)
					.map((it) => [
						it.id, it.type, it.lat, it.lon, it.name, it.description,
						(it.equipments || []).map((e) => [
							e.id,
							e.equipmentmodels?.type,
							e.observation,
							e.influxData?.['d/c']?.[0]?.value ?? null,
							e.flashAlarm ?? false,
						]),
						(it.clients || []).map((c) => [c.id, c.name, c.meter, c.status ? 1 : 0]),
					])
			)
			// Group markers by id_map
			const markersByMap = {}
			let mapFilters = currentFilters
			if (nodes.data.length > 0) {
				if (!mapFilters) {
					const mapsSaved = await request(`${backend[`${import.meta.env.VITE_APP_NAME}`]}/UserChecksHome/4`, 'GET')
					const maps = nodes.data.map((item) => item.id_map)

					// Obtenemos IDs únicos
					const idMaps = [...new Set(maps)]

					// Creamos un objeto indexado por id_map
					mapFilters = {}
					idMaps.forEach((id) => {
						mapFilters[id] = { status: [false, true, true, true, true, true] }
						const existingFilters = mapsSaved.data.filter((filter) => filter.id_map === id)
						if (existingFilters.length > 0) {
							existingFilters.forEach((filter) => {
								mapFilters[id].status[filter.check] = false
							})
						}
					})
					setFiltersMap(mapFilters)
				}
				// Si nada cambió desde el último poll, no reconstruimos los markers.
				if (markersSignatureRef.current === signature) return
				await Promise.all(
					nodes.data.map(async (item, index) => {
						const mapFilter = mapFilters?.[item.id_map]
						// Traemos todos los nodos; el mostrar/ocultar por tipo se resuelve
						// en `visibleMarkers` (useMemo), sin volver a pedir al backend.
						if (!mapFilter || item.type === 0) return null

						const info = (item.equipments.length || item.type === 3)
							? {
								name: item.name,
								number: item.description,
							}
							: {}
						const recloser = item.equipments.filter(
							(equipItem) => equipItem.equipmentmodels.type == 1
						)
						let colorRecloser = 0
						if (recloser.length > 0) {
							colorRecloser = recloser[0]?.influxData?.['d/c']?.[0]?.value ?? 3;
							// Si viene en 0 le paso el valor 2 de abierto
							colorRecloser = colorRecloser === 0 ? 2 : colorRecloser
							// Veo si hay una alarma y dependiendo si esta abierto o no le cambio el parpadeo
							if (recloser[0]?.flashAlarm) {
								if (parseInt(colorRecloser) === 1) {
									colorRecloser = 4
								} else {
									if (parseInt(colorRecloser) === 3) {
										colorRecloser = 7
									} else {
										colorRecloser = 6
									}
								}
							}
						}
						// Create a new marker
						const marker = new markerCustom(
							item.id,
							item.name,
							item.lat,
							item.lon,
							colorRecloser,
							info,
							true,
							recloser,
							item.equipments,
							item.type,
							item.clients || [],
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
			if (markersSignatureRef.current !== signature) {
				markersSignatureRef.current = signature
				setMarkersRecloser(markersByMap)
			}
		} catch (error) {
			console.error(error)
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

	const handleFilter = (index, mapId) => {
		// Solo alterna la visibilidad (estado local) y persiste la preferencia.
		// No refetch ni remount: `visibleMarkers` recalcula qué se muestra.
		const status = [...filtersMap[mapId].status]
		status[index] = !status[index]
		const newFilters = {
			...filtersMap,
			[mapId]: { ...filtersMap[mapId], status }
		}
		setFiltersMap(newFilters)
		const body = {
			check: index,
			status: status[index] ? 1 : 0,
			type: 4,
			id_map: mapId
		}
		request(`${backend.Reconecta}/UserChecksHome`, 'POST', body)
	}
	useEffect(() => {
		if (markersRecloser && dataMap && !changeZoom) {
			setZoomActive(Array(dataMap.length).fill(false))
			setActiveMove(Array(dataMap.length).fill(false))
		}
	}, [markersRecloser])
	useEffect(() => {
		getdisplay(filtersRef.current)

		const intervalId = setInterval(() => {
			getdisplay(filtersRef.current)
		}, 15000)
		return () => clearInterval(intervalId)
	}, [])
	useEffect(() => {
		filtersRef.current = filtersMap
	}, [filtersMap])
	const widthMap = ['lg:w-1/2', 'lg:w-full']
	return (
		<>
			{markersRecloser && dataMap ? (
				<div className={`!min-h-[90vh] relative w-full flex flex-wrap pb-3`}>
					{dataMap.map((map, index) => {
						return (
							<div
								key={index}
								className={`!min-h-[inherit] !shadow-md !shadow-black/40 !rounded-2xl p-2 sm:m-0 m-2 ${widthMap[dataMap.length > 1 ? 0 : 1]
									} w-full relative`}
							>
								<IconButton
									className={`!absolute !top-5 !left-4 z-[9999] !bg-slate-300`}
									onClick={() => handleActiveZoom(index)}
								>
									{!zoomActive[index] ? <Lock /> : <LockOpen />}
								</IconButton>
								<FilterNodesButton filters={filtersMap?.[map.id].status} handleFilter={handleFilter} indexMap={map.id} />
								<MapCustom
									key={map.id}
									center={map.center}
									activeZoom={zoomActive[index] || false}
									activeMove={activeMove[index] || false}
									zoom={map.zoom}
									markers={visibleMarkers[map.id]}
									polylines={polylines[map.id]}
									filters={filtersMap}
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
