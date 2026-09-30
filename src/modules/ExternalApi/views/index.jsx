import { Tab, Tabs } from '@mui/material'
import { useState } from 'react'

import TokensTab from '../components/TokensTab'
import DocsTab from '../components/DocsTab'

// Mismo estilo de pestañas que Auditoría
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

/*
 * Módulo API externa: los tokens con los que un tercero consulta los datos de
 * la cooperativa y la documentación de los métodos, armada con la
 * especificación OpenAPI que publica el backend.
 */
const ExternalApi = () => {
	const [tab, setTab] = useState(0)

	return (
		<div className='w-full min-w-0 flex flex-col gap-3 pb-4'>
			<h1 className='text-xl font-semibold text-slate-800 dark:text-gray-100'>API externa</h1>

			<Tabs value={tab} onChange={(_, value) => setTab(value)} variant='scrollable' scrollButtons={false} sx={tabsSx}>
				<Tab label='Tokens' />
				<Tab label='Documentación' />
			</Tabs>

			{tab === 0 ? <TokensTab /> : <DocsTab />}
		</div>
	)
}

export default ExternalApi
