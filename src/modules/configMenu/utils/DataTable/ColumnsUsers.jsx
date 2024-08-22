import { Circle, Edit } from '@mui/icons-material'
import { IconButton } from '@mui/material'
import { BiWindowOpen } from 'react-icons/bi'
const profile = {
	1: 'Super Admin',
	2: 'Moderador',
	3: 'Lector',
	4: 'Operador',
}
export const ColumnsUser = (editUser) => [
	{
		header: 'Nombre',
		accessorKey: 'first_name',
		Cell: ({ row }) => {
			return <p className='m-0 p-0 ml-2 text-base'>{`${row.original?.first_name} ${row.original?.last_name}`}</p>
		},
		size: 300,
	},
	{
		header: 'Email',
		accessorKey: 'email',
	},
	{
		header: 'Perfil',
		accessorKey: 'id_profile',
		Cell: ({ row }) => {
			return <p className='m-0 p-0 ml-2 text-base'>{`${profile[row.original?.id_profile]}`}</p>
		},
	},
	{
		header: 'Estado',
		accessorKey: 'status',
		Cell: ({ row }) => {
			return (
				<div className='flex items-center w-full'>
					<Circle color={row.original?.status > 0 ? 'success' : 'error'} />
					<p className='m-0 p-0 ml-2 text-base'>{`${
						row.original?.status > 0 ? 'Habilitado' : 'Deshabilitado'
					}`}</p>
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
			return (
				<IconButton
					onClick={() => editUser(row.original)}
					className=' !bg-[#ffbf1e] hover:!bg-[#ffde89] !text-black !shadow-md'
				>
					<Edit />
				</IconButton>
			)
		},
	},
]
