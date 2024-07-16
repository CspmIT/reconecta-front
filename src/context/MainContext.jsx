import { createContext, useState } from 'react'
import Diagrams from '../modules/diagrams/views'
import Board from '../modules/board/views'

const MainContext = createContext()

function MainProvider({ children }) {
	const [darkMode, setDarkMode] = useState(false)
	const [user, setUser] = useState(false)
	const [tabActive, setTabActive] = useState(0)
	const [tabs, setTabs] = useState([
		{
			name: 'Hola',
			component: (
				<>
					<h1 className='text-black'>Holaaa 1</h1>
				</>
			),
		},
		{
			name: '',
			component: (
				<>
					<h1 className='text-black'>Holaaa 2</h1>
				</>
			),
		},
		{
			name: 'Hola3',
			component: (
				<>
					<Board />
				</>
			),
		},
		{
			name: 'Hola4',
			component: (
				<>
					<Diagrams />
				</>
			),
		},
	])
	return (
		<MainContext.Provider value={{ tabActive, setTabActive, tabs, setTabs, user, setUser, darkMode, setDarkMode }}>
			{children}
		</MainContext.Provider>
	)
}
export { MainContext, MainProvider }
