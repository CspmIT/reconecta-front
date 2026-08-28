import { useState } from 'react'

import CardCustom from '../../../components/CardCustom'
import { HelpIcon, formatInt, pillClass } from '../utils/dashboardShared'
import { HELP } from '../utils/help'

// Tablas HTML nativas en vez de TableCustom: acá conviene el control fino del
// ancho de cada columna y no hacen falta filtros ni exportación.
const thClass =
	'px-2 py-1.5 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-gray-400 whitespace-nowrap'
const tdClass = 'px-2 py-1.5 text-xs text-slate-600 dark:text-gray-300 align-top'

// Rojo para fallas del servidor, ámbar para el resto: el mismo criterio que el
// donut de estados.
const badgeClass = (status) =>
	status >= 500
		? 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400'
		: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400'

const StatusBadge = ({ status }) => (
	<span className={`rounded px-1.5 py-0.5 text-[11px] font-semibold tabular-nums ${badgeClass(status)}`}>
		{status}
	</span>
)

const RequestLabel = ({ method, path }) => (
	<span className='font-mono text-[11px]'>
		<span className='font-semibold'>{method}</span> {path}
	</span>
)

const dateTime = (value) =>
	new Date(value).toLocaleString('es-AR', { timeZone: 'America/Argentina/Cordoba' })

const userLabel = (row) => {
	const name = `${row.user?.first_name || ''} ${row.user?.last_name || ''}`.trim()
	if (name) return name
	return <span className='italic text-slate-400'>Sistema</span>
}

const ErrorsDetail = ({ errors, days }) => {
	const [tab, setTab] = useState('grouped')
	const grouped = errors?.grouped || []
	const latest = errors?.latest || []
	const rows = tab === 'grouped' ? grouped : latest

	return (
		<CardCustom className='rounded-xl p-4 flex flex-col gap-2'>
			<div className='flex items-start justify-between gap-2'>
				<div>
					<div className='flex items-center gap-1.5'>
						<h3 className='text-sm font-semibold text-slate-700 dark:text-gray-200'>Detalle de errores</h3>
						<HelpIcon help={HELP.errorsDetail} />
					</div>
					<p className='text-xs text-slate-400 dark:text-gray-400'>
						{tab === 'grouped'
							? `Errores repetidos, del más frecuente al menos (últimos ${days} días)`
							: `Los últimos errores registrados (últimos ${days} días)`}
					</p>
				</div>
				<div className='flex gap-2 shrink-0'>
					<button type='button' className={pillClass(tab === 'grouped')} onClick={() => setTab('grouped')}>
						Agrupados
					</button>
					<button type='button' className={pillClass(tab === 'latest')} onClick={() => setTab('latest')}>
						Últimos
					</button>
				</div>
			</div>

			{!rows.length ? (
				<p className='py-6 text-center text-xs text-slate-400 dark:text-gray-400'>
					Sin errores en el período 🎉
				</p>
			) : (
				<div className='overflow-x-auto'>
					{tab === 'grouped' ? (
						<table className='w-full'>
							<thead>
								<tr>
									<th className={`${thClass} text-right`}>Veces</th>
									<th className={thClass}>Código</th>
									<th className={thClass}>Pedido</th>
									<th className={thClass}>Módulo</th>
									<th className={thClass}>Mensaje</th>
									<th className={`${thClass} text-right`}>Usuarios</th>
									<th className={thClass}>Última vez</th>
								</tr>
							</thead>
							<tbody>
								{grouped.map((row, i) => (
									<tr key={i} className='border-b border-slate-100 dark:border-gray-600 last:border-0'>
										<td className={`${tdClass} text-right font-semibold tabular-nums`}>
											{formatInt(row.total)}
										</td>
										<td className={tdClass}>
											<StatusBadge status={row.status} />
										</td>
										<td className={tdClass}>
											<RequestLabel method={row.method} path={row.path} />
										</td>
										<td className={tdClass}>{row.module}</td>
										<td className={`${tdClass} max-w-md`}>{row.error_message || '—'}</td>
										<td className={`${tdClass} text-right tabular-nums`}>{formatInt(row.users)}</td>
										<td className={`${tdClass} whitespace-nowrap`}>{dateTime(row.last_seen)}</td>
									</tr>
								))}
							</tbody>
						</table>
					) : (
						<table className='w-full'>
							<thead>
								<tr>
									<th className={thClass}>Cuándo</th>
									<th className={thClass}>Código</th>
									<th className={thClass}>Pedido</th>
									<th className={thClass}>Módulo</th>
									<th className={thClass}>Mensaje</th>
									<th className={thClass}>Usuario</th>
								</tr>
							</thead>
							<tbody>
								{latest.map((row) => (
									<tr
										key={row.id}
										className='border-b border-slate-100 dark:border-gray-600 last:border-0'
									>
										<td className={`${tdClass} whitespace-nowrap`}>{dateTime(row.createdAt)}</td>
										<td className={tdClass}>
											<StatusBadge status={row.status} />
										</td>
										<td className={tdClass}>
											<RequestLabel method={row.method} path={row.path} />
										</td>
										<td className={tdClass}>{row.module}</td>
										<td className={`${tdClass} max-w-md`}>{row.error_message || '—'}</td>
										<td className={tdClass}>{userLabel(row)}</td>
									</tr>
								))}
							</tbody>
						</table>
					)}
				</div>
			)}
		</CardCustom>
	)
}

export default ErrorsDetail
