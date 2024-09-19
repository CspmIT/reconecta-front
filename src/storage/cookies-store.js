import Cookies from 'js-cookie'
import { Store } from '@tauri-apps/plugin-store'

// Crear una instancia de Store para Tauri (en caso de estar en desktop)
const store = window.__TAURI__ ? new Store('.storage/user-data.dat') : null

// Función para detectar si estamos en un entorno Tauri
function isTauri() {
	return typeof window.__TAURI__ !== 'undefined'
}

// Guardar datos condicionalmente
export async function saveData(key, value, cookieOptions = {}) {
	if (isTauri()) {
		await store.set(key, value)
		await store.save()
	} else {
		Cookies.set(key, value, cookieOptions)
	}
}

// Obtener datos condicionalmente
export async function getData(key) {
	if (isTauri()) {
		return await store.get(key)
	} else {
		return Cookies.get(key)
	}
}

// Eliminar datos condicionalmente
export async function removeData(key) {
	if (isTauri()) {
		await store.delete(key)
		await store.save()
	} else {
		Cookies.remove(key)
	}
}
