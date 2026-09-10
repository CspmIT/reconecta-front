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
import { DashboardFilterProvider } from '../context/DashboardFilterContext'

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
	/*
	 * El provider envuelve al panel Y a la tabla porque son hermanos: al tocar una
	 * tarjeta la tabla queda filtrada por ese indicador (ver
	 * DashboardFilterContext).
	 *
	 * El panel arma su propia franja —veredicto, rejilla y cartel de filtro—, asi
	 * que aca solo va el margen.
	 */
	return (
		<DashboardFilterProvider>
			<div className='flex flex-col w-full pt-4'>
				{!isMobile && (
					<div className='mb-5 px-3'>
						<CardDashboard />
					</div>
				)}
				<TabsHome newTab={newTabBoard} />
			</div>
		</DashboardFilterProvider>
	)
}

export default Home
