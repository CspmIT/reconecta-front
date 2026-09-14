/*
 * Campana de notificaciones por equipo, la de cada fila de la tabla general.
 *
 * Todos los equipos nacen con la alarma activa: lo que el usuario guarda es la
 * lista de excepciones (muted_devices en NotificationPrefs). El resto de las
 * preferencias (tipos de alarma activos, horario de silencio) se edita en Mis
 * notificaciones.
 */
import { useCallback, useEffect, useState } from 'react'
import Swal from 'sweetalert2'

import { request } from '../../../utils/js/request'
import { backend } from '../../../utils/routes/app.routes'

const list = (value) => (Array.isArray(value) ? value.map(Number) : [])

export const useAlarmBells = () => {
	// null mientras carga; si el pedido falla queda en null y la campana no se
	// dibuja: la tabla tiene que seguir sirviendo igual.
	const [muted, setMuted] = useState(null)
	const [busy, setBusy] = useState(null)

	useEffect(() => {
		let cancelled = false
		const load = async () => {
			try {
				const { data } = await request(`${backend.Reconecta}/notificationPref`, 'GET')
				if (!cancelled) setMuted(list(data?.muted_devices))
			} catch (e) {
				console.log(e)
			}
		}
		load()
		return () => {
			cancelled = true
		}
	}, [])

	const isActive = useCallback((id) => !list(muted).includes(Number(id)), [muted])

	/*
	 * Optimista: la fila cambia al toque y vuelve atras si el backend rechaza.
	 * La respuesta trae las preferencias completas, asi que la lista queda
	 * sincronizada aunque el usuario tenga otra pestaña abierta.
	 */
	const toggle = useCallback(
		async (id) => {
			const device = Number(id)
			const previous = list(muted)
			const active = !previous.includes(device)
			setBusy(device)
			setMuted(active ? [...previous, device] : previous.filter((item) => item !== device))
			try {
				const { data } = await request(`${backend.Reconecta}/notificationPref/devices/${device}`, 'PUT', {
					active: !active,
				})
				setMuted(list(data?.muted_devices))
			} catch (e) {
				// El usuario confirmo el cambio: si no se pudo guardar tiene que
				// enterarse, no alcanza con volver la campana a como estaba.
				console.log(e)
				setMuted(previous)
				Swal.fire({
					icon: 'error',
					title: 'No se pudo guardar',
					text: e?.message || 'No se pudo cambiar la notificacion de este equipo.',
				})
			} finally {
				setBusy(null)
			}
		},
		[muted]
	)

	return { ready: muted !== null, busy, isActive, toggle }
}
