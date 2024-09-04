import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

function ContainerDnd({ id, children, title }) {
	const { attributes, setNodeRef, transform, transition } = useSortable({
		id: id,
		data: {
			type: 'container',
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
			className={'w-full h-full p-4 bg-gray-50 cursor-auto rounded-xl flex flex-col gap-y-4'}
		>
			<div className='flex items-center justify-between'>
				<div className='flex flex-col gap-y-1'>
					<h1 className='text-gray-800 text-xl'>{title}</h1>
				</div>
			</div>
			<div className='flex flex-col gap-y-4 w-full'>{children}</div>
		</div>
	)
}

export default ContainerDnd
