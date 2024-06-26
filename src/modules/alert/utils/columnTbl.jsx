const eventsList = ['Bloqueo', 'Apertura']
export const columnsCriticos = [
	{
		header: 'Nº',
		accessorKey: 'Nro_recloser',
		muiFilterTextFieldProps: { placeholder: 'Nº' },
		size: 20,
	},
	{
		header: 'Nombre',
		accessorKey: 'Name',
		muiFilterTextFieldProps: { placeholder: 'Name' },
	},
	{
		accessorFn: (originalRow) => new Date(originalRow.dateAlert), //convert to date for sorting and filtering
		id: 'dateAlert',
		header: 'Fecha',
		accessorKey: 'dateAlert',
		filterVariant: 'date-range',
		Cell: ({ cell }) => `${cell.getValue().toLocaleDateString()} ${cell.getValue().toLocaleTimeString()}`, // convert back to string for display
	},
	{
		header: 'Evento',
		accessorKey: 'event',
		filterVariant: 'multi-select',
		filterSelectOptions: eventsList,
		muiFilterTextFieldProps: { placeholder: 'Evento' },
	},
	{
		header: 'Información adicional',
		accessorKey: 'infoAdd',
		muiFilterTextFieldProps: { placeholder: 'Info adic.' },
		enableColumnFilter: false,
	},
]
