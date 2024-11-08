import { FormControlLabel, IconButton, Switch } from '@mui/material'
import { Circle } from '@mui/icons-material'
import { BiWindowOpen } from 'react-icons/bi'

export const ColumnsRecloser = (changeAlarm, newTab) => [
	{
		header: 'Matricula',
		accessorKey: 'number',
		muiFilterTextFieldProps: { placeholder: 'Nº' },
		grow: false,
		maxSize: 20,
		size: 19,
		minSize: 10,
		Cell: ({ row }) => <p className='m-0 p-0 ml-2 text-base dark:!text-black'>{row.original?.number}</p>,
	},
	{
		header: 'Nombre',
		accessorKey: 'name',
		muiFilterTextFieldProps: { placeholder: 'name' },
		Cell: ({ row }) => <p className='m-0 p-0 ml-2 text-base dark:!text-black'>{row.original?.name}</p>,
	},
	{
		header: 'Num. de Serie',
		accessorKey: 'serial',

		muiFilterTextFieldProps: { placeholder: 'Num. de Serie' },

		Cell: ({ row }) => <p className='m-0 p-0 ml-2 text-base dark:!text-black'>{row.original?.serial}</p>,
	},
	{
		header: 'Marca',
		accessorKey: 'version',
		muiFilterTextFieldProps: { placeholder: 'Marca' },

		Cell: ({ row }) => <p className='m-0 p-0 ml-2 text-base dark:!text-black'>{row.original?.version}</p>,
	},
	{
		header: 'Estado',
		accessorKey: 'status_recloser',
		size: 50,
		enableColumnFilter: false,
		enableClickToCopy: false,

		Cell: ({ row }) => {
			const status = {
				0: {
					description: 'Cerrado',
					color: 'error',
				},
				1: {
					description: 'Abierto',
					color: 'success',
				},
				2: {
					description: 'Offline',
					color: 'warning',
				},
				3: {
					description: 'Offline',
					color: 'warning',
				},
			}
			return (
				<div className='flex items-center justify-center md:justify-start w-full'>
					<Circle color={status[row.original?.status_recloser].color} />
					<p className='m-0 p-0 ml-2 text-base dark:!text-black'>{`${
						status[row.original?.status_recloser].description
					}`}</p>
				</div>
			)
		},
	},
	{
		header: 'Alarma',
		accessorKey: 'status_alarm',
		size: 185,
		enableColumnFilter: false,
		enableClickToCopy: false,

		Cell: ({ row }) => {
			return (
				<FormControlLabel
					control={
						<Switch
							checked={row.original?.status_alarm > 0 ? true : false}
							onChange={() => changeAlarm(row.original)}
							name={row.original.name}
						/>
					}
					className='dark:text-black m-0 p-0'
					label={row.original?.status_alarm ? 'Activada' : 'Desactivada'}
				/>
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
			row.original.type_recloser = 1
			return (
				<>
					<IconButton
						onClick={() => newTab(row.original)}
						// size='small'
						className='!m-0 !text-base !bg-[#bce1fc] hover:!bg-[#74bdf2] !text-black !shadow-md'
					>
						<BiWindowOpen />
					</IconButton>
				</>
			)
		},
	},
]

export const ColumnsRecloserCel = (changeAlarm, newTab, deleteRecloser) => [
	{
		header: <span className='text-xs'>Nº</span>,
		accessorKey: 'number',
		muiFilterTextFieldProps: { placeholder: 'Nº' },
		grow: false,
		muiTableHeadCellProps: {
			style: { width: 'auto', minWidth: '40px', maxWidth: '40px' },
		},
		muiTableBodyCellProps: {
			style: { minWidth: 'auto' },
		},

		Cell: ({ row }) => <div className='text-xs dark:!text-black'>{row.original.version}</div>,
	},
	{
		header: <span className='text-xs'>Nombre</span>,
		accessorKey: 'name',
		muiFilterTextFieldProps: { placeholder: 'name' },
		muiTableHeadCellProps: {
			style: { width: 'auto', minWidth: '70px', maxWidth: '70px' },
		},
		muiTableBodyCellProps: {
			style: { minWidth: 'auto' },
		},

		Cell: ({ row }) => (
			<div
				className='text-xs dark:!text-black'
				style={{ overflow: 'hidden', whiteSpace: 'normal', wordWrap: 'break-word' }}
			>
				{row.original.name}
			</div>
		),
	},
	{
		header: '',
		accessorKey: 'status_recloser',
		size: 10,
		enableColumnFilter: false,
		enableClickToCopy: false,
		Cell: ({ row }) => {
			const status = {
				0: {
					color: 'error',
				},
				1: {
					color: 'success',
				},
				2: {
					color: 'warning',
				},
				3: {
					color: 'action',
				},
			}
			return (
				<div className=' flex items-center justify-center md:justify-start w-full '>
					<Circle style={{ fontSize: '1rem' }} color={status[row.original?.status_recloser].color} />
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
			row.original.type_recloser = 1
			return (
				<>
					<IconButton
						size='small'
						onClick={() => newTab(row.original)}
						className='!m-0  !bg-[#bce1fc] hover:!bg-[#74bdf2] !text-black !shadow-md'
					>
						<BiWindowOpen />
					</IconButton>
				</>
			)
		},
	},
]
