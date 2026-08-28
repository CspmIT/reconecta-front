import { Tooltip } from '@mui/material'

// Etiquetas legibles del ENUM `action` de la tabla ActionLogs.
export const ACTION_LABELS = {
	LOGIN: 'Inicio de sesión',
	MQTT_SEND: 'Orden a equipo',
}

const userCell = (row) => {
	const name = `${row.user?.first_name || ''} ${row.user?.last_name || ''}`.trim()
	if (!name && !row.user?.email) return <span className='italic text-slate-400'>Sistema</span>
	return (
		<Tooltip title={row.user?.email || ''} arrow placement='top'>
			<span>{name || row.user?.email}</span>
		</Tooltip>
	)
}

// El detalle es un JSON de forma variable: se muestra recortado y completo en
// el hover, que alcanza para auditar sin romper el ancho de la tabla.
const detailCell = (details) => {
	if (!details) return '—'
	const text = typeof details === 'string' ? details : JSON.stringify(details)
	return (
		<span title={text} className='font-mono text-[11px]'>
			{text.length > 120 ? `${text.slice(0, 120)}…` : text}
		</span>
	)
}

export const columnsMovements = () => [
	{
		accessorKey: 'createdAt',
		header: 'Fecha',
		size: 170,
		Cell: ({ cell }) =>
			new Date(cell.getValue()).toLocaleString('es-AR', { timeZone: 'America/Argentina/Cordoba' }),
	},
	{
		accessorKey: 'user',
		header: 'Usuario',
		size: 180,
		accessorFn: (row) => `${row.user?.first_name || ''} ${row.user?.last_name || ''}`.trim() || 'Sistema',
		Cell: ({ row }) => userCell(row.original),
	},
	{
		accessorKey: 'action',
		header: 'Acción',
		size: 150,
		Cell: ({ cell }) => ACTION_LABELS[cell.getValue()] || cell.getValue(),
	},
	{
		accessorKey: 'details',
		header: 'Detalle',
		Cell: ({ cell }) => detailCell(cell.getValue()),
	},
]
