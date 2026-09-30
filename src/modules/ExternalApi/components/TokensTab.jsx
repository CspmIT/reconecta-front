import { Tooltip } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { FaPlus } from 'react-icons/fa'
import Swal from 'sweetalert2'

import CardCustom from '../../../components/CardCustom'
import LoaderComponent from '../../../components/Loader'
import TableCustom from '../../../components/TableCustom'
import { externalApi } from '../api/externalApi'
import { StatusBadge, errorText, formatDate, pillClass } from '../utils/shared'
import CreateTokenDialog from './CreateTokenDialog'

const buildColumns = (scopeLabel, onRevoke) => [
	{ accessorKey: 'name', header: 'Nombre', size: 180 },
	{
		accessorKey: 'token_prefix',
		header: 'Token',
		size: 150,
		Cell: ({ cell }) => <code className='text-xs'>{`…${cell.getValue()}…`}</code>,
	},
	{
		accessorKey: 'scopes',
		header: 'Permisos',
		size: 200,
		accessorFn: (row) => (row.scopes || []).join(', '),
		Cell: ({ row }) => (
			<div className='flex flex-wrap gap-1'>
				{(row.original.scopes || []).map((scope) => (
					<Tooltip key={scope} title={scopeLabel(scope)} arrow placement='top'>
						<span className='rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[11px] text-slate-600 dark:bg-zinc-800 dark:text-gray-300'>
							{scope}
						</span>
					</Tooltip>
				))}
			</div>
		),
	},
	{
		accessorKey: 'status',
		header: 'Estado',
		size: 100,
		Cell: ({ cell }) => <StatusBadge status={cell.getValue()} />,
	},
	{
		accessorKey: 'user',
		header: 'Creado por',
		size: 170,
		accessorFn: (row) => row.user?.name || '—',
		Cell: ({ row }) => (
			<div className='flex flex-col'>
				<span>{row.original.user?.name || '—'}</span>
				<span className='text-xs text-slate-400'>{formatDate(row.original.createdAt)}</span>
			</div>
		),
	},
	{
		accessorKey: 'last_used_at',
		header: 'Último uso',
		size: 170,
		Cell: ({ row }) =>
			row.original.last_used_at ? (
				<div className='flex flex-col'>
					<span>{formatDate(row.original.last_used_at)}</span>
					<span className='text-xs text-slate-400'>{row.original.last_ip}</span>
				</div>
			) : (
				<span className='italic text-slate-400'>Nunca</span>
			),
	},
	{
		accessorKey: 'expires_at',
		header: 'Vence',
		size: 150,
		Cell: ({ row }) =>
			row.original.revoked_at
				? `Revocado ${formatDate(row.original.revoked_at)}`
				: row.original.expires_at
					? formatDate(row.original.expires_at)
					: 'No vence',
	},
	{
		id: 'actions',
		header: '',
		size: 90,
		enableSorting: false,
		Cell: ({ row }) =>
			row.original.status === 'activo' ? (
				<button type='button' className={pillClass(false)} onClick={() => onRevoke(row.original)}>
					Revocar
				</button>
			) : null,
	},
]

/*
 * Tokens de la cooperativa. Un token revocado o vencido se sigue listando: la
 * auditoría tiene a quién apuntar y el usuario ve qué integraciones existieron.
 */
const TokensTab = () => {
	const [rows, setRows] = useState([])
	const [scopes, setScopes] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')
	const [dialog, setDialog] = useState(false)

	const load = async () => {
		setLoading(true)
		try {
			const [tokens, opts] = await Promise.all([externalApi.listTokens(), externalApi.getScopes()])
			setRows(tokens)
			setScopes(opts.scopes || [])
			setError('')
		} catch (e) {
			setError(errorText(e))
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		load()
	}, [])

	const revoke = async (token) => {
		const answer = await Swal.fire({
			icon: 'warning',
			title: `¿Revocar "${token.name}"?`,
			text: 'Las integraciones que lo usan dejan de funcionar al instante. No se puede deshacer.',
			showCancelButton: true,
			confirmButtonText: 'Revocar',
			cancelButtonText: 'Cancelar',
			confirmButtonColor: '#dc2626',
		})
		if (!answer.isConfirmed) return
		try {
			await externalApi.revokeToken(token.id)
			await load()
			Swal.fire({ icon: 'success', title: 'Token revocado', timer: 1500, showConfirmButton: false })
		} catch (e) {
			Swal.fire({ icon: 'error', title: 'No se pudo revocar', text: errorText(e) })
		}
	}

	const columns = useMemo(() => {
		const labels = new Map(scopes.map((s) => [s.value, s.label]))
		return buildColumns((value) => labels.get(value) || value, revoke)
	}, [scopes])

	return (
		<CardCustom className='rounded-xl p-4 flex flex-col gap-3'>
			<div className='flex flex-wrap items-start justify-between gap-3'>
				<div>
					<h3 className='text-sm font-semibold text-slate-700 dark:text-gray-200'>Tokens de acceso</h3>
					<p className='text-xs text-slate-500 dark:text-gray-400'>
						Cada token da acceso de solo lectura a los datos de esta cooperativa, con los permisos que se le asignen.
					</p>
				</div>
				<button
					type='button'
					className={`${pillClass(true)} inline-flex items-center gap-1.5`}
					onClick={() => setDialog(true)}
					disabled={loading || !scopes.length}
				>
					<FaPlus size={10} /> Nuevo token
				</button>
			</div>

			{loading ? (
				<LoaderComponent image={false} />
			) : error ? (
				<p className='py-6 text-center text-xs text-slate-400 dark:text-gray-400'>{error}</p>
			) : (
				<TableCustom data={rows} columns={columns} pagination pageSize={10} />
			)}

			<CreateTokenDialog
				open={dialog}
				scopes={scopes}
				onClose={(changed) => {
					setDialog(false)
					if (changed) load()
				}}
			/>
		</CardCustom>
	)
}

export default TokensTab
