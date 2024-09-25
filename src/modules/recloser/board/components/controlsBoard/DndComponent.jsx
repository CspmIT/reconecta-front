import React, { useState } from 'react'
import { DndContext, DragOverlay, rectIntersection, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { KeyboardSensor, PointerSensor } from '@dnd-kit/core'
import ContainerDnd from './ContainerDnd'
import ItemsDnD from './ItemsDnd'
import { findItemById, handleDragMove, handleDragStart, handleDragEnd } from './utils/js/dndHandlers'
function DndComponent({ controls, setContainer }) {
	const [containers, setContainers] = useState([
		{
			id: 'container-Basic',
			title: 'Basicos',
			items: controls.Basic.map((item) => ({
				...item,
				id: 'item-' + item.id,
				group: 'Basic',
			})),
		},
		{
			id: 'container-Advance',
			title: 'Avanzados',
			items: controls.Advance.map((item) => ({
				...item,
				id: 'item-' + item.id,
				group: 'Advance',
			})),
		},
	])

	const [activeId, setActiveId] = useState(null)

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	)

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={rectIntersection}
			onDragStart={(event) => handleDragStart(event, setActiveId)}
			onDragMove={(event) => handleDragMove(event, containers, setContainers)}
			onDragEnd={(event) => handleDragEnd(event, containers, setContainers, setContainer, setActiveId)}
		>
			<div className='flex flex-col w-full gap-3'>
				<SortableContext items={containers.map((container) => container.id)}>
					{containers.map((container) => (
						<ContainerDnd key={container.id} id={container.id} title={container.title}>
							<div className='grid grid-cols-4 gap-3'>
								<SortableContext items={container.items.map((item) => item.id)}>
									{container.items.map((item) => (
										<div
											key={item.id}
											className={`w-full ${
												(!item.enabled || item.status == 'sin Datos') && '!opacity-25'
											}`}
										>
											<ItemsDnD key={item.id} id={item.id} control={item} />
										</div>
									))}
								</SortableContext>
							</div>
						</ContainerDnd>
					))}
				</SortableContext>
				<DragOverlay>
					{activeId && findItemById(activeId, containers)?.item && (
						<ItemsDnD id={activeId} control={findItemById(activeId, containers).item} />
					)}
				</DragOverlay>
			</div>
		</DndContext>
	)
}

export default DndComponent
