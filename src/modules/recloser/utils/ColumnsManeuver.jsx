export const columnManeuver = [
	{
		accessorFn: (originalRow) => new Date(originalRow.createdAt), //convert to date for sorting and filtering
		size: 100,
		id: 'date',
		header: 'Fecha',
		accessorKey: 'createdAt',
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
		accessorFn: (originalRow) => `${originalRow.user_create.first_name} ${originalRow.user_create.last_name}`,
		header: 'Usuario',
		accessorKey: 'user_name',
		muiFilterTextFieldProps: { placeholder: 'Usuario' },
	},
]
