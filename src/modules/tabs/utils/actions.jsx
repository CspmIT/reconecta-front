import { useContext } from 'react'
import { MainContext } from '../../../context/MainContext'
import Board from '../../board/views'
import { useNavigate } from 'react-router-dom'

export const newTabBoard = (id) => {
	const { tabs, setTabs, setTabCurrent } = useContext(MainContext)
	const navigate = useNavigate()
	setTabs((prevTabs) => [
		...prevTabs,
		{
			name: popupData.name,
			id: id,
			link: '/board',
			component: (
				<>
					<Board />
				</>
			),
		},
	])
	setTabCurrent(tabs.length)
	navigate('/tabs')
}
