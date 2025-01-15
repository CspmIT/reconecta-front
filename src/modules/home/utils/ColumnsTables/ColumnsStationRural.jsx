import { IconButton } from '@mui/material'
import { CheckCircleSharp, ErrorSharp } from '@mui/icons-material'
import { BiWindowOpen } from 'react-icons/bi'

export const ColumnsRural = (newTab) => [
	{
		header: 'Sub-Estación',
		accessorKey: 'name_station',
		muiFilterTextFieldProps: { placeholder: 'Sub-Estación' },

		Cell: ({ row }) => <p className='m-0 p-0 ml-2 text-base dark:!text-black'>{row.original?.name_station}</p>,
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
								<li key={index} className='dark:!text-black'>
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

		Cell: ({ row }) => <p className='m-0 p-0 ml-2 text-base dark:!text-black'>{row.original?.num_meter}</p>,
	},
	{
		header: 'Latitud',
		accessorKey: 'lat_point',
		muiFilterTextFieldProps: { placeholder: 'Latitud' },

		Cell: ({ row }) => <p className='m-0 p-0 ml-2 text-base dark:!text-black'>{row.original?.lat_point}</p>,
	},
	{
		header: 'Longitud',
		accessorKey: 'lng_point',
		muiFilterTextFieldProps: { placeholder: 'Longitud' },

		Cell: ({ row }) => <p className='m-0 p-0 ml-2 text-base dark:!text-black'>{row.original?.lng_point}</p>,
	},
	{
		header: 'Potencia',
		size: 50,
		accessorKey: 'potencia_transformador',
		muiFilterTextFieldProps: { placeholder: 'Potencia' },

		Cell: ({ row }) => (
			<p className='m-0 p-0 ml-2 text-base dark:!text-black'>{row.original?.potencia_transformador}</p>
		),
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
				name: row.original.name_station,
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

export const ColumnsRuralCel = (newTab) => [
	{
		header: <span className='text-xs'>Sub-Estación</span>,
		accessorKey: 'name_station',
		muiTableHeadCellProps: {
			style: { minWidth: '30px', maxWidth: '30px' },
		},
		muiTableBodyCellProps: {
			style: { minWidth: 'auto' },
		},
		muiFilterTextFieldProps: { placeholder: 'Sub-Estación' },
		Cell: ({ row }) => <div className='text-xs  dark:text-black'>{row.original.name_station}</div>,
	},
	{
		header: <span className='text-xs'>Nombre de usuario</span>,
		accessorKey: 'user',
		size: 40,
		muiTableHeadCellProps: {
			style: { minWidth: '70px', maxWidth: '70px' },
		},
		muiTableBodyCellProps: {
			style: { minWidth: 'auto' },
		},
		Cell: ({ row }) => {
			return (
				<div key={row.original.id} className='flex items-center w-full'>
					<ul>
						{row.original?.user.map((user, index) => {
							return (
								<li key={index} className='text-gray-600  dark:text-black text-xs'>
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
		header: <span className='text-xs'>N° de Medidor</span>,
		accessorKey: 'num_meter',
		muiFilterTextFieldProps: { placeholder: 'Nº de Medidor' },
		muiTableHeadCellProps: {
			style: { with: 'auto', minWidth: '30px', maxWidth: '30px' },
		},
		muiTableBodyCellProps: {
			style: { minWidth: 'auto' },
		},
		Cell: ({ row }) => <div className='text-xs dark:text-black'>{row.original.num_meter}</div>,
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
				name: row.original.name_station,
				id: parseInt(row.original.id),
				type_recloser: 5,
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
