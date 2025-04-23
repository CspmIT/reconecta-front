import CardCustom from '../../../../components/CardCustom'
import GrafCorriente from './components/GrafCorriente'
import GrafTensionABC from './components/GrafTensionABC'
import TableInterruption from './components/TableInterruption'

const AnalyticsBoard = ({ idRecloser }) => {
	return (
		<div className='w-full'>
			<CardCustom className='mt-3 rounded-md p-2 border-t-8 h-96 border-blue-500 shadow-blue-500/55 shadow-[3px_3px_3px_2px]'>
				<GrafTensionABC idRecloser={idRecloser} />
			</CardCustom>
			<CardCustom className='mt-8 rounded-md p-2 border-t-8 h-96 border-blue-500 shadow-blue-500/55 shadow-[3px_3px_3px_2px]'>
				<GrafCorriente idRecloser={idRecloser} />
			</CardCustom>
			<CardCustom className='flex flex-col items-center mt-8 rounded-md p-4 border-t-8  border-blue-500 shadow-blue-500/55 shadow-[3px_3px_3px_2px]'>
				<h1 className='text-2xl mb-4'>Disparos de sobrecorriente</h1>
				<h1 className='text-xl mb-4'>En desarrollo...</h1>
			</CardCustom>
			<CardCustom className='w-full flex flex-col items-center mt-8 rounded-md p-4 border-t-8  border-blue-500 shadow-blue-500/55 shadow-[3px_3px_3px_2px]'>
				<TableInterruption idRecloser={idRecloser} />
			</CardCustom>
		</div>
	)
}

export default AnalyticsBoard
