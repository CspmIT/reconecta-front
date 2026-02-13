import React, { useEffect, useState } from 'react'
import { request } from '../../../../utils/js/request'
import { backend } from '../../../../utils/routes/app.routes'
import dayjs from 'dayjs'
import HistoryPatChart from './linechart'
import { DateTimePicker, LocalizationProvider, renderTimeViewClock } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

const HistoryPat = ({ info }) => {
    const [history, setHistory] = useState([])
    const [dateCurrent, setDateCurrent] = useState(null)
    const [dateStart, setDateStart] = useState(null)
    const getHistory = async () => {
        const body = { dateStart, dateCurrent, id: info.id }
        const { data } = await request(`${backend.Reconecta}/SubstationPatFilter`, "POST", body)
        if (data.length !== 0) {
            const dataGraph = {
                values: data.map(item => item.value),
                time: data.map(item => dayjs(item.createdAt).format("DD/MM/YYYY"))
            }
            setHistory(dataGraph)
        }
    }
    useEffect(() => {
        getHistory()
    }, [])
    return (
        <div className='bg-white dark:bg-slate-800 py-5'>
            <div className='w-full flex justify-center my-5 gap-5'>
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
                <div className='flex flex-row items-center'>
                    <button className='bg-blue-500 text-white rounded-lg px-4 py-2 ml-3' onClick={getHistory}>
                        Filtrar
                    </button>
                </div>
            </div>
            <div className='h-96'>
                {history.length !== 0 ? <HistoryPatChart values={history} title={"Históricos de puesta a tierra (PAT)"} /> :
                    <div className='w-full h-full flex items-center justify-center'>
                        <h2 className='text-2xl font-bold'>No se registran mediciones de PAT</h2>
                    </div>}
            </div>
        </div>
    )
}

export default HistoryPat