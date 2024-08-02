import { IconButton } from '@mui/material'
import { CheckCircleSharp, ErrorSharp } from '@mui/icons-material'
import { BiWindowOpen } from 'react-icons/bi'

export const ColumnsRural = (newTab) => [
	{
		header: 'Sub-Estación',
		accessorKey: 'name_station',
		muiFilterTextFieldProps: { placeholder: 'Sub-Estación' },
	},
	{
		header: 'Nombre de usuario',
		accessorKey: 'user',
		size: 350,
		Cell: ({ row }) => {
			return (
				<div key={row.original.id} className='flex items-center w-full'>
					<ul>
						{row.original?.user.map((user, index) => {
							return (
								<li key={index} className='text-gray-600'>
									- {user.name_user_recloser}
								</li>
							)
						})}
					</ul>
				</div>
			)
		},
		muiFilterTextFieldProps: { placeholder: 'Nombre usuario' },
	},
	{
		header: 'Nº de Medidor',
		accessorKey: 'num_meter',
		muiFilterTextFieldProps: { placeholder: 'Nº de Medidor' },
	},
	{
		header: 'Latitud',
		accessorKey: 'lat_point',
		muiFilterTextFieldProps: { placeholder: 'Latitud' },
	},
	{
		header: 'Longitud',
		accessorKey: 'lng_point',
		muiFilterTextFieldProps: { placeholder: 'Longitud' },
	},
	{
		header: 'Potencia',
		accessorKey: 'potencia_transformador',
		muiFilterTextFieldProps: { placeholder: 'Potencia' },
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
				Name: row.original.name_station,
				id: parseInt(row.original.id),
				type_recloser: 5,
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
