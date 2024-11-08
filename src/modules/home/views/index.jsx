import { useContext, useState } from 'react'
import TableRecloser from '../components/Tables/TableRecloser'
import { MainContext } from '../../../context/MainContext'
import { useNavigate } from 'react-router-dom'
import Board from '../../recloser/board/views'
import AnalyzerBoard from '../../analyzer/board/views'
import BoardMeter from '../../meter/views'
import SubstationUrbanBoard from '../../substationUrban/views'
import TabsHome from '../components/TabHome'
import TableSubStationUrban from '../components/Tables/TableSubStationUrban'
import TableSubStationRural from '../components/Tables/TableSubStationRural'
import TableMeter from '../components/Tables/TableMeter'
import TableAnalyzer from '../components/Tables/TableAnalyzer'
import SubstationRuralBoard from '../../substationRural/views'
import TableNodo from '../components/Tables/TableNodo'
import CardDashboard from '../components/CardDashboard/CardDashboard'
import { useMediaQuery } from '@mui/material'

const Home = () => {
	const { tabs, setTabs, setTabCurrent } = useContext(MainContext)
	const isMobile = useMediaQuery('(max-width: 600px)')
	const navigate = useNavigate()
	const typeEquipment = (key) => {
		let component
		switch (key) {
			case 1:
				component = <Board />
				break
			case 2:
				component = <BoardMeter />
				break
			case 3:
				component = <SubstationUrbanBoard />
				break
			case 5:
				component = <SubstationRuralBoard />
				break
			case 4:
				component = <AnalyzerBoard />
				break
			default:
				break
		}
		return component
	}
	const newTabBoard = (data) => {
		const existingTabIndex = tabs.findIndex((tab) => tab.name === data.name && tab.id === data.id)
		if (existingTabIndex !== -1) {
			setTabCurrent(existingTabIndex)
		} else {
			setTabs((prevTabs) => [
				...prevTabs,
				{
					name: data.name,
					id: data.id,
					link: '/board',
					component: typeEquipment(data.type_recloser),
				},
			])
			setTabCurrent(tabs.length)
		}
		navigate('/tabs')
	}
	const tabsHome = [
		{
			id: 1,
			title: 'Reconectadores',
			component: <TableRecloser newTab={newTabBoard} />,
		},
		{
			id: 4,
			title: 'Medidores',
			component: <TableMeter newTab={newTabBoard} />,
		},
		{
			id: 2,
			title: 'Sub Estación Urbana',
			component: <TableSubStationUrban newTab={newTabBoard} />,
		},
		{
			id: 3,
			title: 'Sub Estación Rural',
			component: <TableSubStationRural newTab={newTabBoard} />,
		},
		{
			id: 5,
			title: 'Analizador de red',
			component: <TableAnalyzer newTab={newTabBoard} />,
		},
		{
			id: 6,
			title: 'Nodos',
			component: <TableNodo />,
		},
	]
	return (
		<div className='flex flex-col w-full pt-4'>
			{!isMobile ? (
				<div className='flex flex-wrap gap-3 mb-5 px-3 max-sm:hidden'>
					<CardDashboard />
				</div>
			) : null}
			<TabsHome tabs={tabsHome} />
		</div>
	)
}

export default Home
