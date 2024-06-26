import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
dayjs.extend(localizedFormat)

// Configurar el adaptador globalmente
const locale = 'es' // Opcional: configurar el idioma deseado
dayjs.locale(locale)

// Función para formatear la fecha al formato 'MM/DD/YYYY'
export const formatDate = (date) => {
	return dayjs(date).format('YYYY/MM/DD')
}
