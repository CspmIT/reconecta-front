import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

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
			className={
				('px-2 py-4 bg-white shadow-md rounded-xl w-full border border-transparent hover:border-gray-200 cursor-pointer',
				isDragging && 'opacity-50')
			}
		>
			<div className='flex p-3 rounded-md items-center justify-between bg-slate-400' {...listeners}>
				<label>
					<b>{control.name}</b>
				</label>
			</div>
		</div>
	)
}

export default ItemsDnD
