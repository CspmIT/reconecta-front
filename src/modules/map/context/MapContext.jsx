import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { request } from '../../../utils/js/request'
import { backend } from '../../../utils/routes/app.routes'
import { clampToCard } from '../utils/js/freeSpot'
import { buildPayload, nextIdFrom, normalizeView, sameView, sanitizeLupas, sanitizeView } from '../utils/js/prefs'
import { snapToDevice, tooCloseToLast } from '../utils/js/snap'
import { useOpenBoard } from '../../tabs/utils/openBoard'

/*
 * Contexto del mapa operativo.
 *
 * Concentra lo que el mapa y el panel comparten: datos en vivo, tramos,
 * filtros, seleccion y estado de la vista. El mapa es imperativo (Leaflet puro)
 * y el panel es declarativo; el contexto es el unico punto de encuentro, asi
 * que ninguno de los dos necesita conocer al otro.
 *
 * Fuente de datos: GET /map/live (agregado, una sola consulta para todo).
 * Los tramos vienen de GET /map/lines con las coordenadas ya resueltas.
 */

const MapContext = createContext(null)

const API = () => backend[`${import.meta.env.VITE_APP_NAME}`]

const POLL_MS = 15000
// Modulo con el que se guardan las preferencias de UI de esta vista
const PREF_MODULE = 'map'
// El layout se guarda con retardo: arrastrar una lupa no debe pegarle al backend
// en cada gesto, y encadenar varios ajustes tiene que resultar en una escritura.
const SAVE_DEBOUNCE_MS = 1200
// Pasado este margen sin respuesta, el pie del panel avisa que los datos no estan frescos
const STALE_MS = POLL_MS * 3

export const BASE_LAYERS = {
	street: {
		label: 'Mapa',
		// Es TMS, no XYZ: el eje Y va invertido y hace falta {-y}. Con {y} los
		// tiles se dibujan espejados en latitud y la ubicacion sale mal.
		url: 'https://wms.ign.gob.ar/geoserver/gwc/service/tms/1.0.0/capabaseargenmap@EPSG%3A3857@png/{z}/{x}/{-y}.png',
	},
	gris: {
		label: 'Gris',
		url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
	},
	satelite: {
		label: 'Satelital',
		url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
	},
}

