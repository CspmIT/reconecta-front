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

const PUNTO = {
	rojo: 'bg-sev-rojo',
	naranja: 'bg-sev-naranja',
	amarillo: 'bg-sev-amarillo',
	dato: 'bg-linea',
}

/*
 * Una fila del panel: asa para arrastrar, casilla para mostrar u ocultar y el
 * punto con el tono del indicador.
 *
 * Los listeners del arrastre van SOLO en el asa. Si escucharan toda la fila,
 * tildar la casilla arrancaria un arrastre y el click nunca llegaria al input.
 */
function FilaCard({ id, rotulo, tono, checked, onToggle }) {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

	return (
		<div
			ref={setNodeRef}
			style={{ transition, transform: CSS.Translate.toString(transform) }}
			className={`flex items-center gap-2.5 rounded px-1.5 py-1.5 hover:bg-[#F3F5F7] dark:hover:bg-zinc-700 ${
				isDragging ? 'opacity-35' : ''
			}`}
		>
			<span
				{...attributes}
				{...listeners}
				className='flex items-center cursor-grab text-[#C3CAD2] touch-none'
				title='Arrastrar para reordenar'
			>
				<DragIndicator fontSize='small' />
			</span>
			<label className='flex items-center gap-2.5 flex-1 min-w-0 cursor-pointer'>
				<input type='checkbox' checked={checked} onChange={onToggle} className='h-[15px] w-[15px] rounded accent-acento' />
				<span
					className={`text-[13.5px] leading-[1.25] ${
						checked ? 'text-tinta dark:text-white' : 'text-tinta-2 dark:text-gray-400'
					}`}
				>
					{rotulo}
				</span>
			</label>
			<span className={`w-[7px] h-[7px] rounded-sm flex-none ${PUNTO[tono] ?? PUNTO.dato}`} />
		</div>
	)
}

/**
 * Panel para elegir que tarjetas se ven, en que orden, y si las que estan en
 * alerta se adelantan.
 *
 * El estado vive arriba (CardDashboard) porque es el que persiste la
 * preferencia; aca solo se abre y se cierra el panel.
 */
function CardsConfig({ prefs, onChange, compact = false }) {
	const [open, setOpen] = useState(false)
	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
	)

	const { order, hidden, priorizar } = prefs
	const ocultas = new Set(hidden)
	const porClave = new Map(CARD_CATALOG.map((card) => [card.key, card]))

	const handleDragEnd = ({ active, over }) => {
		if (!over || active.id === over.id) return
		const desde = order.indexOf(active.id)
		const hasta = order.indexOf(over.id)
		if (desde < 0 || hasta < 0) return
		onChange({ ...prefs, order: arrayMove(order, desde, hasta) })
	}

	const handleToggle = (key) => {
		const next = new Set(ocultas)
		if (next.has(key)) {
			next.delete(key)
		} else {
			next.add(key)
		}
		onChange({ ...prefs, hidden: [...next] })
	}

	const contenido = (
		<>
			<h3 className='text-[13px] font-semibold text-tinta dark:text-white mb-0.5'>Tarjetas visibles</h3>
			<p className='text-[12.5px] text-tinta-2 dark:text-tinta-3 mb-2.5 leading-[1.35]'>
				Arrastrá para cambiar el orden. Destildá para ocultar.
			</p>
			<div className='max-h-[310px] overflow-y-auto -mx-1'>
				<DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
					<SortableContext items={order} strategy={verticalListSortingStrategy}>
						{order.map((key) => (
							<FilaCard
								key={key}
								id={key}
								rotulo={porClave.get(key).rotulo}
								tono={porClave.get(key).tono}
								checked={!ocultas.has(key)}
								onToggle={() => handleToggle(key)}
							/>
						))}
					</SortableContext>
				</DndContext>
			</div>
			<button
				type='button'
				onClick={() => onChange({ ...prefs, priorizar: !priorizar })}
				aria-pressed={priorizar}
				className={`w-full mt-2.5 rounded border px-2.5 py-1.5 text-[13.5px] font-medium ${
					priorizar
						? 'bg-[#EEF0F8] border-acento text-acento'
						: 'bg-white dark:bg-gray-800 border-linea-fuerte text-tinta-2 dark:text-gray-300'
				}`}
			>
				Adelantar las que están en alerta
			</button>
		</>
	)

	/*
	 * `compact` no cambia el boton, solo como se abre el panel: en el telefono va
	 * como hoja inferior porque colgado del boton se salia de la pantalla —el
	 * boton vive en una columna angosta, asi que un panel de 288px anclado a su
	 * borde derecho arrancaba en x negativa y sus ultimas filas quedaban fuera del
	 * viewport, sin poder tocarlas.
	 */
	return (
		<div className='relative flex items-center flex-none z-[1060]'>
			<button
				type='button'
				onClick={() => setOpen((v) => !v)}
				aria-label='Personalizar tarjetas'
				aria-expanded={open}
				className='flex items-center gap-1.5 rounded border border-linea-fuerte bg-white dark:bg-gray-800 px-2.5 py-1.5 text-[13.5px] font-medium text-tinta-2 dark:text-gray-300'
			>
				<Tune style={{ fontSize: '1rem' }} />
				{!compact && 'Tarjetas'}
			</button>

			{open &&
				(compact ? (
					<>
						<div className='fixed inset-0 bg-[rgba(23,32,42,0.42)]' onClick={() => setOpen(false)} />
						<div className='fixed left-0 right-0 bottom-0 max-h-[70vh] overflow-y-auto rounded-t-2xl bg-white dark:bg-zinc-800 shadow-lg p-3.5 pb-[max(1rem,env(safe-area-inset-bottom))]'>
							{contenido}
						</div>
					</>
				) : (
					<div className='absolute z-50 top-full right-0 mt-2 w-[296px] rounded-lg border border-linea-fuerte bg-white dark:bg-zinc-800 shadow-[0_12px_28px_rgba(23,32,42,0.14)] p-3'>
						{contenido}
					</div>
				))}
		</div>
	)
}

export default CardsConfig
