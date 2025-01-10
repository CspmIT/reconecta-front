export const getFormatterGraf = async (data, dataGrafico) => {
	const dataFormatter = dataGrafico.keys.reduce((acc, key) => {
		acc[key] = data[key]?.map((item) => item.value) || []
		return acc
	}, {})
	return {
		graf: createSeries(dataGrafico.names, dataGrafico.keys, dataFormatter),
		data: {
			...dataFormatter,
			DatePeriod: data.Date.map((item) => item.value),
		},
		titleGraf: dataGrafico.title,
		config: dataGrafico.config,
		disable: dataGrafico.disable,
		select: dataGrafico.select || false,
	}
}

export const createSeries = (names, dataKeys, data) => {
	return names.map((name, index) => ({
		name,
		data: data[dataKeys[index]],
	}))
}
