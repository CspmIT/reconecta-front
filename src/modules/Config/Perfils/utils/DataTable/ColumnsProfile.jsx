import { IconButton } from '@mui/material'
import { BiWindowOpen } from 'react-icons/bi'

export const ColumnsProfile = () => [
	{
		header: 'Perfil',
		accessorKey: 'profile',
	},
	{
		header: 'Estado',
		accessorKey: 'status',
	},
	{
		header: '',
		accessorKey: 'btn-dashboard',
		size: 10,
		enableSorting: false,
		enableColumnFilter: false,
		enableClickToCopy: false,
		Cell: ({ row }) => {
			const info = {
				Name: row.original.name,
				id: parseInt(row.original.id),
				type_recloser: 4,
				...row.origin,
			}
			return (
				<IconButton
					onClick={() => newTab(info)}
					className=' !bg-[#bce1fc] hover:!bg-[#74bdf2] !text-black !shadow-md'
				>
					<BiWindowOpen />
				</IconButton>
			)
		},
	},
]
