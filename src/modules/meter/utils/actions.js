import { request } from '../../../utils/js/request'
import { backend } from '../../../utils/routes/app.routes'

// Datos instantáneos del medidor (VI + máximos mensual/histórico)
export const DataInsta = async (info) => {
	try {
		const meter = await request(
			`${backend[`${import.meta.env.VITE_APP_NAME}`]}/getMetrologyInsta?serial=${info.serial}&version=${
				info.version
			}&brand=${info.brand}`,
			'GET'
		)
		return meter.data
	} catch (error) {
		throw new Error('Error al traer datos instantaneos')
	}
}
