import { FormControlLabel, IconButton, Switch } from '@mui/material'
import { CheckCircleSharp, Circle, ErrorSharp } from '@mui/icons-material'
import { BiTrash, BiWindowOpen } from 'react-icons/bi'

export const ColumnsRecloser = (changeAlarm, newTab, deleteRecloser) => [
	{
		header: 'Nº',
		accessorKey: 'number',
		muiFilterTextFieldProps: { placeholder: 'Nº' },
		grow: false,
		size: 20,
	},
	{
		header: 'Nombre',
		accessorKey: 'name',
		muiFilterTextFieldProps: { placeholder: 'name' },
	},
	{
		header: 'Num. de Serie',
		accessorKey: 'serial',
		muiFilterTextFieldProps: { placeholder: 'Num. de Serie' },
	},
	{
		header: 'Marca',
		accessorKey: 'version',
		muiFilterTextFieldProps: { placeholder: 'Marca' },
	},
	{
		header: 'Estado',
		accessorKey: 'status_recloser',
		size: 50,
		enableColumnFilter: false,
		enableClickToCopy: false,
		Cell: ({ row }) => {
			return (
				<div className='flex items-center w-full'>
					<Circle color={row.original?.status_recloser > 0 ? 'success' : 'error'} />
					<p className='m-0 p-0 ml-2 text-base'>{`${
						row.original?.status_recloser > 0 ? 'Abierto' : 'Cerrado'
					}`}</p>
				</div>
			)
		},
	},
	// {
	// 	header: 'On-Line',
	// 	accessorKey: 'online',
	// 	size: 80,
	// 	enableColumnFilter: false,
	// 	enableClickToCopy: false,
	// 	Cell: ({ row }) => {
	// 		return (
	// 			<div className='flex items-center w-full'>
	// 				{row.original?.online > 0 ? (
	// 					<CheckCircleSharp color='success' className='!text-3xl' />
	// 				) : (
	// 					<ErrorSharp color='warning' className='!text-3xl' />
	// 				)}
	// 			</div>
	// 		)
	// 	},
	// },
	// {
	// 	header: 'Alarma',
	// 	accessorKey: 'status_alarm_recloser',
	// 	size: 185,
	// 	enableColumnFilter: false,
	// 	enableClickToCopy: false,
	// 	Cell: ({ row }) => {
	// 		return (
	// 			<FormControlLabel
	// 				control={
	// 					<Switch
	// 						checked={row.original?.status_alarm_recloser > 0 ? true : false}
	// 						onChange={() => changeAlarm(row.original.serial)}
	// 						name={row.original.name}
	// 					/>
	// 				}
	// 				label={row.original?.status_alarm_recloser ? 'Activada' : 'Desactivada'}
	// 			/>
	// 		)
	// 	},
	// },
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
						className=' !bg-[#bce1fc] hover:!bg-[#74bdf2] !text-black !shadow-md'
					>
						<BiWindowOpen />
					</IconButton>
					<IconButton
						onClick={() => deleteRecloser(row.original)}
						className='!ml-3 !bg-[#fd7979] hover:!bg-[#ff5656] !text-black !shadow-md'
					>
						<BiTrash />
					</IconButton>
				</>
			)
		},
	},
]
