export const dataTableEnergi = [
	{
		description: 'Acumulado Activa Importada - Resto',
		cod: '1.1.1.8.1.255',
		value: '33908630.00 kWh',
		datePeriod: '0',
	},
	{
		description: 'Acumulado Activa Importada - Pico',
		cod: '1.1.1.8.2.255',
		value: '530755110.00 kWh',
		datePeriod: '0',
	},
	{
		description: 'Acumulado Activa Importada - Valle',
		cod: '1.1.1.8.3.255',
		value: '426454862.00 kWh',
		datePeriod: '0',
	},
]

export const ColumnsTableEnergi = [
	{
		header: 'Descripción',
		accessorKey: 'description',
		enableColumnFilter: false,
		enableSorting: false,
		size: 400,
	},
	{
		header: 'Código',
		accessorKey: 'cod',
		enableColumnFilter: false,
		enableSorting: false,
	},
	{
		header: 'Valor',
		accessorKey: 'value',
		enableColumnFilter: false,
		enableSorting: false,
	},
	{
		accessorFn: (originalRow) => new Date(originalRow.datePeriod),
		id: 'datePeriod',
		accessorKey: 'datePeriod',
		filterVariant: 'date-range',
		Cell: ({ cell }) =>
			`${cell.getValue()?.toLocaleDateString() ? cell.getValue()?.toLocaleDateString() : '-'} ${
				cell.getValue()?.toLocaleTimeString() ? cell.getValue()?.toLocaleTimeString() : ''
			}`,
		header: 'Fecha',
		size: 200,
	},
]
export const dataTableDifEnergi = [
	{ description: 'Acumulado Intermensual Activa Importada - Resto', value: '-963472558.00 kWh', period: 'Junio' },
	{ description: 'Acumulado Intermensual Activa Importada - Pico', value: '20888182.00 kWh', period: 'Junio' },
	{ description: 'Acumulado Intermensual Activa Importada - Valle', value: '13424132.00 kWh', period: 'Junio' },
]

export const ColumnsTableDifEnergi = [
	{
		header: 'Descripción',
		accessorKey: 'description',
		enableColumnFilter: false,
		enableSorting: false,
		size: 400,
	},
	{
		header: 'Valor',
		accessorKey: 'value',
		enableColumnFilter: false,
		enableSorting: false,
	},
	{
		header: 'Periodo',
		accessorKey: 'period',
		enableColumnFilter: false,
		enableSorting: false,
	},
]
