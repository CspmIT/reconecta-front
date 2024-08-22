export const dataTable = [
	{ fase: '3', duration: '5 Min, 10.05 Seg', Amplitud: '0 V', datePeriod: '2024-07-21 12:33:06' },
	{ fase: '2', duration: '5 Min, 10.05 Seg', Amplitud: '0 V', datePeriod: '2024-07-21 12:33:06' },
	{ fase: '1', duration: '5 Min, 10.05 Seg', Amplitud: '0 V', datePeriod: '2024-07-21 12:33:06' },
	{ fase: '3', duration: '4 Min, 24.05 Seg', Amplitud: '0 V', datePeriod: '2024-07-16 15:37:18' },
	{ fase: '2', duration: '4 Min, 24.05 Seg', Amplitud: '0 V', datePeriod: '2024-07-16 15:37:18' },
	{ fase: '1', duration: '4 Min, 24.05 Seg', Amplitud: '0 V', datePeriod: '2024-07-16 15:37:18' },
	{ fase: '3', duration: '9 Min, 34.46 Seg', Amplitud: '0 V', datePeriod: '2024-07-09 21:07:04' },
	{ fase: '2', duration: '9 Min, 34.13 Seg', Amplitud: '0 V', datePeriod: '2024-07-09 21:07:04' },
	{ fase: '1', duration: '2 Min, 39.02 Seg', Amplitud: '0 V', datePeriod: '2024-07-09 21:07:04' },
	{ fase: '1', duration: '6 Min, 55.33 Seg', Amplitud: '0 V', datePeriod: '2024-07-09 21:04:26' },
]

export const ColumnsTable = [
	{
		header: 'Fase',
		accessorKey: 'fase',
		enableColumnFilter: false,
		enableSorting: false,
	},
	{
		header: 'Duración',
		accessorKey: 'duration',
		enableColumnFilter: false,
		enableSorting: false,
	},
	{
		header: 'Amplitud',
		accessorKey: 'Amplitud',
		enableColumnFilter: false,
		enableSorting: false,
	},
	{
		accessorFn: (originalRow) => new Date(originalRow.datePeriod),
		id: 'datePeriod',
		accessorKey: 'datePeriod',
		filterVariant: 'date-range',
		Cell: ({ cell }) => `${cell.getValue().toLocaleDateString()} ${cell.getValue().toLocaleTimeString()}`,
		header: 'Fecha el Período',
		size: 200,
	},
]
export const dataTableModal = [
	{ name: 'Duración Mínima', Fase1: '0.03 Seg', Fase2: '0.03 Seg', Fase3: '0.03 Seg' },
	{ name: 'Fecha', Fase1: '12/02/2024 08:41:09', Fase2: '21/07/2009 08:29:33', Fase3: '02/02/2013 04:51:18' },
	{
		name: 'Duración Máxima',
		Fase1: '76 Día(s), 23 Hora(s), 48 Min, 31 Seg',
		Fase2: '76 Día(s), 23 Hora(s), 49 Min, 21 Seg',
		Fase3: '76 Día(s), 23 Hora(s), 40 Min, 55.5 Seg',
	},
	{ name: 'Fecha', Fase1: '18/05/2006 10:13:09', Fase2: '18/05/2006 10:13:18', Fase3: '18/05/2006 10:13:19' },
	{
		name: 'Duración Total',
		Fase1: '127 Día(s), 10 Hora(s), 31 Min, 50 Seg',
		Fase2: '143 Día(s), 15 Hora(s), 10 Min, 34 Seg',
		Fase3: '143 Día(s), 15 Hora(s), 43 Min, 48 Seg',
	},
	{ name: 'Eventos', Fase1: '1102', Fase2: '1148', Fase3: '1099' },
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
