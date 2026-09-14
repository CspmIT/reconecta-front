import { Button, Portal } from '@mui/material'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { introPendiente, marcarIntroVisto } from '../utils/intro'

// El boton del avatar, que es el que abre el menu donde vive el acceso.
const TARGET = 'user-menu-button'
// El AppBar de MUI va en 1100 y el spotlight tiene que taparlo para poder
// recortar el boton que esta adentro.
const Z = 1400

/*
 * Presentacion del modulo: en vez de contarle al usuario donde esta el acceso,
 * se lo senala. Un velo oscuro con un recorte sobre el boton real (el recorte es
 * la sombra gigante del halo) y un cartel corto al lado.
 *
 * Si el boton no esta en pantalla no se muestra nada y el aviso queda pendiente
 * para el proximo ingreso: es preferible a explicarlo con palabras.
 */
const NotificationsIntro = () => {
	const navigate = useNavigate()
	const [estado, setEstado] = useState(null)
	const [rect, setRect] = useState(null)

	useEffect(() => {
		let cancelado = false
		introPendiente().then((resultado) => {
			if (!cancelado && resultado?.pendiente) setEstado(resultado)
		})
		return () => {
			cancelado = true
		}
	}, [])

	// La barra es fixed, pero el rectangulo cambia al rotar o achicar la ventana.
	useEffect(() => {
		if (!estado) return
		const objetivo = document.getElementById(TARGET)
		if (!objetivo) return

		const medir = () => setRect(objetivo.getBoundingClientRect())
		medir()
		window.addEventListener('resize', medir)
		return () => window.removeEventListener('resize', medir)
	}, [estado])

	if (!estado || !rect) return null

	const cerrar = () => {
		marcarIntroVisto(estado)
		setEstado(null)
	}

	const ir = () => {
		cerrar()
		navigate('/config/notifications')
	}

	return (
		<Portal>
			<div className='fixed inset-0' style={{ zIndex: Z }} onClick={cerrar}>
				<div
					className='fixed rounded-full ring-2 ring-white animate-pulse pointer-events-none'
					style={{
						top: rect.top - 6,
						left: rect.left - 6,
						width: rect.width + 12,
						height: rect.height + 12,
						boxShadow: '0 0 0 9999px rgba(0,0,0,.65)',
					}}
				/>
				<div
					className='fixed w-64 max-w-[calc(100vw-2rem)] rounded-xl bg-white dark:bg-zinc-800 shadow-2xl p-4'
					style={{ top: rect.bottom + 16, right: Math.max(16, window.innerWidth - rect.right - 4) }}
					onClick={(event) => event.stopPropagation()}
				>
					{/* Punta del globo, apuntando al boton recortado */}
					<div className='absolute -top-1.5 right-6 w-3 h-3 rotate-45 bg-white dark:bg-zinc-800' />
					<p className='text-sm font-semibold text-slate-800 dark:text-gray-100'>Nuevo: Mis notificaciones</p>
					<p className='text-sm text-slate-600 dark:text-gray-300 mt-1'>
						Elegí qué alarmas te llegan al celular. Está en este menú.
					</p>
					<div className='flex justify-end gap-2 mt-3'>
						<Button size='small' color='inherit' onClick={cerrar}>
							Entendido
						</Button>
						<Button size='small' variant='contained' onClick={ir}>
							Ver ahora
						</Button>
					</div>
				</div>
			</div>
		</Portal>
	)
}

export default NotificationsIntro
