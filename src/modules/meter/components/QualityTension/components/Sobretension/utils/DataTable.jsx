export const dataTable = [
	{ fase: '2', duration: '0.12 Seg', Amplitud: '11424 V', datePeriod: '2024-07-17 12:00:10' },
	{ fase: '1', duration: '0.08 Seg', Amplitud: 'S/M', datePeriod: '2024-07-17 12:00:10' },
	{ fase: '-', duration: '0.12 Seg', Amplitud: '11412 V', datePeriod: '2024-07-17 11:59:38' },
	{ fase: '1', duration: '0.08 Seg', Amplitud: 'S/M', datePeriod: '2024-07-17 11:59:38' },
	{ fase: '3', duration: '0.12 Seg', Amplitud: '13416 V', datePeriod: '2024-07-16 14:02:36' },
	{ fase: '2', duration: '0.12 Seg', Amplitud: '12888 V', datePeriod: '2024-07-16 14:02:36' },
	{ fase: '3', duration: '0.12 Seg', Amplitud: '13476 V', datePeriod: '2024-07-16 13:53:42' },
	{ fase: '2', duration: '0.08 Seg', Amplitud: 'S/M', datePeriod: '2024-07-16 13:53:42' },
	{ fase: '3', duration: '0.08 Seg', Amplitud: 'S/M', datePeriod: '2024-07-16 13:35:24' },
	{ fase: '2', duration: '0.08 Seg', Amplitud: 'S/M', datePeriod: '2024-07-16 13:35:24' },
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
	{ name: 'Fecha', Fase1: '22/07/2020 17:27:09', Fase2: '11/01/2021 02:13:55', Fase3: '22/07/2020 17:27:09' },
	{
		name: 'Duración Máxima',
		Fase1: '5 Hora(s), 11 Min, 2.45 Seg',
		Fase2: '8 Min, 2.54 Seg',
		Fase3: '8 Min, 2.54 Seg',
	},
	{ name: 'Fecha', Fase1: '29/10/2019 12:11:21', Fase2: '24/08/2017 17:13:16', Fase3: '24/08/2017 17:13:16' },
	{
		name: 'Duración Total',
		Fase1: '16 Hora(s), 26 Min, 2.62 Seg',
		Fase2: '13 Min, 42.55 Seg',
		Fase3: '13 Min, 23.49 Seg',
	},
	{ name: 'Eventos', Fase1: '1516', Fase2: '1057', Fase3: '1176' },
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
