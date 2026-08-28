import { Tab, Tabs } from '@mui/material'
import { useState } from 'react'

import AuditDashboard from '../components/AuditDashboard'
import AuditMovements from '../components/AuditMovements'

// scrollable no es decorativo: en pantallas angostas las pestañas se recortan.
const tabsSx = {
	minHeight: 42,
	borderBottom: '1px solid rgba(148,163,184,0.25)',
	'& .MuiTabs-indicator': { height: 3, borderRadius: '3px 3px 0 0', backgroundColor: '#edbf36' },
	'& .MuiTab-root': {
		minHeight: 42,
		fontWeight: 600,
		fontSize: '0.9rem',
		textTransform: 'none',
		color: '#64748b',
	},
	'body.dark &': { '& .MuiTab-root': { color: '#9ca3af' } },
	'& .Mui-selected': { color: '#edbf36 !important' },
}

const ActionAudit = () => {
	const [tab, setTab] = useState(0)

	// w-full porque el layout (core/views) envuelve el Outlet en un flex: sin eso
	// la vista se encoge al ancho de su contenido. min-w-0 deja que las tablas
	// anchas scrolleen adentro en vez de estirar la página.
	return (
		<div className='w-full min-w-0 flex flex-col gap-3 pb-4'>
			<h1 className='text-xl font-semibold text-slate-800 dark:text-gray-100'>Auditoría de acciones</h1>

			<Tabs value={tab} onChange={(_, value) => setTab(value)} variant='scrollable' scrollButtons={false} sx={tabsSx}>
				<Tab label='Dashboard' />
				<Tab label='Movimientos' />
			</Tabs>

			{tab === 0 ? <AuditDashboard /> : <AuditMovements />}
		</div>
	)
}

export default ActionAudit
