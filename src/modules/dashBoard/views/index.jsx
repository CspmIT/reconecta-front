import { listen } from '@tauri-apps/api/event'
import GridLayout from 'react-grid-layout'
import '../../../../node_modules/react-grid-layout/css/styles.css'
import '../../../../node_modules/react-resizable/css/styles.css'
import { Suspense, lazy, useEffect, useState } from 'react'
import LoaderComponent from '../../../components/Loader'
import '../utils/styles.css'
import { Check, Edit } from '@mui/icons-material'
import { IconButton } from '@mui/material'
const componentMap = [
    {
        name: 'Gauges',
        link: () => import('../../core/components/GraficodePrueba/Gauges')
    },
    {
        name: 'GraficodePrueba',
        link: () => import('../../core/components/GraficodePrueba')
    },
    {
        name: 'GrafArea',
        link: () => import('../../core/components/GraficodePrueba/GrafArea')
    },
    {
        name: 'GrafBarra',
        link: () => import('../../core/components/GraficodePrueba/GrafBarra')
    },
    {
        name: 'TableDashboar',
        link: () => import('../../core/components/GraficodePrueba/TableDashboar')
    },
    {
        name: 'MapPrueba',
        link: () => import('../../map/components/MapPrueba/MapPrueba')
    }
]

function DashBoard() {
    const [graficos, setGraficos] = useState([])
    const [widthGraf, setWidthGraf] = useState(window.innerWidth - 100)
    const [numCol, setNumCol] = useState((window.innerWidth - 150) / 30)
    const [rowHeight, setRowHeight] = useState(window.innerHeight / 30)
    const [sizeCelu, setSizeCelu] = useState(window.innerHeight < 1050 ? true : false)
    const [dashboardStatic, setDashboardStatic] = useState(false)
    const [availableHandles, setAvailableHandles] = useState([])
    const [layoutCustom, setLayoutCustom] = useState([
        { i: 'GrafArea', x: 0, y: 0, w: sizeCelu ? 8 : 5, h: 5, minW: sizeCelu ? 8 : 5, minH: 5 },
        { i: 'GraficodePrueba', x: 8, y: 0, w: sizeCelu ? 8 : 5, h: 5, minW: sizeCelu ? 8 : 5, minH: 5 },
        { i: 'GrafBarra', x: 16, y: 0, w: sizeCelu ? 8 : 5, h: 5, minW: sizeCelu ? 8 : 5, minH: 5 },
        { i: 'Gauges', x: 24, y: 0, w: sizeCelu ? 8 : 7, h: 7, minW: sizeCelu ? 8 : 7, minH: 7 },
        { i: 'TableDashboar', x: 0, y: 5, w: sizeCelu ? 8 : 5, h: 12, minW: sizeCelu ? 8 : 5, minH: 11 },
        { i: 'MapPrueba', x: 40, y: 5, w: sizeCelu ? 8 : 5, h: 9, minW: sizeCelu ? 8 : 9, minH: 9 }
    ])

    useEffect(() => {
        setTimeout(() => {
            if (graficos.length === 0) {
                const componentes = componentMap.map((item) => {
                    return { componente: [lazy(item.link)], id: item.name }
                })
                setGraficos(componentes)
            }
        }, 1500)
    }, [componentMap])
    useEffect(() => {
        if (window.__TAURI__) {
            listen('tauri://resize', (event) => {
                const { width } = event.payload
                setWidthGraf(width - 100)
                setSizeCelu(false)
                // setNumCol(parseInt((width - 150) / 30))
                const newNumCol = parseInt((width - 150) / 30)
                setNumCol(newNumCol)
                const newLayout = layoutCustom.map((item) => {
                    return {
                        ...item,
                        w: Math.max(item.w + 2, 1)
                        // h: item.h - 1
                    }
                })
                const oldLayout = layoutCustom.map((item) => {
                    return {
                        ...item
                    }
                })
                setLayoutCustom(newLayout)
                setTimeout(() => {
                    setLayoutCustom(oldLayout)
                }, 200)
            })
        }
    }, [])
    useEffect(() => {
        if (!window.__TAURI__) {
            const updateSize = () => {
                setWidthGraf(window.innerWidth)
                let newNumCol = parseInt((window.innerWidth - 150) / 50)
                if (window.innerWidth > 1050) {
                    setSizeCelu(false)
                    setNumCol(newNumCol)
                    setRowHeight(window.innerHeight / 25)
                } else {
                    setSizeCelu(true)
                    setRowHeight(30)
                    setNumCol(10)
                }
                const newLayout = layoutCustom.map((item) => {
                    return {
                        ...item,
                        w: Math.max(item.w + 2, 1)
                        // h: item.h - 1
                    }
                })
                const oldLayout = layoutCustom.map((item) => {
                    return {
                        ...item
                    }
                })
                setLayoutCustom(newLayout)
                setTimeout(() => {
                    setLayoutCustom(oldLayout)
                }, 200)
            }
            window.addEventListener('resize', updateSize)
        }
    }, [])

    const editDashboard = () => {
        setDashboardStatic(!dashboardStatic)
        if (!dashboardStatic) {
            setAvailableHandles(['s', 'w', 'e', 'n', 'sw', 'nw', 'se', 'ne'])
        } else {
            setAvailableHandles([])
        }
    }
    const handleLayoutChange = (data) => {
        setLayoutCustom(data)
    }

    return (
        <>
            {graficos.length > 0 ? (
                <>
                    <IconButton className={`!absolute !top-5 !right-5 !p-3 !rounded-full !shadow-gray-400 shadow-md z-50 ${dashboardStatic ? '!bg-green-500' : '!bg-gray-300'}`} onClick={() => editDashboard()}>
                        {dashboardStatic ? <Check className='text-white font-bold ' /> : <Edit className='text-blue-500' />}
                    </IconButton>
                    <GridLayout onResizeStop={(data) => handleLayoutChange(data)} isDraggable={dashboardStatic} isResizable={dashboardStatic} resizeHandles={availableHandles} className='layout' hei layout={layoutCustom} cols={numCol} rowHeight={rowHeight} width={widthGraf}>
                        {graficos.map((item) => {
                            const Component = item.componente[0]
                            return (
                                <div className={'chartContainer  bg-white dark:bg-gray-300 rounded-lg shadow-gray-500 shadow-md drop-shadow-md p-3'} key={item.id}>
                                    <Suspense fallback={<div>Cargando...</div>}>
                                        <Component />
                                    </Suspense>
                                </div>
                            )
                        })}
                    </GridLayout>
                </>
            ) : (
                <div className='justify-center items-center flex w-full'>
                    <LoaderComponent />
                </div>
            )}
        </>
    )
}

export default DashBoard
