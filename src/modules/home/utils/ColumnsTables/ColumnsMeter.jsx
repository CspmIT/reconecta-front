import { IconButton } from '@mui/material'
import { CheckCircleSharp, ErrorSharp } from '@mui/icons-material'
import { BiWindowOpen } from 'react-icons/bi'

export const ColumnsMeter = (newTab) => [
	{
		header: 'Matricula',
		accessorKey: 'matricula',
		muiFilterTextFieldProps: { placeholder: 'Matricula' },
		Cell: ({ row }) => <p className='m-0 p-0 ml-2 text-base dark:!text-black'>{row.original?.matricula}</p>,
	},
	{
		header: 'Nodo',
		accessorKey: 'device_name',
		muiFilterTextFieldProps: { placeholder: 'Nodo' },
		Cell: ({ row }) => <p className='m-0 p-0 ml-2 text-base dark:!text-black'>{row.original?.device_name}</p>,
	},
	{
		header: 'Nro de serie',
		accessorKey: 'serial',
		muiFilterTextFieldProps: { placeholder: 'Nro de serie' },
		Cell: ({ row }) => <p className='m-0 p-0 ml-2 text-base dark:!text-black'>{row.original?.serial}</p>,
	},
	{
		header: 'Version',
		accessorKey: 'version',
		muiFilterTextFieldProps: { placeholder: 'Version' },
		Cell: ({ row }) => <p className='m-0 p-0 ml-2 text-base dark:!text-black'>{row.original?.version}</p>,
	},
	{
		header: 'On-Line',
		accessorKey: 'status_meter',
		size: 80,
		enableColumnFilter: false,
		enableClickToCopy: false,
		Cell: ({ row }) => {
			return (
				<div className='flex items-center w-full'>
					{parseInt(row.original?.status_meter) > 0 ? (
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

export const ColumnsMeterCel = (newTab) => [
	{
		header: <span className='text-xs'>Nro de serie</span>,
		accessorKey: 'serial',
		muiFilterTextFieldProps: { placeholder: 'Nro de serie' },
		muiTableHeadCellProps: {
			style: { width: 'auto', minWidth: '20px', maxWidth: '20px' },
		},
		muiTableBodyCellProps: {
			style: { minWidth: 'auto' },
		},
		Cell: ({ row }) => <div className='text-xs dark:text-black'>{row.original.num_serie}</div>,
	},
	{
		header: <span className='text-xs'>On-Line</span>,
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
					{parseInt(row.original?.status) > 0 ? (
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
				name: row.original.device_name,
				id: parseInt(row.original.id),
				type_recloser: 2,
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
