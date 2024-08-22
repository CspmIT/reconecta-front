import { FormControlLabel, IconButton, Switch } from '@mui/material'
import { CheckCircleSharp, Circle, ErrorSharp } from '@mui/icons-material'
import { BiWindowOpen } from 'react-icons/bi'
import { storage } from '../../../../storage/storage'

const TypeRecloser = {
	1: 'Reconectador',
	2: 'Medidor',
	3: 'Sub-Estación',
	4: 'Analizador de red',
	5: 'Sub-Estación Rural',
}
export const ColumnsRecloser = (changeAlarm, newTab) => [
	{
		header: 'Nº',
		accessorKey: 'Nro_recloser',
		muiFilterTextFieldProps: { placeholder: 'Nº' },
		grow: false,
		size: 20,
	},
	{
		header: 'Nombre',
		accessorKey: 'Name',
		muiFilterTextFieldProps: { placeholder: 'Name' },
	},
	{
		header: 'Num. de Serie',
		accessorKey: 'Nro_Serie',
		muiFilterTextFieldProps: { placeholder: 'Num. de Serie' },
	},
	// {
	// 	header: 'Tipo',
	// 	accessorKey: 'type_recloser',
	// 	filterVariant: 'multi-select',
	// 	muiFilterTextFieldProps: { placeholder: 'Tipo' },
	// 	filterSelectOptions: [
	// 		{
	// 			label: 'Reconectador',
	// 			value: 1,
	// 		},
	// 		{
	// 			label: 'Medidor',
	// 			value: 2,
	// 		},
	// 		{
	// 			label: 'Sub-Estación',
	// 			value: 3,
	// 		},
	// 		{
	// 			label: 'Analizador de red',
	// 			value: 4,
	// 		},
	// 	],
	// 	filterFn: (row, id, filterValue) => {
	// 		const filter = storage.get('filter')
	// 		const filterType_recloser =
	// 			filter?.length > 0 ? filter.filter((item) => item.name === 'type_recloser')[0] : []
	// 		if (filterValue !== filterType_recloser) {
	// 			if (filter?.length > 0) {
	// 				filter.splice(filter.indexOf(filterType_recloser), 1)
	// 				storage.set('filter', [...filter, { name: 'type_recloser', value: filterValue }])
	// 			} else {
	// 				storage.set('filter', [{ name: 'type_recloser', value: filterValue }])
	// 			}
	// 		}
	// 		if (!filterValue || filterValue.length === 0) {
	// 			return true
	// 		}
	// 		return filterValue.includes(row.getValue(id))
	// 	},
	// 	Cell: ({ row }) => {
	// 		return TypeRecloser[row.original.type_recloser] || 'indefinido'
	// 	},
	// },
	{
		header: 'Marca',
		accessorKey: 'brand',
		muiFilterTextFieldProps: { placeholder: 'Marca' },
		Cell: ({ row }) => {
			return (
				<div className='flex items-center w-full'>
					<p className='m-0 p-0 ml-2 text-base'>{`${row.original.brand} - ${row.original.version}`}</p>
				</div>
			)
		},
	},
	{
		header: 'Estado',
		accessorKey: 'status',
		size: 50,
		enableColumnFilter: false,
		enableClickToCopy: false,
		Cell: ({ row }) => {
			return (
				<div className='flex items-center w-full'>
					<Circle color={row.original?.status > 0 ? 'success' : 'error'} />
					<p className='m-0 p-0 ml-2 text-base'>{`${row.original?.status > 0 ? 'Abierto' : 'Cerrado'}`}</p>
				</div>
			)
		},
	},
	{
		header: 'On-Line',
		accessorKey: 'online',
		size: 80,
		enableColumnFilter: false,
		enableClickToCopy: false,
		Cell: ({ row }) => {
			return (
				<div className='flex items-center w-full'>
					{row.original?.online > 0 ? (
						<CheckCircleSharp color='success' className='!text-3xl' />
					) : (
						<ErrorSharp color='warning' className='!text-3xl' />
					)}
				</div>
			)
		},
	},
	{
		header: 'Alarma',
		accessorKey: 'alarm_recloser',
		size: 185,
		enableColumnFilter: false,
		enableClickToCopy: false,
		Cell: ({ row }) => {
			return (
				<FormControlLabel
					control={
						<Switch
							checked={row.original?.alarm_recloser > 0 ? true : false}
							onChange={() => changeAlarm(row.original.Nro_Serie)}
							name={row.original.name}
						/>
					}
					label={row.original?.alarm_recloser ? 'Activada' : 'Desactivada'}
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
			return (
				<IconButton
					onClick={() => newTab(row.original)}
					className=' !bg-[#bce1fc] hover:!bg-[#74bdf2] !text-black !shadow-md'
				>
					<BiWindowOpen />
				</IconButton>
			)
		},
	},
]
