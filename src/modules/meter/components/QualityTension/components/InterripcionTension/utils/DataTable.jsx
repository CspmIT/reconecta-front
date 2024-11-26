export const ColumnsTable = [
	{
		header: 'Duración',
		accessorKey: 'duration',
		enableColumnFilter: false,
		enableSorting: false,
		size: 400,
		muiTableHeadCellProps: {
			style: { width: 'auto', minWidth: '70px' },
		},
		muiTableBodyCellProps: {
			style: { minWidth: 'auto' },
		},
	},
	{
		accessorFn: (originalRow) => new Date(originalRow.datePeriod),
		id: 'datePeriod',
		accessorKey: 'datePeriod',
		filterVariant: 'date-range',
		Cell: ({ cell }) => `${cell.getValue().toLocaleDateString()} ${cell.getValue().toLocaleTimeString()}`,
		header: 'Fecha el Período',
		size: 200,
		muiTableHeadCellProps: {
			style: { width: 'auto', minWidth: '70px' },
		},
		muiTableBodyCellProps: {
			style: { minWidth: 'auto' },
		},
	},
]

export const ColumnsTableModal = [
	{
		header: 'Nombre',
		accessorKey: 'name',
		enableColumnFilter: false,
		enableSorting: false,
	},
	{
		header: 'Global',
		accessorKey: 'global',
		enableColumnFilter: false,
		enableSorting: false,
	},
]
