import { createContext, useEffect, useState } from 'react'
import Swal from 'sweetalert2'
const TabContext = createContext()

const TabProvider = ({ children }) => {
	const [activeTab, setActiveTab] = useState(null)

	useEffect(() => {
		const tabId = Math.random().toString(36).substring(2, 15)
		const channel = new BroadcastChannel('app-channel')

		const checkIfActive = () => localStorage.getItem('activeTabId') === tabId

		const setAppActive = () => {
			localStorage.setItem('activeTabId', tabId)
			setActiveTab(tabId)
			channel.postMessage({ action: 'activate', tabId })
		}

		const handleBeforeUnload = () => {
			if (checkIfActive()) {
				localStorage.removeItem('activeTabId')
				channel.postMessage({ action: 'inactive', tabId })
			}
		}

		const handleMessage = (event) => {
			if (event.data.action === 'activate' && event.data.tabId !== tabId) {
				changeFaviconAndTitle()
				changeFavicon('/crisis.ico')
				Swal.fire({
					title: 'Atención!',
					text: 'La aplicación se está abriendo en otra pestaña. ¿Deseas utilizar aca la aplicación?',
					icon: 'question',
					allowOutsideClick: false,
					showDenyButton: true,
					showCancelButton: false,
					confirmButtonText: 'Usar aqui',
					denyButtonText: `Cerrar`,
				}).then((result) => {
					/* Read more about isConfirmed, isDenied below */
					if (result.isConfirmed) {
						window.location.reload()
					} else if (result.isDenied) {
						window.location.replace(import.meta.env.VITE_COOPTECH_URL)
					}
				})
			}
		}
		const changeFaviconAndTitle = () => {
			// Cambiar el título de la página
			document.title = '¡Atención! - La aplicación está abierta en otra pestaña'
			document.body.style.backgroundColor = 'yellow !important'
		}

		const changeFavicon = (iconURL) => {
			const link = document.querySelector("link[rel~='icon']")
			if (link) {
				link.href = iconURL
			} else {
				const newLink = document.createElement('link')
				newLink.rel = 'icon'
				newLink.href = iconURL
				document.head.appendChild(newLink)
			}
		}
		window.addEventListener('beforeunload', handleBeforeUnload)
		channel.addEventListener('message', handleMessage)

		if (localStorage.getItem('activeTabId')) {
			channel.postMessage({ action: 'activate', tabId })
		}

		setAppActive()

		return () => {
			window.removeEventListener('beforeunload', handleBeforeUnload)
			channel.removeEventListener('message', handleMessage)
		}
	}, [])

	return <TabContext.Provider value={{ activeTab }}>{children}</TabContext.Provider>
}
export { TabContext, TabProvider }
