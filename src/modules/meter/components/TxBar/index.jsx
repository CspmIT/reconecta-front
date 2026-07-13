import { useState } from 'react'
import { Button, Modal, Radio, TextField } from '@mui/material'
import { FaEdit, FaLock, FaExchangeAlt } from 'react-icons/fa'
import { ImCross } from 'react-icons/im'
import Swal from 'sweetalert2'
import { useMeter } from '../../context/MeterContext'

/*
 * Barra de relación de transformación (VT/CT) + toggle global Medido/Convertido.
 * "Convertido" (por defecto) muestra valores físicos: tensiones ×VT y corrientes ×CT.
 * Energías/potencias no se tocan: el medidor ya las publica en primario.
 */
function TxBar() {
	const { txOn, setTxOn, txSource, vt, ct, vtLabel, ctLabel, equipmentReport, saveTx } = useMeter()
	const [open, setOpen] = useState(false)
	const [form, setForm] = useState(null)

	const openModal = () => {
		setForm({
			source: txSource,
			vtP: vt.primary,
			vtS: vt.secondary,
			ctP: ct.primary,
			ctS: ct.secondary,
		})
		setOpen(true)
	}

	const setSource = (source) => {
		if (source === 'equipment') {
			setForm({
				source,
				vtP: equipmentReport.vt.primary,
				vtS: equipmentReport.vt.secondary,
				ctP: equipmentReport.ct.primary,
				ctS: equipmentReport.ct.secondary,
			})
		} else {
			setForm({ ...form, source })
		}
	}

	const [saving, setSaving] = useState(false)
	const handleSave = async () => {
		const vtP = parseFloat(form.vtP)
		const vtS = parseFloat(form.vtS)
		const ctP = parseFloat(form.ctP)
		const ctS = parseFloat(form.ctS)
		if ([vtP, vtS, ctP, ctS].some(isNaN) || vtS === 0 || ctS === 0) {
			Swal.fire({ title: 'Atención!', html: 'Valores inválidos', icon: 'error' })
			return
		}
		setSaving(true)
		const saved = await saveTx(
			form.source,
			{ primary: vtP, secondary: vtS },
			{ primary: ctP, secondary: ctS }
		)
		setSaving(false)
		if (saved) setOpen(false)
	}

	const isManual = txSource === 'manual'

	return (
		<>
			<div className='w-full flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-zinc-700 border border-gray-200 dark:border-zinc-500 rounded-xl px-4 py-2.5 shadow-sm'>
				<div className='flex flex-wrap items-center gap-4'>
					<span className='inline-flex items-center gap-1.5 text-xs uppercase tracking-wide text-gray-600 dark:text-zinc-300 font-medium'>
						<FaExchangeAlt /> Relación de transformación
					</span>
					<span className='text-sm'>
						<span className='text-gray-500 dark:text-zinc-400 text-xs uppercase mr-1'>VT</span>
						<b className='font-mono'>{vtLabel}</b>
					</span>
					<span className='text-sm'>
						<span className='text-gray-500 dark:text-zinc-400 text-xs uppercase mr-1'>CT</span>
						<b className='font-mono'>{ctLabel}</b>
					</span>
					<span
						className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full ${
							isManual
								? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
								: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200'
						}`}
					>
						{isManual ? <FaEdit /> : <FaLock />}
						{isManual ? 'manual · guardado en Reconecta' : 'leído del equipo'}
					</span>
					<button
						onClick={openModal}
						className='text-xs text-blue-700 dark:text-blue-300 border border-gray-300 dark:border-zinc-500 rounded-md px-2.5 py-1 inline-flex items-center gap-1 hover:bg-blue-50 dark:hover:bg-zinc-600'
					>
						<FaEdit /> Editar
					</button>
				</div>

				{/* Toggle Medido / Convertido */}
				<div
					className='flex items-center gap-2 text-xs select-none'
					title='Conmutar entre valores medidos (crudos del secundario) y convertidos (físicos, con CT/VT aplicado)'
				>
					<span
						className={`cursor-pointer ${!txOn ? 'text-blue-700 dark:text-blue-300 font-semibold' : 'text-gray-500 dark:text-zinc-400'}`}
						onClick={() => setTxOn(false)}
					>
						Medido
					</span>
					<div
						role='switch'
						aria-checked={txOn}
						tabIndex={0}
						onClick={() => setTxOn(!txOn)}
						onKeyDown={(e) => {
							if (e.key === ' ' || e.key === 'Enter') {
								e.preventDefault()
								setTxOn(!txOn)
							}
						}}
						className={`relative w-10 h-5 rounded-full cursor-pointer transition-colors ${txOn ? 'bg-blue-600' : 'bg-gray-400'}`}
					>
						<span
							className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${txOn ? 'left-5' : 'left-0.5'}`}
						/>
					</div>
					<span
						className={`cursor-pointer ${txOn ? 'text-blue-700 dark:text-blue-300 font-semibold' : 'text-gray-500 dark:text-zinc-400'}`}
						onClick={() => setTxOn(true)}
					>
						Convertido
					</span>
				</div>
			</div>

			<Modal open={open} onClose={() => setOpen(false)}>
				<div className='w-full md:w-[560px] !absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 p-2'>
					<div className='bg-white dark:bg-zinc-700 rounded-md shadow-md w-full text-black dark:text-white'>
						<div className='p-4 bg-[#243f8c] rounded-t-md relative text-white'>
							<h1 className='text-lg font-bold'>Editar relación de transformación</h1>
							<button onClick={() => setOpen(false)} className='!absolute top-4 right-4'>
								<ImCross size={14} />
							</button>
						</div>
						{form && (
							<div className='p-5 flex flex-col gap-4'>
								<div className='flex flex-col sm:flex-row gap-2.5'>
									{[
										{
											value: 'equipment',
											label: 'Leído del equipo',
											desc: 'La relación se obtiene de la configuración del equipo y se actualiza con cada lectura.',
										},
										{
											value: 'manual',
											label: 'Manual (override)',
											desc: 'Útil cuando el equipo está configurado 1:1 (típico en grandes consumidores). El valor lo gestiona Reconecta.',
										},
									].map((opt) => (
										<label
											key={opt.value}
											className={`flex-1 border rounded-lg p-2.5 cursor-pointer flex items-start gap-1 ${
												form.source === opt.value
													? 'border-blue-600 bg-blue-50 dark:bg-zinc-600'
													: 'border-gray-300 dark:border-zinc-500'
											}`}
										>
											<Radio
												size='small'
												checked={form.source === opt.value}
												onChange={() => setSource(opt.value)}
											/>
											<span>
												<span className='block text-sm font-medium'>{opt.label}</span>
												<span className='block text-xs text-gray-600 dark:text-zinc-300 mt-0.5'>
													{opt.desc}
												</span>
											</span>
										</label>
									))}
								</div>

								{[
									['Transformador de tensión (VT)', 'vtP', 'vtS', '(V)'],
									['Transformador de corriente (CT)', 'ctP', 'ctS', '(A)'],
								].map(([label, pKey, sKey, unit]) => (
									<div key={pKey}>
										<p className='text-xs text-gray-600 dark:text-zinc-300 mb-1.5 font-medium'>
											{label}
										</p>
										<div className='flex items-center gap-2'>
											<TextField
												type='number'
												size='small'
												className='!w-28'
												disabled={form.source !== 'manual'}
												value={form[pKey]}
												onChange={(e) => setForm({ ...form, [pKey]: e.target.value })}
											/>
											<span className='text-lg text-gray-500'>:</span>
											<TextField
												type='number'
												size='small'
												className='!w-28'
												disabled={form.source !== 'manual'}
												value={form[sKey]}
												onChange={(e) => setForm({ ...form, [sKey]: e.target.value })}
											/>
											<span className='text-xs text-gray-500 dark:text-zinc-400'>
												primario : secundario {unit}
											</span>
										</div>
									</div>
								))}

								<div className='bg-gray-100 dark:bg-zinc-600 rounded-md px-3 py-2 text-xs text-gray-600 dark:text-zinc-200'>
									<b>Valor reportado por el equipo:</b> VT {equipmentReport.vt.primary}:
									{equipmentReport.vt.secondary} · CT {equipmentReport.ct.primary}:
									{equipmentReport.ct.secondary}
								</div>

								<div className='flex justify-end gap-2 pt-1'>
									<Button variant='outlined' size='small' onClick={() => setOpen(false)}>
										Cancelar
									</Button>
									<Button variant='contained' size='small' onClick={handleSave} disabled={saving}>
										{saving ? 'Guardando...' : 'Guardar'}
									</Button>
								</div>
							</div>
						)}
					</div>
				</div>
			</Modal>
		</>
	)
}

export default TxBar
