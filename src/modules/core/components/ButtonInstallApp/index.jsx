import { IconButton } from '@mui/material'
import { MdInstallMobile } from 'react-icons/md'
import Swal from 'sweetalert2'

import { useInstallApp } from '../../../../hooks/useInstallApp'

/*
 * Boton para instalar Reconecta en el celular.
 *
 * Desaparece solo cuando ya esta instalada, cuando la esta usando desde el
 * icono, o cuando el navegador no ofrece instalarla (Tauri, escritorio sin
 * soporte). En iOS no existe el prompt nativo, asi que ahi explica los pasos.
 *
 * Instalar no es cosmetico: es lo que habilita las notificaciones push en
 * iPhone, que solo funcionan con la PWA agregada a la pantalla de inicio.
 */
const ButtonInstallApp = () => {
	const { installed, canPrompt, needsManualSteps, install } = useInstallApp()

	if (installed || (!canPrompt && !needsManualSteps)) return null

	const onClick = async () => {
		if (canPrompt) {
			await install()
			return
		}

		Swal.fire({
			icon: 'info',
			title: 'Instalar Reconecta',
			html: `
				<p style="text-align:left">Para tenerla como app y poder recibir notificaciones:</p>
				<ol style="text-align:left;margin-top:8px">
					<li>Tocá el botón <b>Compartir</b> de Safari.</li>
					<li>Elegí <b>Agregar a inicio</b>.</li>
					<li>Abrila desde el icono nuevo.</li>
				</ol>
			`,
			confirmButtonText: 'Entendido',
		})
	}

	return (
		<IconButton size='medium' className='shadow-none !rounded-full' title='Instalar la app' onClick={onClick}>
			<MdInstallMobile className='text-gray-700' />
		</IconButton>
	)
}

export default ButtonInstallApp
