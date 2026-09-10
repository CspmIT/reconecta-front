import { Button, CircularProgress, Switch } from '@mui/material'
import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import { isTauri } from '@tauri-apps/api/core'

import { notificationApi } from '../api/notificationApi'
import Card from '../components/Card'
import DevicesSection from '../components/DevicesSection'
import MutedSection from '../components/MutedSection'
import QuietHoursSection from '../components/QuietHoursSection'
import {
	askPermission,
	getDeviceSubscription,
	iosNeedsInstall,
	permissionState,
	pushSupported,
	subscribeDevice,
	unsubscribeDevice,
} from '../utils/push'

// Campos que viaja el PUT: el backend hace merge, pero se manda todo junto para
// que el boton Guardar sea una sola operacion.
const EDITABLE = [
	'enabled',
	'quiet_enabled',
	'quiet_start',
	'quiet_end',
	'quiet_days',
	'quiet_allow_critical',
	'muted_alarm_types',
	'muted_device_types',
	'muted_devices',
]

// `request` lanza el cuerpo de la respuesta, que en este backend trae message.
const errorText = (error) =>
	error?.message || (typeof error === 'string' ? error : 'Ocurrio un error inesperado')

/*
 * Modulo de notificaciones del usuario. Dos cosas distintas en una pantalla:
 * el alta de cada dispositivo (permiso del navegador + suscripcion push) y las
 * preferencias del usuario, que valen para todos sus dispositivos.
 */
