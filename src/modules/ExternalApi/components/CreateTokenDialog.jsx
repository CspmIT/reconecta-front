import { Checkbox, CircularProgress, Dialog, DialogContent, DialogTitle, FormControlLabel } from '@mui/material'
import { useEffect, useState } from 'react'
import { MdWarningAmber } from 'react-icons/md'

import { EXTERNAL_BASE, externalApi } from '../api/externalApi'
import { CodeBlock, CopyButton, errorText, inputClass, pillClass } from '../utils/shared'

const EXPIRATIONS = [
	{ value: 30, label: '30 días' },
	{ value: 90, label: '90 días' },
	{ value: 365, label: '1 año' },
	{ value: '', label: 'Sin vencimiento' },
]

const EMPTY = { name: '', scopes: [], expires_in_days: 365 }

/*
 * Alta de un token en dos pasos: el formulario y, al crearlo, el secreto. El
 * secreto se muestra una sola vez (el backend guarda solo el hash), así que el
 * diálogo no se cierra solo: el usuario tiene que confirmar que lo copió.
 */
const CreateTokenDialog = ({ open, scopes, onClose }) => {
	const [form, setForm] = useState(EMPTY)
	const [saving, setSaving] = useState(false)
	const [error, setError] = useState('')
	const [created, setCreated] = useState(null)

	useEffect(() => {
		if (open) {
			setForm({ ...EMPTY, scopes: scopes.map((s) => s.value) })
			setError('')
			setCreated(null)
		}
	}, [open])

	const toggleScope = (value) =>
		setForm((prev) => ({
			...prev,
			scopes: prev.scopes.includes(value) ? prev.scopes.filter((s) => s !== value) : [...prev.scopes, value],
		}))

	const submit = async (event) => {
		event.preventDefault()
		setSaving(true)
		setError('')
		try {
			const result = await externalApi.createToken({
				name: form.name,
				scopes: form.scopes,
				expires_in_days: form.expires_in_days === '' ? null : Number(form.expires_in_days),
			})
			setCreated(result)
		} catch (e) {
			setError(errorText(e))
		} finally {
			setSaving(false)
		}
	}

	// Se avisa si hubo alta, para que la lista se refresque
	const close = () => onClose(Boolean(created))

	const canSubmit = form.name.trim() && form.scopes.length && !saving

	return (
		<Dialog open={open} onClose={created ? undefined : close} maxWidth='sm' fullWidth>
			<DialogTitle className='!font-semibold'>{created ? 'Token creado' : 'Nuevo token'}</DialogTitle>
			<DialogContent>
				{created ? (
					<div className='flex flex-col gap-3'>
						<div className='flex gap-2 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-700 dark:bg-amber-900/30 dark:text-amber-200'>
							<MdWarningAmber className='mt-0.5 shrink-0 text-lg' />
							<span>
								Copiá el token ahora y guardalo en un lugar seguro. <b>No se vuelve a mostrar</b>: si se pierde,
								hay que revocarlo y crear otro.
							</span>
						</div>
						<div className='flex items-center gap-2'>
							<code className='flex-1 break-all rounded-lg bg-slate-100 px-3 py-2 text-xs text-slate-800 dark:bg-zinc-900 dark:text-slate-100'>
								{created.token}
							</code>
							<CopyButton text={created.token} />
						</div>
						<p className='text-sm text-slate-500 dark:text-gray-400'>Para probarlo:</p>
						<CodeBlock code={`curl -H "Authorization: Bearer ${created.token}" \\\n  ${EXTERNAL_BASE}/me`} />
						<div className='flex justify-end pt-2'>
							<button type='button' className={pillClass(true)} onClick={close}>
								Ya lo copié
							</button>
						</div>
					</div>
				) : (
					<form className='flex flex-col gap-4' onSubmit={submit}>
						<label className='flex flex-col gap-1 text-sm text-slate-600 dark:text-gray-300'>
							Nombre
							<input
								autoFocus
								className={inputClass}
								maxLength={100}
								placeholder='Ej: SCADA proveedor X'
								value={form.name}
								onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
							/>
							<span className='text-xs text-slate-400'>Para reconocer la integración en la lista.</span>
						</label>

						<div className='flex flex-col gap-1 text-sm text-slate-600 dark:text-gray-300'>
							Permisos
							{scopes.map((scope) => (
								<FormControlLabel
									key={scope.value}
									className='!-my-1'
									control={
										<Checkbox
											size='small'
											checked={form.scopes.includes(scope.value)}
											onChange={() => toggleScope(scope.value)}
										/>
									}
									label={
										<span className='text-sm'>
											{scope.label} <code className='text-xs text-slate-400'>{scope.value}</code>
										</span>
									}
								/>
							))}
						</div>

						<label className='flex flex-col gap-1 text-sm text-slate-600 dark:text-gray-300'>
							Vencimiento
							<select
								className={inputClass}
								value={form.expires_in_days}
								onChange={(e) => setForm((prev) => ({ ...prev, expires_in_days: e.target.value }))}
							>
								{EXPIRATIONS.map((opt) => (
									<option key={opt.label} value={opt.value}>
										{opt.label}
									</option>
								))}
							</select>
						</label>

						{error && <p className='text-sm text-red-600 dark:text-red-400'>{error}</p>}

						<div className='flex justify-end gap-2 pt-2'>
							<button type='button' className={pillClass(false)} onClick={close} disabled={saving}>
								Cancelar
							</button>
							<button type='submit' className={`${pillClass(true)} inline-flex items-center gap-2`} disabled={!canSubmit}>
								{saving && <CircularProgress size={12} color='inherit' />}
								Crear token
							</button>
						</div>
					</form>
				)}
			</DialogContent>
		</Dialog>
	)
}

export default CreateTokenDialog
