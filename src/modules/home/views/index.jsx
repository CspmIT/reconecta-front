import { useContext } from 'react'
import { MainContext } from '../../../context/MainContext'
import { useNavigate } from 'react-router-dom'
import Board from '../../recloser/views'
import AnalyzerBoard from '../../analyzer/board/views'
import BoardMeter from '../../meter/views'
import TabsHome from '../components/TabHome'
import CardDashboard from '../components/CardDashboard/CardDashboard'
import { useMediaQuery } from '@mui/material'
import SubstationRuralBoard from '../../substationRural/views'

const Home = () => {
	const { tabs, setTabs, setTabCurrent } = useContext(MainContext)
	const isMobile = useMediaQuery('(max-width: 600px)')
	const navigate = useNavigate()
	const boardEquipment = (key) => {
		let component
		switch (key) {
			case 0:
				component = <SubstationRuralBoard />
				break
			case 1:
				component = <Board />
				break
			case 2:
				component = <BoardMeter />
				break
			/* case 2:
				component = <SubstationUrbanBoard />
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
		const name = data.elementType === 3 ? `${data.elementName}` :
			`${data.elementName} - ${data.observation ? data.observation : `${data.equipmentmodels.name} ${data.equipmentmodels.brand}`}`
		const typeEquipment = data.equipmentmodels?.type || 0
		const existingTabIndex = tabs.findIndex(
			(tab) => tab.id === data.id && tab.typeEquipment === typeEquipment
		)
		if (existingTabIndex !== -1) {
			setTabCurrent(existingTabIndex)
		} else {
			setTabs((prevTabs) => [
				...prevTabs,
				{
					name,
					id: data.id,
					equipmentId: data.equipmentmodels?.id,
					typeEquipment,
					clients: data.clients,
					link: '/board',
					component: boardEquipment(typeEquipment),
				},
			])
			setTabCurrent(tabs.length)
		}
		navigate('/tabs')
	}
	return (
		<div className='flex flex-col w-full pt-4'>
			{!isMobile && (
				<div className='flex flex-wrap gap-3 mb-5 px-3 max-sm:hidden'>
					<CardDashboard />
				</div>
			)}
			<TabsHome newTab={newTabBoard} />
		</div>
	)
}

export default Home
