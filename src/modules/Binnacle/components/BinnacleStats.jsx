import { FaCheckCircle, FaClipboardList, FaExclamationTriangle, FaSpinner } from 'react-icons/fa'
import CardCustom from '../../../components/CardCustom'

// Tarjetas de KPI para el header del listado.
function StatCard({ icon, label, value, detail, color }) {
	return (
		<CardCustom className='flex-1 min-w-[180px] p-4 rounded-md text-black flex items-center gap-3'>
			<div className={`p-3 rounded-full text-white ${color}`}>{icon}</div>
			<div className='flex flex-col leading-tight'>
				<span className='text-xs uppercase tracking-wide text-gray-500'>{label}</span>
				<span className='text-2xl font-semibold'>{value ?? '—'}</span>
				{detail && <span className='text-xs text-gray-500'>{detail}</span>}
			</div>
		</CardCustom>
	)
}

export default function BinnacleStats({ stats }) {
	return (
		<div className='w-full flex flex-wrap gap-3'>
			<StatCard
				icon={<FaClipboardList size={18} />}
				color='bg-blue-600'
				label='Órdenes este mes'
				value={stats?.totalMes}
				detail='Periodo actual'
			/>
			<StatCard
				icon={<FaSpinner size={18} />}
				color='bg-yellow-600'
				label='En curso'
				value={stats?.enCurso}
				detail='Requieren seguimiento'
			/>
			<StatCard
				icon={<FaCheckCircle size={18} />}
				color='bg-green-600'
				label='Completadas (30 días)'
				value={stats?.completadasMes}
				detail={stats?.variacionCompletadas ? `${stats.variacionCompletadas} vs. mes anterior` : ''}
			/>
			<StatCard
				icon={<FaExclamationTriangle size={18} />}
				color='bg-red-600'
				label='Vencidas'
				value={stats?.vencidas}
				detail='Requieren atención'
			/>
		</div>
	)
}
