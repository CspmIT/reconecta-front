import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(localizedFormat)
dayjs.extend(customParseFormat)

// Configurar el adaptador globalmente
const locale = 'es' // Opcional: configurar el idioma deseado
dayjs.locale(locale)

/**
 * Formatea una fecha en un string con el formato 'YYYY/MM/DD'.
 *
 * @param {Date|string} date - Fecha que se desea formatear, puede ser un objeto Date o un string válido.
 * @returns {string} Fecha formateada en el formato 'YYYY/MM/DD'.
 * @author [Jose Romani] <jose.romani@hotmail.com>
 */
export const formatDate = (date) => {
	return dayjs(date).format('YYYY/MM/DD')
}
/**
 * Convierte un string de fecha en formato 'DD/MM/YYYY HH:mm:ss' a un objeto Date,
 * y opcionalmente suma una cantidad de horas.
 *
 * @param {string} date - Fecha en formato 'DD/MM/YYYY HH:mm:ss'.
 * @param {number} [hour=0] - Cantidad de horas a sumar a la fecha (por defecto es 0).
 * @returns {Date} Objeto Date con la fecha y hora ajustada.
 * @author [Jose Romani] <jose.romani@hotmail.com>
 */
export const formatStrToDate = (date, hour = 0) => {
	return dayjs(date, 'DD/MM/YYYY HH:mm:ss').add(hour, 'hour').toDate()
}

export const calculoTiempoDuracion = (segundos) => {
	if (segundos <= 0) return '0 Seg.'

	// Convertir segundos a días, horas, minutos y segundos restantes
	const dias = Math.floor(segundos / 86400)
	segundos %= 86400
	const horas = Math.floor(segundos / 3600)
	segundos %= 3600
	const minutos = Math.floor(segundos / 60)
	segundos = Math.round(((segundos % 60) + Number.EPSILON) * 100) / 100

	// Crear una lista con las partes del tiempo
	const partes = []
	if (dias > 0) partes.push(`${dias} Día(s)`)
	if (horas > 0) partes.push(`${horas} Hora(s)`)
	if (minutos > 0) partes.push(`${minutos} Min`)
	if (segundos > 0) partes.push(`${segundos} Seg`)

	// Unir las partes en un solo string
	return partes.join(', ')
}
