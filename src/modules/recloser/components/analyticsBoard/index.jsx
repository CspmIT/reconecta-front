import { DateTimePicker, LocalizationProvider, renderTimeViewClock } from '@mui/x-date-pickers'
import CardCustom from '../../../../components/CardCustom'
import GrafCorriente from './components/GrafCorriente'
import GrafTensionABC from './components/GrafTensionABC'
import TableInterruption from './components/TableInterruption'
import { useState } from 'react'
import dayjs from 'dayjs'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

const AnalyticsBoard = ({ idRecloser }) => {
	const [checked, setChecked] = useState(true)
	const [dateCurrent, setDateCurrent] = useState(dayjs())
	const [dateStart, setDateStart] = useState(dayjs().subtract(2, 'hour'))
	const [search, setSearch] = useState(false)
	return (
		<div className='w-full'>
			<div className='w-full flex justify-center my-5'>
				<LocalizationProvider dateAdapter={AdapterDayjs}>
					<DateTimePicker
						className='bg-white dark:bg-slate-800'
						ampm={false}
						label="Fecha de inicio"
						format='DD/MM/YYYY HH:mm'
						viewRenderers={{
							hours: renderTimeViewClock,
							minutes: renderTimeViewClock,
							seconds: renderTimeViewClock,
						}}
						value={dateStart}
						onChange={(newValue) => {
							setDateStart(newValue)
						}}
					/>
					<DateTimePicker
						className='bg-white dark:bg-slate-800'
						label="Fecha de fin"
						ampm={false}
						format='DD/MM/YYYY HH:mm'
						viewRenderers={{
							hours: renderTimeViewClock,
							minutes: renderTimeViewClock,
							seconds: renderTimeViewClock,
						}}
						value={dateCurrent}
						onChange={(newValue) => {
							setDateCurrent(newValue)
						}}
					/>
				</LocalizationProvider>
				<div className='flex flex-col items-center px-3'>
					<b>Tiempo real</b>
					<input className='text-center w-5 h-5' type='checkbox' checked={checked} onChange={() => setChecked(prev => !prev)} />
				</div>
				<div className='flex flex-row items-center'>
					<button className='bg-blue-500 text-white rounded-lg px-4 py-2 ml-3' onClick={() => setSearch(!search)}>
						Filtrar
					</button>
				</div>
			</div>
			<CardCustom className='mt-3 rounded-md p-2 border-t-8 h-96 border-blue-500 shadow-blue-500/55 shadow-[3px_3px_3px_2px]'>
				<GrafTensionABC idRecloser={idRecloser} dateStart={dateStart} dateFinished={dateCurrent} search={search} realTime={checked} />
			</CardCustom>
			<CardCustom className='mt-8 rounded-md p-2 border-t-8 h-96 border-blue-500 shadow-blue-500/55 shadow-[3px_3px_3px_2px]'>
				<GrafCorriente idRecloser={idRecloser} dateStart={dateStart} dateFinished={dateCurrent} search={search} realTime={checked} />
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
