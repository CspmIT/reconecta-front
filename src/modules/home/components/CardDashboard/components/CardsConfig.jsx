import { useState } from 'react'
import { DndContext, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core'
import {
	SortableContext,
	arrayMove,
	sortableKeyboardCoordinates,
	useSortable,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { DragIndicator, Tune } from '@mui/icons-material'
import { CARD_CATALOG } from '../utils/listCard'

/*
 * Una fila del panel: asa para arrastrar, casilla para mostrar u ocultar.
 *
 * Los listeners del arrastre van SOLO en el asa. Si escucharan toda la fila,
 * tildar la casilla arrancaria un arrastre y el click nunca llegaria al input.
 */
function FilaCard({ id, title, checked, onToggle }) {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

	return (
		<div
			ref={setNodeRef}
			style={{ transition, transform: CSS.Translate.toString(transform) }}
			className={`flex items-center rounded px-1 py-1 hover:bg-gray-100 dark:hover:bg-zinc-700 ${
				isDragging ? 'opacity-50' : ''
			}`}
		>
			<span
				{...attributes}
				{...listeners}
				className='flex items-center cursor-grab text-gray-400 touch-none'
				title='Arrastrar para reordenar'
			>
				<DragIndicator fontSize='small' />
			</span>
			<label className='flex items-center flex-1 min-w-0 cursor-pointer'>
				<input
					type='checkbox'
					checked={checked}
					onChange={onToggle}
					className='mx-2 h-4 w-4 rounded accent-blue-600'
				/>
				<span className='text-sm text-black dark:text-white truncate'>{title}</span>
			</label>
		</div>
	)
}

/**
 * Panel para elegir que tarjetas se ven y en que orden.
 *
 * El estado vive arriba (CardDashboard) porque es el que persiste la
 * preferencia; aca solo se abre y se cierra el panel.
 */
function CardsConfig({ order, hidden, onChange }) {
	const [open, setOpen] = useState(false)
	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
	)

	const ocultas = new Set(hidden)
	const titulos = new Map(CARD_CATALOG.map((card) => [card.key, card.title]))

	const handleDragEnd = ({ active, over }) => {
		if (!over || active.id === over.id) return
		const desde = order.indexOf(active.id)
		const hasta = order.indexOf(over.id)
		if (desde < 0 || hasta < 0) return
		onChange({ order: arrayMove(order, desde, hasta), hidden })
	}

	const handleToggle = (key) => {
		const next = new Set(ocultas)
		if (next.has(key)) {
			next.delete(key)
		} else {
			next.add(key)
		}
		onChange({ order, hidden: [...next] })
	}

	/*
	 * Fila propia ARRIBA de la grilla, no un item mas entre las tarjetas.
	 *
	 * Como item de la grilla el boton se recolocaba cada vez que cambiaba la
	 * cantidad de tarjetas visibles —y con el panel abierto se corria debajo del
	 * cursor mientras se tildaban las casillas—. Al ser el primer elemento y
	 * ocupar el ancho completo, su posicion no depende de cuantas tarjetas haya.
	 *
	 * El z-index va por ENCIMA de los Fab de la tabla, que arrastran el 1050 del
	 * tema de MUI y se metian adelante del panel (varios de la tabla lo pisan con
	 * `!z-0`, pero no todos). Queda por debajo del 1201 de la barra de navegacion,
	 * que tiene que seguir ganando.
	 */
	return (
		<div className='relative w-full flex justify-end z-[1060]'>
			<button
				onClick={() => setOpen((v) => !v)}
				className='flex items-center gap-1 px-2 py-1 rounded-md border border-gray-300 dark:border-zinc-600 bg-white dark:bg-gray-800 text-xs font-semibold text-gray-600 dark:text-gray-300 shadow-sm'
			>
				<Tune style={{ fontSize: '1rem' }} />
				Personalizar tarjetas
			</button>

			{open && (
				<div className='absolute z-50 top-full right-0 mt-1 w-72 max-h-80 overflow-y-auto rounded-xl border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 shadow-lg p-2'>
					<p className='text-xs text-gray-500 dark:text-gray-400 px-1 pb-1'>
						Arrastrá para ordenar, destildá para ocultar
					</p>
					<DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
						<SortableContext items={order} strategy={verticalListSortingStrategy}>
							{order.map((key) => (
								<FilaCard
									key={key}
									id={key}
									title={titulos.get(key)}
									checked={!ocultas.has(key)}
									onToggle={() => handleToggle(key)}
								/>
							))}
						</SortableContext>
					</DndContext>
				</div>
			)}
		</div>
	)
}

export default CardsConfig
