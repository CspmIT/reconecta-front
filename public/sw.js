/*
 * Service worker de Reconecta. Su unica tarea son las notificaciones push: no
 * cachea nada, asi el deploy sigue funcionando igual que antes (nginx sirve el
 * build y no queda nada viejo pegado en el dispositivo).
 *
 * Existe porque el navegador solo entrega un push a traves de un service
 * worker: sin este archivo la app no puede recibir alertas con la pantalla
 * apagada. En iOS ademas hace falta que la PWA este instalada en el inicio.
 */

self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()))

const ICON = '/icons/icon-192.png'
// El sufijo -v2 es un cache-bust: los iconos se sirven con max-age de 4 horas,
// asi que cambiar el contenido dejando el mismo nombre no llega al telefono
// hasta que expire. Si algun dia hay que cambiar el dibujo, se sube con nombre
// nuevo, no se sobreescribe.
const BADGE = '/icons/badge-96-v2.png'

// El backend manda la URL absoluta de produccion; se usa solo la ruta para que
// la notificacion abra el origen desde el que se instalo la app.
const localPath = (url) => {
	try {
		return new URL(url, self.location.origin).pathname
	} catch {
		return '/'
	}
}

self.addEventListener('push', (event) => {
	let payload = {}
	try {
		payload = event.data ? event.data.json() : {}
	} catch {
		payload = { body: event.data ? event.data.text() : '' }
	}

	const critical = payload.priority === 1
	const options = {
		body: payload.body || '',
		icon: ICON,
		badge: BADGE,
		// El tag agrupa: una alarma que se repite reemplaza la anterior en vez de
		// apilar veinte avisos del mismo equipo.
		tag: payload.tag || undefined,
		renotify: Boolean(payload.tag),
		// Las criticas quedan en pantalla hasta que alguien las toca.
		requireInteraction: critical,
		vibrate: critical ? [200, 100, 200] : undefined,
		timestamp: payload.sentAt ? Date.parse(payload.sentAt) : Date.now(),
		data: { url: localPath(payload.url || '/') },
	}

	event.waitUntil(self.registration.showNotification(payload.title || 'Reconecta', options))
})

self.addEventListener('notificationclick', (event) => {
	event.notification.close()
	const url = event.notification.data?.url || '/'

	event.waitUntil(
		(async () => {
			const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true })

			// Si la app ya esta abierta se reutiliza esa ventana en lugar de abrir
			// otra: en el celular abrir una segunda instancia pierde la sesion.
			const open = windows.find((client) => 'focus' in client)
			if (open) {
				await open.focus()
				if ('navigate' in open && localPath(open.url) !== url) await open.navigate(url)
				return
			}

			await self.clients.openWindow(url)
		})()
	)
})
