import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles.css'
import { MainProvider } from './context/MainContext'
import { TabProvider } from './context/TabContext'

ReactDOM.createRoot(document.getElementById('root')).render(
	<MainProvider>
		<TabProvider>
			<App />
		</TabProvider>
	</MainProvider>
)
