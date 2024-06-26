import { BrowserRouter, Route, Routes } from 'react-router-dom'
import MainContent from './modules/core/views'
import DashBoard from '../src/modules/dashBoard/views/index'
import Map from './modules/map/views'
import TabDinamic from './modules/tabs/views'
// import Login from './modules/login/views'
import Profile from './modules/profile/views'
import Board from './modules/board/views'
// import ForgeViewer from './modules/visualizerAutocad/views'
import Notification from './modules/Notification'
import { ThemeProvider, createTheme } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import { MainContext } from './context/MainContext'
import LoginApp from './modules/LoginApp/view'
import ListClients from './modules/LoginApp/view/ListClient'
import Home from './modules/home/views'
import Alert from './modules/alert/views'

function App() {
	// const [userRoutes, setUserRoutes] = useState([])
	const loginRoutes = [
		{ path: '/login', element: <LoginApp /> },
		{ path: '/ListClients', element: <ListClients /> },
	]
	const userRoutes = [
		{ path: '/*', element: <Home /> },
		{ path: '/Dashboard', element: <DashBoard /> },
		{ path: '/map', element: <Map /> },
		{ path: '/Alert', element: <Alert /> },
		// { path: '/visualizador', element: <ForgeViewer /> },
		{ path: '/tabs', element: <TabDinamic /> },
		{ path: '/notificaciones', element: <Notification /> },
		{ path: '/board/:id', element: <Board /> },
		{ path: '/profile', element: <Profile /> },
	]

	//Incorporo el theme de mui
	const { darkMode } = useContext(MainContext)
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
		// <div className='flex min-h-screen overflow-x-hidden  bg-gray-200 dark:bg-gray-600 text-gray-700'>
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
		// </div>
	)
}

export default App
