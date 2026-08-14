import { useEffect, useState } from 'react'
import { Button, Chip, MenuItem, Select, TextField } from '@mui/material'
import { MdLink, MdLinkOff, MdEdit } from 'react-icons/md'
import { request } from '../../../../utils/js/request'
import { backend } from '../../../../utils/routes/app.routes'
import { STATES } from '../../utils/js/states'

// Tipos de equipo que puede representar una entidad del plano
export const KINDS = {
	interruptor: 'Interruptor',
	reconectador: 'Reconectador',
	seccionador: 'Seccionador',
	fusible: 'Fusible',
	trafo: 'Transformador',
	set: 'SET',
	barra: 'Barra',
	capacitor: 'Banco de capacitores',
	medidor: 'Medidor',
	salida: 'Salida / alimentador',
	otro: 'Otro',
}

// Fuentes de datos en vivo a las que se puede vincular el equipo
const DEVICE_SOURCES = {
	recloser: { label: 'Reconectador', endpoint: 'getReclosersEnabled' },
	meter: { label: 'Medidor', endpoint: 'getMetersEnabled' },
	node: { label: 'Nodo', endpoint: 'getListNode' },
}

const deviceName = (item) =>
	item.name || item.serial || item.description || item.title || `#${item.id}`

const SectionTitle = ({ children }) => (
	<p className='text-xs font-bold tracking-widest text-gray-500 dark:text-gray-400 uppercase mt-4 mb-2'>
		{children}
	</p>
)

const StatCard = ({ value, label }) => (
	<div className='border border-gray-300 dark:border-gray-700 rounded-md p-2 flex-1 min-w-[45%]'>
		<p className='text-2xl font-bold text-black dark:text-white leading-none'>{value}</p>
		<p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>{label}</p>
	</div>
)

