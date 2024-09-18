import { IconButton } from '@mui/material'
import { BiTrash } from 'react-icons/bi'

export const ColumnsDevice = (removeElementList) => [
	{
		header: 'Nº de serie',
		accessorKey: 'serial',
		size: 200,
	},
	{
		header: 'Marca',
		accessorKey: 'brand',
	},
	{
		header: '',
		accessorKey: 'btn-dashboard',
		size: 10,
		enableSorting: false,
		enableColumnFilter: false,
		enableClickToCopy: false,
		Cell: ({ row }) => {
			return (
				<IconButton
					onClick={() => removeElementList(row.original.id)}
					className='!ml-3 !bg-[#fd7979] hover:!bg-[#ff5656] !text-black !shadow-md'
				>
					<BiTrash />
				</IconButton>
			)
		},
	},
]
