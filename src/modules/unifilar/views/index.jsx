import { useEffect, useMemo, useRef, useState } from 'react'
import { Button, CircularProgress, MenuItem, Select, Tooltip } from '@mui/material'
import { MdUploadFile, MdDelete, MdRefresh, MdUndo, MdSave, MdFileDownload, MdFileUpload, MdLayers, MdZoomOutMap } from 'react-icons/md'
import { toast } from 'react-toastify'
import { request } from '../../../utils/js/request'
import { backend } from '../../../utils/routes/app.routes'
import { getPlans, getPlan, getPlanLive, uploadPlan, reprocessPlan, updatePlan, deletePlan } from '../utils/js/api'
import { calcular, aguasAbajo } from '../utils/js/topology'
import {
	borrar, colocar, conectar, conEscala, duplicar, editar, escalaSugerida,
	fusionar, girar, modeloVacio, mover, moverNodo,
} from '../utils/js/network'
import NetworkCanvas from '../components/NetworkCanvas'
import Palette from '../components/Palette'
import ModelPanel from '../components/ModelPanel'

// Vista del módulo unifilar.
//
// El DWG entra como CALCO: se dibuja de fondo y no se interpreta. Encima, el
// usuario arma la red con los símbolos del catálogo. Se intentó deducir la red
// del dibujo y funcionaba sólo en el plano para el que se calibraba; con dos
// planos distintos en la mano quedó claro que no hay convención común que
// explotar. Colocar un símbolo cuesta un clic y no falla nunca.
//
// Dos modos: EDITAR arma la red, OPERAR la mira y maniobra.

const ahora = () => new Date().toLocaleTimeString('es-AR', { hour12: false })
const MAX_HISTORIAL = 60

