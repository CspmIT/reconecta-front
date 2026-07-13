import { Button } from '@mui/material'
import { FaEdit, FaRedo, FaInfoCircle } from 'react-icons/fa'

// Umbral (en secundario) para considerar una fase con tensión
const UMIN = 10

const OCTAGON =
	'polygon(29.3% 0,70.7% 0,100% 29.3%,100% 70.7%,70.7% 100%,29.3% 100%,0 70.7%,0 29.3%)'

// Convención del MEDIDOR: EN SERVICIO = verde, FUERA = rojo, DESCONOCIDO = amarillo
const STATUS_STYLE = {
	on: { bg: 'bg-green-500', text: 'text-green-700' },
	partial: { bg: 'bg-amber-500', text: 'text-amber-700' },
	off: { bg: 'bg-red-500', text: 'text-red-700' },
	unk: { bg: 'bg-yellow-500', text: 'text-yellow-700' },
}

export const getEnergyStatus = (vi) => {
	const phases = [vi?.V_0?.value, vi?.V_1?.value, vi?.V_2?.value].map((v) => parseFloat(v))
	if (phases.every((v) => isNaN(v))) {
		return { key: 'unk', label: 'DESCONOCIDO', sub: 'Sin datos del medidor' }
	}
	const active = phases.map((v) => !isNaN(v) && v >= UMIN)
	const activeCount = active.filter(Boolean).length
	if (activeCount === 3) return { key: 'on', label: 'EN SERVICIO', sub: '3 fases activas' }
	if (activeCount === 0)
		return { key: 'off', label: 'FUERA DE SERVICIO', sub: 'Sin tensión en las 3 fases' }
	const missing = active
		.map((ok, i) => (!ok ? i + 1 : null))
		.filter(Boolean)
		.join(' y ')
	return { key: 'partial', label: 'SERVICIO PARCIAL', sub: `Falta tensión en fase ${missing}` }
}

function StatusCircle({ status }) {
	const style = STATUS_STYLE[status.key]
	return (
		<div
			className='flex flex-col items-center gap-1.5 select-none cursor-help'
			title='EN SERVICIO: tensión en las 3 fases · SERVICIO PARCIAL: falta tensión en 1 o 2 fases · FUERA DE SERVICIO: sin tensión · DESCONOCIDO: sin datos'
		>
			<div
				className={`relative w-44 h-44 flex items-center justify-center drop-shadow-lg ${style.bg}`}
				style={{ clipPath: OCTAGON }}
			>
				<div
					className='absolute inset-5 bg-white dark:bg-zinc-700'
					style={{ clipPath: OCTAGON }}
				/>
				<div className={`relative z-10 text-center px-6 ${style.text}`}>
					<p className='font-bold text-base leading-tight'>{status.label}</p>
					<p className='text-xs font-medium text-zinc-600 dark:text-zinc-300 mt-1'>{status.sub}</p>
				</div>
			</div>
		</div>
	)
}

function Indicator({ color, children }) {
	return (
		<div className='flex items-center gap-2.5 text-base'>
			<span className={`w-3.5 h-3.5 rounded-full flex-shrink-0 ${color}`} />
			<span>{children}</span>
		</div>
	)
}

const fmt = (value, decimals = 2) => {
	const num = parseFloat(value)
	if (isNaN(num)) return 'sin datos'
	return num.toLocaleString('es-AR', { maximumFractionDigits: decimals })
}

