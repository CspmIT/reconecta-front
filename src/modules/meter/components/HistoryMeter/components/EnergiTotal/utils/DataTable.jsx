// Los valores llegan en kilo-unidad (kWh/kVAh/kVArh). El selector de submúltiplo
// solo cambia el prefijo dividiendo por 1000 (k -> M -> G); "auto" elige el legible.
const scaleEnergy = (value, base, unitMode) => {
	const num = parseFloat(value)
	if (isNaN(num)) return `${value ?? 'sin datos'}`
	let steps
	if (unitMode === 'auto') {
		steps = 0
		let tmp = Math.abs(num)
		while (tmp >= 1000 && steps < 2) {
			tmp /= 1000
			steps++
		}
	} else {
		steps = { k: 0, M: 1, G: 2 }[unitMode] ?? 0
	}
	const scaled = num / Math.pow(1000, steps)
	return `${scaled.toLocaleString('es-AR', { maximumFractionDigits: 3 })} ${['k', 'M', 'G'][steps]}${base}`
}

export const dataTableEnergiImpExp = (data, unitMode = 'k') => {
	const f = (item, base) => scaleEnergy(item?.value, base, unitMode)
	return [
		{
			description: 'Fase 1 Activa',
			codImport: '1.1.21.8.0.255',
			valueImport: f(data.IET_0, 'Wh'),
			codExport: '1.1.22.8.0.255',
			valueExport: f(data.IET_4, 'Wh'),
		},
		{
			description: 'Fase 2 Activa',
			codImport: '1.1.41.8.0.255',
			valueImport: f(data.IET_1, 'Wh'),
			codExport: '1.1.42.8.0.255',
			valueExport: f(data.IET_5, 'Wh'),
		},
		{
			description: 'Fase 3 Activa',
			codImport: '1.1.61.8.0.255',
			valueImport: f(data.IET_2, 'Wh'),
			codExport: '1.1.62.8.0.255',
			valueExport: f(data.IET_6, 'Wh'),
		},
		{
			description: 'Acumulado Activa',
			codImport: '1.1.1.8.0.255',
			valueImport: f(data.IET_3, 'Wh'),
			codExport: '1.1.2.8.0.255',
			valueExport: f(data.IET_7, 'Wh'),
		},
		{
			description: 'Fase 1 Aparente',
			codImport: '1.1.29.8.0.255',
			valueImport: f(data.IET_3_4, 'VAh'),
			codExport: '1.1.30.8.0.255',
			valueExport: f(data.IET_3_8, 'VAh'),
		},
		{
			description: 'Fase 2 Aparente',
			codImport: '1.1.49.8.0.255',
			valueImport: f(data.IET_3_5, 'VAh'),
			codExport: '1.1.50.8.0.255',
			valueExport: f(data.IET_3_9, 'VAh'),
		},
		{
			description: 'Fase 3 Aparente',
			codImport: '1.1.69.8.0.255',
			valueImport: f(data.IET_3_6, 'VAh'),
			codExport: '1.1.70.8.0.255',
			valueExport: f(data.IET_3_10, 'VAh'),
		},
		{
			description: 'Acumulado Aparente',
			codImport: '1.1.9.8.0.255',
			valueImport: f(data.IET_3_7, 'VAh'),
			codExport: '1.1.10.8.0.255',
			valueExport: f(data.IET_3_11, 'VAh'),
		},
		{
			description: 'Fase 1 Reactiva',
			codImport: '1.1.23.8.0.255',
			valueImport: f(data.IET_8, 'VArh'),
			codExport: '1.1.24.8.0.255',
			valueExport: f(data.IET_2_0, 'VArh'),
		},
		{
			description: 'Fase 2 Reactiva',
			codImport: '1.1.43.8.0.255',
			valueImport: f(data.IET_9, 'VArh'),
			codExport: '1.1.44.8.0.255',
			valueExport: f(data.IET_2_1, 'VArh'),
		},
		{
			description: 'Fase 3 Reactiva',
			codImport: '1.1.63.8.0.255',
			valueImport: f(data.IET_10, 'VArh'),
			codExport: '1.1.64.8.0.255',
			valueExport: f(data.IET_2_2, 'VArh'),
		},
		{
			description: 'Acumulado Reactiva',
			codImport: '1.1.3.8.0.255',
			valueImport: f(data.IET_11, 'VArh'),
			codExport: '1.1.4.8.0.255',
			valueExport: f(data.IET_2_3, 'VArh'),
		},
	]
}

