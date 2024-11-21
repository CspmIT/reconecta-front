import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(localizedFormat)
dayjs.extend(customParseFormat)

// Configurar el adaptador globalmente
const locale = 'es' // Opcional: configurar el idioma deseado
dayjs.locale(locale)

// Función para formatear la fecha al formato 'MM/DD/YYYY'
export const formatDate = (date) => {
	return dayjs(date).format('YYYY/MM/DD')
}
// Función para pasar de un string 'DD/MM/YYYY HH:mm:ss' a tipo Date
export const formatStrToDate = (date) => {
	return dayjs(date, 'DD/MM/YYYY HH:mm:ss').toDate()
}
