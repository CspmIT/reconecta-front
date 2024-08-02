import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom'
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
import Profile from './modules/profile/views'
import Home from './modules/home/views'
import './App.css'
import Board from './modules/recloser/board/views'
import AbmEquipament from './modules/AbmEquipament/views'
import AnalyzerBoard from './modules/analyzer/board/views'
import Perfils from './modules/Config/Perfils'

function App() {
	const { darkMode } = useContext(MainContext)
	const loginRoutes = [
		{ path: '/login', element: <LoginApp /> },
		{ path: '/ListClients', element: <ListClients /> },
	]
	const userRoutes = [
		{ path: '/*', element: <Home /> },
		{ path: '/Dashboard', element: <DashBoard /> },
		{ path: '/map', element: <Map /> },
		{ path: '/Alert', element: <Alert /> },
		{ path: '/Diagram', element: <Diagrams /> },
		// { path: '/visualizador', element: <ForgeViewer /> },
		{ path: '/tabs', element: <TabDinamic /> },
		{ path: '/config/profile', element: <Perfils /> },
		{ path: '/notificaciones', element: <Notification /> },
		{ path: '/board/:id', element: <Board /> },
		{ path: '/Abm/:name', element: <AbmEquipament /> },
		{ path: '/Abm/:name/:id', element: <AbmEquipament /> },
		{ path: '/Analyzer/:id', element: <AnalyzerBoard /> },
		{ path: '/profile', element: <Profile /> },
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
