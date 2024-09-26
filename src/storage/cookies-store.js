import Cookies from 'js-cookie'
import { Store } from 'tauri-plugin-store-api'

// Función para detectar si estamos en un entorno Tauri
function isTauri() {
	return typeof window.__TAURI__ !== 'undefined'
}

// Crear una instancia de Store para Tauri
const store = isTauri() ? new Store('.storage/user-data.dat') : null
console.log(new Store('.storage/user-data.dat'))
// Guardar datos condicionalmente
export async function saveData(key, value, cookieOptions = {}) {
	try {
		if (isTauri()) {
			await store.set(key, value)
			await store.save()
		} else {
			Cookies.set(key, value, cookieOptions)
		}
	} catch (error) {
		console.error('Error saving data:', error)
	}
}

// Obtener datos condicionalmente
export async function getData(key) {
	try {
		if (isTauri()) {
			return await store.get(key)
		} else {
			return Cookies.get(key)
		}
	} catch (error) {
		console.error('Error getting data:', error)
	}
}

// Eliminar datos condicionalmente
export async function removeData(key) {
	try {
		if (isTauri()) {
			await store.delete(key)
			await store.save()
		} else {
			Cookies.remove(key)
		}
	} catch (error) {
		console.error('Error removing data:', error)
	}
}
