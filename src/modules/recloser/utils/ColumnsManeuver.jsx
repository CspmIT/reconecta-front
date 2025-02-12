export const columnManeuver = [
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
		header: 'Acción',
		accessorKey: 'action',
		muiFilterTextFieldProps: { placeholder: 'Acción' },
		size: 40,
	},
	{
		header: 'Usuario',
		accessorKey: 'user_name',
		muiFilterTextFieldProps: { placeholder: 'Usuario' },
	},
]
