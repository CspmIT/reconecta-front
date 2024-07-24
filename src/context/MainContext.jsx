import { createContext, useEffect, useState } from 'react'

const MainContext = createContext()

function MainProvider({ children }) {
	const [darkMode, setDarkMode] = useState(false)
	const [user, setUser] = useState(false)
	const [infoNav, setInfoNav] = useState('')
	const [tabActive, setTabActive] = useState(0)
	const [tabs, setTabs] = useState([])
	const [tabCurrent, setTabCurrent] = useState(0)
	useEffect(() => {
		if (tabs.length) {
			setTabActive(tabs.length)
		}
	}, [tabs])

	return (
		<MainContext.Provider
			value={{
				infoNav,
				setInfoNav,
				tabCurrent,
				setTabCurrent,
				tabActive,
				setTabActive,
				tabs,
				setTabs,
				user,
				setUser,
				darkMode,
				setDarkMode,
			}}
		>
			{children}
		</MainContext.Provider>
	)
}
export { MainContext, MainProvider }