export const ColumnsTableEnergiImpExp = [
	{
		header: 'Descripción',
		enableColumnFilter: false,
		accessorKey: 'description',

		muiTableHeadCellProps: {
			align: 'center',
			sx: {
				background: 'rgb(190 190 190)',
				fontSize: '18px',
				fontWeight: 'bold',
				border: 'none',
				borderRight: '1px solid rgba(0, 0, 0, 0.12)',
			},
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
					sx: {
						background: 'rgb(190 190 190)',
						fontSize: '18px',
						fontWeight: 'bold',
						border: '1px solid rgba(0, 0, 0, 0.12)',
					},
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
					sx: {
						background: 'rgb(190 190 190)',
						fontSize: '18px',
						fontWeight: 'bold',
						border: '1px solid rgba(0, 0, 0, 0.12)',
					},
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
			sx: {
				background: 'rgb(190 190 190)',
				fontSize: '18px',
				fontWeight: 'bold',
				border: 'none',
				borderRight: '1px solid rgba(0, 0, 0, 0.12)',
				borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
			},
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
					sx: {
						background: 'rgb(190 190 190)',
						fontSize: '18px',
						fontWeight: 'bold',
						border: '1px solid rgba(0, 0, 0, 0.12)',
					},
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
					sx: {
						background: 'rgb(190 190 190)',
						fontSize: '18px',
						fontWeight: 'bold',
						border: '1px solid rgba(0, 0, 0, 0.12)',
					},
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
			sx: {
				background: 'rgb(190 190 190)',
				fontSize: '18px',
				fontWeight: 'bold',
				borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
			},
		},
	},
]

export const dataTableReactivaxCuadrante = (data) => [
	{
		description: 'Fase 1',
		codQ1: '1.1.25.8.0.255',
		valueQ1: `${data.IET_2_4.value} VArh`,
		codQ2: '1.1.26.8.0.255',
		valueQ2: `${data.IET_2_8.value} VArh`,
		codQ3: '1.1.27.8.0.255',
		valueQ3: `${data.IET_2_12.value} VArh`,
		codQ4: '1.1.28.8.0.255',
		valueQ4: `${data.IET_3_0.value} VArh`,
	},
	{
		description: 'Fase 2',
		codQ1: '1.1.45.8.0.255',
		valueQ1: `${data.IET_2_5.value} VArh`,
		codQ2: '1.1.46.8.0.255',
		valueQ2: `${data.IET_2_9.value} VArh`,
		codQ3: '1.1.47.8.0.255',
		valueQ3: `${data.IET_2_13.value} VArh`,
		codQ4: '1.1.48.8.0.255',
		valueQ4: `${data.IET_3_1.value} VArh`,
	},
	{
		description: 'Fase 3',
		codQ1: '1.1.65.8.0.255',
		valueQ1: `${data.IET_2_6.value} VArh`,
		codQ2: '1.1.66.8.0.255',
		valueQ2: `${data.IET_2_10.value} VArh`,
		codQ3: '1.1.67.8.0.255',
		valueQ3: `${data.IET_2_14.value} VArh`,
		codQ4: '1.1.68.8.0.255',
		valueQ4: `${data.IET_3_2.value} VArh`,
	},
	{
		description: 'Acumulado',
		codQ1: '1.1.5.8.0.255',
		valueQ1: `${data.IET_2_7.value} VArh`,
		codQ2: '1.1.6.8.0.255',
		valueQ2: `${data.IET_2_11.value} VArh`,
		codQ3: '1.1.7.8.0.255',
		valueQ3: `${data.IET_2_15.value} VArh`,
		codQ4: '1.1.8.8.0.255',
		valueQ4: `${data.IET_3_3.value} VArh`,
	},
]

