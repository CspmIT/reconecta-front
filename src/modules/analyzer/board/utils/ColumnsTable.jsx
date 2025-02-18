export const columnsTableCurve = [
	{
		accessorFn: (originalRow) => new Date(originalRow.date), //convert to date for sorting and filtering
		size: 100,
		id: 'date',
		header: 'Fecha',
		accessorKey: 'date',
		filterVariant: 'date-range',
		Cell: ({ cell }) => `${cell.getValue().toLocaleDateString()} ${cell.getValue().toLocaleTimeString()}`, // convert back to string for display
	},
	{
		header: 'Canal 1 (V)',
		accessorKey: 'tr',
		muiFilterTextFieldProps: { placeholder: 'Canal 1' },
		size: 40,
	},
	{
		header: 'Canal 2 (V)',
		accessorKey: 'ts',
		muiFilterTextFieldProps: { placeholder: 'Canal 2' },
		size: 40,
	},
	{
		header: 'Canal 3 (V)',
		accessorKey: 'tt',
		muiFilterTextFieldProps: { placeholder: 'Canal 3' },
		size: 40,
	},
	{
		header: 'Canal 4',
		accessorKey: 'cos_total',
		muiFilterTextFieldProps: { placeholder: 'Canal 4' },
		size: 40,
	},

	{
		header: 'Canal 5 (kW)',
		accessorKey: 'p0',
		muiFilterTextFieldProps: { placeholder: 'Canal 5' },
		size: 40,
	},
	{
		header: 'Canal 6 (kW)',
		accessorKey: 'p1',
		muiFilterTextFieldProps: { placeholder: 'Canal 6' },
		size: 40,
	},
	{
		header: 'Canal 7 (kW)',
		accessorKey: 'p2',
		muiFilterTextFieldProps: { placeholder: 'Canal 7' },
		size: 40,
	},
	{
		header: 'Canal 8 (kVA)',
		accessorKey: 'aparente_total',
		muiFilterTextFieldProps: { placeholder: 'Canal 8' },
		size: 40,
	},
]

export const columnsTableTension = [
	{
		accessorFn: (originalRow) => new Date(originalRow.date), //convert to date for sorting and filtering
		size: 100,
		id: 'date',
		header: 'Fecha',
		accessorKey: 'date',
		filterVariant: 'date-range',
		Cell: ({ cell }) => `${cell.getValue().toLocaleDateString()} ${cell.getValue().toLocaleTimeString()}`, // convert back to string for display
	},
	{
		header: 'Tensión R (V)',
		accessorKey: 'tr',
		muiFilterTextFieldProps: { placeholder: 'Tensión R' },
		size: 40,
	},
	{
		header: 'Tensión S (V)',
		accessorKey: 'ts',
		muiFilterTextFieldProps: { placeholder: 'Tensión S' },
		size: 40,
	},
	{
		header: 'Tensión T (V)',
		accessorKey: 'tt',
		muiFilterTextFieldProps: { placeholder: 'Tensión T' },
		size: 40,
	},
	{
		header: 'Corriente R (A)',
		accessorKey: 'cr',
		muiFilterTextFieldProps: { placeholder: 'Corriente R' },
		size: 40,
	},
	{
		header: 'Corriente S (A)',
		accessorKey: 'cs',
		muiFilterTextFieldProps: { placeholder: 'Corriente S' },
		size: 40,
	},
	{
		header: 'Corriente T (A)',
		accessorKey: 'ct',
		muiFilterTextFieldProps: { placeholder: 'Corriente T' },
		size: 40,
	},
]

export const columnsTableCoseno = [
	{
		accessorFn: (originalRow) => new Date(originalRow.date), //convert to date for sorting and filtering
		size: 100,
		id: 'date',
		header: 'Fecha',
		accessorKey: 'date',
		filterVariant: 'date-range',
		Cell: ({ cell }) => `${cell.getValue().toLocaleDateString()} ${cell.getValue().toLocaleTimeString()}`, // convert back to string for display
	},
	{
		header: 'Cos R',
		accessorKey: 'cos_0',
		muiFilterTextFieldProps: { placeholder: 'Cos R' },
		size: 40,
	},
	{
		header: 'Cos S',
		accessorKey: 'cos_1',
		muiFilterTextFieldProps: { placeholder: 'Cos S' },
		size: 40,
	},
	{
		header: 'Cos T',
		accessorKey: 'cos_2',
		muiFilterTextFieldProps: { placeholder: 'Cos T' },
		size: 40,
	},
]

export const columnsTableEnergia = [
	{
		accessorFn: (originalRow) => new Date(originalRow.date), //convert to date for sorting and filtering
		size: 100,
		id: 'date',
		header: 'Fecha',
		accessorKey: 'date',
		filterVariant: 'date-range',
		Cell: ({ cell }) => `${cell.getValue().toLocaleDateString()} ${cell.getValue().toLocaleTimeString()}`, // convert back to string for display
	},
	{
		header: 'Activa R (kWh)',
		accessorKey: 'a0',
		muiFilterTextFieldProps: { placeholder: 'Activa R' },
		size: 40,
	},
	{
		header: 'Activa S (kWh)',
		accessorKey: 'a1',
		muiFilterTextFieldProps: { placeholder: 'Activa S' },
		size: 40,
	},
	{
		header: 'Activa T (kWh)',
		accessorKey: 'a2',
		muiFilterTextFieldProps: { placeholder: 'Activa T' },
		size: 40,
	},
	{
		header: 'Reactiva R (kVArh)',
		accessorKey: 'r0',
		muiFilterTextFieldProps: { placeholder: 'Reactiva R' },
		size: 40,
	},
	{
		header: 'Reactiva S (kVArh)',
		accessorKey: 'r1',
		muiFilterTextFieldProps: { placeholder: 'Reactiva S' },
		size: 40,
	},
	{
		header: 'Reactiva T (kVArh)',
		accessorKey: 'r2',
		muiFilterTextFieldProps: { placeholder: 'Reactiva T' },
		size: 40,
	},

]
