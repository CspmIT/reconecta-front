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
		accessorKey: 'cos',
		muiFilterTextFieldProps: { placeholder: 'Canal 4' },
		size: 40,
	},

	{
		header: 'Canal 5 (kW)',
		accessorKey: 'pr',
		muiFilterTextFieldProps: { placeholder: 'Canal 5' },
		size: 40,
	},
	{
		header: 'Canal 6 (kW)',
		accessorKey: 'ps',
		muiFilterTextFieldProps: { placeholder: 'Canal 6' },
		size: 40,
	},
	{
		header: 'Canal 7 (kW)',
		accessorKey: 'pt',
		muiFilterTextFieldProps: { placeholder: 'Canal 7' },
		size: 40,
	},
	{
		header: 'Canal 8 (kVA)',
		accessorKey: 'aparente',
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
		accessorKey: 'cosr',
		muiFilterTextFieldProps: { placeholder: 'Cos R' },
		size: 40,
	},
	{
		header: 'Cos S',
		accessorKey: 'coss',
		muiFilterTextFieldProps: { placeholder: 'Cos S' },
		size: 40,
	},
	{
		header: 'Cos T',
		accessorKey: 'cost',
		muiFilterTextFieldProps: { placeholder: 'Cos T' },
		size: 40,
	},
]
