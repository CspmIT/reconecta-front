import React, { useEffect, useState } from 'react'
import { DndContext, DragOverlay, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { closestCorners, KeyboardSensor, PointerSensor } from '@dnd-kit/core'
import ContainerDnd from './ContainerDnd'
import ItemsDnD from './ItemsDnd'
function DndComponent({ controls, info, setContainer }) {
	const [containers, setContainers] = useState([
		{
			id: 'container-Basic',
			title: 'Basicos',
			items: controls[info.brand][info.version].basic.map((item) => ({
				...item,
				id: 'item-' + item.id,
				group: 'Basic',
			})),
		},
		{
			id: 'container-Advance',
			title: 'Avanzados',
			items: controls[info.brand][info.version].advance.map((item) => ({
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

	const findItemById = (id) => {
		for (const container of containers) {
			const item = container.items.find((item) => item.id === id)
			if (item) return { container, item }
		}
		return null
	}

	function findValueOfItems(id, type) {
		if (type === 'container') {
			return containers.find((item) => item.id === id)
		}
		if (type === 'item') {
			return containers.find((container) => container.items.find((item) => item.id === id))
		}
	}

	const handleDragStart = (event) => {
		setActiveId(event.active.id)
	}

	const handleDragMove = (event) => {
		const { active, over } = event
		// Handle Items Sorting
		if (
			active.id.toString().includes('item') &&
			over?.id.toString().includes('item') &&
			active &&
			over &&
			active.id !== over.id
		) {
			// Find the active container and over container
			const activeContainer = findValueOfItems(active.id, 'item')
			const overContainer = findValueOfItems(over.id, 'item')

			// If the active or over container is not found, return
			if (!activeContainer || !overContainer) return

			// Find the index of the active and over container
			const activeContainerIndex = containers.findIndex((container) => container.id === activeContainer.id)
			const overContainerIndex = containers.findIndex((container) => container.id === overContainer.id)

			// Find the index of the active and over item
			const activeitemIndex = activeContainer.items.findIndex((item) => item.id === active.id)
			const overitemIndex = overContainer.items.findIndex((item) => item.id === over.id)
			// In the same container
			if (activeContainerIndex === overContainerIndex) {
				let newItems = [...containers]
				newItems[activeContainerIndex].items = arrayMove(
					newItems[activeContainerIndex].items,
					activeitemIndex,
					overitemIndex
				)

				setContainers(newItems)
			} else {
				// In different containers
				let newItems = [...containers]
				const [removeditem] = newItems[activeContainerIndex].items.splice(activeitemIndex, 1)
				newItems[overContainerIndex].items.splice(overitemIndex, 0, removeditem)
				setContainers(newItems)
			}
		}

		// Handling Item Drop Into a Container
		if (
			active.id.toString().includes('item') &&
			over?.id.toString().includes('container') &&
			active &&
			over &&
			active.id !== over.id
		) {
			// Find the active and over container
			const activeContainer = findValueOfItems(active.id, 'item')
			const overContainer = findValueOfItems(over.id, 'container')

			// If the active or over container is not found, return
			if (!activeContainer || !overContainer) return

			// Find the index of the active and over container
			const activeContainerIndex = containers.findIndex((container) => container.id === activeContainer.id)
			const overContainerIndex = containers.findIndex((container) => container.id === overContainer.id)

			// Find the index of the active and over item
			const activeitemIndex = activeContainer.items.findIndex((item) => item.id === active.id)

			// Remove the active item from the active container and add it to the over container
			let newItems = [...containers]
			const [removeditem] = newItems[activeContainerIndex].items.splice(activeitemIndex, 1)
			newItems[overContainerIndex].items.push(removeditem)
			setContainers(newItems)
		}
	}

	function handleDragEnd(event) {
		const { active, over } = event

		// Handling Container Sorting
		if (
			active.id.toString().includes('container') &&
			over?.id.toString().includes('container') &&
			active &&
			over &&
			active.id !== over.id
		) {
			// Find the index of the active and over container
			const activeContainerIndex = containers.findIndex((container) => container.id === active.id)
			const overContainerIndex = containers.findIndex((container) => container.id === over.id)
			// Swap the active and over container
			let newItems = [...containers]
			newItems = arrayMove(newItems, activeContainerIndex, overContainerIndex)
			setContainers(newItems)
		}

		// Handling item Sorting
		if (
			active.id.toString().includes('item') &&
			over?.id.toString().includes('item') &&
			active &&
			over &&
			active.id !== over.id
		) {
			// Find the active and over container
			const activeContainer = findValueOfItems(active.id, 'item')
			const overContainer = findValueOfItems(over.id, 'item')

			// If the active or over container is not found, return
			if (!activeContainer || !overContainer) return
			// Find the index of the active and over container
			const activeContainerIndex = containers.findIndex((container) => container.id === activeContainer.id)
			const overContainerIndex = containers.findIndex((container) => container.id === overContainer.id)
			// Find the index of the active and over item
			const activeitemIndex = activeContainer.items.findIndex((item) => item.id === active.id)
			const overitemIndex = overContainer.items.findIndex((item) => item.id === over.id)

			// In the same container
			if (activeContainerIndex === overContainerIndex) {
				let newItems = [...containers]
				newItems[activeContainerIndex].items = arrayMove(
					newItems[activeContainerIndex].items,
					activeitemIndex,
					overitemIndex
				)
				setContainers(newItems)
			} else {
				// In different containers
				let newItems = [...containers]
				const [removeditem] = newItems[activeContainerIndex].items.splice(activeitemIndex, 1)
				newItems[overContainerIndex].items.splice(overitemIndex, 0, removeditem)
				setContainers(newItems)
			}
		}
		// Handling item dropping into Container
		if (
			active.id.toString().includes('item') &&
			over?.id.toString().includes('container') &&
			active &&
			over &&
			active.id !== over.id
		) {
			// Find the active and over container
			const activeContainer = findValueOfItems(active.id, 'item')
			const overContainer = findValueOfItems(over.id, 'container')

			// If the active or over container is not found, return
			if (!activeContainer || !overContainer) return
			// Find the index of the active and over container
			const activeContainerIndex = containers.findIndex((container) => container.id === activeContainer.id)
			const overContainerIndex = containers.findIndex((container) => container.id === overContainer.id)
			// Find the index of the active and over item
			const activeitemIndex = activeContainer.items.findIndex((item) => item.id === active.id)

			let newItems = [...containers]
			const [removeditem] = newItems[activeContainerIndex].items.splice(activeitemIndex, 1)
			newItems[overContainerIndex].items.push(removeditem)
			setContainers(newItems)
		}
		setActiveId(null)
		setContainer(containers)
	}

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCorners}
			onDragStart={handleDragStart}
			onDragMove={handleDragMove}
			onDragEnd={handleDragEnd}
		>
			<div className='flex flex-col w-full gap-3'>
				<SortableContext items={containers.map((container) => container.id)}>
					{containers.map((container) => (
						<ContainerDnd key={container.id} id={container.id} title={container.title}>
							<div className='grid grid-cols-4 gap-3'>
								<SortableContext items={container.items.map((item) => item.id)}>
									{container.items.map((item) => (
										<div key={item.id} className='w-full'>
											<ItemsDnD key={item.id} id={item.id} control={item} />
										</div>
									))}
								</SortableContext>
							</div>
						</ContainerDnd>
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

export default DndComponent
