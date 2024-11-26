export const formatDataActivaImp = (data, unidad = 'kw', decimal = 2) => {
	const dataActivaImp = [
		{
			title: 'Activa L1',
			ip: '1.1.21.7.0.255',
			value: data.IAcP_0?.value.toFixed(decimal) ?? 'sin datos',
			uni: unidad,
		},
		{
			title: 'Activa L2',
			ip: '1.1.41.7.0.255',
			value: data.IAcP_1?.value.toFixed(decimal) ?? 'sin datos',
			uni: unidad,
		},
		{
			title: 'Activa L3',
			ip: '1.1.61.7.0.255',
			value: data.IAcP_2?.value.toFixed(decimal) ?? 'sin datos',
			uni: unidad,
		},
		{
			title: 'Activa Total',
			ip: '1.1.1.7.0.255',
			value: data.IAcP_3?.value.toFixed(decimal) ?? 'sin datos',
			uni: unidad,
		},
	]

	return dataActivaImp
}
export const formatDataAparenteImp = (data, unidad = 'kw', decimal = 2) => {
	if (unidad == 'kw') {
		unidad = 'kVA'
	} else {
		unidad = 'MVA'
	}
	const dataAparenteImp = [
		{
			title: 'Aparente L1',
			ip: '1.1.29.7.0.255',
			value: data.IApP_0?.value.toFixed(decimal) ?? 'sin datos',
			uni: unidad,
		},
		{
			title: 'Aparente L2',
			ip: '1.1.49.7.0.255',
			value: data.IApP_1?.value.toFixed(decimal) ?? 'sin datos',
			uni: unidad,
		},
		{
			title: 'Aparente L3',
			ip: '1.1.69.7.0.255',
			value: data.IApP_2?.value.toFixed(decimal) ?? 'sin datos',
			uni: unidad,
		},
		{
			title: 'Aparente Total',
			ip: '1.1.9.7.0.255',
			value: data.IApP_3?.value.toFixed(decimal) ?? 'sin datos',
			uni: unidad,
		},
	]

	return dataAparenteImp
}
export const formatDataReactivaImp = (data, unidad = 'kw', decimal = 2) => {
	if (unidad == 'kw') {
		unidad = 'kVAr'
	} else {
		unidad = 'MVAr'
	}
	const dataReactivaImp = [
		{
			title: 'Reactiva L1',
			ip: '1.1.23.7.0.255',
			value: data.IReP_0?.value.toFixed(decimal) ?? 'sin datos',
			uni: unidad,
		},
		{
			title: 'Reactiva L2',
			ip: '1.1.43.7.0.255',
			value: data.IReP_1?.value.toFixed(decimal) ?? 'sin datos',
			uni: unidad,
		},
		{
			title: 'Reactiva L3',
			ip: '1.1.63.7.0.255',
			value: data.IReP_2?.value.toFixed(decimal) ?? 'sin datos',
			uni: unidad,
		},
		{
			title: 'Reactiva Total',
			ip: '1.1.3.7.0.255',
			value: data.IReP_3?.value.toFixed(decimal) ?? 'sin datos',
			uni: unidad,
		},
	]

	return dataReactivaImp
}
export const formatDataActivaExp = (data, unidad = 'kw', decimal = 2) => {
	const dataActivaExp = [
		{
			title: 'Activa L1',
			ip: '1.1.22.7.0.255',
			value: data.EAcP_0?.value.toFixed(decimal) ?? 'sin datos',
			uni: unidad,
		},
		{
			title: 'Activa L2',
			ip: '1.1.42.7.0.255',
			value: data.EAcP_1?.value.toFixed(decimal) ?? 'sin datos',
			uni: unidad,
		},
		{
			title: 'Activa L3',
			ip: '1.1.62.7.0.255',
			value: data.EAcP_2?.value.toFixed(decimal) ?? 'sin datos',
			uni: unidad,
		},
		{
			title: 'Activa Total',
			ip: '1.1.2.7.0.255',
			value: data.EAcP_3?.value.toFixed(decimal) ?? 'sin datos',
			uni: unidad,
		},
	]

	return dataActivaExp
}
export const formatDataAparenteExp = (data, unidad = 'kw', decimal = 2) => {
	if (unidad == 'kw') {
		unidad = 'kVA'
	} else {
		unidad = 'MVA'
	}
	const dataAparenteExp = [
		{
			title: 'Aparente L1',
			ip: '1.1.30.7.0.255',
			value: data.EApP_0?.value.toFixed(decimal) ?? 'sin datos',
			uni: unidad,
		},
		{
			title: 'Aparente L2',
			ip: '1.1.50.7.0.255',
			value: data.EApP_1?.value.toFixed(decimal) ?? 'sin datos',
			uni: unidad,
		},
		{
			title: 'Aparente L3',
			ip: '1.1.70.7.0.255',
			value: data.EApP_2?.value.toFixed(decimal) ?? 'sin datos',
			uni: unidad,
		},
		{
			title: 'Aparente Total',
			ip: '1.1.10.7.0.255',
			value: data.EApP_3?.value.toFixed(decimal) ?? 'sin datos',
			uni: unidad,
		},
	]

	return dataAparenteExp
}
export const formatDataReactivaExp = (data, unidad = 'kw', decimal = 2) => {
	if (unidad == 'kw') {
		unidad = 'kVAr'
	} else {
		unidad = 'MVAr'
	}
	const dataReactivaExp = [
		{
			title: 'Reactiva L1',
			ip: '1.1.24.7.0.255',
			value: data.EReP_0?.value.toFixed(decimal) ?? 'sin datos',
			uni: unidad,
		},
		{
			title: 'Reactiva L2',
			ip: '1.1.44.7.0.255',
			value: data.EReP_1?.value.toFixed(decimal) ?? 'sin datos',
			uni: unidad,
		},
		{
			title: 'Reactiva L3',
			ip: '1.1.64.7.0.255',
			value: data.EReP_2?.value.toFixed(decimal) ?? 'sin datos',
			uni: unidad,
		},
		{
			title: 'Reactiva Total',
			ip: '1.1.4.7.0.255',
			value: data.EReP_3?.value.toFixed(decimal) ?? 'sin datos',
			uni: unidad,
		},
	]

	return dataReactivaExp
}

export const formatDataReactivaCuadrante = (data, unidad = 'kw', decimal = 2) => {
	if (unidad == 'kw') {
		unidad = 'kVAr'
	} else {
		unidad = 'MVAr'
	}
	const dataReactivaCuadrante = [
		{
			title: 'Cuadrante 1',
			ip: '1.1.5.7.0.255',
			value: data.Q12_ReP_0?.value.toFixed(decimal) ?? 'sin datos',
			uni: unidad,
		},
		{
			title: 'Cuadrante 2',
			ip: '1.1.6.7.0.255',
			value: data.Q12_ReP_1?.value.toFixed(decimal) ?? 'sin datos',
			uni: unidad,
		},
		{
			title: 'Cuadrante 1',
			ip: '1.1.7.7.0.255',
			value: data.Q34_ReP_0?.value.toFixed(decimal) ?? 'sin datos',
			uni: unidad,
		},
		{
			title: 'Cuadrante 1',
			ip: '1.1.8.7.0.255',
			value: data.Q34_ReP_1?.value.toFixed(decimal) ?? 'sin datos',
			uni: unidad,
		},
	]

	return dataReactivaCuadrante
}
