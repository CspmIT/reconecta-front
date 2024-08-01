import { Box } from '@mui/material'

export const dataTableEnergiImpExp = [
	{
		description: 'Fase 1 Activa',
		codImport: '1.1.21.8.0.255',
		valueImport: '688332 kWh',
		codExport: '1.1.22.8.0.255',
		valueExport: '0 kWh',
	},
	{
		description: 'Fase 2 Activa',
		codImport: '1.1.41.8.0.255',
		valueImport: '598195 kWh',
		codExport: '1.1.42.8.0.255',
		valueExport: '0 kWh',
	},
	{
		description: 'Fase 3 Activa',
		codImport: '1.1.61.8.0.255',
		valueImport: '704591 kWh',
		codExport: '1.1.62.8.0.255',
		valueExport: '0 kWh',
	},
	{
		description: 'Acumulado Activa',
		codImport: '1.1.1.8.0.255',
		valueImport: '1991118 kWh',
		codExport: '1.1.2.8.0.255',
		valueExport: '0 kWh',
	},
	{
		description: 'Fase 1 Aparente',
		codImport: '1.1.29.8.0.255',
		valueImport: '696277 kVAh',
		codExport: '1.1.30.8.0.255',
		valueExport: '0 kVAh',
	},
	{
		description: 'Fase 2 Aparente',
		codImport: '1.1.49.8.0.255',
		valueImport: '608405 kVAh',
		codExport: '1.1.50.8.0.255',
		valueExport: '0 kVAh',
	},
	{
		description: 'Fase 3 Aparente',
		codImport: '1.1.69.8.0.255',
		valueImport: '713797 kVAh',
		codExport: '1.1.70.8.0.255',
		valueExport: '0 kVAh',
	},
	{
		description: 'Acumulado Aparente',
		codImport: '1.1.9.8.0.255',
		valueImport: '2018481 kVAh',
		codExport: '1.1.10.8.0.255',
		valueExport: '0 kVAh',
	},
	{
		description: 'Fase 1 Reactiva',
		codImport: '1.1.23.8.0.255',
		valueImport: '33847 kVArh',
		codExport: '1.1.24.8.0.255',
		valueExport: '27061 kVArh',
	},
	{
		description: 'Fase 2 Reactiva',
		codImport: '1.1.43.8.0.255',
		valueImport: '15135 kVArh',
		codExport: '1.1.44.8.0.255',
		valueExport: '57716 kVArh',
	},
	{
		description: 'Fase 3 Reactiva',
		codImport: '1.1.63.8.0.255',
		valueImport: '67199 kVArh',
		codExport: '1.1.64.8.0.255',
		valueExport: '4739 kVArh',
	},
	{
		description: 'Acumulado Reactiva',
		codImport: '1.1.3.8.0.255',
		valueImport: '116181 kVArh',
		codExport: '1.1.4.8.0.255',
		valueExport: '89517 kVArh',
	},
]

export const ColumnsTableEnergiImpExp = [
	{
		header: 'Descripción',
		enableColumnFilter: false,
		accessorKey: 'description',

		muiTableHeadCellProps: {
			align: 'center',
		},
		muiTableBodyCellProps: {
			align: 'center',
		},
	},
	{
		columns: [
			{
				accessorKey: 'codImport',
				header: 'Código',
				enableColumnFilter: false,
				enableSorting: false,
				muiTableHeadCellProps: {
					align: 'center',
				},
				muiTableBodyCellProps: {
					align: 'center',
				},
			},
			{
				accessorKey: 'valueImport',
				header: 'Valor',
				enableColumnFilter: false,
				enableSorting: false,
				muiTableHeadCellProps: {
					align: 'center',
				},
				muiTableBodyCellProps: {
					align: 'center',
				},
			},
		],
		header: 'Importada',
		id: 'import',
		muiTableHeadCellProps: {
			align: 'center',
		},
	},
	{
		columns: [
			{
				accessorKey: 'codExport',
				header: 'Código',
				enableColumnFilter: false,
				enableSorting: false,
				muiTableHeadCellProps: {
					align: 'center',
				},
				muiTableBodyCellProps: {
					align: 'center',
				},
			},
			{
				accessorKey: 'valueExport',
				header: 'Valor',
				enableColumnFilter: false,
				enableSorting: false,
				muiTableHeadCellProps: {
					align: 'center',
				},
				muiTableBodyCellProps: {
					align: 'center',
				},
			},
		],
		header: 'Exportada',
		id: 'export',
		muiTableHeadCellProps: {
			align: 'center',
		},
	},
]