const Unifilar = () => {
	const [plans, setPlans] = useState([])
	const [selectedId, setSelectedId] = useState('')
	const [plan, setPlan] = useState(null)
	const [loading, setLoading] = useState(false)

	const [modelo, setModelo] = useState(() => modeloVacio(1))
	const [historial, setHistorial] = useState([])
	const [sucio, setSucio] = useState(false)
	const [guardando, setGuardando] = useState(false)

	const [modo, setModo] = useState('operar')
	const [herramienta, setHerramienta] = useState(null)
	const [verCalco, setVerCalco] = useState(true)
	const [seleccion, setSeleccion] = useState(null)

	const [live, setLive] = useState({})
	const [eventos, setEventos] = useState([])
	const [equipments, setEquipments] = useState([])
	const importRef = useRef(null)

	const log = (kind, text) =>
		setEventos((actual) => [{ time: ahora(), kind, text }, ...actual].slice(0, 100))

	// --- carga ---------------------------------------------------------------
	const loadPlans = async () => {
		try {
			const data = await getPlans()
			setPlans(data)
			if (data.length && !selectedId) setSelectedId(data[0].id)
		} catch (e) {
			toast.error(e.message || 'Error al cargar los planos')
		}
	}

	const loadPlan = async (id) => {
		setLoading(true)
		try {
			const data = await getPlan(id)
			setPlan(data)
			// Si el plano todavía no tiene red, se arranca una vacía con la escala
			// de símbolo que le corresponde a ESTE dibujo: los planos vienen en
			// unidades muy distintas y un tamaño fijo se vería microscópico en uno
			// y gigante en otro.
			const escala = data.document ? escalaSugerida(data.document.entities) : 1
			setModelo(data.model?.nodos ? { seq: 0, ...data.model } : modeloVacio(escala))
			setHistorial([])
			setSucio(false)
			setSeleccion(null)
			setHerramienta(null)
			log('', `Plano abierto · ${data.name}`)
		} catch (e) {
			toast.error(e.message || 'Error al cargar el plano')
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => { loadPlans() }, [])
	useEffect(() => { if (selectedId) loadPlan(selectedId) }, [selectedId])

	useEffect(() => {
		const base = backend[`${import.meta.env.VITE_APP_NAME}`]
		request(`${base}/Equipments`, 'GET')
			.then(({ data }) => setEquipments(Array.isArray(data) ? data : []))
			.catch(() => {})
	}, [])

	// --- estado eléctrico ----------------------------------------------------
	const estado = useMemo(() => calcular(modelo), [modelo])
	const seleccionado = seleccion ? modelo.elementos.find((e) => e.id === seleccion) : null
	const abajo = useMemo(
		() => (modo === 'operar' && seleccionado ? aguasAbajo(modelo, seleccionado, estado) : new Set()),
		[modo, modelo, seleccionado, estado]
	)

	// --- datos en vivo -------------------------------------------------------
	const anterior = useRef({})
	useEffect(() => {
		const vinculados = modelo.elementos.filter((e) => e.equipmentId)
		if (!plan?.id || modo !== 'operar' || !vinculados.length) {
			setLive({})
			anterior.current = {}
			return
		}
		let cancelado = false
		const tick = async () => {
			try {
				const data = await getPlanLive(plan.id)
				if (cancelado) return
				for (const [id, item] of Object.entries(data)) {
					const antes = anterior.current[id]?.state
					if (antes && item.state && antes !== item.state) {
						const el = modelo.elementos.find((e) => e.id === id)
						log('alarma', `${el?.nombre || id}: ${antes} → ${item.state}`)
					}
				}
				anterior.current = data
				setLive(data)
			} catch {
				// silencioso: el próximo tick reintenta
			}
		}
		tick()
		const t = setInterval(tick, 15000)
		return () => { cancelado = true; clearInterval(t) }
	}, [plan?.id, modo, modelo.elementos])

	// --- edición -------------------------------------------------------------
	// Cada cambio apila el modelo anterior: deshacer es volver a sacarlo.
	const aplicar = (siguiente, evento) => {
		if (!siguiente || siguiente === modelo) return
		setHistorial((h) => [...h, modelo].slice(-MAX_HISTORIAL))
		setModelo(siguiente)
		setSucio(true)
		if (evento) log('edit', evento)
	}

	const deshacer = () => {
		if (!historial.length) return
		setModelo(historial[historial.length - 1])
		setHistorial((h) => h.slice(0, -1))
		setSucio(true)
		setSeleccion(null)
	}

	const handleColocar = (tipo, x, y) => {
		const { modelo: siguiente, id } = colocar(modelo, tipo, x, y)
		aplicar(siguiente, `${tipo} agregado como ${id}`)
		setSeleccion(id)
		setHerramienta(null)
	}

	const handleDuplicar = (id) => {
		const { modelo: siguiente, id: nuevo } = duplicar(modelo, id)
		aplicar(siguiente, `${nuevo} duplicado`)
		setSeleccion(nuevo)
	}

	const handleBorrar = (id) => {
		aplicar(borrar(modelo, id), `${modelo.elementos.find((e) => e.id === id)?.nombre || id} eliminado`)
		setSeleccion(null)
	}

	// Mover y arrastrar generan muchísimos pasos intermedios: no van al historial
	// uno por uno, se apila el estado previo sólo al empezar el gesto.
	const gesto = useRef(false)
	const enGesto = (siguiente) => {
		if (!gesto.current) {
			setHistorial((h) => [...h, modelo].slice(-MAX_HISTORIAL))
			gesto.current = true
		}
		setModelo(siguiente)
		setSucio(true)
	}
	useEffect(() => {
		const soltar = () => { gesto.current = false }
		window.addEventListener('pointerup', soltar)
		return () => window.removeEventListener('pointerup', soltar)
	}, [])

	const guardar = async () => {
		setGuardando(true)
		try {
			const { seq, ...limpio } = modelo
			await updatePlan(plan.id, { model: { ...limpio, seq } })
			setSucio(false)
			toast.success('Red guardada')
		} catch (e) {
			toast.error(e.message || 'Error al guardar la red')
		} finally {
			setGuardando(false)
		}
	}

	// --- maniobra ------------------------------------------------------------
	const handleManiobra = (el) => {
		const estadoNuevo = el.estado === 'cerrado' ? 'abierto' : 'cerrado'
		// La maniobra NO va al historial de edición: es una operación, no un
		// cambio de dibujo, y deshacerla con Ctrl+Z sería peligroso.
		setModelo(editar(modelo, el.id, { estado: estadoNuevo }))
		setSucio(true)
		log(estadoNuevo === 'cerrado' ? 'rest' : 'maniobra', `${el.nombre || el.id} ${estadoNuevo} por orden de operador`)
	}

	// --- archivo -------------------------------------------------------------
	const handleUpload = async (event) => {
		const file = event.target.files?.[0]
		event.target.value = ''
		if (!file) return
		setLoading(true)
		try {
			const result = await uploadPlan(file)
			toast.success(result.message)
			await loadPlans()
			setSelectedId(result.data.id)
		} catch (e) {
			toast.error(e.message || 'Error al subir el plano')
		} finally {
			setLoading(false)
		}
	}

	const handleReprocess = async () => {
		setLoading(true)
		try {
			const result = await reprocessPlan(plan.id)
			toast[result.data.pending ? 'warning' : 'success'](result.message)
			await loadPlan(plan.id)
		} catch (e) {
			toast.error(e.message || 'Error al reprocesar el plano')
		} finally {
			setLoading(false)
		}
	}

	const handleDelete = async () => {
		if (!confirm(`¿Eliminar el plano "${plan.name}"?`)) return
		try {
			await deletePlan(plan.id)
			toast.success('Plano eliminado')
			setPlan(null)
			setSelectedId('')
			await loadPlans()
		} catch (e) {
			toast.error(e.message || 'Error al eliminar el plano')
		}
	}

	const exportar = () => {
		const doc = { formato: 'reconecta.unifilar/2', esquema: plan.name, ...modelo }
		const a = document.createElement('a')
		a.href = URL.createObjectURL(new Blob([JSON.stringify(doc, null, 1)], { type: 'application/json' }))
		a.download = `${plan.name.replace(/[^\w.-]+/g, '-').toLowerCase()}.reconecta.json`
		a.click()
		URL.revokeObjectURL(a.href)
		log('edit', 'Red exportada')
	}

	const importar = (event) => {
		const file = event.target.files?.[0]
		event.target.value = ''
		if (!file) return
		file.text().then((txt) => {
			try {
				const d = JSON.parse(txt)
				if (!d.nodos || !Array.isArray(d.elementos)) throw new Error('formato')
				aplicar({ seq: 0, escala: modelo.escala, ...d }, `Red importada · ${d.esquema || file.name}`)
				setSeleccion(null)
			} catch {
				toast.error('El archivo no tiene formato de red Reconecta')
			}
		})
	}

	const boton = (activo) =>
		`px-3 py-1.5 text-xs font-medium ${activo ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`

	return (
		<div className="relative flex flex-col h-[calc(100vh-5rem)] w-full p-4 gap-3">
			<div className="flex flex-row flex-wrap items-center gap-3">
				<h1 className="text-xl font-bold text-black dark:text-white">Diagrama Unifilar</h1>
				{plans.length > 0 && (
					<Select size="small" value={selectedId} onChange={(e) => setSelectedId(e.target.value)}
						className="min-w-52 bg-white dark:bg-gray-700">
						{plans.map((p) => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}
					</Select>
				)}
				<Button component="label" variant="contained" startIcon={<MdUploadFile />}>
					Subir plano
					<input type="file" hidden accept=".dwg" onChange={handleUpload} />
				</Button>

				{plan && (
					<>
						<div className="flex rounded-md overflow-hidden border border-gray-400">
							<button onClick={() => { setModo('operar'); setHerramienta(null) }} className={boton(modo === 'operar')}>Operar</button>
							<button onClick={() => setModo('editar')} className={boton(modo === 'editar')}>Editar</button>
						</div>

						<Tooltip title={verCalco ? 'Ocultar el plano de fondo' : 'Mostrar el plano de fondo'}>
							<Button size="small" variant="outlined" startIcon={<MdLayers />} onClick={() => setVerCalco((v) => !v)}>
								Calco {verCalco ? 'visible' : 'oculto'}
							</Button>
						</Tooltip>

						{modo === 'editar' && (
							<>
								<Button size="small" variant="outlined" startIcon={<MdUndo />} disabled={!historial.length} onClick={deshacer}>
									Deshacer
								</Button>
								<Tooltip title="Tamaño de los símbolos en el plano">
									<div className="flex items-center rounded-md overflow-hidden border border-gray-400">
										<span className="px-2 text-gray-500"><MdZoomOutMap size={14} /></span>
										{[
											['−', 1 / 1.25],
											['+', 1.25],
										].map(([texto, factor]) => (
											<button
												key={texto}
												onClick={() => { setModelo(conEscala(modelo, modelo.escala * factor)); setSucio(true) }}
												className="px-2.5 py-1.5 text-xs font-medium bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300"
											>
												{texto}
											</button>
										))}
									</div>
								</Tooltip>
								<Button size="small" variant="outlined" startIcon={<MdFileDownload />} onClick={exportar}>Exportar</Button>
								<Button size="small" variant="outlined" startIcon={<MdFileUpload />} onClick={() => importRef.current?.click()}>
									Importar
								</Button>
								<input ref={importRef} type="file" hidden accept=".json" onChange={importar} />
							</>
						)}

						<Button
							size="small" variant={sucio ? 'contained' : 'outlined'} color={sucio ? 'success' : 'primary'}
							startIcon={<MdSave />} disabled={!sucio || guardando} onClick={guardar}
						>
							{sucio ? 'Guardar cambios' : 'Guardado'}
						</Button>

						<Button size="small" color="error" variant="outlined" startIcon={<MdDelete />} onClick={handleDelete}>
							Eliminar
						</Button>
					</>
				)}
			</div>

			<div className="relative flex-1 min-h-0 flex flex-col sm:flex-row gap-3">
				{loading ? (
					<div className="flex items-center justify-center h-full w-full"><CircularProgress /></div>
				) : !plan ? (
					<div className="flex flex-col items-center justify-center h-full w-full text-gray-500 dark:text-gray-400">
						<p>No hay planos cargados.</p>
						<p>Subí un archivo .dwg para empezar.</p>
					</div>
				) : !plan.document ? (
					<div className="flex flex-col items-center justify-center h-full w-full gap-3 text-gray-500 dark:text-gray-400">
						<p>El plano todavía no fue convertido.</p>
						{plan.data?.error && <p className="text-sm">{plan.data.error}</p>}
						<Button variant="outlined" startIcon={<MdRefresh />} onClick={handleReprocess}>Reprocesar</Button>
					</div>
				) : (
					<>
						{modo === 'editar' && <Palette herramienta={herramienta} onElegir={setHerramienta} />}
						<div className="flex-1 min-w-0 min-h-0">
							<NetworkCanvas
								documento={plan.document}
								modelo={modelo}
								estado={estado}
								live={live}
								modo={modo}
								herramienta={herramienta}
								seleccion={seleccion}
								verCalco={verCalco}
								abajo={abajo}
								onSelect={setSeleccion}
								onColocar={handleColocar}
								onConectar={(a, b) => { aplicar(conectar(modelo, a, b), 'Conductor agregado'); setHerramienta(null) }}
								onMoverElemento={(id, dx, dy) => enGesto(mover(modelo, id, dx, dy))}
								onMoverNodo={(id, x, y) => enGesto(moverNodo(modelo, id, x, y))}
								onFusionar={(id) => { const s = fusionar(modelo, id); if (s !== modelo) { setModelo(s); setSucio(true); log('edit', 'Nodos unidos') } }}
							/>
						</div>
						<ModelPanel
							modelo={modelo}
							estado={estado}
							live={live}
							seleccion={seleccion}
							modo={modo}
							equipments={equipments}
							eventos={eventos}
							onManiobra={handleManiobra}
							onEditar={(id, cambios) => aplicar(editar(modelo, id, cambios))}
							onGirar={(id) => aplicar(girar(modelo, id), 'Elemento girado')}
							onDuplicar={handleDuplicar}
							onBorrar={handleBorrar}
							onEvento={log}
						/>
					</>
				)}
			</div>
		</div>
	)
}

export default Unifilar
