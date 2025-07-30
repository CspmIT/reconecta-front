import React, { useEffect, useState } from 'react'
import { request } from '../../../../utils/js/request'
import { backend } from '../../../../utils/routes/app.routes'
import SunburstChart from '../sunburstChart'
import LoaderComponent from '../../../../components/Loader'

const Graphic = ({ data }) => {
    const [graphicData, setGraphicData] = useState(data.tree)
    const [loading, setLoading] = useState(true)

    const getValueTopic = async (node) => {
        // Si el nodo tiene topic, traemos su valor
        if (node.topic) {
            try {
                const valueTopic = await request(`${backend.Reconecta}/AnalyzerMonths`, "POST", node.topic)
                const lastKey = Math.max(...Object.keys(valueTopic.data).map(Number))
                const lastEntry = valueTopic.data[lastKey]
                node.value = parseFloat(lastEntry.value) || 0
            } catch (err) {
                console.error("Error fetching topic data for", node.topic, err)
                node.value = 0
            }
        } else {
            node.value = 0
        }

        // Si tiene hijos, llamamos recursivamente
        if (Array.isArray(node.children)) {
            for (const child of node.children) {
                await getValueTopic(child)
                node.value += child.value || 0 // sumamos valores de hijos
            }
        }
    }

    useEffect(() => {
        const init = async () => {
            const clonedTree = JSON.parse(JSON.stringify(data.tree))
            await getValueTopic(clonedTree[0]) // asumimos un solo root
            setGraphicData(clonedTree)
            setLoading(false)
        }
        init()
    }, [])
    return (
        <div className='md:w-1/2 w-full h-screen'>
            <h1 className='mt-5 font-bold text-2xl'>{data.name}</h1>
            {loading ? <LoaderComponent /> :
                <>
                    <h2 className='text-center'>Total: {`${graphicData[0].value} ${data.unit}`} </h2>
                    <SunburstChart data={graphicData} unit={data.unit} />
                </>
            }
        </div>
    )
}

export default Graphic