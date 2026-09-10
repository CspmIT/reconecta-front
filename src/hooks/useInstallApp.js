import { useEffect, useState } from 'react'
import { isTauri } from '@tauri-apps/api/core'

/*
 * Estado de instalacion de la PWA.
 *
 * El navegador emite 'beforeinstallprompt' una sola vez y apenas carga la
 * pagina, normalmente antes de que monte cualquier componente. Por eso la
 * captura vive a nivel de modulo y no dentro del hook: si esperaramos al
 * useEffect el evento ya habria pasado y el boton no aparecerian nunca.
 */

let savedPrompt = null
const listeners = new Set()

const notify = (event) => listeners.forEach((listener) => listener(event))

if (typeof window !== 'undefined') {
	window.addEventListener('beforeinstallprompt', (event) => {
		// Cancela el mini-infobar de Chrome: el alta la ofrecemos nosotros.
		event.preventDefault()
		savedPrompt = event
		notify('prompt')
	})
	window.addEventListener('appinstalled', () => {
		savedPrompt = null
		notify('installed')
	})
}

const STANDALONE = '(display-mode: standalone)'

// Instalada = se abrio desde el icono. navigator.standalone es el equivalente
// de iOS, que no soporta display-mode.
const isStandalone = () => window.matchMedia?.(STANDALONE).matches || window.navigator.standalone === true

const isIos = () =>
	/iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)

/**
 * @returns {{ installed: boolean, canPrompt: boolean, needsManualSteps: boolean, install: Function }}
 *   installed         - ya esta instalada (o se abrio desde el icono)
 *   canPrompt         - hay prompt nativo disponible (Chromium)
 *   needsManualSteps  - iOS: no hay prompt, hay que explicar Compartir → Agregar a inicio
 *   install           - dispara el prompt nativo; devuelve 'accepted' | 'dismissed' | 'unavailable'
 */
export const useInstallApp = () => {
	const [prompt, setPrompt] = useState(savedPrompt)
	const [installed, setInstalled] = useState(isStandalone)

	useEffect(() => {
		if (isTauri()) return

		const sync = (event) => {
			setPrompt(savedPrompt)
			// 'appinstalled' llega aunque el usuario siga en la pestaña del
			// navegador: ahi display-mode todavia es 'browser' pero ya esta
			// instalada, y el boton no tiene mas nada que ofrecer.
			if (event === 'installed') setInstalled(true)
		}

		listeners.add(sync)

		// Cubre el caso de instalarla y pasar a la ventana standalone sin recargar.
		const media = window.matchMedia?.(STANDALONE)
		const onModeChange = (event) => setInstalled(event.matches)
		media?.addEventListener?.('change', onModeChange)

		return () => {
			listeners.delete(sync)
			media?.removeEventListener?.('change', onModeChange)
		}
	}, [])

	const install = async () => {
		if (!prompt) return 'unavailable'

		prompt.prompt()
		const { outcome } = await prompt.userChoice

		// El evento es de un solo uso: llamar prompt() dos veces sobre el mismo
		// lanza error, asi que se descarta pase lo que pase. Chrome lo vuelve a
		// emitir en la proxima carga si el usuario lo rechazo.
		savedPrompt = null
		setPrompt(null)
		return outcome
	}

	return {
		installed,
		canPrompt: Boolean(prompt) && !installed,
		needsManualSteps: !isTauri() && isIos() && !installed,
		install,
	}
}
