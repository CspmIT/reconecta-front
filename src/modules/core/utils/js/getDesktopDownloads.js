export const getDesktopDownloads = async () => {
	const res = await fetch('https://storageov.cooptech.com.ar/releases/downloads.json', {
		cache: 'no-store',
	})

	if (!res.ok) {
		throw new Error('No se pudo obtener el último release')
	}

	return await res.json()
}
