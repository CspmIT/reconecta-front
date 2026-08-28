import { useEffect, useRef, useState } from 'react'
import { Button, Checkbox, Chip, FormControlLabel, ListSubheader, MenuItem, Select, TextField } from '@mui/material'
import { MdRotate90DegreesCcw, MdContentCopy, MdDelete, MdLabel } from 'react-icons/md'
import { CATALOG } from '../../utils/js/catalog'
import { aguasAbajo, resumen } from '../../utils/js/topology'

// Panel lateral: estado de la red, detalle del elemento y registro.
//
// Cambia de cara según el modo. En OPERAR sólo se puede mirar y maniobrar; en
// EDITAR aparecen los campos del elemento y el vínculo con el equipo. Separar
// los dos modos es lo que evita que operar y editar se pisen: una maniobra y
// un cambio de nombre no tienen por qué convivir en la misma pantalla.
//
// La maniobra es de DOS PASOS con vencimiento: es una orden sobre un aparato de
// una estación real y un clic suelto no puede alcanzar.

const ARMADO_MS = 10000

const EQUIPMENT_TYPES = { 1: 'Reconectadores', 2: 'Medidores', 3: 'Analizadores de red' }

const equipmentLabel = (equipment) => {
	const lugar = equipment?.elements?.name
	const serie = equipment?.serial
	if (lugar && serie) return `${lugar} · ${serie}`
	return lugar || serie || `#${equipment?.id}`
}

const Kpi = ({ valor, de, texto, tono }) => (
	<div className="rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2">
		<b className={`block text-xl font-mono ${tono || 'text-gray-900 dark:text-gray-100'}`}>
			{valor}
			{de != null && <span className="text-sm text-gray-500">/{de}</span>}
		</b>
		<span className="block text-[11px] text-gray-500 dark:text-gray-400 mt-1 leading-tight">{texto}</span>
	</div>
)

const Fila = ({ children }) => (
	<tr className="border-b border-gray-200 dark:border-gray-700 last:border-0">{children}</tr>
)

