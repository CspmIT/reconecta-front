import { calculoTiempoDuracion, formatStrToDate } from '../../../../../../../../utils/js/formatDate'

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
				}
				dataReturn.get(item).push(value)
			})
		}
	})

	const resultado = Object.fromEntries(dataReturn)
	const uniqueSet = new Set()
	const arrayResult = resultado.D1_0.reduce((acc, _, index) => {
		for (let i = 1; i <= 10; i++) {
			const combination = `${resultado[`D${i}_0`][index]}-${resultado[`D${i}_1`][index]}`
			if (!uniqueSet.has(combination)) {
				uniqueSet.add(combination)
				acc.push({
					duration: resultado[`D${i}_1`][index],
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
		},
		{
			name: 'Fecha',
			Fase1: data.min_1[0].value,
		},
		{
			name: 'Duración Máxima',
			Fase1: calculoTiempoDuracion(data.max_0[0].value),
		},
		{
			name: 'Fecha',
			Fase1: data.max_1[0].value,
		},

		{
			name: 'Duración Total',
			Fase1: calculoTiempoDuracion(data.tot[0].value),
		},
		{
			name: 'Eventos',
			Fase1: data.Eventos[0].value,
		},
	]
	return arrayResult
}
