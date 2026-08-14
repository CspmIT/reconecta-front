import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Divider,
	Menu,
	MenuItem,
	Checkbox,
	TextField,
	ToggleButton,
	ToggleButtonGroup,
	Tooltip,
} from '@mui/material'
import {
	MdDelete,
	MdElectricalServices,
	MdHorizontalRule,
	MdLayers,
	MdRedo,
	MdRotate90DegreesCcw,
	MdSave,
	MdTextFields,
	MdUndo,
	MdZoomIn,
	MdZoomOut,
	MdClose,
} from 'react-icons/md'
import { FaMousePointer, FaRegHandPaper } from 'react-icons/fa'
import { toast } from 'react-toastify'
import EntityRenderer from './EntityRenderer'
import { SYMBOLS } from './symbols'
import { documentBBox, entityBBox, bboxIntersects, translateEntity } from '../../utils/js/geometry'
import { updatePlan } from '../../utils/js/api'

// Capa donde caen las entidades nuevas creadas en el editor
const EDIT_LAYER = 'EDICION'

let newIdCounter = 0
const newId = () => `n${Date.now().toString(36)}-${++newIdCounter}`

const EMPTY_SET = new Set()

const Editor = ({ plan, onExit }) => {
	const [entities, setEntities] = useState(plan.document.entities)
	const [layers, setLayers] = useState(plan.document.layers || [])
	const [past, setPast] = useState([])
	const [future, setFuture] = useState([])
	const [selection, setSelection] = useState(new Set())
	const [tool, setTool] = useState('select')
	const [drag, setDrag] = useState(null) // { start:[x,y], dx, dy }
	const [rubber, setRubber] = useState(null) // { start:[x,y], end:[x,y] }
	const [lineDraft, setLineDraft] = useState(null) // { start:[x,y], end:[x,y] }
	const [textDialog, setTextDialog] = useState(null) // { id?, x, y, value }
	const [layersMenu, setLayersMenu] = useState(null)
	const [symbolsMenu, setSymbolsMenu] = useState(null)
	const [saving, setSaving] = useState(false)
	const svgRef = useRef(null)

	// El viewBox se fija con el contenido inicial para que el lienzo no salte
	const viewBox = useMemo(() => {
		const [x1, y1, x2, y2] = documentBBox(plan.document.entities)
		const pad = Math.max(x2 - x1, y2 - y1) * 0.02
		return [x1 - pad, y1 - pad, x2 - x1 + pad * 2, y2 - y1 + pad * 2]
	}, [plan.id])

	const strokeWidth = Math.max(viewBox[2], viewBox[3]) / 1200
	const hitWidth = strokeWidth * 10
	const defaultTextSize = useMemo(() => {
		const sizes = plan.document.entities.filter((e) => e.type === 'text').map((e) => e.size)
		sizes.sort((a, b) => a - b)
		return sizes[Math.floor(sizes.length / 2)] || viewBox[2] / 80
	}, [plan.id])
	const defaultSymbolScale = Math.min(viewBox[2], viewBox[3]) / 20

	const hiddenLayers = useMemo(() => new Set(layers.filter((l) => l.hidden).map((l) => l.name)), [layers])

	// --- Historial -------------------------------------------------------
	const apply = useCallback(
		(updater) => {
			setPast([...past.slice(-40), entities])
			setFuture([])
			setEntities(typeof updater === 'function' ? updater(entities) : updater)
		},
		[entities, past]
	)

	const undo = useCallback(() => {
		if (!past.length) return
		setFuture([...future, entities])
		setEntities(past[past.length - 1])
		setPast(past.slice(0, -1))
		setSelection(new Set())
	}, [entities, past, future])

	const redo = useCallback(() => {
		if (!future.length) return
		setPast([...past, entities])
		setEntities(future[future.length - 1])
		setFuture(future.slice(0, -1))
		setSelection(new Set())
	}, [entities, past, future])

	// --- Coordenadas pantalla → SVG --------------------------------------
	const toSvgPoint = (event) => {
		const svg = svgRef.current
		const point = new DOMPoint(event.clientX, event.clientY)
		const p = point.matrixTransform(svg.getScreenCTM().inverse())
		return [p.x, p.y]
	}

	// --- Alta de entidades ------------------------------------------------
	const ensureEditLayer = () => {
		setLayers((current) =>
			current.some((l) => l.name === EDIT_LAYER) ? current : [...current, { name: EDIT_LAYER, hidden: false }]
		)
	}

	const addEntity = (entity) => {
		ensureEditLayer()
		apply((current) => [...current, entity])
		setSelection(new Set([entity.id]))
	}

	// --- Eventos de puntero -----------------------------------------------
	const onPointerDown = (event) => {
		if (event.button !== 0 || tool === 'pan') return
		const point = toSvgPoint(event)
		if (tool === 'line') {
			if (!lineDraft) {
				setLineDraft({ start: point, end: point })
			} else {
				addEntity({
					id: newId(),
					type: 'line',
					layer: EDIT_LAYER,
					x1: lineDraft.start[0],
					y1: lineDraft.start[1],
					x2: point[0],
					y2: point[1],
				})
				setLineDraft(null)
			}
			return
		}
		if (tool === 'text') {
			setTextDialog({ x: point[0], y: point[1], value: '' })
			return
		}
		if (tool.startsWith('symbol:')) {
			addEntity({
				id: newId(),
				type: 'symbol',
				layer: EDIT_LAYER,
				symbol: tool.slice(7),
				x: point[0],
				y: point[1],
				rot: 0,
				scale: defaultSymbolScale,
			})
			setTool('select')
			return
		}
		// tool === 'select'
		const eid = event.target.closest?.('[data-eid]')?.getAttribute('data-eid')
		event.currentTarget.setPointerCapture(event.pointerId)
		if (eid) {
			let newSelection
			if (event.shiftKey) {
				newSelection = new Set(selection)
				newSelection.has(eid) ? newSelection.delete(eid) : newSelection.add(eid)
			} else {
				newSelection = selection.has(eid) ? selection : new Set([eid])
			}
			setSelection(newSelection)
			if (newSelection.size) setDrag({ start: point, dx: 0, dy: 0 })
		} else {
			if (!event.shiftKey) setSelection(new Set())
			setRubber({ start: point, end: point })
		}
	}

	const onPointerMove = (event) => {
		if (tool === 'line' && lineDraft) {
			const point = toSvgPoint(event)
			setLineDraft((draft) => ({ ...draft, end: point }))
			return
		}
		if (drag) {
			const point = toSvgPoint(event)
			setDrag((d) => ({ ...d, dx: point[0] - d.start[0], dy: point[1] - d.start[1] }))
			return
		}
		if (rubber) {
			const point = toSvgPoint(event)
			setRubber((r) => ({ ...r, end: point }))
		}
	}

	const onPointerUp = () => {
		if (drag) {
			const { dx, dy } = drag
			if (Math.hypot(dx, dy) > strokeWidth) {
				apply((current) => current.map((e) => (selection.has(e.id) ? translateEntity(e, dx, dy) : e)))
			}
			setDrag(null)
		}
		if (rubber) {
			const rect = [
				Math.min(rubber.start[0], rubber.end[0]),
				Math.min(rubber.start[1], rubber.end[1]),
				Math.max(rubber.start[0], rubber.end[0]),
				Math.max(rubber.start[1], rubber.end[1]),
			]
			if (rect[2] - rect[0] > strokeWidth || rect[3] - rect[1] > strokeWidth) {
				const inside = entities.filter(
					(e) => !hiddenLayers.has(e.layer) && bboxIntersects(entityBBox(e), rect)
				)
				setSelection((sel) => new Set([...sel, ...inside.map((e) => e.id)]))
			}
			setRubber(null)
		}
	}

	const onDoubleClick = (event) => {
		if (tool !== 'select') return
		const eid = event.target.closest?.('[data-eid]')?.getAttribute('data-eid')
		const entity = entities.find((e) => e.id === eid)
		if (entity?.type === 'text') {
			setTextDialog({ id: entity.id, x: entity.x, y: entity.y, value: entity.lines.join('\n') })
		}
	}

	// --- Acciones ----------------------------------------------------------
	const deleteSelection = useCallback(() => {
		if (!selection.size) return
		apply((current) => current.filter((e) => !selection.has(e.id)))
		setSelection(new Set())
	}, [selection, apply])

	const transformSymbols = (fn) => {
		apply((current) => current.map((e) => (selection.has(e.id) && e.type === 'symbol' ? fn(e) : e)))
	}
	const selectionHasSymbols = [...selection].some((id) => entities.find((e) => e.id === id)?.type === 'symbol')

	const saveText = () => {
		const lines = textDialog.value
			.split('\n')
			.map((l) => l.trim())
			.filter(Boolean)
		if (textDialog.id) {
			if (lines.length) {
				apply((current) => current.map((e) => (e.id === textDialog.id ? { ...e, lines } : e)))
			}
		} else if (lines.length) {
			addEntity({
				id: newId(),
				type: 'text',
				layer: EDIT_LAYER,
				x: textDialog.x,
				y: textDialog.y,
				size: defaultTextSize,
				anchor: 'start',
				baseline: 'hanging',
				lines,
			})
			setTool('select')
		}
		setTextDialog(null)
	}

	const save = async () => {
		setSaving(true)
		try {
			const clone = svgRef.current.cloneNode(true)
			clone.querySelectorAll('[data-editor]').forEach((node) => node.remove())
			clone.removeAttribute('class')
			clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
			const svg = new XMLSerializer().serializeToString(clone)
			await updatePlan(plan.id, { document: { version: 1, layers, entities }, svg })
			toast.success('Plano guardado')
			onExit(true)
		} catch (e) {
			toast.error(e.message || 'Error al guardar el plano')
			setSaving(false)
		}
	}

	// --- Teclado ------------------------------------------------------------
	useEffect(() => {
		const onKeyDown = (event) => {
			if (['INPUT', 'TEXTAREA'].includes(event.target.tagName)) return
			if (event.key === 'Delete' || event.key === 'Backspace') deleteSelection()
			if (event.key === 'Escape') {
				setLineDraft(null)
				setSelection(new Set())
				setTool('select')
			}
			if (event.ctrlKey && event.key.toLowerCase() === 'z' && !event.shiftKey) undo()
			if ((event.ctrlKey && event.key.toLowerCase() === 'y') || (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'z'))
				redo()
		}
		window.addEventListener('keydown', onKeyDown)
		return () => window.removeEventListener('keydown', onKeyDown)
	}, [deleteSelection, undo, redo])

	// --- Render -------------------------------------------------------------
	const dragHidden = drag ? selection : EMPTY_SET

	// Entidades agrupadas por capa; memoizado para que el arrastre (que solo
	// mueve la copia del overlay) no re-renderice el plano completo.
	const baseGroups = useMemo(() => {
		const order = [...layers.map((l) => l.name)]
		for (const e of entities) if (!order.includes(e.layer)) order.push(e.layer)
		return order
			.filter((name) => !hiddenLayers.has(name))
			.map((name) => (
				<g key={name} data-layer={name}>
					{entities
						.filter((e) => e.layer === name && !dragHidden.has(e.id))
						.map((e) => (
							<EntityRenderer key={e.id} entity={e} />
						))}
				</g>
			))
	}, [entities, layers, hiddenLayers, dragHidden])

	// Clones invisibles con trazo ancho para poder clickear líneas finas
	const hitGroup = useMemo(
		() => (
			<g data-editor='hit' stroke='transparent' strokeWidth={hitWidth} style={{ pointerEvents: 'stroke' }}>
				{entities
					.filter((e) => !hiddenLayers.has(e.layer))
					.map((e) =>
						e.type === 'text' || e.type === 'symbol' ? (
							(() => {
								const [x1, y1, x2, y2] = entityBBox(e)
								return (
									<rect
										key={e.id}
										data-eid={e.id}
										x={x1}
										y={y1}
										width={x2 - x1}
										height={y2 - y1}
										fill='transparent'
										stroke='none'
										style={{ pointerEvents: 'all' }}
									/>
								)
							})()
						) : (
							<g key={e.id} data-eid={e.id}>
								<EntityRenderer entity={e} bare />
							</g>
						)
					)}
			</g>
		),
		[entities, hiddenLayers, hitWidth]
	)

	const selectedEntities = entities.filter((e) => selection.has(e.id))
	const cursor = tool === 'pan' ? 'grab' : tool === 'select' ? 'default' : 'crosshair'

	return (
		<div className='flex flex-col h-full w-full gap-2'>
			{/* Barra de herramientas */}
			<div className='flex flex-row flex-wrap items-center gap-2'>
				<ToggleButtonGroup size='small' value={tool} exclusive onChange={(e, v) => v && setTool(v)}>
					<ToggleButton value='select'>
						<Tooltip title='Seleccionar (clic o rectángulo)'>
							<span className='flex'>
								<FaMousePointer className='text-lg' />
							</span>
						</Tooltip>
					</ToggleButton>
					<ToggleButton value='pan'>
						<Tooltip title='Mover vista'>
							<span className='flex'>
								<FaRegHandPaper className='text-lg' />
							</span>
						</Tooltip>
					</ToggleButton>
					<ToggleButton value='line'>
						<Tooltip title='Dibujar línea (dos clics)'>
							<span className='flex'>
								<MdHorizontalRule className='text-lg' />
							</span>
						</Tooltip>
					</ToggleButton>
					<ToggleButton value='text'>
						<Tooltip title='Agregar texto'>
							<span className='flex'>
								<MdTextFields className='text-lg' />
							</span>
						</Tooltip>
					</ToggleButton>
				</ToggleButtonGroup>

				<Button size='small' variant='outlined' startIcon={<MdElectricalServices />} onClick={(e) => setSymbolsMenu(e.currentTarget)}>
					Símbolos
				</Button>
				<Menu anchorEl={symbolsMenu} open={Boolean(symbolsMenu)} onClose={() => setSymbolsMenu(null)}>
					{Object.entries(SYMBOLS).map(([key, symbol]) => (
						<MenuItem
							key={key}
							onClick={() => {
								setTool(`symbol:${key}`)
								setSymbolsMenu(null)
							}}
						>
							<svg viewBox='-0.6 -0.6 1.2 1.2' width='26' height='26' className='mr-2' stroke='currentColor' fill='none'>
								{symbol.render()}
							</svg>
							{symbol.label}
						</MenuItem>
					))}
				</Menu>

				<Divider orientation='vertical' flexItem />
				<Button size='small' disabled={!past.length} onClick={undo}>
					<MdUndo className='text-xl' />
				</Button>
				<Button size='small' disabled={!future.length} onClick={redo}>
					<MdRedo className='text-xl' />
				</Button>
				<Button size='small' disabled={!selection.size} color='error' onClick={deleteSelection}>
					<MdDelete className='text-xl' />
				</Button>
				{selectionHasSymbols && (
					<>
						<Button size='small' onClick={() => transformSymbols((e) => ({ ...e, rot: ((e.rot || 0) + 270) % 360 }))}>
							<MdRotate90DegreesCcw className='text-xl' />
						</Button>
						<Button size='small' onClick={() => transformSymbols((e) => ({ ...e, scale: e.scale * 1.25 }))}>
							<MdZoomIn className='text-xl' />
						</Button>
						<Button size='small' onClick={() => transformSymbols((e) => ({ ...e, scale: e.scale / 1.25 }))}>
							<MdZoomOut className='text-xl' />
						</Button>
					</>
				)}
				<Button size='small' variant='outlined' startIcon={<MdLayers />} onClick={(e) => setLayersMenu(e.currentTarget)}>
					Capas
				</Button>
				<Menu anchorEl={layersMenu} open={Boolean(layersMenu)} onClose={() => setLayersMenu(null)}>
					{layers.map((layer) => (
						<MenuItem
							key={layer.name}
							dense
							onClick={() =>
								setLayers((current) =>
									current.map((l) => (l.name === layer.name ? { ...l, hidden: !l.hidden } : l))
								)
							}
						>
							<Checkbox size='small' checked={!layer.hidden} sx={{ padding: '0 8px 0 0' }} />
							{layer.name}
						</MenuItem>
					))}
				</Menu>

				<div className='flex-1' />
				<span className='text-sm text-gray-500 dark:text-gray-400'>
					{selection.size ? `${selection.size} seleccionadas` : ''}
				</span>
				<Button size='small' variant='contained' startIcon={<MdSave />} disabled={saving} onClick={save}>
					Guardar
				</Button>
				<Button size='small' variant='outlined' startIcon={<MdClose />} onClick={() => onExit(false)}>
					Cancelar
				</Button>
			</div>

			{/* Lienzo */}
			<div className='relative flex-1 min-h-0 bg-white rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600'>
				<TransformWrapper
					minScale={0.2}
					maxScale={40}
					limitToBounds={false}
					centerOnInit
					panning={{ disabled: tool !== 'pan' }}
					doubleClick={{ disabled: true }}
				>
					<TransformComponent wrapperClass='!w-full !h-full' contentClass='!w-full !h-full'>
						<svg
							ref={svgRef}
							viewBox={viewBox.join(' ')}
							className='w-full h-full'
							fill='none'
							stroke='#111'
							strokeWidth={strokeWidth}
							strokeLinecap='round'
							strokeLinejoin='round'
							style={{ fontFamily: 'Arial, sans-serif', cursor }}
							onPointerDown={onPointerDown}
							onPointerMove={onPointerMove}
							onPointerUp={onPointerUp}
							onDoubleClick={onDoubleClick}
						>
							<style>{'text{fill:#111;stroke:none}'}</style>
							{baseGroups}
							{hitGroup}
							{/* Overlay del editor: nunca se guarda */}
							<g data-editor='overlay' style={{ pointerEvents: 'none' }}>
								{drag && (
									<g transform={`translate(${drag.dx} ${drag.dy})`} stroke='#2563eb'>
										<style>{'[data-editor="overlay"] text{fill:#2563eb}'}</style>
										{selectedEntities.map((e) => (
											<EntityRenderer key={e.id} entity={e} bare />
										))}
									</g>
								)}
								{!drag &&
									selectedEntities.map((e) => {
										const [x1, y1, x2, y2] = entityBBox(e)
										const margin = strokeWidth * 3
										return (
											<rect
												key={e.id}
												x={x1 - margin}
												y={y1 - margin}
												width={x2 - x1 + margin * 2}
												height={y2 - y1 + margin * 2}
												stroke='#2563eb'
												strokeDasharray={`${strokeWidth * 4} ${strokeWidth * 3}`}
												fill='rgba(37,99,235,0.06)'
											/>
										)
									})}
								{rubber && (
									<rect
										x={Math.min(rubber.start[0], rubber.end[0])}
										y={Math.min(rubber.start[1], rubber.end[1])}
										width={Math.abs(rubber.end[0] - rubber.start[0])}
										height={Math.abs(rubber.end[1] - rubber.start[1])}
										stroke='#2563eb'
										strokeDasharray={`${strokeWidth * 4} ${strokeWidth * 3}`}
										fill='rgba(37,99,235,0.08)'
									/>
								)}
								{lineDraft && (
									<line
										x1={lineDraft.start[0]}
										y1={lineDraft.start[1]}
										x2={lineDraft.end[0]}
										y2={lineDraft.end[1]}
										stroke='#2563eb'
									/>
								)}
							</g>
						</svg>
					</TransformComponent>
				</TransformWrapper>
			</div>

			{/* Diálogo de texto (nuevo o edición) */}
			<Dialog open={Boolean(textDialog)} onClose={() => setTextDialog(null)} fullWidth maxWidth='xs'>
				<DialogTitle>{textDialog?.id ? 'Editar texto' : 'Nuevo texto'}</DialogTitle>
				<DialogContent>
					<TextField
						autoFocus
						fullWidth
						multiline
						minRows={2}
						value={textDialog?.value || ''}
						onChange={(e) => setTextDialog((t) => ({ ...t, value: e.target.value }))}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setTextDialog(null)}>Cancelar</Button>
					<Button variant='contained' onClick={saveText}>
						Aceptar
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	)
}

export default Editor
