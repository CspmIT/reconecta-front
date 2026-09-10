/*
 * Plomeria del navegador para las notificaciones push. Todo lo que toca
 * navigator/Notification vive aca; las llamadas al backend estan en
 * api/notificationApi.js.
 */
import { isTauri } from '@tauri-apps/api/core'

const SW_URL = '/sw.js'

/**
 * El webview de Tauri no implementa Web Push: en la app de escritorio las
 * alertas siguen llegando por Discord. Tampoco hay push en navegadores viejos.
 */
export const pushSupported = () => {
	if (isTauri()) return false
	return (
		typeof navigator !== 'undefined' &&
		'serviceWorker' in navigator &&
		typeof window !== 'undefined' &&
		'PushManager' in window &&
		'Notification' in window
	)
}

export const permissionState = () => (typeof Notification === 'undefined' ? 'unsupported' : Notification.permission)

export const isInstalled = () =>
	window.matchMedia?.('(display-mode: standalone)').matches || window.navigator.standalone === true

/**
 * iOS solo habilita las notificaciones cuando la PWA se agrego a la pantalla de
 * inicio (16.4+). Abierta en Safari el permiso ni se puede pedir, asi que hay
 * que avisarle al usuario que primero la instale.
 */
export const iosNeedsInstall = () => {
	const ua = navigator.userAgent || ''
	const ios = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
	return ios && !isInstalled()
}

// La clave VAPID viaja en base64 url-safe y el navegador la pide como bytes.
const urlBase64ToUint8Array = (base64) => {
	const padding = '='.repeat((4 - (base64.length % 4)) % 4)
	const normalized = (base64 + padding).replace(/-/g, '+').replace(/_/g, '/')
	const raw = window.atob(normalized)
	return Uint8Array.from([...raw].map((char) => char.charCodeAt(0)))
}

/**
 * Registra el service worker (idempotente) y espera a que este activo: recien
 * entonces pushManager sirve.
 */
export const readyRegistration = async () => {
	if (!pushSupported()) return null
	const existing = await navigator.serviceWorker.getRegistration(SW_URL)
	const registration = existing || (await navigator.serviceWorker.register(SW_URL))
	await navigator.serviceWorker.ready
	return registration
}

export const getDeviceSubscription = async () => {
	const registration = await readyRegistration()
	return registration ? registration.pushManager.getSubscription() : null
}

export const askPermission = async () => {
	if (typeof Notification === 'undefined') throw new Error('Este navegador no soporta notificaciones')
	return Notification.requestPermission()
}

/**
 * Suscribe este dispositivo. Devuelve la suscripcion del navegador, que despues
 * hay que guardar en el backend.
 */
export const subscribeDevice = async (publicKey) => {
	if (!publicKey) throw new Error('El servidor no tiene configuradas las claves de notificacion')

	const registration = await readyRegistration()
	if (!registration) throw new Error('Este dispositivo no soporta notificaciones push')

	const existing = await registration.pushManager.getSubscription()
	if (existing) return existing

	return registration.pushManager.subscribe({
		// Obligatorio en Chrome: todo push tiene que mostrar una notificacion.
		userVisibleOnly: true,
		applicationServerKey: urlBase64ToUint8Array(publicKey),
	})
}

/**
 * Da de baja este dispositivo en el navegador y devuelve el endpoint que habia,
 * para poder borrarlo tambien en el backend.
 */
export const unsubscribeDevice = async () => {
	const subscription = await getDeviceSubscription()
	if (!subscription) return null
	const { endpoint } = subscription
	await subscription.unsubscribe()
	return endpoint
}
