export const storage = {
	get(key) {
		const val = localStorage.getItem(key)
		return val ? JSON.parse(val) : null
	},

	set(key, val) {
		localStorage.setItem(key, JSON.stringify(val))
	},

	remove(key) {
		localStorage.removeItem(key)
	},

	clear() {
		localStorage.clear()
	},
}
