import { IconButton } from '@mui/material'
import { Circle, Edit } from '@mui/icons-material'
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
	{
		header: 'Relación',
		accessorKey: 'node_history',
		size: 50,
		enableColumnFilter: false,
		enableClickToCopy: false,
		Cell: ({ row }) => {
			return (
				<div className='flex items-center justify-center md:justify-start w-full'>
					<Circle color={row?.original?.node_history?.length > 0 ? 'success' : 'error'} />
					<p className='m-0 p-0 ml-2 text-base hidden md:block'>{`${row?.original?.node_history?.length > 0 ? 'Vinculado' : 'Desvinculado'}`}</p>
				</div>
			)
		},
	},
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
					<IconButton onClick={() => newTab(row.original)} className='!m-1 !bg-[#fcf9bc] hover:!bg-[#f2ec74] !text-black !shadow-md'>
						<Edit />
					</IconButton>
					<IconButton
						onClick={() => deleteRecloser(row.original)}
						className='!m-1 !bg-[#fd7979] hover:!bg-[#ff5656] !text-black !shadow-md'
					>
						<BiTrash />
					</IconButton>
				</>
			)
		},
	},
]
