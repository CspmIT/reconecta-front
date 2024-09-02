import { arrayMove } from '@dnd-kit/sortable'
export const findItemById = (id, containers) => {
	for (const container of containers) {
		const item = container.items.find((item) => item.id === id)
		if (item) return { container, item }
	}
	return null
}

export function findValueOfItems(id, type, containers) {
	if (type === 'container') {
		return containers.find((item) => item.id === id)
	}
	if (type === 'item') {
		return containers.find((container) => container.items.find((item) => item.id === id))
	}
}
export const handleDragStart = (event, setActiveId) => {
	setActiveId(event.active.id)
}

export const handleDragMove = (event, containers, setContainers) => {
	const { active, over } = event
	if (!active || !over) return

	const activeId = active.id.toString()
	const overId = over.id.toString()

	if (activeId.includes('item') && overId.includes('item') && activeId !== overId) {
		const activeContainer = findValueOfItems(active.id, 'item', containers)
		const overContainer = findValueOfItems(over.id, 'item', containers)
		if (!activeContainer || !overContainer) return

		const activeContainerIndex = containers.findIndex((container) => container.id === activeContainer.id)
		const overContainerIndex = containers.findIndex((container) => container.id === overContainer.id)
		const activeItemIndex = activeContainer.items.findIndex((item) => item.id === active.id)
		const overItemIndex = overContainer.items.findIndex((item) => item.id === over.id)

		let newItems = [...containers]
		if (activeContainerIndex === overContainerIndex) {
			newItems[activeContainerIndex].items = arrayMove(
				newItems[activeContainerIndex].items,
				activeItemIndex,
				overItemIndex
			)
		} else {
			const [removedItem] = newItems[activeContainerIndex].items.splice(activeItemIndex, 1)
			newItems[overContainerIndex].items.splice(overItemIndex, 0, removedItem)
		}
		setContainers(newItems)
	}

	if (activeId.includes('item') && overId.includes('container') && activeId !== overId) {
		const activeContainer = findValueOfItems(active.id, 'item', containers)
		const overContainer = findValueOfItems(over.id, 'container', containers)
		if (!activeContainer || !overContainer) return

		const activeContainerIndex = containers.findIndex((container) => container.id === activeContainer.id)
		const overContainerIndex = containers.findIndex((container) => container.id === overContainer.id)
		const activeItemIndex = activeContainer.items.findIndex((item) => item.id === active.id)

		let newItems = [...containers]
		const [removedItem] = newItems[activeContainerIndex].items.splice(activeItemIndex, 1)
		newItems[overContainerIndex].items.push(removedItem)

		setContainers(newItems)
	}
}

export const handleDragEnd = (event, containers, setContainers, setContainer, setActiveId) => {
	const { active, over } = event
	if (!active || !over) return

	const activeId = active.id.toString()
	const overId = over.id.toString()

	if (activeId.includes('container') && overId.includes('container') && activeId !== overId) {
		const activeContainerIndex = containers.findIndex((container) => container.id === active.id)
		const overContainerIndex = containers.findIndex((container) => container.id === over.id)
		let newItems = [...containers]
		newItems = arrayMove(newItems, activeContainerIndex, overContainerIndex)
		setContainers(newItems)
	}

	if (activeId.includes('item') && overId.includes('item') && activeId !== overId) {
		const activeContainer = findValueOfItems(active.id, 'item', containers)
		const overContainer = findValueOfItems(over.id, 'item', containers)
		if (!activeContainer || !overContainer) return

		const activeContainerIndex = containers.findIndex((container) => container.id === activeContainer.id)
		const overContainerIndex = containers.findIndex((container) => container.id === overContainer.id)
		const activeItemIndex = activeContainer.items.findIndex((item) => item.id === active.id)
		const overItemIndex = overContainer.items.findIndex((item) => item.id === over.id)

		let newItems = [...containers]
		if (activeContainerIndex === overContainerIndex) {
			newItems[activeContainerIndex].items = arrayMove(
				newItems[activeContainerIndex].items,
				activeItemIndex,
				overItemIndex
			)
		} else {
			const [removedItem] = newItems[activeContainerIndex].items.splice(activeItemIndex, 1)
			newItems[overContainerIndex].items.splice(overItemIndex, 0, removedItem)
		}
		setContainers(newItems)
	}

	if (activeId.includes('item') && overId.includes('container') && activeId !== overId) {
		const activeContainer = findValueOfItems(active.id, 'item', containers)
		const overContainer = findValueOfItems(over.id, 'container', containers)
		if (!activeContainer || !overContainer) return

		const activeContainerIndex = containers.findIndex((container) => container.id === activeContainer.id)
		const overContainerIndex = containers.findIndex((container) => container.id === overContainer.id)
		const activeItemIndex = activeContainer.items.findIndex((item) => item.id === active.id)

		let newItems = [...containers]
		const [removedItem] = newItems[activeContainerIndex].items.splice(activeItemIndex, 1)
		newItems[overContainerIndex].items.push(removedItem)

		setContainers(newItems)
	}

	setActiveId(null)
	setContainer(containers)
}
