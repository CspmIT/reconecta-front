import { useContext } from 'react'
import Grafs from '../components/Grafs'
import TableRecloser from '../components/TableRecloser'
import { MainContext } from '../../../context/MainContext'
import { useNavigate } from 'react-router-dom'
import Board from '../../recloser/board/views'
import AnalyzerBoard from '../../analyzer/board/views'
import SubstationUrbanBoard from '../../substation/views'

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
				<Board />
			</>
		),
		3: (
			<>
				<SubstationUrbanBoard />
			</>
		),
		4: (
			<>
				<AnalyzerBoard />
			</>
		),
	}
	const newTabBoard = (data) => {
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
	return (
		<div className='flex flex-col w-full pt-4'>
			<div className='row gap-3 mb-5 px-3'>
				<Grafs />
			</div>
			<TableRecloser newTab={newTabBoard} />
		</div>
	)
}

export default Home
