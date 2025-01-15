export const ColumnsTable = [
	{
		header: 'Fase',
		accessorKey: 'fase',
		enableColumnFilter: false,
		enableSorting: false,
		muiTableHeadCellProps: {
			style: { width: 'auto', minWidth: '70px' },
		},
		muiTableBodyCellProps: {
			style: { minWidth: 'auto' },
		},
	},
	{
		header: 'Duración',
		accessorKey: 'duration',
		enableColumnFilter: false,
		enableSorting: false,
		muiTableHeadCellProps: {
			style: { width: 'auto', minWidth: '70px' },
		},
		muiTableBodyCellProps: {
			style: { minWidth: 'auto' },
		},
	},
	{
		header: 'Amplitud',
		accessorKey: 'Amplitud',
		enableColumnFilter: false,
		enableSorting: false,
		muiTableHeadCellProps: {
			style: { width: 'auto', minWidth: '70px' },
		},
		muiTableBodyCellProps: {
			style: { minWidth: 'auto' },
		},
	},
	{
		// accessorFn: (originalRow) => new Date(originalRow.datePeriod),
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
		header: 'Fase 1',
		accessorKey: 'Fase1',
		enableColumnFilter: false,
		enableSorting: false,
	},
	{
		header: 'Fase 2',
		accessorKey: 'Fase2',
		enableColumnFilter: false,
		enableSorting: false,
	},
	{
		header: 'Fase 3',
		accessorKey: 'Fase3',
		enableColumnFilter: false,
		enableSorting: false,
	},
]
