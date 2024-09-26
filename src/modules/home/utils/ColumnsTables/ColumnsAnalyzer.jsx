import { IconButton } from '@mui/material'
import { CheckCircleSharp, ErrorSharp } from '@mui/icons-material'
import { BiWindowOpen } from 'react-icons/bi'

export const ColumnsAnalyzer = (newTab) => [
	{
		header: 'Nombre/ubicacion',
		accessorKey: 'name',
		muiFilterTextFieldProps: { placeholder: 'Nro de serie' },
	},
	{
		header: 'Marca',
		accessorKey: 'brand',
		muiFilterTextFieldProps: { placeholder: 'Nombre usuario' },
	},

	{
		header: 'Versión',
		accessorKey: 'version',
		muiFilterTextFieldProps: { placeholder: 'Version' },
	},
	{
		header: 'Nro de serie',
		accessorKey: 'serial',
		muiFilterTextFieldProps: { placeholder: 'Marca' },
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
				name: row.original.name,
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
