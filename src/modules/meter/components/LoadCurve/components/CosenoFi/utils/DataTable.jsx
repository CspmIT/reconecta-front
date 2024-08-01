export const dataTable = [
	{ datePeriod: '2024-07-30 08:13:38', Cos1: 1, Cos2: 1, Cos3: 1 },
	{ datePeriod: '2024-07-30 07:58:38', Cos1: 1, Cos2: 1, Cos3: 1 },
	{ datePeriod: '2024-07-30 07:43:38', Cos1: 1, Cos2: 1, Cos3: 1 },
	{ datePeriod: '2024-07-30 07:28:38', Cos1: 1, Cos2: 1, Cos3: 1 },
	{ datePeriod: '2024-07-30 07:13:38', Cos1: 1, Cos2: 1, Cos3: 0.99 },
	{ datePeriod: '2024-07-30 06:58:38', Cos1: 1, Cos2: 1, Cos3: 1 },
	{ datePeriod: '2024-07-30 06:43:38', Cos1: 1, Cos2: 1, Cos3: 1 },
	{ datePeriod: '2024-07-30 06:28:38', Cos1: 1, Cos2: 1, Cos3: 1 },
	{ datePeriod: '2024-07-30 06:13:38', Cos1: 1, Cos2: 1, Cos3: 1 },
	{ datePeriod: '2024-07-30 05:58:38', Cos1: 1, Cos2: 1, Cos3: 0.99 },
]

export const ColumnsTable = [
	{
		accessorFn: (originalRow) => new Date(originalRow.datePeriod),
		id: 'datePeriod',
		accessorKey: 'datePeriod',
		filterVariant: 'date-range',
		Cell: ({ cell }) => `${cell.getValue().toLocaleDateString()} ${cell.getValue().toLocaleTimeString()}`,
		header: 'Fecha el Período',
		size: 300,
	},
	{
		header: 'Cos ϕ L1',
		accessorKey: 'Cos1',
		size: 200,
		enableColumnFilter: false,
		enableSorting: false,
	},
	{
		header: 'Cos ϕ L2',
		accessorKey: 'Cos2',
		size: 200,
		enableColumnFilter: false,
		enableSorting: false,
	},
	{
		header: 'Cos ϕ L3',
		accessorKey: 'Cos3',
		size: 200,
		enableColumnFilter: false,
		enableSorting: false,
	},
]
