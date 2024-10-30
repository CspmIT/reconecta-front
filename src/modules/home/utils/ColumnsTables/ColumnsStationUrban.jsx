import { IconButton } from '@mui/material'
import { CheckCircleSharp, ErrorSharp } from '@mui/icons-material'
import { BiWindowOpen } from 'react-icons/bi'

export const ColumnsUrban = (newTab) => [
	{
		header: 'Nombre',
		accessorKey: 'name',
		muiFilterTextFieldProps: { placeholder: 'Nombre' },
	},
	{
		header: 'Ubicación',
		accessorKey: 'location',
		muiFilterTextFieldProps: { placeholder: 'Ubicación' },
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
					{row.original?.status > 0 ? (
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
				name: row.original.name,
				id: parseInt(row.original.id),
				type_recloser: 3,
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

export const ColumnsUrbanCel = (newTab) => [
	{
		header: <span className="text-xs">Nombre</span>,
		accessorKey: 'name',
		muiFilterTextFieldProps: { placeholder: 'Nombre' },
		muiTableHeadCellProps: {
			style: { minWidth: '70px', maxWidth: '70px' },
		},
		muiTableBodyCellProps: {
			style: { minWidth: 'auto' },
		},
		Cell: ({ row }) => (
			<div  className="text-xs">{row.original.name}</div>
		),
	},
	{
		header: <span className="text-xs">On-Line</span>,
		accessorKey: 'status',
		size: 10,
		enableColumnFilter: false,
		enableClickToCopy: false,
		muiTableHeadCellProps: {
			style: { minWidth: '70px', maxWidth: '70px' },
		},
		muiTableBodyCellProps: {
			style: { minWidth: 'auto' },
		},
		Cell: ({ row }) => {
			return (
				<div className='flex items-center w-full'>
					{row.original?.status > 0 ? (
						<CheckCircleSharp color='success' className='md:!text-3xl' />
					) : (
						<ErrorSharp color='warning' className='md:!text-3xl' />
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
				name: row.original.name,
				id: parseInt(row.original.id),
				type_recloser: 3,
				...row.origin,
			}
			return (
				<IconButton
				size="small"
					onClick={() => newTab(info)}
					className=' !bg-[#bce1fc] hover:!bg-[#74bdf2] !text-black !shadow-md'
				>
					<BiWindowOpen />
				</IconButton>
			)
		},
	},
]
