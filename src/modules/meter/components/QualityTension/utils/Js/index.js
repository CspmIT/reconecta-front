import { calculoTiempoDuracion, formatStrToDate } from '../../../../../../utils/js/formatDate'

export const formatterDataTable = async (data) => {
	// Sin datos del medidor (respuesta vacia, 'sin datos' o sin los slots D1..D10)
	if (!data || data === 'sin datos' || data.length == 0 || !Array.isArray(data.D1_0)) return []
	const dataReturn = new Map()
	Object.keys(data).forEach((item) => {
		if (!item.includes('VT')) {
			if (!dataReturn.has(item)) {
				dataReturn.set(item, [])
			}
			data?.[item].forEach((elem, index) => {
				const num = item.slice(-1)
				let value = elem.value

				if (num == 1) {
					value = calculoTiempoDuracion(value)
				} else if (num == 2) {
					const duracion = data[`${item.slice(0, -1)}1`]?.[index]?.value
					const vt0 = data.VT_0?.[index]?.value
					const vt1 = data.VT_1?.[index]?.value
					if (parseInt(value) == 0 && parseFloat(duracion) < 0.1) {
						value = 'S/M'
					} else if (vt0 !== undefined && vt1) {
						value = ((parseFloat(value) * vt0) / vt1).toFixed(0) + ' V'
					} else {
						value = parseFloat(value).toFixed(0) + ' V'
					}
				} else if (num == 3) {
					if (value != 1 && value != 2 && value != 3) {
						value = '-'
					}
				}
				dataReturn.get(item).push(value)
			})
		}
	})

	const resultado = Object.fromEntries(dataReturn)
	const uniqueSet = new Set()
	const arrayResult = resultado.D1_0.reduce((acc, _, index) => {
		for (let i = 1; i <= 10; i++) {
			const fecha = resultado[`D${i}_0`]?.[index]
			if (fecha === undefined) continue
			const combination = `${fecha}-${resultado[`D${i}_1`]?.[index]}-${
				resultado[`D${i}_2`]?.[index]
			}-${resultado[`D${i}_3`]?.[index]}`
			if (!uniqueSet.has(combination)) {
				uniqueSet.add(combination)
				acc.push({
					fase: resultado[`D${i}_3`]?.[index] ?? '-',
					duration: resultado[`D${i}_1`]?.[index] ?? '-',
					Amplitud: resultado[`D${i}_2`]?.[index] ?? '-',
					datePeriod: formatStrToDate(fecha),
				})
			}
		}
		return acc
	}, [])

	return arrayResult
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
