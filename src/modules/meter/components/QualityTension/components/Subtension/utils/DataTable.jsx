export const dataTable = [
	{ fase: '2', duration: '0.08 Seg', Amplitud: 'S/M', datePeriod: '2024-07-11 07:53:07' },
	{ fase: '1', duration: '0.08 Seg', Amplitud: 'S/M', datePeriod: '2024-07-11 07:53:07' },
	{ fase: '2', duration: '0.24 Seg', Amplitud: '194 V', datePeriod: '2024-07-09 23:36:43' },
	{ fase: '1', duration: '0.68 Seg', Amplitud: '194 V', datePeriod: '2024-07-09 22:18:57' },
	{ fase: '3', duration: '0.08 Seg', Amplitud: 'S/M', datePeriod: '2024-07-05 10:48:29' },
	{ fase: '2', duration: '0.08 Seg', Amplitud: 'S/M', datePeriod: '2024-07-05 10:48:29' },
	{ fase: '2', duration: '0.16 Seg', Amplitud: '182 V', datePeriod: '2024-06-02 15:09:29' },
	{ fase: '3', duration: '0.04 Seg', Amplitud: 'S/M', datePeriod: '2024-04-28 00:49:01' },
	{ fase: '1', duration: '0.04 Seg', Amplitud: 'S/M', datePeriod: '2024-04-28 00:49:01' },
	{ fase: '2', duration: '0.08 Seg', Amplitud: 'S/M', datePeriod: '2024-04-24 20:50:14' },
]

export const ColumnsTable = [
	{
		header: 'Fase',
		accessorKey: 'fase',
		enableColumnFilter: false,
		enableSorting: false,
		muiTableHeadCellProps: {
			style: { width: 'auto', minWidth: '70px'},
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
			style: { width: 'auto', minWidth: '70px'},
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
			style: { width: 'auto', minWidth: '70px'},
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
			style: { width: 'auto', minWidth: '70px'},
		},
		muiTableBodyCellProps: {
			style: { minWidth: 'auto' },
		},
	},
]
export const dataTableModal = [
	{ name: 'Duración Mínima', Fase1: '0.03 Seg', Fase2: '0.03 Seg', Fase3: '0.03 Seg' },
	{ name: 'Fecha', Fase1: '24/01/2007 04:46:03', Fase2: '14/04/2010 00:18:45', Fase3: '14/04/2010 00:18:45' },
	{
		name: 'Duración Máxima',
		Fase1: '22 Min, 38.24 Seg',
		Fase2: '22 Min, 43.17 Seg',
		Fase3: '22 Min, 38.24 Seg',
	},
	{ name: 'Fecha', Fase1: '09/12/2022 19:53:05', Fase2: '09/12/2022 19:53:10', Fase3: '09/12/2022 19:53:05' },
	{
		name: 'Duración Total',
		Fase1: '52 Min, 6.41 Seg',
		Fase2: '56 Min, 22.81 Seg',
		Fase3: '54 Min, 33.81 Seg',
	},
	{ name: 'Eventos', Fase1: '1150', Fase2: '1053', Fase3: '1192' },
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
