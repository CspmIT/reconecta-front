import { useContext } from 'react'
import Grafs from '../components/Grafs'
import TableRecloser from '../components/Tables/TableRecloser'
import { MainContext } from '../../../context/MainContext'
import { useNavigate } from 'react-router-dom'
import Board from '../../recloser/board/views'
import AnalyzerBoard from '../../analyzer/board/views'
import BoardMeter from '../../meter/views'
import TabsHome from '../components/TabHome'
import TableSubStationUrban from '../components/Tables/TableSubStationUrban'
import TableSubStationRural from '../components/Tables/TableSubStationRural'
import TableMeter from '../components/Tables/TableMeter'
import TableAnalyzer from '../components/Tables/TableAnalyzer'

const Home = () => {
	const { tabs, setTabs, setTabCurrent } = useContext(MainContext)
	const navigate = useNavigate()
	const typeEquipment = {
		1: (
			<>
				<Board />
			</>
		),
		2: (
			<>
				<BoardMeter />
			</>
		),
		3: (
			<>
				<Board />
			</>
		),
		4: (
			<>
				<AnalyzerBoard />
			</>
		),
		5: (
			<>
				<Board />
			</>
		),
	}
	const newTabBoard = (data) => {
		console.log('hola')
		setTabs((prevTabs) => [
			...prevTabs,
			{
				name: data.Name,
				id: data.id,
				link: '/board',
				component: typeEquipment[`${data.type_recloser}`],
			},
		])
		setTabCurrent(tabs.length)
		navigate('/tabs')
	}
	const tabsHome = [
		{
			id: 1,
			title: 'Reconectadores',
			component: <TableRecloser newTab={newTabBoard} />,
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
			id: 4,
			title: 'Medidores',
			component: <TableMeter newTab={newTabBoard} />,
		},
		{
			id: 5,
			title: 'Analizador de red',
			component: <TableAnalyzer newTab={newTabBoard} />,
		},
	]

	return (
		<div className='flex flex-col w-full pt-4'>
			<div className='row gap-3 mb-5 px-3'>
				<Grafs />
			</div>
			<TabsHome tabs={tabsHome} />
		</div>
	)
}

export default Home
