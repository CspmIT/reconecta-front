import { calculoTiempoDuracion, formatStrToDate } from '../../../../../../utils/js/formatDate'

export const formatterDataTable = async (data) => {
	if (data.length == 0) return []
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
					if (parseInt(value) == 0 && parseFloat(data[`${item.slice(0, -1)}1`][index].value) < 0.1) {
						value = 'S/M'
					} else {
						value =
							((parseFloat(value) * data.VT_0[index].value) / data.VT_1[index].value).toFixed(0) + ' V'
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
			const combination = `${resultado[`D${i}_0`][index]}-${resultado[`D${i}_1`][index]}-${
				resultado[`D${i}_2`][index]
			}-${resultado[`D${i}_3`][index]}`
			if (!uniqueSet.has(combination)) {
				uniqueSet.add(combination)
				acc.push({
					fase: resultado[`D${i}_3`][index],
					duration: resultado[`D${i}_1`][index],
					Amplitud: resultado[`D${i}_2`][index],
					datePeriod: formatStrToDate(resultado[`D${i}_0`][index]),
				})
			}
		}
		return acc
	}, [])

	return arrayResult
}

export const formatterDataModal = async (data) => {
	if (data.length == 0) return []
	const arrayResult = [
		{
			name: 'Duración Mínima',
			Fase1: calculoTiempoDuracion(data.min_0[0].value),
			Fase2: calculoTiempoDuracion(data.min_0[1].value),
			Fase3: calculoTiempoDuracion(data.min_0[2].value),
		},
		{
			name: 'Fecha',
			Fase1: data.min_1[0].value,
			Fase2: data.min_1[1].value,
			Fase3: data.min_1[2].value,
		},
		{
			name: 'Duración Máxima',
			Fase1: calculoTiempoDuracion(data.max_0[0].value),
			Fase2: calculoTiempoDuracion(data.max_0[1].value),
			Fase3: calculoTiempoDuracion(data.max_0[2].value),
		},
		{
			name: 'Fecha',
			Fase1: data.max_1[0].value,
			Fase2: data.max_1[1].value,
			Fase3: data.max_1[2].value,
		},

		{
			name: 'Duración Total',
			Fase1: calculoTiempoDuracion(data.tot[0].value),
			Fase2: calculoTiempoDuracion(data.tot[1].value),
			Fase3: calculoTiempoDuracion(data.tot[2].value),
		},
		{
			name: 'Eventos',
			Fase1: data.Eventos[0].value,
			Fase2: data.Eventos[1].value,
			Fase3: data.Eventos[2].value,
		},
	]
	return arrayResult
}
