export const ColumnsEvent = () => [
	{
		accessorFn: (originalRow) => originalRow.dateAlert,
		size: 200,
		id: 'dateAlert',
		header: 'Fecha',
		accessorKey: 'dateAlert',
		filterVariant: 'date-range',
		Cell: ({ cell }) => `${cell.getValue()}`,
	},
	{
		header: 'Evento',
		accessorKey: 'event',
		muiFilterTextFieldProps: { placeholder: 'Evento' },
	},
	{
		header: 'Información adicional',
		accessorKey: 'infoAdd',
		muiFilterTextFieldProps: { placeholder: 'Info adic.' },
		enableColumnFilter: false,
	},
]