const SidePanel = ({ document, mapping, live = {}, selectedIds = [], onSaveMapping, events }) => {
	const [devices, setDevices] = useState({ recloser: [], meter: [], node: [] })
	const [form, setForm] = useState(null) // { kind, label, deviceType, deviceId }

	useEffect(() => {
		const base = backend[`${import.meta.env.VITE_APP_NAME}`]
		for (const [type, source] of Object.entries(DEVICE_SOURCES)) {
			request(`${base}/${source.endpoint}`, 'GET')
				.then(({ data }) => setDevices((d) => ({ ...d, [type]: Array.isArray(data) ? data : [] })))
				.catch(() => {})
		}
	}, [])

	const selectedEntities = document.entities.filter((e) => selectedIds.includes(e.id))
	const selected = selectedEntities[0] || null
	// Entrada de mapeo cuyo grupo contiene alguna entidad seleccionada
	const mappingKey = Object.keys(mapping).find((key) => {
		const members = mapping[key].entities?.length ? mapping[key].entities : [key]
		return members.some((id) => selectedIds.includes(id))
	})
	const link = mappingKey ? mapping[mappingKey] : null

	// Al cambiar la selección se cierra el formulario
	useEffect(() => setForm(null), [selectedIds])

	const startForm = () => {
		const textEntity = selectedEntities.find((e) => e.type === 'text')
		setForm(
			link || {
				kind: '',
				label: textEntity ? textEntity.lines.join(' ') : '',
				deviceType: '',
				deviceId: '',
			}
		)
	}

	const saveForm = () => {
		const device = form.deviceType ? devices[form.deviceType].find((d) => d.id === form.deviceId) : null
		onSaveMapping(mappingKey || selectedIds[0], {
			kind: form.kind || 'otro',
			label: form.label || KINDS[form.kind] || 'Equipo',
			deviceType: form.deviceType || null,
			deviceId: form.deviceId || null,
			deviceName: device ? deviceName(device) : null,
			entities: selectedIds,
		})
		setForm(null)
	}

	const mappedValues = Object.values(mapping)
	const countKinds = (kinds) => mappedValues.filter((m) => kinds.includes(m.kind)).length
	const liveValues = Object.values(live)
	const countStates = (states) => liveValues.filter((l) => states.includes(l.state)).length
	const selectedLive = mappingKey ? live[mappingKey] : null

	return (
		<div className='w-full sm:w-80 shrink-0 h-full overflow-y-auto border-l border-gray-300 dark:border-gray-700 pl-3'>
			<SectionTitle>Estado de la red</SectionTitle>
			<div className='flex flex-wrap gap-2'>
				<StatCard value={mappedValues.length} label='Equipos vinculados' />
				<StatCard value={countStates(['open'])} label='Aparatos abiertos' />
				<StatCard value={liveValues.filter((l) => l.alarm).length} label='Alarmas activas' />
				<StatCard value={countStates(['offline'])} label='Fuera de línea' />
			</div>

			<SectionTitle>Equipo seleccionado</SectionTitle>
			{!selected ? (
				<p className='text-sm text-gray-500 dark:text-gray-400'>
					Tocá un equipo del diagrama para ver su detalle y vincularlo.
				</p>
			) : form ? (
				<div className='flex flex-col gap-2'>
					<TextField
						size='small'
						label='Nombre / etiqueta'
						value={form.label}
						onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
					/>
					<Select
						size='small'
						displayEmpty
						value={form.kind}
						onChange={(e) => setForm((f) => ({ ...f, kind: e.target.value }))}
					>
						<MenuItem value=''>
							<em>Tipo de equipo…</em>
						</MenuItem>
						{Object.entries(KINDS).map(([key, label]) => (
							<MenuItem key={key} value={key}>
								{label}
							</MenuItem>
						))}
					</Select>
					<Select
						size='small'
						displayEmpty
						value={form.deviceType}
						onChange={(e) => setForm((f) => ({ ...f, deviceType: e.target.value, deviceId: '' }))}
					>
						<MenuItem value=''>
							<em>Sin datos en vivo</em>
						</MenuItem>
						{Object.entries(DEVICE_SOURCES).map(([key, source]) => (
							<MenuItem key={key} value={key}>
								{source.label}
							</MenuItem>
						))}
					</Select>
					{form.deviceType && (
						<Select
							size='small'
							displayEmpty
							value={form.deviceId}
							onChange={(e) => setForm((f) => ({ ...f, deviceId: e.target.value }))}
						>
							<MenuItem value=''>
								<em>Elegir {DEVICE_SOURCES[form.deviceType].label.toLowerCase()}…</em>
							</MenuItem>
							{devices[form.deviceType].map((d) => (
								<MenuItem key={d.id} value={d.id}>
									{deviceName(d)}
								</MenuItem>
							))}
						</Select>
					)}
					<div className='flex gap-2'>
						<Button size='small' variant='contained' onClick={saveForm}>
							Guardar
						</Button>
						<Button size='small' onClick={() => setForm(null)}>
							Cancelar
						</Button>
					</div>
				</div>
			) : link ? (
				<div className='flex flex-col gap-2'>
					<div className='flex items-center gap-2 flex-wrap'>
						<p className='text-xl font-bold text-black dark:text-white'>{link.label}</p>
						<Chip size='small' label={KINDS[link.kind] || link.kind} />
					</div>
					<div className='text-sm text-gray-600 dark:text-gray-300 flex flex-col gap-1'>
						<div className='flex justify-between'>
							<span className='text-gray-500 dark:text-gray-400'>Datos en vivo</span>
							<span>
								{link.deviceType
									? `${DEVICE_SOURCES[link.deviceType]?.label || link.deviceType} · ${link.deviceName || link.deviceId}`
									: 'Sin vincular'}
							</span>
						</div>
						{link.deviceType && (
							<div className='flex justify-between items-center'>
								<span className='text-gray-500 dark:text-gray-400'>Estado</span>
								{selectedLive?.state ? (
									<Chip
										size='small'
										color={STATES[selectedLive.state]?.chip || 'default'}
										label={STATES[selectedLive.state]?.label || selectedLive.state}
									/>
								) : (
									<span>{selectedLive?.error ? 'Sin datos' : '…'}</span>
								)}
							</div>
						)}
						{selectedLive?.values?.map((v) => (
							<div key={v.key} className='flex justify-between'>
								<span className='text-gray-500 dark:text-gray-400'>{v.key}</span>
								<span className='font-mono'>
									{v.value} {v.unit}
								</span>
							</div>
						))}
						{selectedLive?.error && (
							<p className='text-xs text-amber-600 dark:text-amber-400'>{selectedLive.error}</p>
						)}
					</div>
					<div className='flex gap-2'>
						<Button size='small' variant='outlined' startIcon={<MdEdit />} onClick={startForm}>
							Editar vínculo
						</Button>
						<Button
							size='small'
							color='error'
							startIcon={<MdLinkOff />}
							onClick={() => onSaveMapping(mappingKey, null)}
						>
							Quitar
						</Button>
					</div>
				</div>
			) : (
				<div className='flex flex-col gap-2'>
					<p className='text-sm text-gray-500 dark:text-gray-400'>
						{selectedIds.length === 1
							? `1 entidad seleccionada (${selected.type}), sin vincular.`
							: `${selectedIds.length} entidades seleccionadas, sin vincular.`}{' '}
						Shift+clic ajusta el grupo.
					</p>
					<Button size='small' variant='contained' startIcon={<MdLink />} onClick={startForm}>
						Vincular equipo
					</Button>
				</div>
			)}

			<SectionTitle>Registro de eventos</SectionTitle>
			<div className='flex flex-col gap-1 pb-4'>
				{events.length === 0 && <p className='text-sm text-gray-500 dark:text-gray-400'>Sin eventos.</p>}
				{events.map((event, i) => (
					<p key={i} className='text-sm text-gray-700 dark:text-gray-300'>
						<span className='font-mono text-xs text-gray-500 dark:text-gray-400 mr-2'>{event.time}</span>
						{event.text}
					</p>
				))}
			</div>
		</div>
	)
}

export default SidePanel