const Notifications = () => {
	const supported = pushSupported()

	const [loading, setLoading] = useState(true)
	const [saving, setSaving] = useState(false)
	const [busyDevice, setBusyDevice] = useState(false)
	const [server, setServer] = useState({ enabled: false, publicKey: null })
	const [permission, setPermission] = useState(permissionState())
	const [subscribed, setSubscribed] = useState(false)
	const [devices, setDevices] = useState([])
	const [pref, setPref] = useState(null)
	const [options, setOptions] = useState({ alarm_types: [], device_types: [] })
	const [equipments, setEquipments] = useState([])
	const [dirty, setDirty] = useState(false)

	const refreshDevices = async () => {
		const list = await notificationApi.getDevices().catch(() => [])
		setDevices(list)
	}

	const load = async () => {
		setLoading(true)
		try {
			const [key, preferences, opts] = await Promise.all([
				notificationApi.getPublicKey(),
				notificationApi.getPreferences(),
				notificationApi.getOptions(),
			])
			setServer({ enabled: Boolean(key.enabled), publicKey: key.publicKey })
			setPref(preferences)
			setOptions(opts)

			// El catalogo es para la lista de equipos silenciados: si falla, la
			// pantalla sigue sirviendo para el resto.
			setEquipments(await notificationApi.getEquipments().catch(() => []))
			await refreshDevices()

			if (supported) {
				const subscription = await getDeviceSubscription()
				setSubscribed(Boolean(subscription))
				setPermission(permissionState())
			}
		} catch (error) {
			Swal.fire({ icon: 'error', title: 'No se pudieron cargar las notificaciones', text: errorText(error) })
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		load()
	}, [])

	const change = (patch) => {
		setPref((current) => ({ ...current, ...patch }))
		setDirty(true)
	}

	const enableDevice = async () => {
		setBusyDevice(true)
		try {
			const result = await askPermission()
			setPermission(result)
			if (result !== 'granted') {
				Swal.fire({
					icon: 'warning',
					title: 'Permiso no otorgado',
					text: 'El navegador no autorizo las notificaciones para Reconecta.',
				})
				return
			}

			const subscription = await subscribeDevice(server.publicKey)
			await notificationApi.subscribe(subscription.toJSON())
			setSubscribed(true)
			await refreshDevices()
			Swal.fire({
				icon: 'success',
				title: 'Notificaciones activadas',
				timer: 1500,
				showConfirmButton: false,
			})
		} catch (error) {
			Swal.fire({ icon: 'error', title: 'No se pudo activar', text: errorText(error) })
		} finally {
			setBusyDevice(false)
		}
	}

	const disableDevice = async () => {
		setBusyDevice(true)
		try {
			const endpoint = await unsubscribeDevice()
			if (endpoint) await notificationApi.unsubscribe(endpoint)
			setSubscribed(false)
			await refreshDevices()
		} catch (error) {
			Swal.fire({ icon: 'error', title: 'No se pudo desactivar', text: errorText(error) })
		} finally {
			setBusyDevice(false)
		}
	}

	const removeDevice = async (endpoint) => {
		setBusyDevice(true)
		try {
			// Si es este mismo navegador, tambien hay que darlo de baja aca: si no
			// sigue suscrito y se vuelve a registrar en el proximo arranque.
			const own = await getDeviceSubscription()
			if (own?.endpoint === endpoint) {
				await own.unsubscribe()
				setSubscribed(false)
			}
			await notificationApi.unsubscribe(endpoint)
			await refreshDevices()
		} catch (error) {
			Swal.fire({ icon: 'error', title: 'No se pudo eliminar', text: errorText(error) })
		} finally {
			setBusyDevice(false)
		}
	}

	const testDevice = async () => {
		setBusyDevice(true)
		try {
			const result = await notificationApi.sendTest()
			Swal.fire({
				icon: result.sent ? 'success' : 'warning',
				title: result.sent ? 'Notificacion enviada' : 'No se pudo entregar',
				text: `Enviadas: ${result.sent} · fallidas: ${result.failed} · dadas de baja: ${result.removed}`,
			})
			await refreshDevices()
		} catch (error) {
			Swal.fire({ icon: 'error', title: 'No se pudo probar', text: errorText(error) })
		} finally {
			setBusyDevice(false)
		}
	}

	const save = async () => {
		setSaving(true)
		try {
			const changes = {}
			for (const field of EDITABLE) changes[field] = pref[field]
			const saved = await notificationApi.savePreferences(changes)
			setPref(saved)
			setDirty(false)
			Swal.fire({ icon: 'success', title: 'Preferencias guardadas', timer: 1500, showConfirmButton: false })
		} catch (error) {
			Swal.fire({ icon: 'error', title: 'No se pudo guardar', text: errorText(error) })
		} finally {
			setSaving(false)
		}
	}

	const deviceWarning = () => {
		if (isTauri()) {
			return 'En la aplicacion de escritorio no hay notificaciones push: usala desde el navegador o el celular. Las alertas siguen saliendo por Discord.'
		}
		if (!supported) return 'Este navegador no soporta notificaciones push.'
		if (!server.enabled) return 'El servidor todavia no tiene configuradas las claves de notificacion (VAPID).'
		if (iosNeedsInstall()) {
			return 'En iPhone o iPad hay que agregar Reconecta a la pantalla de inicio (Compartir → Agregar a inicio) y abrirla desde ahi: recien entonces iOS permite activar las notificaciones.'
		}
		return null
	}

	if (loading || !pref) {
		return (
			<div className='w-full flex justify-center py-16'>
				<CircularProgress />
			</div>
		)
	}

	return (
		<div className='w-full min-w-0 flex flex-col gap-4 pb-4'>
			<h1 className='text-xl font-semibold text-slate-800 dark:text-gray-100'>Mis notificaciones</h1>

			<DevicesSection
				server={server}
				permission={permission}
				subscribed={subscribed}
				devices={devices}
				busy={busyDevice}
				warning={deviceWarning()}
				onEnable={enableDevice}
				onDisable={disableDevice}
				onRemove={removeDevice}
				onTest={testDevice}
			/>

			<Card
				title='Recibir notificaciones'
				description='Interruptor general. Apagado no llega ninguna alarma a ningun dispositivo de este usuario.'
				right={
					<Switch checked={Boolean(pref.enabled)} onChange={(event) => change({ enabled: event.target.checked })} />
				}
			/>

			<QuietHoursSection pref={pref} onChange={change} />

			<MutedSection pref={pref} options={options} equipments={equipments} onChange={change} />

			<div className='flex items-center gap-3'>
				<Button variant='contained' onClick={save} disabled={saving || !dirty}>
					{saving ? 'Guardando…' : 'Guardar preferencias'}
				</Button>
				{dirty ? <span className='text-sm text-amber-600 dark:text-amber-400'>Hay cambios sin guardar</span> : null}
			</div>
		</div>
	)
}

export default Notifications
