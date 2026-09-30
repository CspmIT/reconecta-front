import { useState } from 'react'
import { MdCheck, MdContentCopy } from 'react-icons/md'

// `request` lanza el cuerpo de la respuesta, que en este backend trae message
export const errorText = (error) =>
	error?.message || (typeof error === 'string' ? error : 'Ocurrió un error inesperado')

export const formatDate = (value) =>
	value ? new Date(value).toLocaleString('es-AR', { timeZone: 'America/Argentina/Cordoba' }) : '—'

export const pillClass = (active) =>
	`rounded-full border px-3 py-1 text-xs font-semibold transition-colors disabled:opacity-50 ${
		active
			? 'border-primary bg-primary text-slate-900'
			: 'border-slate-200 bg-white text-slate-500 hover:border-primary hover:text-slate-700 dark:border-gray-600 dark:bg-zinc-800 dark:text-gray-300'
	}`

export const inputClass =
	'rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 outline-none focus:border-primary dark:border-gray-600 dark:bg-zinc-800 dark:text-slate-200'

const copy = async (text) => {
	try {
		await navigator.clipboard.writeText(text)
		return true
	} catch {
		return false
	}
}

/**
 * Botón de copiar con confirmación visual.
 */
export const CopyButton = ({ text, label = 'Copiar', className = '' }) => {
	const [done, setDone] = useState(false)
	return (
		<button
			type='button'
			className={`${pillClass(false)} inline-flex items-center gap-1 ${className}`}
			onClick={async () => {
				if (await copy(text)) {
					setDone(true)
					setTimeout(() => setDone(false), 1500)
				}
			}}
		>
			{done ? <MdCheck /> : <MdContentCopy />}
			{done ? 'Copiado' : label}
		</button>
	)
}

/**
 * Bloque de código con botón de copiar.
 */
export const CodeBlock = ({ code, maxHeight = 320 }) => (
	<div className='relative'>
		<pre
			className='overflow-auto rounded-lg bg-slate-900 p-3 pr-24 text-xs leading-relaxed text-slate-100'
			style={{ maxHeight }}
		>
			<code>{code}</code>
		</pre>
		<div className='absolute right-2 top-2'>
			<CopyButton text={code} />
		</div>
	</div>
)

const STATUS_CLASS = {
	activo: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
	vencido: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
	revocado: 'bg-slate-200 text-slate-600 dark:bg-zinc-600 dark:text-gray-300',
}

export const StatusBadge = ({ status }) => (
	<span className={`rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${STATUS_CLASS[status] || ''}`}>
		{status}
	</span>
)
