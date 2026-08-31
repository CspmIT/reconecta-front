import { getVersion } from "@tauri-apps/api/app"
import { useEffect, useState } from "react"

/**
 * @param {Object} props
 * @param {boolean} [props.enFlujo] En vez de quedar pegado al fondo de la
 *   ventana, va en el flujo despues del contenido. Lo usan las vistas que
 *   ocupan todo el alto (el mapa): asi el footer queda abajo del pliegue y no
 *   les come 64px de pantalla. Ver modules/core/views.
 */
function Footer({ enFlujo = false }) {
	const [version, setVersion] = useState(false)
	const year = new Date().getFullYear()
	useEffect(() => {
		getVersion()
			.then(setVersion)
			.catch(() => setVersion(false))
	}, [])
	return (
		<div
			className={`${
				enFlujo ? 'relative' : 'absolute bottom-0'
			} !h-16 flex justify-center items-center w-full z-50 bg-primary`}
		>
			<h1>Copyright © IT & Development - COOPMORTEROS {year} {version && (<>- Versión {version}</>)} </h1>
		</div>
	)
}

export default Footer
