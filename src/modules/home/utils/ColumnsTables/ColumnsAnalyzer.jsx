import { IconButton } from '@mui/material'
import { CheckCircleSharp, ErrorSharp } from '@mui/icons-material'
import { BiWindowOpen } from 'react-icons/bi'

export const ColumnsAnalyzer = (newTab) => [
	{
		header: 'Nombre/ubicacion',
		accessorKey: 'name',
		muiFilterTextFieldProps: { placeholder: 'Nro de serie' },
		Cell: ({ row }) => <p className='m-0 p-0 ml-2 text-base dark:!text-black'>{row.original?.name}</p>,
	},
	{
		header: 'Marca',
		accessorKey: 'brand',
		muiFilterTextFieldProps: { placeholder: 'Nombre usuario' },
		Cell: ({ row }) => <p className='m-0 p-0 ml-2 text-base dark:!text-black'>{row.original?.brand}</p>,
	},

	{
		header: 'Versión',
		accessorKey: 'version',
		muiFilterTextFieldProps: { placeholder: 'Version' },
		Cell: ({ row }) => <p className='m-0 p-0 ml-2 text-base dark:!text-black'>{row.original?.version}</p>,
	},
	{
		header: 'Nro de serie',
		accessorKey: 'serial',
		muiFilterTextFieldProps: { placeholder: 'Marca' },
		Cell: ({ row }) => <p className='m-0 p-0 ml-2 text-base dark:!text-black'>{row.original?.serial}</p>,
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

export const ColumnsAnalyzerCel = (newTab) => [
	{
		header: <span className='text-xs'>Nombre/ubicacion</span>,
		accessorKey: 'name',
		muiFilterTextFieldProps: { placeholder: 'Nro de serie' },
		muiTableHeadCellProps: {
			style: { minWidth: '140px', maxWidth: '140px' },
		},
		muiTableBodyCellProps: {
			style: { minWidth: 'auto' },
		},
		Cell: ({ row }) => <div className='text-xs dark:!text-black'>{row.original.name}</div>,
	},
	{
		header: <span className='text-xs'>Nro de serie</span>,
		accessorKey: 'serial',
		muiFilterTextFieldProps: { placeholder: 'Marca' },
		muiTableHeadCellProps: {
			style: { minWidth: '70px', maxWidth: '70px' },
		},
		muiTableBodyCellProps: {
			style: { minWidth: 'auto' },
		},
		Cell: ({ row }) => <div className='text-xs dark:!text-black'>{row.original.serial}</div>,
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
					size='small'
					onClick={() => newTab(info)}
					className=' !bg-[#bce1fc] hover:!bg-[#74bdf2] !text-black !shadow-md'
				>
					<BiWindowOpen />
				</IconButton>
			)
		},
	},
]
