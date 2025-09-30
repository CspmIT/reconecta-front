import React, { useEffect, useState } from 'react'
import { request } from '../../../../utils/js/request'
import { backend } from '../../../../utils/routes/app.routes'

const HistoryPat = ({ info }) => {
    const [history, setHistory] = useState([])
    const getHistory = async () => {
        const { data } = await request(`${backend.Reconecta}/SubstationPat/${info.id}/0`, "GET")
        setHistory(data)
        console.log(data)
    }
    useEffect(() => {
        getHistory()
    }, [])
    return (
        <div>

        </div>
    )
}

export default HistoryPat