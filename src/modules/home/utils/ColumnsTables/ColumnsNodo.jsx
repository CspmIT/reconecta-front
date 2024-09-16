import { IconButton } from '@mui/material'
import { Circle } from '@mui/icons-material'
import { BiTrash, BiWindowOpen } from 'react-icons/bi'

export const ColumnsNodo = (newTab, deleteRecloser) => [
	{
		header: 'Nº',
		accessorKey: 'number',
		muiFilterTextFieldProps: { placeholder: 'Nº' },
		grow: false,
		size: 20,
	},
	{
		header: 'Nombre',
		accessorKey: 'name',
		muiFilterTextFieldProps: { placeholder: 'name' },
	},
	{
		header: 'Descripción',
		accessorKey: 'description',
		muiFilterTextFieldProps: { placeholder: 'Marca' },
	},
	// {
	// 	header: 'Estado',
	// 	accessorKey: 'recloser',
	// 	size: 50,
	// 	enableColumnFilter: false,
	// 	enableClickToCopy: false,
	// 	Cell: ({ row }) => {
	// 		return (
	// 			<div className='flex items-center w-full'>
	// 				<Circle color={row.original?.recloser.length > 0 ? 'success' : 'error'} />
	// 				<p className='m-0 p-0 ml-2 text-base'>{`${
	// 					row.original?.recloser.length > 0 ? 'Vinculado' : 'Desvinculado'
	// 				}`}</p>
	// 			</div>
	// 		)
	// 	},
	// },
	{
		header: '',
		accessorKey: 'btn-dashboard',
		size: 10,
		enableSorting: false,
		enableColumnFilter: false,
		enableClickToCopy: false,
		Cell: ({ row }) => {
			row.original.type_recloser = 1
			return (
				<>
					<IconButton
						onClick={() => newTab(row.original)}
						className=' !bg-[#bce1fc] hover:!bg-[#74bdf2] !text-black !shadow-md'
					>
						<BiWindowOpen />
					</IconButton>
					<IconButton
						onClick={() => deleteRecloser(row.original)}
						className='!ml-3 !bg-[#fd7979] hover:!bg-[#ff5656] !text-black !shadow-md'
					>
						<BiTrash />
					</IconButton>
				</>
			)
		},
	},
]
