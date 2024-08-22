export const dataTable = [
	{ duration: '5 Min, 9 Seg', datePeriod: '2024-07-21 12:27:57' },
	{ duration: '4 Min, 23 Seg', datePeriod: '2024-07-16 15:32:55' },
	{ duration: '3 Min, 59 Seg', datePeriod: '2024-07-09 20:57:33' },
	{ duration: '26 Min, 15 Seg', datePeriod: '2024-06-08 18:34:58' },
	{ duration: '33 Min, 28 Seg', datePeriod: '2024-03-20 19:47:54' },
	{ duration: '47 Min, 14 Seg', datePeriod: '2023-12-28 19:26:33' },
	{ duration: '1 Hora(s), 40 Min, 46 Seg', datePeriod: '2023-12-17 05:07:55' },
	{ duration: '4 Hora(s), 27 Min, 0 Seg', datePeriod: '2023-10-08 06:59:41' },
	{ duration: '49 Min, 54 Seg', datePeriod: '2023-10-05 20:14:43' },
	{ duration: '0 Seg.', datePeriod: '2023-10-01 18:56:31 ' },
]

export const ColumnsTable = [
	{
		header: 'Duración',
		accessorKey: 'duration',
		enableColumnFilter: false,
		enableSorting: false,
		size: 400,
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
	{ name: 'Duración Mínima', global: '0 Seg.' },
	{ name: 'Fecha', global: '01/01/1992 00:00:00' },
	{ name: 'Duración', global: 'Máxima	76 Día(s), 23 Hora(s), 40 Min, 44 Seg' },
	{ name: 'Fecha', global: '02/03/2006 10:32:25' },
	{ name: 'Duración Total', global: '127 Día(s), 3 Hora(s), 6 Min, 49 Seg' },
	{ name: 'Eventros Breves', global: '292' },
	{ name: 'Eventros Prolongados', global: '571' },
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
