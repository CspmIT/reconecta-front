import { Tab, Tabs } from '@mui/material'
import { useEffect, useState } from 'react'

import { ALL_SCHEMAS, auditApi } from '../api/auditApi'
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
	// La cooperativa elegida es del módulo entero: se mantiene al cambiar de
	// pestaña. Quién puede cambiarla lo decide el backend, no el front.
	const [schema, setSchema] = useState('')
	const [organizations, setOrganizations] = useState([])
	const [orgNames, setOrgNames] = useState(new Map())

	useEffect(() => {
		let active = true
		auditApi.getOrganizations().then(async (info) => {
			if (!active || !info.superadmin) return
			// El nombre visible de cada cooperativa lo tiene Cooptech.
			const names = await auditApi.getOrganizationNames()
			if (!active) return
			setOrgNames(names)
			setOrganizations([
				{ value: ALL_SCHEMAS, label: 'Todas las cooperativas' },
				...info.schemas.map((value) => ({ value, label: names.get(value) || value })),
			])
		})
		return () => {
			active = false
		}
	}, [])

	const filterProps = { schema, setSchema, organizations, orgNames }

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

			{tab === 0 ? <AuditDashboard {...filterProps} /> : <AuditMovements {...filterProps} />}
		</div>
	)
}

export default ActionAudit
