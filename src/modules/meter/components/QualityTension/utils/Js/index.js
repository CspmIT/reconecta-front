import { calculoTiempoDuracion, formatStrToDate } from '../../../../../../utils/js/formatDate'

export const formatterDataTable = async (data) => {
	// Los topicos calidad/An* publican UN antecedente por registro:
	// D_0 = fecha, D_1 = duracion (segundos), D_2 = amplitud, D_3 = fase (1/2/3).
	// VT_0/VT_1 llegan aparte (ultimo status/Fasorial) para convertir la amplitud.
	if (!data || data === 'sin datos' || data.length == 0 || !Array.isArray(data.D_0)) return []
	const vt0 = data.VT_0?.at(-1)?.value
	const vt1 = data.VT_1?.at(-1)?.value

	const uniqueSet = new Set()
	return data.D_0.reduce((acc, item, index) => {
		const fecha = item?.value
		if (fecha === undefined) return acc
		const rawDur = data.D_1?.[index]?.value
		const rawAmp = data.D_2?.[index]?.value
		const rawFase = data.D_3?.[index]?.value
		// El buffer se re-publica: se descartan las combinaciones repetidas
		const combination = `${fecha}-${rawDur}-${rawAmp}-${rawFase}`
		if (uniqueSet.has(combination)) return acc
		uniqueSet.add(combination)

		let amplitud = '-'
		if (rawAmp !== undefined) {
			if (parseInt(rawAmp) == 0 && parseFloat(rawDur) < 0.1) {
				amplitud = 'S/M'
			} else if (vt0 !== undefined && vt1) {
				amplitud = ((parseFloat(rawAmp) * vt0) / vt1).toFixed(0) + ' V'
			} else {
				amplitud = parseFloat(rawAmp).toFixed(0) + ' V'
			}
		}

		acc.push({
			fase: rawFase == 1 || rawFase == 2 || rawFase == 3 ? rawFase : '-',
			duration: rawDur !== undefined ? calculoTiempoDuracion(rawDur) : '-',
			Amplitud: amplitud,
			datePeriod: formatStrToDate(fecha),
		})
		return acc
	}, [])
}

export const formatterDataModal = async (data) => {
	// Sin resumen publicado por el medidor
	if (!data || data === 'sin datos' || data.length == 0 || !Array.isArray(data.min_0)) return []
	const arrayResult = [
		{
			name: 'Duración Mínima',
			Fase1: calculoTiempoDuracion(data.min_0?.[0]?.value ?? 0),
			Fase2: calculoTiempoDuracion(data.min_0?.[1]?.value),
			Fase3: calculoTiempoDuracion(data.min_0?.[2]?.value),
		},
		{
			name: 'Fecha',
			Fase1: data.min_1?.[0]?.value,
			Fase2: data.min_1?.[1]?.value,
			Fase3: data.min_1?.[2]?.value,
		},
		{
			name: 'Duración Máxima',
			Fase1: calculoTiempoDuracion(data.max_0?.[0]?.value),
			Fase2: calculoTiempoDuracion(data.max_0?.[1]?.value),
			Fase3: calculoTiempoDuracion(data.max_0?.[2]?.value),
		},
		{
			name: 'Fecha',
			Fase1: data.max_1?.[0]?.value,
			Fase2: data.max_1?.[1]?.value,
			Fase3: data.max_1?.[2]?.value,
		},

		{
			name: 'Duración Total',
			Fase1: calculoTiempoDuracion(data.tot?.[0]?.value),
			Fase2: calculoTiempoDuracion(data.tot?.[1]?.value),
			Fase3: calculoTiempoDuracion(data.tot?.[2]?.value),
		},
		{
			name: 'Eventos',
			Fase1: data.Eventos?.[0]?.value,
			Fase2: data.Eventos?.[1]?.value,
			Fase3: data.Eventos?.[2]?.value,
		},
	]
	return arrayResult
}
