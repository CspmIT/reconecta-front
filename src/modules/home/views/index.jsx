import { useContext } from 'react'
import { MainContext } from '../../../context/MainContext'
import { useNavigate } from 'react-router-dom'
import Board from '../../recloser/views'
import AnalyzerBoard from '../../analyzer/board/views'
import BoardMeter from '../../meter/views'
import TabsHome from '../components/TabHome'
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
			/* case 2:
				component = <SubstationUrbanBoard />
				break
			case 3:
				component = <SubstationRuralBoard />
				break */
			case 3:
				component = <AnalyzerBoard />
				break
			default:
				break
		}
		return component
	}
	const newTabBoard = (data) => {
		const existingTabIndex = tabs.findIndex(
			(tab) => tab.name === data.name && tab.id === data.id
		)
		if (existingTabIndex !== -1) {
			setTabCurrent(existingTabIndex)
		} else {
			setTabs((prevTabs) => [
				...prevTabs,
				{
					name: data.serial,
					id: data.id,
					typeEquipment: data.equipmentmodels.type,
					link: '/board',
					component: typeEquipment(data.equipmentmodels.type),
				},
			])
			setTabCurrent(tabs.length)
		}
		navigate('/tabs')
	}
	return (
		<div className='flex flex-col w-full pt-4'>
			{!isMobile ? (
				<div className='flex flex-wrap gap-3 mb-5 px-3 max-sm:hidden'>
					<CardDashboard />
				</div>
			) : null}
			<TabsHome newTab={newTabBoard} />
		</div>
	)
}

export default Home
