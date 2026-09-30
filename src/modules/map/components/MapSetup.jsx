import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import { Button } from '@mui/material'
import 'leaflet/dist/leaflet.css'
import { request } from '../../../utils/js/request'
import { backend } from '../../../utils/routes/app.routes'
import { BASE_LAYERS } from '../context/MapContext'
import { createNetworkOverlay, swapBaseLayer } from '../utils/js/networkOverlay'

/*
 * Alta de la vista por defecto del mapa (MapLocations).
 *
 * Aparece cuando GET /map responde NO_MAP: en vez de pedir que se cargue la
 * fila a mano en la base, el operador encuadra la zona y la guarda. Es la vista
 * con la que abre cualquier usuario que todavia no movio el mapa; despues cada
 * uno guarda la suya en sus preferencias.
 */

const API = () => backend[`${import.meta.env.VITE_APP_NAME}`]

// Se arranca mirando el pais entero y el operador acerca hasta su zona
const ARGENTINA = { center: [-38.4, -63.6], zoom: 4.5 }

function MapSetup({ elements = [], onCreated }) {
	const containerRef = useRef(null)
	const mapRef = useRef(null)
	const [view, setView] = useState(null)
	const [name, setName] = useState('Mapa principal')
	const [saving, setSaving] = useState(false)
	const [error, setError] = useState(null)

	useEffect(() => {
		const map = L.map(containerRef.current, {
			zoomControl: false,
			attributionControl: false,
			zoomSnap: 0.25,
			zoomDelta: 0.25,
			wheelPxPerZoomLevel: 160,
		})
		L.control.zoom({ position: 'bottomright' }).addTo(map)
		swapBaseLayer(map, null, BASE_LAYERS.street.url)

		const leer = () => setView({ center: map.getCenter(), zoom: map.getZoom() })
		map.on('moveend zoomend', leer)
		map.setView(ARGENTINA.center, ARGENTINA.zoom)
		leer()

		/*
		 * Los elementos ya cargados, como referencia. Se usa la
		 * misma capa que el mapa operativo para que las etiquetas se acomoden sin
		 * pisarse. Sin datos en vivo: forma de su tipo y color de "sin equipo".
		 * Va despues de fijar la vista porque syncTags mide en pantalla.
		 */
		const overlay = createNetworkOverlay(map, { tooltips: false })
		overlay.syncMarkers(elements)

		// El contenedor puede cambiar de tamano (panel lateral, pantalla completa)
		const ro = new ResizeObserver(() => map.invalidateSize())
		ro.observe(containerRef.current)

		mapRef.current = map
		return () => {
			ro.disconnect()
			overlay.destroy()
			map.remove()
			mapRef.current = null
		}
		// elements llega una sola vez con la carga: no se recrea el mapa
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const guardar = async () => {
		const map = mapRef.current
		if (!map || saving) return
		const nombre = name.trim()
		if (!nombre) {
			setError('Poné un nombre para la vista')
			return
		}
		setSaving(true)
		setError(null)
		const c = map.getCenter()
		try {
			await request(`${API()}/map`, 'POST', {
				name: nombre,
				center: [Number(c.lat.toFixed(6)), Number(c.lng.toFixed(6))],
				zoom: map.getZoom(),
			})
			onCreated()
		} catch (e) {
			// Otro usuario la dio de alta mientras tanto: ya hay mapa, se carga ese
			if (e?.code === 'MAP_EXISTS') {
				onCreated()
				return
			}
			setError(e?.message || (typeof e === 'string' ? e : 'No se pudo guardar la vista'))
			setSaving(false)
		}
	}

	return (
		<div className='rc-map'>
			<div className='rc-mapcard'>
				<div className='rc-canvas' ref={containerRef} />
				<div className='rc-setup-cross' aria-hidden='true' />
			</div>
			{/*
			 * Panel al costado y no flotando sobre el mapa: ocupa el lugar del panel
			 * de equipos del mapa operativo, asi el area que se encuadra aca es la
			 * misma que se ve despues y la mira marca el centro real.
			 */}
			<aside className='rc-panel rc-setup'>
				<h2>Configurar el mapa</h2>
				<p>
					Todavía no hay una vista inicial cargada. Mové y acercá el mapa hasta encuadrar la red y guardala: es la vista
					con la que se abre el mapa para todos los usuarios.
				</p>
				<label className='rc-setup-label' htmlFor='rc-setup-name'>
					Nombre
				</label>
				<input
					id='rc-setup-name'
					className='rc-search'
					value={name}
					maxLength={255}
					onChange={(e) => setName(e.target.value)}
					onKeyDown={(e) => e.key === 'Enter' && guardar()}
				/>
				{view && (
					<div className='rc-setup-view'>
						Centro {view.center.lat.toFixed(5)}, {view.center.lng.toFixed(5)} · Zoom {view.zoom}
					</div>
				)}
				{error && <div className='rc-setup-error'>{error}</div>}
				<div className='rc-setup-actions'>
					<Button variant='contained' color='success' onClick={guardar} disabled={saving}>
						{saving ? 'Guardando…' : 'Guardar vista inicial'}
					</Button>
				</div>
			</aside>
		</div>
	)
}

export default MapSetup
