import { request } from '../../../utils/js/request'
import { backend } from '../../../utils/routes/app.routes'

/*
 * Estado del aviso de presentacion del modulo, una sola vez por usuario.
 *
 * Se guarda en UserPrefs (GET/PUT /userPref/:module), o sea del lado del
 * servidor y no en el navegador: el usuario tiene que verlo una vez, no una vez
 * por dispositivo. El payload guarda una lista de avisos y no un booleano, asi
 * el mismo modulo sirve para el proximo anuncio sin migrar nada.
 */
const PREF_MODULE = 'announcements'
const AVISO = 'notifications-v1'

/** null si no se pudo leer: ahi conviene no mostrar nada y reintentar despues. */
export const introPendiente = async () => {
	try {
		const { data } = await request(`${backend.Reconecta}/userPref/${PREF_MODULE}`, 'GET')
		const seen = Array.isArray(data?.seen) ? data.seen : []
		return { pendiente: !seen.includes(AVISO), payload: data, seen }
	} catch (error) {
		console.warn('No se pudo leer el estado de los avisos:', error?.message || error)
		return null
	}
}

export const marcarIntroVisto = ({ payload, seen }) =>
	request(`${backend.Reconecta}/userPref/${PREF_MODULE}`, 'PUT', {
		...(payload || {}),
		seen: [...seen, AVISO],
	}).catch((error) => console.warn('No se pudo guardar el aviso como visto:', error?.message || error))
