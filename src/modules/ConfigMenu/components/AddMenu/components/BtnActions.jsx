import { Add, Delete, Edit } from '@mui/icons-material'
import { IconButton } from '@mui/material'

function BtnActions({ data, optCreate, optDelete, optEdit }) {
	return (
		<>
			{optCreate && (
				<IconButton
					className='!text-green-600'
					title='Agregar menu'
					onClick={(e) => {
						e.stopPropagation()
						optCreate(data)
					}}
				>
					<Add />
				</IconButton>
			)}
			{optDelete && (
				<IconButton
					className='!text-red-600'
					title='Eliminar menu'
					onClick={(e) => {
						e.stopPropagation()
						optDelete(data)
					}}
				>
					<Delete />
				</IconButton>
			)}
			{optEdit && (
				<IconButton
					className='!text-yellow-400'
					title='Editar menu'
					onClick={(e) => {
						e.stopPropagation()
						optEdit(data)
					}}
				>
					<Edit />
				</IconButton>
			)}
		</>
	)
}

export default BtnActions