export function MapProvider({ children }) {
	const [config, setConfig] = useState(null)
	const [types, setTypes] = useState([])
	const [devices, setDevices] = useState([])
	const [lines, setLines] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	const [stamp, setStamp] = useState(null)

	// Filtros y seleccion
	const [query, setQuery] = useState('')
	const [statusFilter, setStatusFilter] = useState('todos')
	const [visibleTypes, setVisibleTypes] = useState(null) // Set de id_type; null = sin cargar
	const [selected, setSelected] = useState(null)
	const [hovered, setHovered] = useState(null)

	// Lupas: ventanas flotantes, cada una con su propio mapa
	const [lupas, setLupas] = useState([])
	const [showGuides, setShowGuides] = useState(true)
	const [armed, setArmed] = useState(false)
	const nextLupaId = useRef(1)
	/*
	 * Registro mutable de las lupas montadas: id -> { lmap, el, geom }.
	 * Arrastrar o hacer zoom dentro de una lupa cambia su geometria en cada
	 * frame; si eso viviera en estado de React redibujaria todo el arbol por
	 * frame. Las guias se redibujan escuchando `guidesTick` en su lugar.
	 */
	const lupaRegistry = useRef(new Map())
	/*
	 * Contador de apilado de lupas. Se usa z-index y NO se reordena el DOM:
	 * mover el nodo libera la captura del puntero (rompe el arrastre) y ademas
	 * React asume que controla el orden de los hijos que renderizo.
	 * Arranca en el z-index base de .rc-lupa.
	 */
	const lupaZ = useRef(500)
	const guidesTick = useRef(new Set())
	// Compartidas para que las guias y el dibujo del recuadro no necesiten props
	const mainMapRef = useRef(null)
	const cardRef = useRef(null)
	const saveTimer = useRef(null)
	const prefsRef = useRef({ baseKey: 'street', showGuides: true, panelCollapsed: false, lupas: [] })
	/*
	 * Centro y zoom del mapa principal, lo ultimo que dejo el operador. Va en un
	 * ref y no en el estado por lo mismo que la geometria de las lupas: un
	 * arrastre dispararia un render por frame. OperationalMap lo lee al crear el
	 * mapa y lo escribe en cada moveend/zoomend.
	 */
	const viewRef = useRef(null)
	// Evita que la carga inicial de preferencias dispare un guardado
	const prefsListas = useRef(false)
	// Ver el cleanup de mas abajo: hay cleanups de hijos que agendan guardados
	const montado = useRef(true)

	// Editor de tramos
	const [lineMode, setLineMode] = useState(false)
	const [draft, setDraft] = useState([])
	const [selectedLine, setSelectedLine] = useState(null)
	const [savingLine, setSavingLine] = useState(false)
	/*
	 * El handler de click de cada marcador se crea una sola vez, asi que no
	 * puede leer `lineMode` del estado: lo lee de este ref. En modo edicion el
	 * click sobre un equipo agrega un vertice anclado en vez de seleccionarlo.
	 */
	const lineModeRef = useRef(false)
	// Espejos para los handlers de Leaflet, que se crean una sola vez
	const draftRef = useRef([])
	const onMapRef = useRef([])
	const linesRef = useRef([])

	// Estado de la vista
	const [locked, setLocked] = useState(false)
	const [baseKey, setBaseKey] = useState('street')
	const [panelCollapsed, setPanelCollapsed] = useState(false)
	const [fullscreen, setFullscreen] = useState(false)
	const [toast, setToast] = useState(null)
	// Contenedor del modulo entero (mapa + panel): es el que se va a pantalla completa
	const rootRef = useRef(null)
	// Elemento que este modulo puso en pantalla completa, para poder soltarlo al desmontar
	const fsElRef = useRef(null)

	const configRef = useRef(null)
	const toastTimer = useRef(null)
	// Espejo de visibleTypes para poder leerlo sin depender del re-render:
	// los updaters de estado deben ser puros (StrictMode los llama dos veces).
	const visibleTypesRef = useRef(null)

	/* ---------------- carga inicial ---------------- */
	useEffect(() => {
		let cancelado = false
		/*
		 * Solo /map es esencial: sin la vista por defecto no hay mapa. Los tipos
		 * y los tramos se piden en paralelo pero fallan por separado, para que
		 * un error en cualquiera de los dos no deje la pantalla en blanco.
		 */
		const cargar = async () => {
			const [mapRes, typesRes, linesRes] = await Promise.allSettled([
				request(`${API()}/map`, 'GET'),
				request(`${API()}/ElementTypes`, 'GET'),
				request(`${API()}/map/lines`, 'GET'),
			])
			if (cancelado) return

			if (mapRes.status === 'rejected') {
				setError(mapRes.reason?.message || 'No se pudo cargar la vista del mapa')
				setLoading(false)
				return
			}
			configRef.current = mapRes.value.data
			setConfig(mapRes.value.data)

			if (linesRes.status === 'fulfilled') {
				setLines(linesRes.value.data || [])
			} else {
				console.error('No se pudieron cargar los tramos:', linesRes.reason?.message || linesRes.reason)
			}

			if (typesRes.status === 'fulfilled') {
				const activos = (typesRes.value.data || []).filter((t) => t.status)
				setTypes(activos)
				await cargarFiltros(mapRes.value.data.id, activos)
			} else {
				// Sin tipos no se puede filtrar: visibleTypes queda en null y se
				// muestran todos los equipos, en lugar de no mostrar ninguno.
				console.error('No se pudieron cargar los tipos:', typesRes.reason?.message || typesRes.reason)
			}

			await restaurarPrefs()
			if (cancelado) return
			prefsListas.current = true
			setLoading(false)
		}
		cargar()
		return () => {
			cancelado = true
		}
	}, [])

	/*
	 * Filtros por tipo guardados por usuario. Se mantiene el contrato existente
	 * de UserChecksHome (type 4): cada fila guardada representa un tipo OCULTO.
	 */
	const cargarFiltros = async (idMap, tiposActivos) => {
		const todos = new Set(tiposActivos.map((t) => t.id))
		try {
			const guardados = await request(`${API()}/UserChecksHome/4`, 'GET')
			const ocultos = (guardados.data || []).filter((f) => f.id_map === idMap).map((f) => f.check)
			ocultos.forEach((id) => todos.delete(id))
		} catch (e) {
			// Sin preferencias guardadas se muestran todos los tipos
			console.error('No se pudieron leer los filtros del usuario:', e?.message || e)
		}
		visibleTypesRef.current = todos
		setVisibleTypes(todos)
	}

	/*
	 * Preferencias de UI del mapa (UserPrefs, modulo 'map'). Se restaura el
	 * layout de lupas, la capa base, las guias y el panel.
	 *
	 * `locked` NO se persiste a proposito: si la vista volviera bloqueada al
	 * entrar, el mapa parece roto (no se puede mover) sin que se entienda por que.
	 *
	 * El centro y el zoom se guardan JUNTOS: restaurar solo el zoom dejaria al
	 * operador mirando el encuadre por defecto con su acercamiento, o sea un
	 * pedazo cualquiera del mapa.
	 */
	const restaurarPrefs = async () => {
		try {
			const res = await request(`${API()}/userPref/${PREF_MODULE}`, 'GET')
			const pref = res.data
			if (!pref) return
			if (BASE_LAYERS[pref.baseKey]) setBaseKey(pref.baseKey)
			if (typeof pref.showGuides === 'boolean') setShowGuides(pref.showGuides)
			if (typeof pref.panelCollapsed === 'boolean') setPanelCollapsed(pref.panelCollapsed)
			viewRef.current = sanitizeView(pref.view)
			const validas = sanitizeLupas(pref.lupas)
			if (validas.length) {
				setLupas(validas)
				nextLupaId.current = nextIdFrom(validas)
			}
		} catch (e) {
			// Sin preferencias guardadas se usan los defaults
			console.error('No se pudieron leer las preferencias del mapa:', e?.message || e)
		}
	}

	const saveFiltro = (idType, visible) => {
		const idMap = configRef.current?.id
		if (!idMap) return
		request(`${API()}/UserChecksHome`, 'POST', {
			check: idType,
			status: visible ? 1 : 0,
			type: 4,
			id_map: idMap,
		}).catch((e) => console.error('No se pudo guardar el filtro:', e?.message || e))
	}

	const toggleType = useCallback((idType) => {
		const actual = visibleTypesRef.current
		if (!actual) return
		const visible = actual.has(idType)
		const next = new Set(actual)
		visible ? next.delete(idType) : next.add(idType)
		// Se adelanta el ref para que dos clicks seguidos no se pisen
		visibleTypesRef.current = next
		setVisibleTypes(next)
		saveFiltro(idType, !visible)
	}, [])

	const setAllTypes = useCallback(
		(todos) => {
			const next = todos ? new Set(types.map((t) => t.id)) : new Set()
			visibleTypesRef.current = next
			setVisibleTypes(next)
			types.forEach((t) => saveFiltro(t.id, todos))
		},
		[types]
	)

	/* ---------------- datos en vivo ---------------- */
	useEffect(() => {
		if (!config) return
		let cancelado = false
		const tick = async () => {
			try {
				const res = await request(`${API()}/map/live`, 'GET')
				if (cancelado) return
				setDevices(res.data || [])
				setStamp(Date.now())
				setError(null)
			} catch (e) {
				if (!cancelado) setError(e?.message || 'Sin datos en vivo')
			}
		}
		tick()
		const id = setInterval(tick, POLL_MS)
		return () => {
			cancelado = true
			clearInterval(id)
		}
	}, [config])

	const reloadLines = useCallback(async () => {
		try {
			const res = await request(`${API()}/map/lines`, 'GET')
			setLines(res.data || [])
		} catch (e) {
			console.error('No se pudieron recargar los tramos:', e?.message || e)
		}
	}, [])

	/* ---------------- derivados ---------------- */
	// Lo que el mapa dibuja: solo el filtro por tipo, para no hacer desaparecer
	// equipos del mapa al buscar o al filtrar por estado en el panel.
	const onMap = useMemo(() => {
		// visibleTypes en null = todavia no hay filtro cargado (o fallaron los
		// tipos): se muestra todo antes que nada.
		if (!visibleTypes) return devices
		/*
		 * Con el filtro de alarma activo se dibujan tambien los equipos alarmados
		 * de tipos ocultos. El badge cuenta todas las alarmas de la red, asi que
		 * si al tocarlo la tabla no pudiera listarlas el numero no llevaria a
		 * ninguna parte; y una fila sin marcador en el mapa no se puede ubicar.
		 */
		if (statusFilter === 'alarma') {
			return devices.filter((d) => visibleTypes.has(d.type) || d.alarm)
		}
		return devices.filter((d) => visibleTypes.has(d.type))
	}, [devices, visibleTypes, statusFilter])

	// Lo que lista el panel: tipo + estado + busqueda.
	// 'alarma' no es un valor de `st`: la alarma es una dimension aparte del
	// estado del equipo, asi que filtra por su propio campo.
	const listed = useMemo(() => {
		const q = query.trim().toLowerCase()
		return onMap.filter((d) => {
			if (statusFilter === 'alarma') {
				if (!d.alarm) return false
			} else if (statusFilter !== 'todos' && d.st !== statusFilter) {
				return false
			}
			if (!q) return true
			return (
				(d.name || '').toLowerCase().includes(q) || (d.description || '').toLowerCase().includes(q)
			)
		})
	}, [onMap, statusFilter, query])

	/*
	 * Alarmas de TODA la red, incluidas las de tipos ocultos por el filtro: el
	 * operador tiene que enterarse de que hay algo importante aunque no lo este
	 * mirando. Al activar el filtro esos equipos aparecen (ver onMap).
	 */
	const alarmCount = useMemo(() => devices.filter((d) => d.alarm).length, [devices])

	// Cuantas de esas alarmas estan en tipos que hoy no se muestran, para avisarlo
	const alarmHidden = useMemo(() => {
		if (!visibleTypes) return 0
		return devices.filter((d) => d.alarm && !visibleTypes.has(d.type)).length
	}, [devices, visibleTypes])

	/*
	 * Si se esta filtrando por alarma y la ultima alarma se normaliza, el filtro
	 * quedaria activo sobre una lista vacia y el chip desaparecido: se vuelve a
	 * "todos" en vez de dejar al operador mirando una tabla vacia sin causa
	 * visible.
	 */
	useEffect(() => {
		if (statusFilter === 'alarma' && alarmCount === 0) setStatusFilter('todos')
	}, [statusFilter, alarmCount])

	const counts = useMemo(() => {
		const byType = {}
		devices.forEach((d) => {
			byType[d.type] = (byType[d.type] || 0) + 1
		})
		return byType
	}, [devices])

	const stale = stamp !== null && Date.now() - stamp > STALE_MS

	/* ---------------- lupas ---------------- */
	const addLupa = useCallback((bounds, geom) => {
		const id = nextLupaId.current++
		setLupas((prev) => [...prev, { id, name: `Lupa ${id}`, bounds, ...geom }])
		return id
	}, [])

	const removeLupa = useCallback((id) => {
		lupaRegistry.current.delete(id)
		setLupas((prev) => prev.filter((l) => l.id !== id))
	}, [])

	/** La geometria se confirma al soltar el gesto, no en cada frame. */
	const commitLupaGeom = useCallback((id, geom) => {
		setLupas((prev) => prev.map((l) => (l.id === id ? { ...l, ...geom } : l)))
	}, [])

	/**
	 * Mete las lupas de nuevo dentro del contenedor cuando este se achica
	 * (salir de pantalla completa, plegar el panel, reducir la ventana). Sin
	 * esto una ventana movida contra el borde del monitor queda recortada
	 * afuera, invisible y sin manera de traerla de vuelta.
	 *
	 * Devuelve `prev` si nada se movio: cualquier objeto nuevo dispararia un
	 * render y un guardado de preferencias por cada evento de resize.
	 */
	const clampLupas = useCallback((cardWidth, cardHeight) => {
		if (cardWidth < 120 || cardHeight < 120) return
		setLupas((prev) => {
			let cambio = false
			const next = prev.map((l) => {
				const g = clampToCard(l, cardWidth, cardHeight)
				if (g.x === l.x && g.y === l.y && g.w === l.w && g.h === l.h) return l
				cambio = true
				return { ...l, ...g }
			})
			return cambio ? next : prev
		})
	}, [])

	/*
	 * Guarda el layout con retardo. Los limites de cada lupa se leen del
	 * registro y no del estado: el estado tiene el encuadre con el que se creo,
	 * mientras que el operador pudo haber hecho zoom o desplazado dentro de la
	 * ventana, y lo que hay que restaurar es lo que esta viendo ahora.
	 */
	const guardarPrefs = useCallback(() => {
		if (!prefsListas.current || !montado.current) return
		clearTimeout(saveTimer.current)
		saveTimer.current = setTimeout(() => {
			const payload = buildPayload(prefsRef.current, lupaRegistry.current, viewRef.current)
			request(`${API()}/userPref/${PREF_MODULE}`, 'PUT', payload).catch((e) =>
				console.error('No se pudieron guardar las preferencias del mapa:', e?.message || e)
			)
		}, SAVE_DEBOUNCE_MS)
		// Sin dependencias: lee todo de prefsRef. Si dependiera del estado, su
		// identidad cambiaria en cada render y los efectos que la capturan
		// (creacion de la lupa, arrastre) se quedarian con versiones viejas —
		// al cerrar una ventana el cleanup guardaba la lupa ya borrada.
	}, [])

	// Espejo del estado que se persiste. Va ANTES del efecto que guarda para
	// que el guardado siempre lea valores frescos.
	useEffect(() => {
		prefsRef.current = { baseKey, showGuides, panelCollapsed, lupas }
	}, [baseKey, showGuides, panelCollapsed, lupas])

	// Cambios que disparan un guardado. El zoom/pan dentro de una lupa no pasa
	// por el estado, asi que lo agenda emitGuidesChange.
	useEffect(() => {
		guardarPrefs()
	}, [baseKey, showGuides, panelCollapsed, lupas, guardarPrefs])

	/*
	 * Al desmontar hay que cortar el guardado agendado, y ademas marcar el
	 * contexto como muerto.
	 *
	 * Lo segundo no es paranoia: React 18 corre los cleanups de PADRE a HIJO, asi
	 * que este limpia el timer y despues el cleanup de cada LupaWindow llama a
	 * emitGuidesChange, que agenda uno nuevo que ya nadie cancela. Medido: al
	 * salir del mapa quedaba una escritura al backend por desmontaje, disparada
	 * 1,2s despues con las preferencias de un contexto que ya no existe.
	 *
	 * La bandera se PRENDE en el setup y no solo se apaga en el cleanup. Con
	 * StrictMode el desmontaje simulado corre el cleanup y vuelve a montar el
	 * mismo componente, que conserva sus refs: si el setup no la reactivara,
	 * quedaria apagada para siempre y en desarrollo no se guardaria ninguna
	 * preferencia. Medido: 0 escrituras en dev, todas correctas en el build.
	 */
	useEffect(() => {
		montado.current = true
		return () => {
			montado.current = false
			clearTimeout(saveTimer.current)
		}
	}, [])

	// Suscripcion para redibujar las guias sin pasar por el estado de React
	const onGuidesChange = useCallback((cb) => {
		guidesTick.current.add(cb)
		return () => guidesTick.current.delete(cb)
	}, [])
	/**
	 * Centro y zoom que dejo el operador. Comparte el debounce del resto de las
	 * preferencias, y no guarda si la vista no cambio: el propio setView de la
	 * creacion del mapa dispara un moveend, y sin la comparacion cada arranque
	 * escribiria al backend sin que nadie hubiera movido nada.
	 */
	const commitView = useCallback(
		(center, zoom) => {
			const nueva = normalizeView(center, zoom)
			if (sameView(viewRef.current, nueva)) return
			viewRef.current = nueva
			guardarPrefs()
		},
		[guardarPrefs]
	)

	const emitGuidesChange = useCallback(() => {
		guidesTick.current.forEach((cb) => cb())
		// Mover o hacer zoom en una lupa no toca el estado de React: el guardado
		// se agenda aca. El debounce colapsa la rafaga de un gesto en una escritura.
		guardarPrefs()
	}, [guardarPrefs])

	// Esc cancela el modo dibujo; bloquear la vista tambien lo apaga
	useEffect(() => {
		if (!armed) return
		const onKey = (e) => e.key === 'Escape' && setArmed(false)
		document.addEventListener('keydown', onKey)
		return () => document.removeEventListener('keydown', onKey)
	}, [armed])

	useEffect(() => {
		if (locked && armed) setArmed(false)
	}, [locked, armed])

	/* ---------------- avisos ---------------- */
	// Declarado antes que el editor de tramos: sus acciones lo usan
	const showToast = useCallback((msg) => {
		setToast(msg)
		clearTimeout(toastTimer.current)
		toastTimer.current = setTimeout(() => setToast(null), 3200)
	}, [])

	useEffect(() => () => clearTimeout(toastTimer.current), [])

	/* ---------------- pantalla completa ---------------- */
	/*
	 * Hay puestos que dejan el mapa todo el dia en un monitor dedicado, asi que
	 * conviene poder sacarle el chrome de la app y del navegador. Se usa la API
	 * nativa sobre el contenedor del modulo: el elemento pasa a la capa superior
	 * y no depende de z-index (el navbar de MUI esta en 1201 y el mapa vive
	 * dentro de un `z-10 relative`, que es un contexto de apilado: desde ahi
	 * ningun z-index puede taparlo).
	 *
	 * NO se persiste, igual que `locked`: entrar a pantalla completa exige un
	 * gesto del usuario, asi que al recargar no se podria restaurar y el boton
	 * quedaria mintiendo.
	 */
	const toggleFullscreen = useCallback(() => {
		const el = rootRef.current
		if (!el) return
		if (document.fullscreenElement === el) {
			document.exitFullscreen?.()
			return
		}
		if (!el.requestFullscreen) {
			showToast('Este navegador no permite pantalla completa')
			return
		}
		fsElRef.current = el
		// El navegador puede negarla (permiso, gesto no confiable): se avisa en
		// vez de dejar un boton que no hace nada
		el.requestFullscreen().catch(() => showToast('El navegador no permitio pantalla completa'))
	}, [showToast])

	// Un solo lugar donde se lee el estado real: el usuario puede salir con Esc
	// o desde el navegador, sin pasar por el boton
	useEffect(() => {
		const onChange = () => setFullscreen(document.fullscreenElement === rootRef.current)
		document.addEventListener('fullscreenchange', onChange)
		return () => document.removeEventListener('fullscreenchange', onChange)
	}, [])

	/*
	 * Salir de la vista en pantalla completa dejaria toda la app a pantalla
	 * completa. Se compara contra `fsElRef` y no contra `rootRef`: al desmontar,
	 * React ya desengancho el ref del DOM, y encima en el primer render de la
	 * vista (mientras carga) todavia no habia elemento que capturar.
	 */
	useEffect(
		() => () => {
			if (fsElRef.current && document.fullscreenElement === fsElRef.current) document.exitFullscreen?.()
		},
		[]
	)

	/* ---------------- editor de tramos ---------------- */
	useEffect(() => {
		lineModeRef.current = lineMode
	}, [lineMode])
	useEffect(() => {
		draftRef.current = draft
	}, [draft])
	useEffect(() => {
		onMapRef.current = onMap
	}, [onMap])
	useEffect(() => {
		linesRef.current = lines
	}, [lines])

	// Entrar al editor despeja la pantalla: sin panel y sin lupas encima
	const prevPanel = useRef(false)
	const toggleLineMode = useCallback((v) => {
		setLineMode((prev) => {
			const next = v === undefined ? !prev : v
			if (next && !prev) {
				prevPanel.current = panelCollapsed
				setPanelCollapsed(true)
			} else if (!next && prev) {
				setPanelCollapsed(prevPanel.current)
			}
			if (!next) {
				setDraft([])
				setSelectedLine(null)
			}
			return next
		})
	}, [panelCollapsed])

	/*
	 * Unico camino para agregar un vertice, sin importar de donde venga el clic:
	 * el mapa vacio, un marcador, o encima de un tramo ya dibujado. La capa de
	 * click de los tramos corta la propagacion, asi que si cada caso tuviera su
	 * propia rama, en medio de un trazado el clic sobre un tramo existente se
	 * perderia sin agregar nada.
	 */
	const addPointFromMap = useCallback((latlng) => {
		const map = mainMapRef.current
		if (!map) return
		const punto = snapToDevice(map, latlng, onMapRef.current)
		if (tooCloseToLast(map, draftRef.current, punto)) return
		setDraft((prev) => [...prev, punto])
	}, [])

	const undoDraftVertex = useCallback(() => setDraft((prev) => prev.slice(0, -1)), [])
	const clearDraft = useCallback(() => setDraft([]), [])

	const createLine = useCallback(
		async (name, vertices) => {
			setSavingLine(true)
			try {
				await request(`${API()}/map/lines`, 'POST', { name, vertices })
				await reloadLines()
				setDraft([])
				showToast(`Tramo <b>${name}</b> guardado`)
			} catch (e) {
				showToast(e?.message || 'No se pudo guardar el tramo')
			} finally {
				setSavingLine(false)
			}
		},
		[reloadLines, showToast]
	)

	const renameLine = useCallback(
		async (id, name) => {
			setSavingLine(true)
			try {
				await request(`${API()}/map/lines/${id}`, 'PUT', { name })
				await reloadLines()
				showToast(`Tramo renombrado a <b>${name}</b>`)
			} catch (e) {
				showToast(e?.message || 'No se pudo renombrar el tramo')
			} finally {
				setSavingLine(false)
			}
		},
		[reloadLines, showToast]
	)

	const deleteLine = useCallback(
		async (id) => {
			setSavingLine(true)
			try {
				await request(`${API()}/map/lines/${id}`, 'DELETE')
				await reloadLines()
				setSelectedLine(null)
				showToast('Tramo eliminado')
			} catch (e) {
				showToast(e?.message || 'No se pudo eliminar el tramo')
			} finally {
				setSavingLine(false)
			}
		},
		[reloadLines, showToast]
	)

	/* ---------------- ir al tablero del equipo ---------------- */
	/*
	 * `/map/live` trae el elemento, no sus equipos: son datos de ABM que casi no
	 * cambian, y meterlos en un poll de 15s seria pagarlos todo el tiempo para
	 * usarlos en un clic. Se piden a `/Elements/:id` en el momento.
	 *
	 * Un elemento puede tener varios equipos (medido en desarrollo: ET1 y CE01
	 * tienen 7 cada uno, RE02 y SETA64 dos), asi que cuando hay mas de uno hay
	 * que preguntar cual. Las subestaciones rurales (tipo 3) no tienen equipos:
	 * abren su propio tablero.
	 */
	const openBoard = useOpenBoard()
	const [openingId, setOpeningId] = useState(null)
	const [equipChoice, setEquipChoice] = useState(null)

	const abrirTablero = useCallback(
		async (device) => {
			if (!device) return
			setOpeningId(device.id)
			try {
				const res = await request(`${API()}/Elements/${device.id}`, 'GET')
				const element = (res.data || [])[0]
				if (!element) {
					showToast('No se encontro el elemento')
					return
				}
				if (element.type === 3) {
					openBoard({
						id: element.id,
						elementName: element.name,
						elementType: 3,
						clients: element.clients,
					})
					return
				}
				const equipos = (element.equipments || []).filter((eq) => eq.equipmentmodels)
				if (!equipos.length) {
					showToast(`${element.name} no tiene equipos asociados`)
					return
				}
				const comun = { elementName: element.name, elementType: element.type, clients: element.clients }
				if (equipos.length === 1) {
					openBoard({ ...equipos[0], ...comun })
					return
				}
				setEquipChoice({ element, equipos, comun })
			} catch (e) {
				showToast(e?.message || 'No se pudieron leer los equipos del elemento')
			} finally {
				setOpeningId(null)
			}
		},
		[openBoard, showToast]
	)

	// El efecto va FUERA del updater a proposito: StrictMode llama los updaters
	// dos veces y abriria la pestana (y navegaria) dos veces por clic
	const elegirEquipo = useCallback(
		(equipo) => {
			if (!equipChoice) return
			setEquipChoice(null)
			openBoard({ ...equipo, ...equipChoice.comun })
		},
		[equipChoice, openBoard]
	)

	/* ---------------- acciones de vista ---------------- */
	const cycleBase = useCallback(() => {
		const keys = Object.keys(BASE_LAYERS)
		setBaseKey((prev) => keys[(keys.indexOf(prev) + 1) % keys.length])
	}, [])

	const value = {
		// datos
		config,
		types,
		devices,
		onMap,
		listed,
		alarmCount,
		alarmHidden,
		counts,
		lines,
		loading,
		error,
		stamp,
		stale,
		reloadLines,
		// filtros
		query,
		setQuery,
		statusFilter,
		setStatusFilter,
		visibleTypes,
		toggleType,
		setAllTypes,
		// seleccion
		selected,
		setSelected,
		hovered,
		setHovered,
		// editor de tramos
		lineMode,
		toggleLineMode,
		lineModeRef,
		draft,
		draftRef,
		linesRef,
		onMapRef,
		addPointFromMap,
		undoDraftVertex,
		clearDraft,
		selectedLine,
		setSelectedLine,
		savingLine,
		createLine,
		renameLine,
		deleteLine,
		// lupas
		lupas,
		addLupa,
		removeLupa,
		commitLupaGeom,
		clampLupas,
		lupaRegistry,
		lupaZ,
		mainMapRef,
		cardRef,
		viewRef,
		commitView,
		showGuides,
		setShowGuides,
		armed,
		setArmed,
		onGuidesChange,
		emitGuidesChange,
		// vista
		locked,
		setLocked,
		baseKey,
		cycleBase,
		panelCollapsed,
		setPanelCollapsed,
		fullscreen,
		toggleFullscreen,
		rootRef,
		// tablero del equipo
		abrirTablero,
		openingId,
		equipChoice,
		setEquipChoice,
		elegirEquipo,
		toast,
		showToast,
	}

	return <MapContext.Provider value={value}>{children}</MapContext.Provider>
}

export function useMapContext() {
	const ctx = useContext(MapContext)
	if (!ctx) throw new Error('useMapContext debe usarse dentro de MapProvider')
	return ctx
}
