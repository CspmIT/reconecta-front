// Solapa «Actualizaciones de firmware»: la vista del instalador.
// Solo releases APROBADOS por ingeniería y de producto Reconecta/General (el
// filtro lo aplica el backend). Secciones numeradas como en el Tablero:
// 1 · Elección de versión, 2 · Modo de programación, 3 · Estado, 4 · Monitor.
import { useEffect, useState } from 'react'
import Terminal from './Terminal'
import { CHIP_LABEL, MODE_LABEL, FREQ_LABEL, agruparPorEquipo, descArchivos } from '../constants'
import { autonomiaApi } from '../api/autonomiaApi'

const fecha = (v) => {
	if (!v) return ''
	const d = new Date(v)
	return Number.isNaN(d.getTime()) ? String(v).slice(0, 10) : d.toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' })
}

export default function FirmwareTab({ cli, flasher, firmwares, cargando, errorCatalogo, recargar }) {
	const [idxSel, setIdxSel] = useState(-1)
	const [detalleVer, setDetalleVer] = useState(false)
	const [eventos, setEventos] = useState([])
	const { flasheando, flashProg, flashFin, programar } = flasher

	const conIdx = firmwares.map((f, i) => ({ ...f, _i: i }))
	const grupos = agruparPorEquipo(conIdx)
	const fwSel = firmwares[idxSel] || null

	const cargarEventos = () => autonomiaApi.getEventos(8).then((r) => setEventos(Array.isArray(r?.eventos) ? r.eventos : [])).catch(() => {})
	useEffect(() => {
		cargarEventos()
	}, [])
	useEffect(() => {
		if (!flasheando) cargarEventos()
	}, [flasheando])

	const tabla = (releases) => (
		<table className='w-full text-xs'>
			<thead>
				<tr className='text-left text-slate-400 bg-slate-50'>
					<th className='px-2 py-1.5 font-medium'>Producto</th>
					<th className='px-2 py-1.5 font-medium'>Versión</th>
					<th className='px-2 py-1.5 font-medium'>Nombre</th>
					<th className='px-2 py-1.5 font-medium'>Archivos</th>
					<th className='px-2 py-1.5 font-medium'>Comentario de la versión</th>
					<th className='px-2 py-1.5 font-medium'>Publicado</th>
					<th className='px-2 py-1.5' />
				</tr>
			</thead>
			<tbody>
				{releases.map((f) => (
					<tr
						key={f._i}
						onClick={() => setIdxSel(f._i)}
						className={`border-t border-slate-100 cursor-pointer ${idxSel === f._i ? 'bg-coop-azul/10' : 'hover:bg-slate-50'}`}>
						<td className='px-2 py-1.5 whitespace-nowrap'>{f.producto || '—'}</td>
						<td className='px-2 py-1.5 font-mono whitespace-nowrap'>{f.version}</td>
						<td className='px-2 py-1.5'>{f.nombre || '—'}</td>
						<td className='px-2 py-1.5 whitespace-nowrap text-slate-500' title={(f.segmentos || []).map((sg) => `${sg.offset}  ${sg.nombre}`).join('\n')}>
							{descArchivos(f)}
						</td>
						<td className='px-2 py-1.5 text-slate-500 max-w-[260px] truncate' title={f.notas || ''}>
							{f.notas || ''}
						</td>
						<td className='px-2 py-1.5 whitespace-nowrap text-slate-400'>{String(f.fecha || '').slice(0, 10)}</td>
						<td className='px-2 py-1.5 whitespace-nowrap text-right' onClick={(e) => e.stopPropagation()}>
							<button
								onClick={() => {
									if (idxSel === f._i) setDetalleVer((v) => !v)
									else {
										setIdxSel(f._i)
										setDetalleVer(true)
									}
								}}
								className={`text-[11px] px-2 py-0.5 rounded-full border ${
									idxSel === f._i && detalleVer ? 'border-coop-azul text-coop-azul bg-coop-azul/5' : 'border-slate-200 text-slate-400 hover:border-coop-azul hover:text-coop-azul'
								}`}>
								{idxSel === f._i && detalleVer ? 'Ocultar detalles' : 'Ver detalles'}
							</button>
						</td>
					</tr>
				))}
			</tbody>
		</table>
	)

	return (
		<div className='text-slate-800'>
			{/* ===== 1 · ELECCIÓN DE VERSIÓN ===== */}
			<div className='bg-white border border-slate-200 rounded-xl p-3'>
				<div className='flex items-center justify-between gap-2 mb-1'>
					<h3 className='text-sm font-semibold text-slate-700'>1 · Elección de versión de firmware</h3>
					<button onClick={recargar} disabled={cargando} className='text-[11px] text-slate-400 hover:text-coop-azul disabled:opacity-40'>
						{cargando ? 'Actualizando…' : '↻ Actualizar catálogo'}
					</button>
				</div>
				<p className='text-sm text-slate-500 mb-3'>
					Elegí el equipo y tocá una versión en la tabla. Acá aparecen solo las versiones <b>aprobadas por ingeniería</b> para Reconecta.
					{!cli.hayUsb && ' Este navegador no soporta puerto serie: usá Chrome/Edge (PC) o Chrome de Android.'}
				</p>
				{errorCatalogo && (
					<div className='border border-amber-200 bg-amber-50 text-amber-800 rounded-lg p-3 text-sm mb-2'>
						No se pudo leer el catálogo de firmwares: {errorCatalogo}
					</div>
				)}
				{!cargando && !errorCatalogo && grupos.length === 0 && (
					<div className='border border-slate-100 rounded-lg p-6 text-center text-sm text-slate-400'>
						Todavía no hay versiones aprobadas para Reconecta. Ingeniería las publica desde el Tablero.
					</div>
				)}
				{grupos.map((g) => (
					<details key={g.modelo} open className='border border-slate-100 rounded-lg mb-2 overflow-hidden'>
						<summary className='px-3 py-2 cursor-pointer select-none text-sm font-medium text-slate-700 hover:bg-slate-50'>
							{g.modelo}{' '}
							<span className='font-normal text-slate-400'>
								{g.chip ? `· ${CHIP_LABEL[g.chip]} ` : ''}· {g.releases.length} {g.releases.length === 1 ? 'versión' : 'versiones'}
							</span>
						</summary>
						<div className='overflow-x-auto border-t border-slate-100'>{tabla(g.releases)}</div>
					</details>
				))}
			</div>

			{/* Ficha de la versión: la tabla offset→archivo tal cual se grabará. */}
			{fwSel && detalleVer && (
				<div className='bg-white border border-slate-200 rounded-xl p-3 mt-3'>
					<div className='flex items-center justify-between flex-wrap gap-1 mb-1'>
						<p className='text-sm font-medium text-slate-700'>
							{fwSel.modelo} · {fwSel.version}
							{fwSel.nombre ? ` · ${fwSel.nombre}` : ''}
						</p>
						<span className='text-[11px] text-slate-400'>
							Chip: {CHIP_LABEL[fwSel.chip] || fwSel.chip} · flash {MODE_LABEL[fwSel.flash?.mode] || fwSel.flash?.mode} / {FREQ_LABEL[fwSel.flash?.freq] || fwSel.flash?.freq} /{' '}
							{fwSel.flash?.size}
						</span>
					</div>
					{fwSel.segmentos?.length > 0 && (
						<div className='bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 font-mono text-[10.5px] text-slate-600'>
							{fwSel.segmentos.map((sg, i) => (
								<div key={i} className='flex justify-between gap-2'>
									<span className='text-coop-azul shrink-0'>{sg.offset}</span>
									<span className='truncate'>{sg.nombre}</span>
									{sg.sha256 && (
										<span className='text-slate-400 shrink-0' title={`SHA-256: ${sg.sha256}`}>
											✓{sg.sha256.slice(0, 8)}
										</span>
									)}
								</div>
							))}
						</div>
					)}
				</div>
			)}

			{/* ===== 2 · MODO DE PROGRAMACIÓN ===== */}
			<div className='bg-white border border-slate-200 rounded-xl p-3 mt-3'>
				<h3 className='text-sm font-semibold text-slate-700 mb-2'>2 · Elección de modo de programación</h3>
				<div className='grid sm:grid-cols-2 gap-2'>
					<button
						onClick={() => programar(fwSel, 'actualizar')}
						disabled={!fwSel?.segmentos?.length || flasheando || !cli.hayUsb}
						className='px-4 py-3 text-sm font-medium bg-coop-naranja text-white rounded-xl hover:opacity-90 disabled:opacity-40'>
						{flasheando ? 'Programando…' : '⬆ Actualizar con la versión seleccionada (conserva config)'}
					</button>
					<button
						onClick={() => programar(fwSel, 'fabrica')}
						disabled={!fwSel?.merged?.key || flasheando || !cli.hayUsb}
						className='px-4 py-3 text-sm font-medium border border-red-300 text-red-600 rounded-xl hover:bg-red-50 disabled:opacity-40'>
						🏭 Volver a fábrica (borra TODO)
					</button>
				</div>
				<p className='text-[11px] text-slate-400 mt-1.5'>
					{!fwSel ? (
						'Seleccioná una versión en la tabla de arriba para habilitar los botones. Al tocar un botón el navegador te pide elegir el puerto USB de la placa.'
					) : (
						<>
							Versión seleccionada:{' '}
							<b className='text-slate-600'>
								{fwSel.modelo} · {fwSel.version}
								{fwSel.nombre ? ` · ${fwSel.nombre}` : ''}
							</b>
							{!fwSel.merged?.key ? ' — esta versión no incluye imagen de fábrica: solo actualización.' : ''}
						</>
					)}
				</p>
			</div>

			{/* ===== 3 · ESTADO ===== */}
			<div className='bg-white border border-slate-200 rounded-xl p-3 mt-3'>
				<h3 className='text-sm font-semibold text-slate-700 mb-2'>3 · Estado</h3>
				<div className='flex justify-between text-[11px] mb-0.5'>
					<span className={flashFin === 'ok' && !flasheando ? 'text-emerald-600 font-medium' : 'text-slate-500'}>
						{flashProg
							? `Programando — segmento ${flashProg.seg}/${flashProg.total}`
							: flasheando
								? 'Preparando programación…'
								: flashFin === 'ok'
									? '✓ Finalizado exitosamente'
									: 'Sin programación en curso'}
					</span>
					<span className={flashFin === 'ok' && !flasheando ? 'text-emerald-600 font-medium' : 'text-slate-500'}>
						{flashProg ? `${flashProg.pct}%` : flasheando ? '…' : flashFin === 'ok' ? '100%' : '—'}
					</span>
				</div>
				<div className='h-2.5 bg-slate-100 rounded-full overflow-hidden'>
					<div
						className={`h-full transition-all ${flashFin === 'ok' && !flasheando ? 'bg-emerald-500' : 'bg-coop-naranja'}`}
						style={{ width: flashFin === 'ok' && !flasheando ? '100%' : `${flashProg ? flashProg.pct : 0}%` }}
					/>
				</div>
				{eventos.length > 0 && (
					<details className='mt-2'>
						<summary className='text-[11px] text-slate-400 cursor-pointer select-none'>Últimas programaciones de la cooperativa</summary>
						<table className='w-full text-[11px] mt-1'>
							<tbody>
								{eventos.map((ev) => (
									<tr key={ev.id} className='border-t border-slate-100 text-slate-500'>
										<td className='px-1 py-0.5 whitespace-nowrap'>{fecha(ev.createdAt)}</td>
										<td className='px-1 py-0.5'>{ev.usuario || ''}</td>
										<td className='px-1 py-0.5'>
											{ev.tipo === 'flash' ? (ev.modo === 'fabrica' ? 'fábrica' : 'actualización') : 'configuración'}
										</td>
										<td className='px-1 py-0.5 whitespace-nowrap'>
											{ev.modelo} {ev.version}
										</td>
										<td className='px-1 py-0.5 font-mono'>{ev.mac || ev.nombre_equipo || ''}</td>
										<td className={`px-1 py-0.5 ${ev.resultado === 'ok' ? 'text-emerald-600' : 'text-red-500'}`}>{ev.resultado}</td>
									</tr>
								))}
							</tbody>
						</table>
					</details>
				)}
			</div>

			{/* ===== 4 · TERMINAL ===== */}
			<div className='bg-white border border-slate-200 rounded-xl p-3 mt-3'>
				<h3 className='text-sm font-semibold text-slate-700 mb-2'>4 · Modo avanzado: monitor del proceso de programación</h3>
				<Terminal cli={cli} altura='h-56' vacio='— Acá vas a ver el paso a paso de la programación —' />
				<p className='text-[11px] text-slate-400 mt-1.5'>
					La placa entra al bootloader por auto-reset (DTR/RTS), el chip se verifica ANTES de escribir y al terminar se reinicia sola a modo run. Si el CLI estaba conectado, se cierra solo.
				</p>
			</div>
		</div>
	)
}
