export const formatDataEnergyImp = (data) => {
	const dataEnergyImp = [
		{
			title: 'Activa Total',
			ip: '1.1.1.8.0.255',
			value: data.IAcE_3?.value ?? 'sin datos',
			uni: 'kWh',
			infoAdicEnergy: [
				{
					title: 'Activa L1',
					ip: '1.1.21.8.0.255',
					value: data.IAcE_0?.value ?? 'sin datos',
					uni: 'kWh',
				},
				{
					title: 'Activa L2',
					ip: '1.1.41.8.0.255',
					value: data.IAcE_1?.value ?? 'sin datos',
					uni: 'kWh',
				},
				{
					title: 'Activa L3',
					ip: '1.1.61.8.0.255',
					value: data.IAcE_2?.value ?? 'sin datos',
					uni: 'kWh',
				},
			],
		},
		{
			title: 'Aparente Total',
			ip: '1.1.9.8.0.255',
			value: data.IApE_3?.value ?? 'sin datos',
			uni: 'kVAr',
			infoAdicEnergy: [
				{
					title: 'Aparente L1',
					ip: '1.1.29.8.0.255',
					value: data.IApE_0?.value ?? 'sin datos',
					uni: 'kVAh',
				},
				{
					title: 'Aparente L2',
					ip: '1.1.49.8.0.255',
					value: data.IApE_1?.value ?? 'sin datos',
					uni: 'kVAh',
				},
				{
					title: 'Aparente L3',
					ip: '1.1.69.8.0.255',
					value: data.IApE_2?.value ?? 'sin datos',
					uni: 'kVAh',
				},
			],
		},
		{
			title: 'Reactiva Total',
			ip: '1.1.3.8.0.255',
			value: data.IReE_3?.value ?? 'sin datos',
			uni: 'kVArh',
			infoAdicEnergy: [
				{
					title: 'Reactiva L1',
					ip: '1.1.23.8.0.255',
					value: data.IReE_0?.value ?? 'sin datos',
					uni: 'kVArh',
				},
				{
					title: 'Reactiva L2',
					ip: '1.1.43.8.0.255',
					value: data.IReE_1?.value ?? 'sin datos',
					uni: 'kVArh',
				},
				{
					title: 'Reactiva L3',
					ip: '1.1.63.8.0.255',
					value: data.IReE_2?.value ?? 'sin datos',
					uni: 'kVArh',
				},
			],
		},
	]

	return dataEnergyImp
}
export const formatDataEnergyExp = (data) => {
	const dataEnergyExp = [
		{
			title: 'Activa Total',
			ip: '1.1.2.8.0.255',
			value: data.EAcE_3?.value ?? 'sin datos',
			uni: 'kWh',
			infoAdicEnergy: [
				{
					title: 'Activa L1',
					ip: '1.1.22.8.0.255',
					value: data.EAcE_0?.value ?? 'sin datos',
					uni: 'kWh',
				},
				{
					title: 'Activa L2',
					ip: '1.1.42.8.0.255',
					value: data.EAcE_1?.value ?? 'sin datos',
					uni: 'kWh',
				},
				{
					title: 'Activa L3',
					ip: '1.1.62.8.0.255',
					value: data.EAcE_2?.value ?? 'sin datos',
					uni: 'kWh',
				},
			],
		},
		{
			title: 'Aparente Total',
			ip: '1.1.10.8.0.255',
			value: data.EApE_3?.value ?? 'sin datos',
			uni: 'kVAr',
			infoAdicEnergy: [
				{
					title: 'Aparente L1',
					ip: '1.1.30.8.0.255',
					value: data.EApE_0?.value ?? 'sin datos',
					uni: 'kVAh',
				},
				{
					title: 'Aparente L2',
					ip: '1.1.50.8.0.255',
					value: data.EApE_1?.value ?? 'sin datos',
					uni: 'kVAh',
				},
				{
					title: 'Aparente L3',
					ip: '1.1.70.8.0.255',
					value: data.EApE_2?.value ?? 'sin datos',
					uni: 'kVAh',
				},
			],
		},
		{
			title: 'Reactiva Total',
			ip: '1.1.4.8.0.255',
			value: data.EReE_3?.value ?? 'sin datos',
			uni: 'kVArh',
			infoAdicEnergy: [
				{
					title: 'Reactiva L1',
					ip: '1.1.24.8.0.255',
					value: data.EReE_0?.value ?? 'sin datos',
					uni: 'kVArh',
				},
				{
					title: 'Reactiva L2',
					ip: '1.1.44.8.0.255',
					value: data.EReE_1?.value ?? 'sin datos',
					uni: 'kVArh',
				},
				{
					title: 'Reactiva L3',
					ip: '1.1.64.8.0.255',
					value: data.EReE_2?.value ?? 'sin datos',
					uni: 'kVArh',
				},
			],
		},
	]

	return dataEnergyExp
}