function MainCard({ info, vi, energy, power, onRefresh, onEdit }) {
	const status = getEnergyStatus(vi)
	const online = status.key !== 'unk'

	// KPI de energía: se muestra la mayor entre importada y exportada (una domina en la práctica).
	// Es el ACUMULADOR DE VIDA del medidor, no la energía del período — no confundir (auditoría D1).
	const impE = parseFloat(energy?.IAcE_3?.value)
	const expE = parseFloat(energy?.EAcE_3?.value)
	const showExp = !isNaN(expE) && (isNaN(impE) || expE > impE)
	// Demanda máxima por tarifa (mes en curso): /status/P_imp campos DeM_Ta_0..5
	// (pares valor/fecha: Resto, Pico, Valle)
	const dmax = (valueKey, dateKey, tarifa, obis) => ({
		title: `Demanda máx. ${tarifa}`,
		value: `${fmt(power?.[valueKey]?.value)} kW`,
		sub: power?.[dateKey]?.value ?? '',
		obis,
		tip: 'Máxima del período en curso (/status/P_imp)',
	})
	const kpis = [
		showExp
			? {
					title: 'Energía exportada',
					value: `${fmt(expE)} kWh`,
					obis: '1.1.2.8.0.255',
					tip: 'Acumulador de vida del medidor, no es la energía del período',
			  }
			: {
					title: 'Energía importada',
					value: `${fmt(impE)} kWh`,
					obis: '1.1.1.8.0.255',
					tip: 'Acumulador de vida del medidor, no es la energía del período',
			  },
		dmax('DeM_Ta_0', 'DeM_Ta_1', 'Resto', '0.0.98.133.61.255'),
		dmax('DeM_Ta_2', 'DeM_Ta_3', 'Pico', '0.0.98.133.62.255'),
		dmax('DeM_Ta_4', 'DeM_Ta_5', 'Valle', '0.0.98.133.63.255'),
		{ title: 'Frecuencia', value: `${fmt(vi?.F?.value)} Hz`, obis: '1.1.14.7.0.255' },
	]

	const props = [
		['Nombre', info?.elements?.name ?? info?.name],
		['Nro de serie', info?.serial],
		['Marca', info?.brand],
		['Versión', info?.version],
		['Configuración', info?.configuration === 1 ? 'Estandar' : 'Especial'],
	]

	return (
		<div className='w-full relative bg-gray-200 dark:bg-zinc-600 rounded-2xl px-8 pt-6 pb-7 shadow'>
			<div className='absolute top-3.5 right-3.5 flex gap-2'>
				<Button onClick={onRefresh} variant='contained' size='small' title='Recargar Datos'>
					<FaRedo />
				</Button>
				<Button
					onClick={onEdit}
					color='warning'
					variant='contained'
					size='small'
					title='Editar Medidor'
				>
					<FaEdit />
				</Button>
			</div>

			<h2 className='text-3xl font-normal text-center mb-4'>
				{info?.elements?.name ?? info?.name}
				{info?.observation ? ` — ${info.observation}` : ''}
			</h2>

			<div className='grid grid-cols-1 md:grid-cols-3 gap-6 items-center'>
				{/* Propiedades */}
				<div className='text-base leading-8'>
					{props.map(([k, v]) => (
						<div key={k}>
							<span className='text-gray-600 dark:text-zinc-300'>{k}:</span>{' '}
							<b className='text-gray-900 dark:text-zinc-100'>{v ?? '—'}</b>
						</div>
					))}
					<div className='text-xs text-gray-500 dark:text-zinc-300 mt-1'>
						Último registro: <b>{vi?.Date?.value ?? info?.Date ?? '—'}</b>
					</div>
				</div>

				{/* Estado de energía */}
				<div className='flex justify-center'>
					<StatusCircle status={status} />
				</div>

				{/* Indicadores */}
				<div className='flex flex-col gap-3 pl-2'>
					<Indicator color={online ? 'bg-green-500' : 'bg-red-500'}>
						{online ? 'Online' : 'Offline'}
					</Indicator>
					<div className='text-xs text-gray-600 dark:text-zinc-300 -mt-2 ml-6'>
						Hora del medidor:{' '}
						<span className='font-semibold cursor-help' title='OBIS 0.0.1.0.0.255'>
							{vi?.Date?.value ?? '—'}
						</span>
					</div>
					{(() => {
						// Batería sana ~3,2 V; por debajo de 3,0 V se marca en alerta
						const bat = parseFloat(vi?.Bat_0?.value)
						const batLow = !isNaN(bat) && bat < 3.0
						return (
							<Indicator color={isNaN(bat) ? 'bg-gray-400' : batLow ? 'bg-red-500' : 'bg-green-500'}>
								<span
									className={`cursor-help ${batLow ? 'text-red-600 dark:text-red-400 font-semibold' : ''}`}
									title={`OBIS 0.0.96.6.3.255${batLow ? ' · Tensión de batería baja (sana ~3,2 V)' : ''}`}
								>
									Batería: {fmt(vi?.Bat_0?.value, 2)} V
								</span>
							</Indicator>
						)
					})()}
					<Indicator color='bg-gray-400'>Alarmas</Indicator>
					{info?.Dif_Time !== undefined && (
						<div className='text-xs text-gray-600 dark:text-zinc-300 ml-6'>
							Diferencia de hora: <span className='font-semibold'>{info.Dif_Time}</span>
						</div>
					)}
				</div>
			</div>

			{/* KPIs */}
			<div className='grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-2.5 mt-5'>
				{kpis.map((kpi) => (
					<div
						key={kpi.title}
						className='bg-white dark:bg-zinc-700 border border-gray-200 dark:border-zinc-500 rounded-xl px-4 py-3 text-sm text-gray-600 dark:text-zinc-300 shadow-sm cursor-help'
						title={[`OBIS ${kpi.obis}`, kpi.tip].filter(Boolean).join(' · ')}
					>
						{kpi.title}
						<b className='block text-lg text-gray-900 dark:text-zinc-100 mt-1.5'>{kpi.value}</b>
						{kpi.sub && (
							<span className='block text-[11px] text-gray-500 dark:text-zinc-400 mt-0.5'>
								{kpi.sub}
							</span>
						)}
					</div>
				))}
			</div>
		</div>
	)
}

export default MainCard
