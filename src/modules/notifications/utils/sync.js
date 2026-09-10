import { notificationApi } from '../api/notificationApi'
import { getDeviceSubscription, permissionState, pushSupported, readyRegistration } from './push'

/**
 * Arranque de las notificaciones en cada carga de la app (area autenticada).
 *
 * 1. Registra el service worker. Hace falta siempre, no solo cuando el usuario
 *    tiene el permiso dado: es lo que habilita recibir push y lo que hace que el
 *    navegador ofrezca instalar la app en el celular.
 * 2. Si ya hay permiso y suscripcion, la reenvia al backend. El navegador puede
 *    rotarla o recrearla por su cuenta (datos del sitio borrados, PWA
 *    reinstalada, rotacion del push service) y el alta es idempotente por
 *    endpoint, asi que sincronizar al arrancar es mas confiable que escuchar
 *    'pushsubscriptionchange' en el worker, que no tiene la sesion a mano.
 *
 * No lanza: si algo falla, el usuario puede reactivar desde Mis notificaciones.
 */
export const initDevicePush = async () => {
	try {
		if (!pushSupported()) return

		await readyRegistration()
		if (permissionState() !== 'granted') return

		const subscription = await getDeviceSubscription()
		if (!subscription) return

		await notificationApi.subscribe(subscription.toJSON())
	} catch (error) {
		console.warn('No se pudo inicializar el push de este dispositivo:', error?.message || error)
	}
}
