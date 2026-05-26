import { Tab, Tabs } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import { FaHistory, FaMapMarkedAlt, FaTools } from 'react-icons/fa'

import LoaderComponent from '../../../components/Loader'
import { MainContext } from '../../../context/MainContext'
import MaintenanceBoard from '../../Binnacle/components/MaintenanceBoard'
import { request } from '../../../utils/js/request'
import { backend } from '../../../utils/routes/app.routes'
import DataBoard from '../components/DataBoard'
import HistoryPat from '../components/HistoryPat'
import MapSubstation from '../components/Map'

const SECTION_TABS = [
	{ id: 1, name: 'MANTENIMIENTO', icon: <FaTools /> },
	{ id: 2, name: 'MAPA', icon: <FaMapMarkedAlt /> },
	{ id: 3, name: 'HISTORIAL PAT', icon: <FaHistory /> },
]

const SubstationRuralBoard = () => {
	const { tabCurrent, tabs } = useContext(MainContext)
	const [info, setInfo] = useState([])
	const [data] = useState(tabs[tabCurrent] || null)
	const [selectedTab, setSelectedTab] = useState(1)
	const [historyPatVersion, setHistoryPatVersion] = useState(0)
	const refreshHistoryPat = () => setHistoryPatVersion(v => v + 1)
	const loadData = async (data) => {
		if (!data) {
			Swal.fire({
				title: 'Atención!',
				html: `Hubo un problema con la carga de los datos de la subestación.</br>Intente nuevamente...`,
				icon: 'error',
			})
			navigate('/Home')
		} else {
			const response = await request(`${backend[`${import.meta.env.VITE_APP_NAME}`]}/Elements/${data.id}`, 'GET')
			setInfo(response.data)
		}
	}
	useEffect(() => {
		loadData(data)
	}, [data])

	const elemento = info[0]
	return (
		<div className='w-full flex flex-row justify-center text-black dark:text-white relative pr-3'>
			<div className='w-full h-min flex-row flex flex-wrap justify-between rounded-md bg-slate-50 dark:bg-gray-800 p-4 pb-8'>
				<div className='w-full items-center rounded-xl p-3 bg-gray-200 dark:bg-gray-600'>
					{info.length === 0 ? (
						<LoaderComponent />
					) : (
						<>
							<div className='flex flex-row relative justify-between mb-11'>
								<div className='flex-grow flex justify-center'>
									<h2 className='text-2xl'>Subestación Rural</h2>
								</div>
							</div>
							<DataBoard info={elemento} onPatSaved={refreshHistoryPat} />

							<div className='mt-6'>
								<Tabs
									value={selectedTab - 1}
									onChange={(_, v) => setSelectedTab(v + 1)}
									indicatorColor='primary'
									textColor='inherit'
									variant='scrollable'
									scrollButtons='auto'
									className='!border-b !border-gray-300 dark:!border-gray-700'
								>
									{SECTION_TABS.map((t) => (
										<Tab
											key={t.id}
											icon={t.icon}
											iconPosition='start'
											label={t.name}
											className='!text-black dark:!text-zinc-200 !font-bold'
										/>
									))}
								</Tabs>

								<div className='w-full bg-white dark:bg-zinc-500 rounded-b-md p-4'>
									{selectedTab === 1 && (
										<MaintenanceBoard
											idElement={elemento?.id || null}
											elementoNombre={elemento?.name || ''}
										/>
									)}
									{selectedTab === 2 && (
										<div className='h-96'>
											<MapSubstation element={elemento} />
										</div>
									)}
									{selectedTab === 3 && <HistoryPat key={historyPatVersion} info={elemento} />}
								</div>
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	)
}

export default SubstationRuralBoard
