import { useEffect, useRef, useState } from 'react'
import { STATES } from '../utils/js/states'
import { Button, CircularProgress, MenuItem, Select, Tooltip } from '@mui/material'
import { MdUploadFile, MdDelete, MdRefresh, MdEdit, MdCategory } from 'react-icons/md'
import { toast } from 'react-toastify'
import { getPlans, getPlan, getPlanLive, uploadPlan, reprocessPlan, updatePlan, deletePlan } from '../utils/js/api'
import PlanViewer from '../components/PlanViewer'
import Editor from '../components/Editor'
import Viewer from '../components/Viewer'
import SidePanel from '../components/SidePanel'
import ShapeCatalog from '../components/ShapeCatalog'

const now = () => new Date().toLocaleTimeString('es-AR', { hour12: false })

const Unifilar = () => {
	const [plans, setPlans] = useState([])
	const [selectedId, setSelectedId] = useState('')
	const [plan, setPlan] = useState(null)
	const [loading, setLoading] = useState(false)
	const [editing, setEditing] = useState(false)
	const [selectedEntities, setSelectedEntities] = useState([])
	const [mapping, setMapping] = useState({})
	const [shapeTypes, setShapeTypes] = useState({})
	const [catalogOpen, setCatalogOpen] = useState(false)
	const [events, setEvents] = useState([])
	const [live, setLive] = useState({})

	const logEvent = (text) => setEvents((current) => [{ time: now(), text }, ...current].slice(0, 100))

	const loadPlans = async () => {
		try {
			const data = await getPlans()
			setPlans(data)
			if (data.length && !selectedId) {
				setSelectedId(data[0].id)
			}
		} catch (e) {
			toast.error(e.message || 'Error al cargar los planos')
		}
	}

	const loadPlan = async (id) => {
		setLoading(true)
		try {
			const data = await getPlan(id)
			setPlan(data)
			setMapping(data.data?.mapping || {})
			setShapeTypes(data.data?.shapeTypes || {})
			setSelectedEntities([])
			logEvent(`Vista unifilar iniciada · ${data.name}`)
		} catch (e) {
			toast.error(e.message || 'Error al cargar el plano')
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		loadPlans()
	}, [])

	useEffect(() => {
		if (selectedId) loadPlan(selectedId)
	}, [selectedId])

	// Polling de datos en vivo de los equipos vinculados (cada 15 s)
	const prevLive = useRef({})
	useEffect(() => {
		if (!plan?.document || !Object.values(mapping).some((m) => m.deviceType)) {
			setLive({})
			prevLive.current = {}
			return
		}
		let cancelled = false
		const tick = async () => {
			try {
				const data = await getPlanLive(plan.id)
				if (cancelled) return
				for (const [entityId, item] of Object.entries(data)) {
					const before = prevLive.current[entityId]?.state
					if (before && item.state && before !== item.state) {
						const label = mapping[entityId]?.label || entityId
						logEvent(`${label}: ${STATES[before]?.label || before} → ${STATES[item.state]?.label || item.state}`)
					}
				}
				prevLive.current = data
				setLive(data)
			} catch {
				// silencioso: el próximo tick reintenta
			}
		}
		tick()
		const interval = setInterval(tick, 15000)
		return () => {
			cancelled = true
			clearInterval(interval)
		}
	}, [plan?.id, plan?.document, mapping])

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
			if (result.data.pending) {
				toast.warning(`${result.message}: ${result.data.error || ''}`)
			} else {
				toast.success(result.message)
			}
			await loadPlan(plan.id)
		} catch (e) {
			toast.error(e.message || 'Error al reprocesar el plano')
		} finally {
			setLoading(false)
		}
	}

	const handleExitEditor = async (saved) => {
		setEditing(false)
		if (saved) await loadPlan(plan.id)
	}

	const handleSaveMapping = async (entityId, entry) => {
		const next = { ...mapping }
		if (entry) {
			next[entityId] = entry
		} else {
			delete next[entityId]
		}
		try {
			await updatePlan(plan.id, { mapping: next })
			setMapping(next)
			logEvent(entry ? `Equipo vinculado · ${entry.label}` : `Vínculo quitado · ${mapping[entityId]?.label || entityId}`)
			toast.success(entry ? 'Equipo vinculado' : 'Vínculo quitado')
		} catch (e) {
			toast.error(e.message || 'Error al guardar el vínculo')
		}
	}

	// Tipificación de formas: un tipo por forma se propaga a todas sus copias.
	const handleSaveShapeTypes = async (next) => {
		try {
			await updatePlan(plan.id, { shapeTypes: next })
			setShapeTypes(next)
			setCatalogOpen(false)
			const symbols = plan.document?.symbols || []
			const tipificados = symbols.filter((symbol) => next[symbol.shape]).length
			logEvent(`Símbolos tipificados · ${tipificados} de ${symbols.length}`)
			toast.success(`${tipificados} símbolos tipificados`)
		} catch (e) {
			toast.error(e.message || 'Error al guardar la tipificación')
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

	if (editing && plan?.document) {
		return (
			<div className='relative flex flex-col h-[calc(100vh-5rem)] w-full p-4'>
				<Editor plan={plan} onExit={handleExitEditor} />
			</div>
		)
	}

	return (
		<div className='relative flex flex-col h-[calc(100vh-5rem)] w-full p-4 gap-3'>
			<div className='flex flex-row flex-wrap items-center gap-3'>
				<h1 className='text-xl font-bold text-black dark:text-white'>Diagrama Unifilar</h1>
				{plans.length > 0 && (
					<Select
						size='small'
						value={selectedId}
						onChange={(e) => setSelectedId(e.target.value)}
						className='min-w-52 bg-white dark:bg-gray-700'
					>
						{plans.map((p) => (
							<MenuItem key={p.id} value={p.id}>
								{p.name}
							</MenuItem>
						))}
					</Select>
				)}
				<Button component='label' variant='contained' startIcon={<MdUploadFile />}>
					Subir plano
					<input type='file' hidden accept='.dwg' onChange={handleUpload} />
				</Button>
				{plan && (
					<>
						<Tooltip title={plan.document ? '' : 'Reprocesá el plano para habilitar la edición'}>
							<span>
								<Button
									variant='outlined'
									startIcon={<MdEdit />}
									disabled={!plan.document}
									onClick={() => setEditing(true)}
								>
									Editar
								</Button>
							</span>
						</Tooltip>
						{plan.document?.shapes?.length > 0 && (
							<Button variant='outlined' startIcon={<MdCategory />} onClick={() => setCatalogOpen(true)}>
								Tipificar símbolos ({Object.keys(shapeTypes).length}/{plan.document.shapes.length})
							</Button>
						)}
						<Button color='error' variant='outlined' startIcon={<MdDelete />} onClick={handleDelete}>
							Eliminar
						</Button>
					</>
				)}
			</div>

			<div className='relative flex-1 min-h-0 flex flex-col sm:flex-row gap-3'>
				{loading ? (
					<div className='flex items-center justify-center h-full w-full'>
						<CircularProgress />
					</div>
				) : !plan ? (
					<div className='flex flex-col items-center justify-center h-full w-full text-gray-500 dark:text-gray-400'>
						<p>No hay planos cargados.</p>
						<p>Subí un archivo .dwg para empezar.</p>
					</div>
				) : plan.document ? (
					<>
						<div className='flex-1 min-w-0 min-h-0'>
							<Viewer
								document={plan.document}
								mapping={mapping}
								live={live}
								selectedIds={selectedEntities}
								onSelect={setSelectedEntities}
							/>
						</div>
						<SidePanel
							document={plan.document}
							mapping={mapping}
							shapeTypes={shapeTypes}
							live={live}
							selectedIds={selectedEntities}
							onSaveMapping={handleSaveMapping}
							events={events}
						/>
					</>
				) : plan.svg ? (
					<PlanViewer svg={plan.svg} />
				) : (
					<div className='flex flex-col items-center justify-center h-full w-full gap-3 text-gray-500 dark:text-gray-400'>
						<p>El plano todavía no fue convertido.</p>
						{plan.data?.error && <p className='text-sm'>{plan.data.error}</p>}
						<Button variant='outlined' startIcon={<MdRefresh />} onClick={handleReprocess}>
							Reprocesar
						</Button>
					</div>
				)}
			</div>

			{plan?.document && (
				<ShapeCatalog
					open={catalogOpen}
					document={plan.document}
					shapeTypes={shapeTypes}
					onSave={handleSaveShapeTypes}
					onClose={() => setCatalogOpen(false)}
				/>
			)}
		</div>
	)
}

export default Unifilar
