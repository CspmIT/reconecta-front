import { useContext } from 'react'
import { MainContext } from '../../../context/MainContext'
import { useNavigate } from 'react-router-dom'
import Board from '../../recloser/board/views'

export const newTabBoard = (id) => {
	const { tabs, setTabs, setTabCurrent } = useContext(MainContext)
	const navigate = useNavigate()
	const existingTabIndex = tabs.findIndex((tab) => tab.name === popupData.name)
	if (existingTabIndex !== -1) {
		setTabCurrent(existingTabIndex)
	} else {
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
	}
	navigate('/tabs')
}
