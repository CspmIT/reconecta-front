import React, { useState } from 'react'
import { DndContext, DragOverlay, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { closestCorners, KeyboardSensor, PointerSensor } from '@dnd-kit/core'
import ContainerDnd from './ContainerDnd'
import ItemsDnD from './ItemsDnd'
export default function DndComponent({ controls, info }) {
	const [containers, setContainers] = useState([
		{
			id: 'container-Basic',
			title: 'Basicos',
			items: controls[info.brand][info.version].basic.map((item) => ({
				...item,
				group: 'Basic',
			})),
		},
		{
			id: 'container-Advance',
			title: 'Avanzados',
			items: controls[info.brand][info.version].advance.map((item) => ({
				...item,
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

	const findItemById = (id) => {
		for (const container of containers) {
			const item = container.items.find((item) => item.id === id)
			if (item) return { container, item }
		}
		return null
	}

	const findContainerById = (id) => containers.find((container) => container.id === id)

	const handleDragStart = (event) => {
		setActiveId(event.active.id)
	}

	const handleDragEnd = (event) => {
		const { active, over } = event

		if (!over) return

		const activeContainerId = containers.find((container) =>
			container.items.some((item) => item.id === active.id)
		)?.id

		const overContainerId = containers.find(
			(container) => container.id === over.id || container.items.some((item) => item.id === over.id)
		)?.id

		if (!activeContainerId || !overContainerId) return

		if (activeContainerId !== overContainerId) {
			// Movimiento entre diferentes contenedores
			const activeContainerIndex = containers.findIndex((container) => container.id === activeContainerId)
			const overContainerIndex = containers.findIndex((container) => container.id === overContainerId)

			const activeContainer = containers[activeContainerIndex]
			const overContainer = containers[overContainerIndex]

			const activeItemIndex = activeContainer.items.findIndex((item) => item.id === active.id)
			const [movedItem] = activeContainer.items.splice(activeItemIndex, 1)

			overContainer.items.splice(overContainer.items.findIndex((item) => item.id === over.id) + 1, 0, movedItem)

			const newContainers = [...containers]
			newContainers[activeContainerIndex] = activeContainer
			newContainers[overContainerIndex] = overContainer

			setContainers(newContainers)
		} else {
			// Movimiento dentro del mismo contenedor
			const containerIndex = containers.findIndex((container) => container.id === activeContainerId)
			const container = containers[containerIndex]

			const activeItemIndex = container.items.findIndex((item) => item.id === active.id)
			const overItemIndex = container.items.findIndex((item) => item.id === over.id)

			const [movedItem] = container.items.splice(activeItemIndex, 1)
			container.items.splice(overItemIndex, 0, movedItem)

			const newContainers = [...containers]
			newContainers[containerIndex] = container

			setContainers(newContainers)
		}
	}

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCorners}
			onDragStart={handleDragStart}
			onDragEnd={handleDragEnd}
		>
			<div className='flex flex-col w-full gap-3'>
				<SortableContext items={containers.map((container) => container.id)}>
					{containers.map((container) => (
						<div key={container.id} className='flex w-full'>
							<ContainerDnd key={container.id} id={container.id} title={container.title}>
								<SortableContext items={container.items.map((item) => item.id)}>
									<div className='flex flex-wrap items-start gap-4'>
										{container.items.map((item) => (
											<ItemsDnD key={item.id} id={item.id} control={item} />
										))}
									</div>
								</SortableContext>
							</ContainerDnd>
						</div>
					))}
				</SortableContext>
				<DragOverlay>
					{activeId && findItemById(activeId)?.item && (
						<ItemsDnD id={activeId} control={findItemById(activeId).item} />
					)}
				</DragOverlay>
			</div>
		</DndContext>
	)
}