export const ColumnsTableReactivaxCuadrante = [
	{
		header: 'Descripción',
		enableColumnFilter: false,
		accessorKey: 'description',

		muiTableHeadCellProps: {
			align: 'center',
			sx: {
				background: 'rgb(190 190 190)',
				fontSize: '18px',
				fontWeight: 'bold',
				border: 'none',
				borderRight: '1px solid rgba(0, 0, 0, 0.12)',
			},
		},
		muiTableBodyCellProps: {
			align: 'center',
		},
	},
	{
		columns: [
			{
				accessorKey: 'codQ1',
				header: 'Código',
				enableColumnFilter: false,
				enableSorting: false,
				muiTableHeadCellProps: {
					align: 'center',
					sx: {
						background: 'rgb(190 190 190)',
						fontSize: '18px',
						fontWeight: 'bold',
						border: '1px solid rgba(0, 0, 0, 0.12)',
					},
				},
				muiTableBodyCellProps: {
					align: 'center',
				},
			},
			{
				accessorKey: 'valueQ1',
				header: 'Valor',
				enableColumnFilter: false,
				enableSorting: false,
				muiTableHeadCellProps: {
					align: 'center',
					sx: {
						background: 'rgb(190 190 190)',
						fontSize: '18px',
						fontWeight: 'bold',
						border: '1px solid rgba(0, 0, 0, 0.12)',
					},
				},
				muiTableBodyCellProps: {
					align: 'center',
				},
			},
		],
		header: 'Q1',
		id: 'importQ1',
		muiTableHeadCellProps: {
			align: 'center',
			sx: {
				background: 'rgb(190 190 190)',
				fontSize: '18px',
				fontWeight: 'bold',
				border: 'none',
				borderRight: '1px solid rgba(0, 0, 0, 0.12)',
				borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
			},
		},
	},

	{
		columns: [
			{
				accessorKey: 'codQ2',
				header: 'Código',
				enableColumnFilter: false,
				enableSorting: false,
				muiTableHeadCellProps: {
					align: 'center',
					sx: {
						background: 'rgb(190 190 190)',
						fontSize: '18px',
						fontWeight: 'bold',
						border: '1px solid rgba(0, 0, 0, 0.12)',
					},
				},
				muiTableBodyCellProps: {
					align: 'center',
				},
			},
			{
				accessorKey: 'valueQ2',
				header: 'Valor',
				enableColumnFilter: false,
				enableSorting: false,
				muiTableHeadCellProps: {
					align: 'center',
					sx: {
						background: 'rgb(190 190 190)',
						fontSize: '18px',
						fontWeight: 'bold',
						border: '1px solid rgba(0, 0, 0, 0.12)',
					},
				},
				muiTableBodyCellProps: {
					align: 'center',
				},
			},
		],
		header: 'Q2',
		id: 'importQ2',
		muiTableHeadCellProps: {
			align: 'center',
			sx: {
				background: 'rgb(190 190 190)',
				fontSize: '18px',
				fontWeight: 'bold',
				border: 'none',
				borderRight: '1px solid rgba(0, 0, 0, 0.12)',
			},
		},
	},

	{
		columns: [
			{
				accessorKey: 'codQ3',
				header: 'Código',
				enableColumnFilter: false,
				enableSorting: false,
				muiTableHeadCellProps: {
					align: 'center',
					sx: {
						background: 'rgb(190 190 190)',
						fontSize: '18px',
						fontWeight: 'bold',
						border: '1px solid rgba(0, 0, 0, 0.12)',
					},
				},
				muiTableBodyCellProps: {
					align: 'center',
				},
			},
			{
				accessorKey: 'valueQ3',
				header: 'Valor',
				enableColumnFilter: false,
				enableSorting: false,
				muiTableHeadCellProps: {
					align: 'center',
					sx: {
						background: 'rgb(190 190 190)',
						fontSize: '18px',
						fontWeight: 'bold',
						border: '1px solid rgba(0, 0, 0, 0.12)',
					},
				},
				muiTableBodyCellProps: {
					align: 'center',
				},
			},
		],
		header: 'Q3',
		id: 'importQ3',
		muiTableHeadCellProps: {
			align: 'center',
			sx: {
				background: 'rgb(190 190 190)',
				fontSize: '18px',
				fontWeight: 'bold',
				borderRight: '1px solid rgba(0, 0, 0, 0.12)',
			},
		},
	},

	{
		columns: [
			{
				accessorKey: 'codQ4',
				header: 'Código',
				enableColumnFilter: false,
				enableSorting: false,
				muiTableHeadCellProps: {
					align: 'center',
					sx: {
						background: 'rgb(190 190 190)',
						fontSize: '18px',
						fontWeight: 'bold',
						border: '1px solid rgba(0, 0, 0, 0.12)',
					},
				},
				muiTableBodyCellProps: {
					align: 'center',
				},
			},
			{
				accessorKey: 'valueQ4',
				header: 'Valor',
				enableColumnFilter: false,
				enableSorting: false,
				muiTableHeadCellProps: {
					align: 'center',
					sx: {
						background: 'rgb(190 190 190)',
						fontSize: '18px',
						fontWeight: 'bold',
						border: '1px solid rgba(0, 0, 0, 0.12)',
					},
				},
				muiTableBodyCellProps: {
					align: 'center',
				},
			},
		],
		header: 'Q4',
		id: 'importQ4',
		muiTableHeadCellProps: {
			align: 'center',
			sx: {
				background: 'rgb(190 190 190)',
				fontSize: '18px',
				fontWeight: 'bold',
				borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
			},
		},
	},
]
