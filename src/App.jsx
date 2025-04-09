import { BrowserRouter, Route, Routes } from 'react-router-dom'
import MainContent from './modules/core/views'
import { ThemeProvider, createTheme } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import { MainContext } from './context/MainContext'
// import { RoutesContext } from './context/RoutesContext'

import LoginApp from './modules/LoginApp/view'
import ListClients from './modules/LoginApp/view/ListClient'
import DashBoard from './modules/dashBoard/views'
import Map from './modules/map/views'
import Alert from './modules/alert/views'
import Diagrams from './modules/diagrams/views'
import TabDinamic from './modules/tabs/views'
import Notification from './modules/Notification'
import Home from './modules/home/views'
import './App.css'
import Board from './modules/recloser/views'
import AbmEquipament from './modules/AbmEquipament/views'
import ConfigMenu from './modules/ConfigMenu/view'
import Profile from './modules/profile/views'
import Notifications from './modules/ConfigNotifications/views/index'
import ConfigSecurity from './modules/configSecurity/views'
import LoginCooptech from './modules/LoginApp/view/LoginCooptech'
import AbmDevice from './modules/AbmDevice/views'
import Binnacle from './modules/Binnacle'
import AddMenu from './modules/ConfigMenu/components/AddMenu'
import Abm from './modules/Abm/views'
import Equipment from './modules/Equipment/view'

function App() {
	const { darkMode } = useContext(MainContext)
	const loginRoutes = [
		{ path: '/login', element: <LoginApp /> },
		{ path: '/ListClients', element: <ListClients /> },
		{ path: '/ListClients/:action', element: <ListClients /> },
		{ path: '/LoginCooptech/:token', element: <LoginCooptech /> },
	]
	const userRoutes = [
		{ path: '/*', element: <Home /> },
		{ path: '/Dashboard', element: <DashBoard /> },
		{ path: '/map', element: <Map /> },
		{ path: '/Alert', element: <Alert /> },
		{ path: '/Diagram', element: <Diagrams /> },
		// { path: '/visualizador', element: <ForgeViewer /> },
		{ path: '/tabs', element: <TabDinamic /> },
		{ path: '/config/security', element: <ConfigSecurity /> },
		{ path: '/config/menu', element: <ConfigMenu /> },
		{ path: '/notificaciones', element: <Notification /> },
		{ path: '/board/:id', element: <Board /> },
		{ path: '/Abm/:name', element: <AbmEquipament /> },
		{ path: '/Abm/:name/:id', element: <AbmEquipament /> },
		{ path: '/AbmDevice/:name', element: <AbmDevice /> },
		{ path: '/AbmDevice/:name/:id', element: <AbmDevice /> },
		{ path: '/profile', element: <Profile /> },
		{ path: '/config/notifications', element: <Notifications /> },
		{ path: '/bitacora', element: <Binnacle /> },
		{ path: '/AddMenu', element: <AddMenu /> },
		{ path: '/AddElement', element: <Abm /> },
		{ path: '/Equipment', element: <Equipment /> },
		{ path: '/Equipment/:id', element: <Equipment /> }
	]
	//Incorporo el theme de mui
	const lightTheme = createTheme({
		palette: {
			mode: 'light',
		},
	})

	const darkTheme = createTheme({
		palette: {
			mode: 'dark',
		},
	})
	const [theme, setTheme] = useState(!darkMode ? darkTheme : lightTheme)
	useEffect(() => {
		setTheme(!darkMode ? lightTheme : darkTheme)
	}, [darkMode])

	return (
		<BrowserRouter>
			<ThemeProvider theme={theme}>
				<Routes>
					{loginRoutes.map((route) => (
						<Route key={route.path} path={route.path} element={route.element} />
					))}

					<Route element={<MainContent />}>
						{userRoutes.map((route) => (
							<Route key={route.path} path={route.path} element={route.element} />
						))}
					</Route>
				</Routes>
			</ThemeProvider>
		</BrowserRouter>
	)
}

export default App
