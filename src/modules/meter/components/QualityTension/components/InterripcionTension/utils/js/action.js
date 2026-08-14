import { calculoTiempoDuracion, formatStrToDate } from '../../../../../../../../utils/js/formatDate'

export const formatterDataTable = async (data) => {
	// El topico calidad/anInt publica UN antecedente por registro:
	// D_0 = fecha, D_1 = valor numerico (duracion en segundos)
	if (!data || data === 'sin datos' || data.length == 0 || !Array.isArray(data.D_0)) return []
	const uniqueSet = new Set()
	return data.D_0.reduce((acc, item, index) => {
		const fecha = item?.value
		const valor = data.D_1?.[index]?.value
		if (fecha === undefined) return acc
		// El buffer se re-publica: se descartan las combinaciones repetidas
		const combination = `${fecha}-${valor}`
		if (uniqueSet.has(combination)) return acc
		uniqueSet.add(combination)
		acc.push({
			duration: valor !== undefined ? calculoTiempoDuracion(valor) : '-',
			datePeriod: formatStrToDate(fecha),
		})
		return acc
	}, [])
}

export const formatterDataModal = async (data) => {
	// Fields de calidad/ReInt: min_0/min_1, max_0/max_1, tot (segundos)
	// y los contadores Ev_breves / Ev_prolon (no existe 'Eventos' como en las otras secciones)
	if (!data || data === 'sin datos' || data.length == 0 || !Array.isArray(data.min_0)) return []
	const arrayResult = [
		{
			name: 'Duración Mínima',
			Fase1: calculoTiempoDuracion(data.min_0?.[0]?.value),
		},
		{
			name: 'Fecha',
			Fase1: data.min_1?.[0]?.value,
		},
		{
			name: 'Duración Máxima',
			Fase1: calculoTiempoDuracion(data.max_0?.[0]?.value),
		},
		{
			name: 'Fecha',
			Fase1: data.max_1?.[0]?.value,
		},
		{
			name: 'Duración Total',
			Fase1: calculoTiempoDuracion(data.tot?.[0]?.value),
		},
		{
			name: 'Eventos breves',
			Fase1: data.Ev_breves?.[0]?.value,
		},
		{
			name: 'Eventos prolongados',
			Fase1: data.Ev_prolon?.[0]?.value,
		},
	]
	return arrayResult
}
