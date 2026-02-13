import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles.css'
import { MainProvider } from './context/MainContext'
import { TabProvider } from './context/TabContext'
import { GoogleOAuthProvider } from '@react-oauth/google'

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<TabProvider>
			<MainProvider>
				<GoogleOAuthProvider clientId='841713891026-pg3r31kjodplsid3nmcpav7hamgs9pv1.apps.googleusercontent.com'>
					<App />
				</GoogleOAuthProvider>
			</MainProvider>
		</TabProvider>
	</React.StrictMode>
)