const ModelPanel = ({
	modelo, estado, live = {}, seleccion, modo,
	equipments = [], eventos = [],
	onManiobra, onEditar, onGirar, onDuplicar, onBorrar, onEvento,
}) => {
	const [armado, setArmado] = useState(null)
	const temporizador = useRef(null)

	const el = seleccion ? modelo.elementos.find((e) => e.id === seleccion) : null
	const def = el ? CATALOG[el.tipo] : null
	const datos = el ? live[el.id] : null

	useEffect(() => {
		clearTimeout(temporizador.current)
		if (!armado) return
		temporizador.current = setTimeout(() => {
			setArmado(null)
			onEvento?.('', 'Armado vencido')
		}, ARMADO_MS)
		return () => clearTimeout(temporizador.current)
	}, [armado, onEvento])

	// Cambiar de elemento desarma: lo armado era para el anterior.
	useEffect(() => setArmado(null), [seleccion])

	const r = resumen(modelo, estado)
	const conTension = el && (el.t || []).some((n) => estado.energizados.has(n))
	const abajo = el && modo === 'operar' ? aguasAbajo(modelo, el, estado) : new Set()
	const cargasAbajo = [...abajo].filter((id) => {
		const x = modelo.elementos.find((e) => e.id === id)
		return CATALOG[x?.tipo]?.term === 1 && !CATALOG[x?.tipo]?.fuente
	}).length

	const equipmentsByType = Object.entries(EQUIPMENT_TYPES)
		.map(([type, label]) => ({
			type: Number(type),
			label,
			items: equipments.filter(
				(e) => e.equipmentmodels?.type === Number(type) && e.status !== false && e.status !== 0
			),
		}))
		.filter((g) => g.items.length)

	return (
		<div className="w-full sm:w-80 shrink-0 flex flex-col gap-3 overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#171d24] p-3 text-gray-700 dark:text-gray-200">
			<div>
				<p className="text-[11px] font-bold tracking-widest text-gray-500 dark:text-gray-500 uppercase mb-2">Estado de la red</p>
				<div className="grid grid-cols-2 gap-2">
					<Kpi valor={r.cargas - r.cargasSinTension} de={r.cargas} texto="Salidas con tensión" />
					<Kpi valor={r.cargasSinTension} texto="Salidas sin tensión" tono={r.cargasSinTension ? 'text-red-600 dark:text-red-400' : ''} />
					<Kpi valor={r.abiertos} texto="Aparatos abiertos" tono={r.abiertos ? 'text-amber-600 dark:text-amber-400' : ''} />
					<Kpi valor={r.sinConectar} texto="Sin conectar" tono={r.sinConectar ? 'text-fuchsia-600 dark:text-fuchsia-400' : ''} />
				</div>
			</div>

			<div className="border-t border-gray-200 dark:border-gray-700 pt-3">
				<p className="text-[11px] font-bold tracking-widest text-gray-500 dark:text-gray-500 uppercase mb-2">
					{modo === 'editar' ? 'Elemento' : 'Equipo seleccionado'}
				</p>

				{!el ? (
					<p className="text-sm text-gray-500 dark:text-gray-400">
						{modo === 'editar'
							? 'Elegí un símbolo de la paleta y tocá el plano, o seleccioná un elemento para editarlo.'
							: 'Tocá un elemento del diagrama para ver su detalle y operarlo.'}
					</p>
				) : (
					<>
						<div className="flex items-baseline gap-2 flex-wrap mb-2">
							<b className="text-lg">{el.nombre || el.id}</b>
							<em className="not-italic text-[11px] uppercase tracking-wide text-gray-500 dark:text-gray-500">
								{def?.nom || el.tipo}
							</em>
						</div>

						{modo === 'editar' ? (
							<div className="flex flex-col gap-2">
								<TextField
									size="small" label="Nombre" value={el.nombre || ''}
									onChange={(ev) => onEditar(el.id, { nombre: ev.target.value })}
								/>
								<TextField
									size="small" label="Descripción" value={el.sub || ''}
									onChange={(ev) => onEditar(el.id, { sub: ev.target.value })}
								/>
								<div className="flex gap-2">
									<Select
										size="small" className="flex-1" value={el.nivel ?? 13.2}
										onChange={(ev) => onEditar(el.id, { nivel: Number(ev.target.value) })}
									>
										<MenuItem value={13.2}>13,2 kV</MenuItem>
										<MenuItem value={132}>132 kV</MenuItem>
									</Select>
									{def?.maniobra && (
										<Select
											size="small" className="flex-1" value={el.estado || 'cerrado'}
											onChange={(ev) => onEditar(el.id, { estado: ev.target.value })}
										>
											<MenuItem value="cerrado">Cerrado</MenuItem>
											<MenuItem value="abierto">Abierto</MenuItem>
										</Select>
									)}
								</div>

								<Select
									size="small" displayEmpty value={el.equipmentId || ''}
									onChange={(ev) => {
										const equipment = equipments.find((q) => q.id === ev.target.value)
										onEditar(el.id, {
											equipmentId: ev.target.value || null,
											// Se guarda el nombre además del id para poder mostrar el
											// vínculo sin esperar a que llegue la lista de equipos.
											equipmentName: equipment ? equipmentLabel(equipment) : null,
										})
									}}
								>
									<MenuItem value=""><em>Sin datos en vivo</em></MenuItem>
									{equipmentsByType.flatMap((grupo) => [
										<ListSubheader key={`g${grupo.type}`}>{grupo.label}</ListSubheader>,
										...grupo.items.map((q) => (
											<MenuItem key={q.id} value={q.id}>{equipmentLabel(q)}</MenuItem>
										)),
									])}
								</Select>

								<div className="flex gap-1.5 flex-wrap">
									<Button size="small" variant="outlined" startIcon={<MdRotate90DegreesCcw />} onClick={() => onGirar(el.id)}>
										Girar
									</Button>
									<Button size="small" variant="outlined" startIcon={<MdLabel />}
										onClick={() => {
											const lados = ['der', 'abajo', 'izq', 'arriba']
											onEditar(el.id, { lbl: lados[(lados.indexOf(el.lbl || 'der') + 1) % 4] })
										}}
									>
										Rótulo
									</Button>
									<Button size="small" variant="outlined" startIcon={<MdContentCopy />} onClick={() => onDuplicar(el.id)}>
										Duplicar
									</Button>
									<Button size="small" variant="outlined" color="error" startIcon={<MdDelete />} onClick={() => onBorrar(el.id)}>
										Borrar
									</Button>
								</div>
								<p className="text-[11px] text-gray-500 dark:text-gray-500 leading-snug">
									Arrastrá el símbolo para moverlo. Arrastrá un nodo violeta y soltalo sobre
									otro para unirlos.
								</p>
							</div>
						) : (
							<>
								<table className="w-full text-sm">
									<tbody>
										<Fila>
											<td className="py-1 text-gray-500 dark:text-gray-400">Estado</td>
											<td className="py-1 text-right">
												{def?.maniobra ? (
													<Chip size="small" color={el.estado === 'cerrado' ? 'success' : 'warning'}
														label={el.estado === 'cerrado' ? 'Cerrado' : 'Abierto'} />
												) : (
													<Chip size="small" color={conTension ? 'success' : 'default'}
														label={conTension ? 'Con tensión' : 'Sin tensión'} />
												)}
											</td>
										</Fila>
										<Fila>
											<td className="py-1 text-gray-500 dark:text-gray-400">Datos en vivo</td>
											<td className="py-1 text-right text-xs">
												{el.equipmentId ? el.equipmentName || `#${el.equipmentId}` : 'Sin vincular'}
											</td>
										</Fila>
										{def?.maniobra && (
											<Fila>
												<td className="py-1 text-gray-500 dark:text-gray-400">Aguas abajo</td>
												<td className="py-1 text-right font-mono">
													{abajo.size} elementos · {cargasAbajo} salidas
												</td>
											</Fila>
										)}
										{datos?.values?.map((v) => (
											<Fila key={v.key}>
												<td className="py-1 text-gray-500 dark:text-gray-400">{v.key}</td>
												<td className="py-1 text-right font-mono">{v.value} {v.unit}</td>
											</Fila>
										))}
									</tbody>
								</table>
								{datos?.error && <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">{datos.error}</p>}

								{def?.maniobra && (
									<div className="mt-3">
										{el.loto ? (
											<p className="text-xs leading-snug text-amber-800 dark:text-amber-400 bg-amber-50 dark:bg-amber-950 border border-amber-400 dark:border-amber-600 rounded-md px-3 py-2 mb-2">
												Equipo con bloqueo de seguridad. Quitá el bloqueo para habilitar la maniobra.
											</p>
										) : armado === el.id ? (
											<p className="text-xs leading-snug text-amber-800 dark:text-amber-400 bg-amber-50 dark:bg-amber-950 border border-amber-400 dark:border-amber-600 rounded-md px-3 py-2 mb-2">
												Maniobra armada. Confirmá dentro de 10 s o se cancela sola.
											</p>
										) : null}
										<Button
											fullWidth
											variant={armado === el.id ? 'contained' : 'outlined'}
											color={armado === el.id ? 'warning' : 'primary'}
											disabled={!!el.loto}
											onClick={() => {
												if (armado === el.id) {
													setArmado(null)
													onManiobra(el)
												} else setArmado(el.id)
											}}
										>
											{armado === el.id
												? `Confirmar ${el.estado === 'cerrado' ? 'apertura' : 'cierre'}`
												: `${el.estado === 'cerrado' ? 'Abrir' : 'Cerrar'} ${el.nombre || el.id}`}
										</Button>
										<p className="text-[11px] text-gray-500 dark:text-gray-500 mt-1 leading-snug">
											{armado === el.id
												? 'Segundo paso: la orden se envía recién al confirmar.'
												: 'Seleccionar y confirmar: la maniobra necesita dos pasos.'}
										</p>
										<FormControlLabel
											control={
												<Checkbox size="small" checked={!!el.loto}
													onChange={(ev) => {
														onEditar(el.id, { loto: ev.target.checked })
														if (ev.target.checked) setArmado(null)
														onEvento?.(ev.target.checked ? 'maniobra' : 'rest',
															`${ev.target.checked ? 'Bloqueo aplicado' : 'Bloqueo retirado'} en ${el.nombre || el.id}`)
													}}
												/>
											}
											label={<span className="text-xs">Bloqueo de seguridad (LOTO)</span>}
										/>
									</div>
								)}
							</>
						)}
					</>
				)}
			</div>

			<div className="border-t border-gray-200 dark:border-gray-700 pt-3 flex-1 min-h-0 flex flex-col">
				<p className="text-[11px] font-bold tracking-widest text-gray-500 dark:text-gray-500 uppercase mb-2">Registro</p>
				<ul className="flex-1 overflow-y-auto text-xs space-y-1 m-0 p-0 list-none">
					{eventos.length === 0 && <li className="text-gray-500 dark:text-gray-600">Sin movimientos.</li>}
					{eventos.map((ev, i) => (
						<li key={i} className="flex gap-2 border-b border-gray-200 dark:border-gray-700 pb-1">
							<time className="font-mono text-gray-500 dark:text-gray-600 shrink-0">{ev.time}</time>
							<span className={
								ev.kind === 'alarma' ? 'text-red-600 dark:text-red-400'
									: ev.kind === 'maniobra' ? 'text-blue-600 dark:text-blue-400'
										: ev.kind === 'rest' ? 'text-green-700 dark:text-green-400' : ''
							}>{ev.text}</span>
						</li>
					))}
				</ul>
			</div>
		</div>
	)
}

export default ModelPanel
