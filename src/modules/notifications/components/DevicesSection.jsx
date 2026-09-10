import { Button, Chip, CircularProgress, IconButton } from '@mui/material'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive'
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff'

import Card from './Card'
import { formatDate } from '../../alert/utils/formatDate'

/*
 * Estado del dispositivo actual y lista de los dispositivos ya registrados.
 * Cada navegador (celular, escritorio, otro perfil) es una suscripcion propia:
 * el usuario tiene que activar las notificaciones una vez en cada uno.
 */
const DevicesSection = ({ server, permission, subscribed, devices, busy, onEnable, onDisable, onTest, onRemove, warning }) => {
	const blocked = permission === 'denied'

	return (
		<Card
			title='Este dispositivo'
			description='Las notificaciones se habilitan por dispositivo. En el celular conviene instalar la app (Agregar a inicio) antes de activarlas.'
			right={
				subscribed ? (
					<Chip size='small' color='success' variant='outlined' label='Activadas' />
				) : (
					<Chip size='small' variant='outlined' label='Sin activar' />
				)
			}
		>
			{warning ? (
				<p className='text-sm rounded-lg px-3 py-2 mb-4 bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-900/20 dark:text-amber-200 dark:border-amber-800'>
					{warning}
				</p>
			) : null}

			<div className='flex flex-wrap gap-2 items-center'>
				{subscribed ? (
					<Button
						variant='outlined'
						color='inherit'
						size='small'
						startIcon={busy ? <CircularProgress size={14} /> : <NotificationsOffIcon />}
						disabled={busy}
						onClick={onDisable}
					>
						Desactivar en este dispositivo
					</Button>
				) : (
					<Button
						variant='contained'
						size='small'
						startIcon={busy ? <CircularProgress size={14} /> : <NotificationsActiveIcon />}
						disabled={busy || blocked || !server.enabled}
						onClick={onEnable}
					>
						Activar notificaciones
					</Button>
				)}

				<Button variant='text' size='small' disabled={!subscribed || busy} onClick={onTest}>
					Enviar prueba
				</Button>
			</div>

			{blocked ? (
				<p className='text-sm text-red-600 dark:text-red-400 mt-3'>
					El navegador tiene las notificaciones bloqueadas para Reconecta. Hay que habilitarlas desde la
					configuracion del sitio y volver a intentar.
				</p>
			) : null}

			<h3 className='text-sm font-semibold text-slate-700 dark:text-gray-200 mt-6 mb-2'>
				Dispositivos registrados ({devices.length})
			</h3>

			{devices.length === 0 ? (
				<p className='text-sm text-slate-500 dark:text-gray-400'>Todavia no hay dispositivos suscritos.</p>
			) : (
				<ul className='flex flex-col gap-2'>
					{devices.map((device) => (
						<li
							key={device.id}
							className='flex items-center justify-between gap-3 rounded-lg border border-zinc-200 dark:border-gray-700 px-3 py-2'
						>
							<div className='min-w-0'>
								<p className='text-sm text-slate-800 dark:text-gray-100 truncate'>
									{device.user_agent || 'Dispositivo sin identificar'}
								</p>
								<p className='text-xs text-slate-500 dark:text-gray-400'>
									Alta {formatDate(device.createdAt)}
									{device.last_error ? ` · ultimo error: ${device.last_error}` : ''}
								</p>
							</div>
							<IconButton size='small' disabled={busy} onClick={() => onRemove(device.endpoint)}>
								<DeleteOutlineIcon fontSize='small' />
							</IconButton>
						</li>
					))}
				</ul>
			)}
		</Card>
	)
}

export default DevicesSection
