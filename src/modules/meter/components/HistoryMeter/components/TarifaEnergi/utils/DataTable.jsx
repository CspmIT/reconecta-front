export const dataTableEnergi = (data) => [
	{
		description: 'Acumulado Activa Importada - Resto',
		cod: '1.1.1.8.1.255',
		value: `${data.Tarifas_value.RTE_0.value} kWh`,
		datePeriod: `${data.Tarifas_value.RTE_0.date}`,
	},
	{
		description: 'Acumulado Activa Importada - Pico',
		cod: '1.1.1.8.2.255',
		value: `${data.Tarifas_value.RTE_1.value} kWh`,
		datePeriod: `${data.Tarifas_value.RTE_1.date}`,
	},
	{
		description: 'Acumulado Activa Importada - Valle',
		cod: '1.1.1.8.3.255',
		value: `${data.Tarifas_value.RTE_2.value} kWh`,
		datePeriod: `${data.Tarifas_value.RTE_2.date}`,
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
export const dataTableDifEnergi = (data) => [
	{
		description: 'Acumulado Intermensual Activa Importada - Resto',
		value: `${data.Dif_tarifas_value.RTE_0} kWh`,
		period: `${data.mes_dif_mensual}`,
	},
	{
		description: 'Acumulado Intermensual Activa Importada - Pico',
		value: `${data.Dif_tarifas_value.RTE_1} kWh`,
		period: `${data.mes_dif_mensual}`,
	},
	{
		description: 'Acumulado Intermensual Activa Importada - Valle',
		value: `${data.Dif_tarifas_value.RTE_2} kWh`,
		period: `${data.mes_dif_mensual}`,
	},
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
