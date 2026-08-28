import { useEffect, useState } from 'react'

import CardCustom from '../../../components/CardCustom'
import LoaderComponent from '../../../components/Loader'
import TableCustom from '../../../components/TableCustom'
import { auditApi } from '../api/auditApi'
import { columnsMovements } from '../utils/columnsAudit'
import { HelpIcon, pillClass } from '../utils/dashboardShared'
import { HELP } from '../utils/help'

const inputClass =
	'rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-600 outline-none focus:border-primary dark:border-gray-600 dark:bg-zinc-800 dark:text-slate-200'

const EMPTY = { from: '', to: '', search: '' }

const AuditMovements = () => {
	const [filters, setFilters] = useState(EMPTY)
	// Los filtros aplicados van aparte de los que se están tipeando: la consulta
	// se dispara con el botón, no en cada tecla.
	const [applied, setApplied] = useState(EMPTY)
	const [rows, setRows] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')

	useEffect(() => {
		let active = true
		setLoading(true)
		auditApi
			.getMovements({ ...applied, limit: 500 })
			.then((data) => {
				if (active) {
					setRows(data.rows || [])
					setError('')
				}
			})
			.catch((e) => active && setError(e?.message || 'No se pudieron cargar los movimientos'))
			.finally(() => active && setLoading(false))
		return () => {
			active = false
		}
	}, [applied])

	const onChange = (key) => (event) => setFilters((prev) => ({ ...prev, [key]: event.target.value }))

	return (
		<CardCustom className='rounded-xl p-4 flex flex-col gap-3'>
			<div className='flex items-center gap-1.5'>
				<h3 className='text-sm font-semibold text-slate-700 dark:text-gray-200'>Movimientos</h3>
				<HelpIcon help={HELP.movements} />
			</div>

			<div className='flex flex-wrap items-center gap-2'>
				<label className='flex items-center gap-1 text-xs text-slate-400 dark:text-gray-400'>
					Desde
					<input type='date' className={inputClass} value={filters.from} onChange={onChange('from')} />
				</label>
				<label className='flex items-center gap-1 text-xs text-slate-400 dark:text-gray-400'>
					Hasta
					<input type='date' className={inputClass} value={filters.to} onChange={onChange('to')} />
				</label>
				<input
					type='text'
					placeholder='Buscar por acción…'
					className={inputClass}
					value={filters.search}
					onChange={onChange('search')}
				/>
				<button type='button' className={pillClass(true)} onClick={() => setApplied(filters)}>
					Filtrar
				</button>
				<button
					type='button'
					className={pillClass(false)}
					onClick={() => {
						setFilters(EMPTY)
						setApplied(EMPTY)
					}}
				>
					Limpiar
				</button>
			</div>

			{loading ? (
				<LoaderComponent image={false} />
			) : error ? (
				<p className='py-6 text-center text-xs text-slate-400 dark:text-gray-400'>{error}</p>
			) : (
				<TableCustom data={rows} columns={columnsMovements()} pagination pageSize={10} />
			)}
		</CardCustom>
	)
}

export default AuditMovements
