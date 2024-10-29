import { IconButton } from '@mui/material'
import { CheckCircleSharp, ErrorSharp } from '@mui/icons-material'
import { BiWindowOpen } from 'react-icons/bi'

export const ColumnsMeter = (newTab) => [
	{
		header: 'Nro de serie',
		accessorKey: 'num_serie',
		muiFilterTextFieldProps: { placeholder: 'Nro de serie' },
	},
	{
		header: 'Nombre',
		accessorKey: 'device_name',
		muiFilterTextFieldProps: { placeholder: 'Nombre usuario' },
	},
	{
		header: 'Tipo de Estación',
		accessorKey: 'type_station',
		muiFilterTextFieldProps: { placeholder: 'Tipo de Estación' },
	},
	{
		header: 'Version',
		accessorKey: 'version',
		muiFilterTextFieldProps: { placeholder: 'Version' },
	},
	{
		header: 'Marca',
		accessorKey: 'brand',
		muiFilterTextFieldProps: { placeholder: 'Marca' },
	},
	{
		header: 'On-Line',
		accessorKey: 'status',
		size: 80,
		enableColumnFilter: false,
		enableClickToCopy: false,
		Cell: ({ row }) => {
			return (
				<div className='flex items-center w-full'>
					{parseInt(row.original?.status) > 0 ? (
						<CheckCircleSharp color='success' className='!text-3xl' />
					) : (
						<ErrorSharp color='warning' className='!text-3xl' />
					)}
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
			const info = {
				name: row.original.device_name,
				id: parseInt(row.original.id),
				type_recloser: 2,
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
