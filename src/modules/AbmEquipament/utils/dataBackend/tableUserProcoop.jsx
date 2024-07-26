import { Circle } from '@mui/icons-material'
import { IconButton } from '@mui/material'
import { BiTrash } from 'react-icons/bi'

export const columnsUsers = (deleteUser) => [
	{
		header: 'Num. Socio',
		accessorKey: 'numCustomer',
		muiFilterTextFieldProps: { placeholder: 'Numero de socio' },
		grow: false,
		size: 20,
	},
	{
		header: 'Nombre',
		accessorKey: 'name',
		muiFilterTextFieldProps: { placeholder: 'Nombre' },
	},
	{
		header: 'Cuenta',
		accessorKey: 'account',
		muiFilterTextFieldProps: { placeholder: 'Numero de cuenta' },
	},
	{
		header: 'Medidor',
		accessorKey: 'numberMeter',
		muiFilterTextFieldProps: { placeholder: 'Numero de Medidor' },
	},
	{
		header: 'Estado del Servicio',
		accessorKey: 'statusUser',
		muiFilterTextFieldProps: { placeholder: 'Estado del Servicio' },
		Cell: ({ row }) => {
			return (
				<div className='flex items-center w-full'>
					<Circle color={row.original?.statusUser === 1 ? 'success' : 'error'} />
					<p className='m-0 p-0 ml-2 text-base'>{`${
						row.original?.statusUser === 1 ? 'En Servicio' : 'Fuera de Servicio'
					}`}</p>
				</div>
			)
		},
	},
	{
		header: '',
		accessorKey: 'btn-delete-user',
		size: 10,
		enableSorting: false,
		enableColumnFilter: false,
		enableClickToCopy: false,
		Cell: ({ row }) => {
			return (
				<IconButton
					onClick={() => deleteUser(row.original.numCustomer)}
					className=' !bg-[#fcbcbc] hover:!bg-[#f27474] !text-black !shadow-md'
				>
					<BiTrash />
				</IconButton>
			)
		},
	},
]
