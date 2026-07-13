import { FaArrowUp, FaArrowDown, FaPlug, FaExclamationTriangle } from 'react-icons/fa'
import QualitySection from './components/QualitySection'
import { formatterDataModal, formatterDataTable } from './utils/Js'
import {
	ColumnsTable as SurgeColumns,
	ColumnsTableModal as SurgeColumnsModal,
} from './components/Surge/utils/DataTable'
import {
	ColumnsTable as SubColumns,
	ColumnsTableModal as SubColumnsModal,
} from './components/Subtension/utils/DataTable'
import {
	ColumnsTable as CorteColumns,
	ColumnsTableModal as CorteColumnsModal,
} from './components/CorteTension/utils/DataTable'
import {
	ColumnsTable as InterColumns,
	ColumnsTableModal as InterColumnsModal,
} from './components/InterripcionTension/utils/DataTable'
import {
	formatterDataTable as interFormatterTable,
	formatterDataModal as interFormatterModal,
} from './components/InterripcionTension/utils/js/action'

function QualityTension({ info }) {
	const sections = [
		{
			key: 'sobre',
			title: 'Sobretensiones',
			Icon: FaArrowUp,
			iconClass: 'text-red-700',
			endpoint: '/getQualitySurge',
			summaryEndpoint: '/getQualitySurgeSummary',
			ColumnsTable: SurgeColumns,
			ColumnsTableModal: SurgeColumnsModal,
			formatTable: formatterDataTable,
			formatModal: formatterDataModal,
			phases: true,
		},
		{
			key: 'sub',
			title: 'Subtensiones',
			Icon: FaArrowDown,
			iconClass: 'text-amber-600',
			endpoint: '/getQualityUnderVoltage',
			summaryEndpoint: '/getQualityUnderVoltageSummary',
			ColumnsTable: SubColumns,
			ColumnsTableModal: SubColumnsModal,
			formatTable: formatterDataTable,
			formatModal: formatterDataModal,
			phases: true,
		},
		{
			key: 'cortes',
			title: 'Cortes de tensión',
			Icon: FaPlug,
			iconClass: 'text-gray-600 dark:text-zinc-300',
			endpoint: '/getQualityCourt',
			summaryEndpoint: '/getQualityCourtSummary',
			ColumnsTable: CorteColumns,
			ColumnsTableModal: CorteColumnsModal,
			formatTable: formatterDataTable,
			formatModal: formatterDataModal,
			phases: true,
		},
		{
			key: 'inter',
			title: 'Interrupciones de tensión',
			Icon: FaExclamationTriangle,
			iconClass: 'text-red-900 dark:text-red-400',
			endpoint: '/getQualityInterruption',
			summaryEndpoint: '/getQualityInterruptionSummary',
			ColumnsTable: InterColumns,
			ColumnsTableModal: InterColumnsModal,
			formatTable: interFormatterTable,
			// El resumen de interrupciones es global (no por fase): se mapea al accessor 'global'
			formatModal: async (data) =>
				(await interFormatterModal(data)).map((row) => ({ ...row, global: row.Fase1 })),
			phases: false,
		},
	]

	return (
		<div className='w-full'>
			<div className='flex items-baseline justify-between mb-4 flex-wrap gap-2'>
				<span className='text-lg font-medium'>Calidad de tensión (VQD)</span>
				<span className='text-xs italic text-gray-500 dark:text-zinc-300'>
					Resumen y antecedentes de los 4 tipos de eventos por fase
				</span>
			</div>
			{sections.map((config) => (
				<QualitySection key={config.key} info={info} config={config} />
			))}
		</div>
	)
}

export default QualityTension
