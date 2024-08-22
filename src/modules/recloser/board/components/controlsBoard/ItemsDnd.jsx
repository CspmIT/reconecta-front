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
			className={isDragging ? ' opacity-50' : ''}
		>
			<div className='flex  p-3 rounded-md items-center justify-between bg-gray-300 ' {...listeners}>
				{control.type === 'switch' ? (
					<>
						<label>
							<b className='mr-2'>{control.name}</b>
						</label>
						<label className='inline-flex items-center cursor-pointer'>
							<input
								disabled={true}
								type='checkbox'
								checked={false}
								id={control.field}
								className='sr-only peer'
							/>
							<div className="relative w-14 h-7 bg-gray-400 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
						</label>
					</>
				) : (
					<>
						<label>
							<b className='mr-2'>{control.name}</b>
						</label>
						<div className='flex flex-row justify-center'>
							{Array.from({ length: 4 }, (_, i) => (
								<span
									className={` bg-slate-400 mx-2 text-white rounded-[50%] w-[28px] h-[27px] flex pl-[10px] pt-[3px] cursor-pointer`}
									key={i}
								>
									{i + 1}
								</span>
							))}
						</div>
					</>
				)}
			</div>
		</div>
	)
}

export default ItemsDnD
