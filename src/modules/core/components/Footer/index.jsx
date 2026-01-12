import { getVersion } from "@tauri-apps/api/app"
import { useEffect, useState } from "react"

function Footer() {
	const [version, setVersion] = useState(false)
	const year = new Date().getFullYear()
	useEffect(() => {
		getVersion()
			.then(setVersion)
			.catch(() => setVersion(false))
	}, [])
	return (
		<div className='absolute bottom-0 !h-16 flex justify-center items-center w-full z-50 bg-primary'>
			<h1>Copyright © IT & Development - COOPMORTEROS {year} {version && (<>- Versión {version}</>)} </h1>
		</div>
	)
}

export default Footer
