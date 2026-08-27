import { useMemo } from 'react'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'
import { Button } from '@mui/material'
import EntityRenderer from '../Editor/EntityRenderer'
import { documentBBox, entityBBox, unionBBox, clusterFromSeed } from '../../utils/js/geometry'
import { STATES } from '../../utils/js/states'

// Visor de operación del unifilar. El clic expande la selección a todo el
// símbolo; Shift+clic agrega/quita entidades individuales para ajustar el
// grupo a mano. La expansión busca, en este orden: el grupo ya vinculado a un
// equipo, el símbolo detectado en la importación, y por último el cluster por
// proximidad (para documentos viejos, importados antes de la detección).
const Viewer = ({ document, mapping = {}, live = {}, selectedIds = [], onSelect }) => {
	const entities = document.entities
	const layers = document.layers || []

	const viewBox = useMemo(() => {
		const [x1, y1, x2, y2] = documentBBox(entities)
		const pad = Math.max(x2 - x1, y2 - y1) * 0.02
		return [x1 - pad, y1 - pad, x2 - x1 + pad * 2, y2 - y1 + pad * 2]
	}, [entities])

	const viewSize = Math.max(viewBox[2], viewBox[3])
	const strokeWidth = viewSize / 1200
	const hiddenLayers = useMemo(() => new Set(layers.filter((l) => l.hidden).map((l) => l.name)), [layers])
	const visible = useMemo(
		() => entities.filter((e) => !hiddenLayers.has(e.layer)),
		[entities, hiddenLayers]
	)
	const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds])
	const selectedEntities = entities.filter((e) => selectedSet.has(e.id))
	const selectionBox = unionBBox(selectedEntities)

	// Grupo vinculado al que pertenece una entidad (si existe)
	const groupOf = (eid) => {
		for (const [key, entry] of Object.entries(mapping)) {
			const members = entry.entities?.length ? entry.entities : [key]
			if (members.includes(eid)) return members
		}
		return null
	}

	// Símbolo detectado en la importación al que pertenece una entidad
	const symbolByEntity = useMemo(() => {
		const map = new Map()
		for (const symbol of document.symbols || []) {
			for (const id of symbol.entities) map.set(id, symbol)
		}
		return map
	}, [document.symbols])

	const handleClick = (event) => {
		const eid = event.target.closest?.('[data-eid]')?.getAttribute('data-eid')
		if (!eid) {
			onSelect([])
			return
		}
		if (event.shiftKey) {
			onSelect(
				selectedSet.has(eid) ? selectedIds.filter((id) => id !== eid) : [...selectedIds, eid]
			)
			return
		}
		onSelect(groupOf(eid) || symbolByEntity.get(eid)?.entities || clusterFromSeed(entities, eid, viewSize))
	}

	return (
		<div className='relative w-full h-full bg-white dark:bg-[#0b1220] rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700'>
			<TransformWrapper minScale={0.2} maxScale={40} limitToBounds={false} centerOnInit doubleClick={{ disabled: true }}>
				{({ zoomIn, zoomOut, resetTransform }) => (
					<>
						<div className='absolute z-10 bottom-3 right-3 flex flex-col gap-1'>
							<Button size='small' variant='outlined' className='!min-w-0' onClick={() => zoomIn()}>
								+
							</Button>
							<Button size='small' variant='outlined' className='!min-w-0' onClick={() => zoomOut()}>
								−
							</Button>
							<Button size='small' variant='outlined' className='!min-w-0 !text-xs' onClick={() => resetTransform()}>
								FIT
							</Button>
						</div>
						<TransformComponent wrapperClass='!w-full !h-full' contentClass='!w-full !h-full'>
							<svg
								viewBox={viewBox.join(' ')}
								className='w-full h-full text-gray-900 dark:text-gray-300'
								fill='none'
								stroke='currentColor'
								strokeWidth={strokeWidth}
								strokeLinecap='round'
								strokeLinejoin='round'
								style={{ fontFamily: 'Arial, sans-serif' }}
								onClick={handleClick}
							>
								<style>{'svg text{fill:currentColor;stroke:none}'}</style>
								{visible.map((e) => (
									<EntityRenderer key={e.id} entity={e} />
								))}
								{/* Zonas de clic ampliadas */}
								<g stroke='transparent' strokeWidth={strokeWidth * 10} style={{ pointerEvents: 'stroke' }}>
									{visible.map((e) =>
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
														style={{ pointerEvents: 'all', cursor: 'pointer' }}
													/>
												)
											})()
										) : (
											<g key={e.id} data-eid={e.id} style={{ cursor: 'pointer' }}>
												<EntityRenderer entity={e} bare />
											</g>
										)
									)}
								</g>
								{/* Resaltado: grupos vinculados (por estado) y selección */}
								<g style={{ pointerEvents: 'none' }}>
									{Object.entries(mapping).map(([key, entry]) => {
										const members = entry.entities?.length ? entry.entities : [key]
										const groupEntities = entities.filter(
											(e) => members.includes(e.id) && !hiddenLayers.has(e.layer)
										)
										const box = unionBBox(groupEntities)
										if (!box) return null
										const [x1, y1, x2, y2] = box
										const m = strokeWidth * 2
										const state = live[key]?.state
										const alerted = state === 'open' || state === 'fault'
										return (
											<rect
												key={key}
												x={x1 - m}
												y={y1 - m}
												width={x2 - x1 + m * 2}
												height={y2 - y1 + m * 2}
												stroke={state ? STATES[state].stroke : '#16a34a'}
												strokeWidth={strokeWidth * (alerted ? 1.6 : 0.8)}
												opacity={alerted ? '0.9' : '0.55'}
												fill={alerted ? `${STATES[state].stroke}18` : 'none'}
											/>
										)
									})}
									{selectedEntities.length > 0 && (
										<>
											<g stroke='#22d3ee'>
												<style>{'.sel-uni text{fill:#22d3ee}'}</style>
												<g className='sel-uni'>
													{selectedEntities.map((e) => (
														<EntityRenderer key={e.id} entity={e} bare />
													))}
												</g>
											</g>
											{selectionBox && (
												<rect
													x={selectionBox[0] - strokeWidth * 4}
													y={selectionBox[1] - strokeWidth * 4}
													width={selectionBox[2] - selectionBox[0] + strokeWidth * 8}
													height={selectionBox[3] - selectionBox[1] + strokeWidth * 8}
													stroke='#22d3ee'
													strokeDasharray={`${strokeWidth * 4} ${strokeWidth * 3}`}
													fill='rgba(34,211,238,0.07)'
												/>
											)}
										</>
									)}
								</g>
							</svg>
						</TransformComponent>
					</>
				)}
			</TransformWrapper>
		</div>
	)
}

export default Viewer
