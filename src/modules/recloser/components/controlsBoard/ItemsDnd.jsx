import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import ControlSwitch from './components/ControlSwitch'
import ControlCircle from './components/ControlCircle'

function ItemsDnD({ id, control }) {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
		id: id,
		data: {
			type: 'item',
		},
	})

	return (
		<div
			{...attributes}
			ref={setNodeRef}
			style={{
				transition,
				transform: CSS.Translate.toString(transform),
			}}
			className={isDragging ? ' opacity-50' : ''}
		>
			<div className='flex  p-3 rounded-md items-center justify-between bg-gray-300 ' {...listeners}>
				{control.type_input === 'switch' ? (
					<ControlSwitch control={control} />
				) : (
					<ControlCircle control={control} />
				)}
			</div>
		</div>
	)
}

export default ItemsDnD
