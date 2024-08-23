import { Button } from '@mui/material'

export const ColumnTableInt = [
	{
		Header: (
			<Button
				variant='contained'
				size='large'
				className='!absolute w-3/4 !bg-yellow-500 !-top-8 !bottom-0 !left-0 !right-0 !m-auto'
			>
				Reiniciar contadores
			</Button>
		),
		size: 280,
		enableSorting: false,
		accessorKey: 'resetButton',
		muiTableHeadCellProps: {
			align: 'center',
			sx: {
				border: 'none',
				background: 'rgb(190 190 190)',
			},
		},
	},
	{
		header: 'ABC',
		colSpan: 2,
		columns: [
			{
				header: 'Largas',
				accessorKey: 'abcLargas',
				muiTableHeadCellProps: {
					align: 'center',
				},
			},
			{
				header: 'Cortas',
				accessorKey: 'abcCortas',
				muiTableHeadCellProps: {
					align: 'center',
				},
			},
		],
	},
	{
		header: 'SRT',
		colSpan: 2,
		columns: [
			{
				header: 'Largas',
				accessorKey: 'srtLargas',
				muiTableHeadCellProps: {
					align: 'center',
				},
			},
			{
				header: 'Cortas',
				accessorKey: 'srtCortas',
				muiTableHeadCellProps: {
					align: 'center',
				},
			},
		],
	},
]
