import { Add, Circle, Edit } from '@mui/icons-material'
import { IconButton } from '@mui/material'
import { useState } from 'react'
import { FaKey } from 'react-icons/fa'

export const ColumnsUser = (editUser, swalNewPassword, profile) => [
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
		accessorKey: 'profile',
		Cell: ({ row }) => {
			return (
				<p className='m-0 p-0 ml-2 text-base'>{`${
					profile.find((item) => item.id == row.original?.profile).description
				}`}</p>
			)
		},
	},
	{
		header: 'Clave de Operación',
		accessorKey: 'password',
		size: 50,
		Cell: ({ row }) => {
			const [editing, setEditing] = useState(false)

			return (
				<div className='flex items-center justify-end'>
					{editing ? (
						<div className='flex items-center'>
							<input
								type='text'
								value={row.original?.password}
								disabled={true}
								onChange={(e) => setPassword(e.target.value)}
								className='border p-1 rounded bg-transparent'
							/>
							<IconButton
								onClick={() => swalNewPassword(row.original).then(() => setEditing(false))}
								className='!text-black !shadow-md'
							>
								<Add />
							</IconButton>
						</div>
					) : (
						<div className='flex items-center'>
							<p className='m-0 p-0 mr-5 text-base'>{row.original?.password ? '••••••••' : ''}</p>
							<IconButton
								onClick={
									row.original?.password
										? () => setEditing(true)
										: () => swalNewPassword(row.original).then(() => setEditing(false))
								}
								className='!text-black !shadow-md'
							>
								{row.original?.password ? <FaKey /> : <Add />}
							</IconButton>
						</div>
					)}
				</div>
			)
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
