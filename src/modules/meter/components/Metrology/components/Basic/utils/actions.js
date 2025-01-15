import { request } from '../../../../../../../utils/js/request'
import { backend } from '../../../../../../../utils/routes/app.routes'

export const DataInsta = async (info) => {
	try {
		const meter = await request(
			`${backend[`${import.meta.env.VITE_APP_NAME}`]}/getMetrologyInsta?serial=${info.serial}&version=${
				info.version
			}&brand=${info.brand}`,
			'GET'
		)
		return meter.data
	} catch (error) {
		throw new Error('Error al traer datos instantaneos')
	}
}
export const formatDataTension = (data) => {
	const VT_0 = data.VI?.VT_0?.value ?? 0
	const VT_1 = data.VI?.VT_1?.value ?? 0
	const dataTension = [
		{
			title: 'Tensión L1',
			ip: '1.1.32.7.0.255',
			value: data.VI.V_0.value,
			uni: 'V',
			infoAdic: {
				month: {
					value: parseFloat((data.maxMonth?.RMS_Max_6?.value * VT_0) / VT_1) ?? 'sin datos',
					uni: 'V',
				},
				maxHistory: {
					value: parseFloat((data.maxHistory?.RMS_Max_6?.value * VT_0) / VT_1) ?? 'sin datos',
					uni: 'V',
				},
			},
		},
		{
			title: 'Tensión L2',
			ip: '1.1.52.7.0.255',
			value: data.VI.V_1.value,
			uni: 'V',
			infoAdic: {
				month: {
					value: parseFloat((data.maxMonth?.RMS_Max_8?.value * VT_0) / VT_1) ?? 'sin datos',
					uni: 'V',
				},
				maxHistory: {
					value: parseFloat((data.maxHistory?.RMS_Max_8?.value * VT_0) / VT_1) ?? 'sin datos',
					uni: 'V',
				},
			},
		},
		{
			title: 'Tensión L3',
			ip: '1.1.72.7.0.255',
			value: data.VI.V_2.value,
			uni: 'V',
			infoAdic: {
				month: {
					value: parseFloat((data.maxMonth?.RMS_Max_10?.value * VT_0) / VT_1) ?? 'sin datos',
					uni: 'V',
				},
				maxHistory: {
					value: parseFloat((data.maxHistory?.RMS_Max_10?.value * VT_0) / VT_1) ?? 'sin datos',
					uni: 'V',
				},
			},
		},
		{
			title: 'Tensión N',
			ip: '1.1.92.7.0.255',
			value: data.VI?.V_3?.value ?? 'sin datos',
			uni: 'V',
		},
	]
	return dataTension
}
export const formatDataCorriente = (data) => {
	const CT_0 = data.VI?.CT_0?.value ?? 0
	const CT_1 = data.VI?.CT_1?.value ?? 0
	const dataCorriente = [
		{
			title: 'Corriente L1',
			ip: '1.1.31.7.0.255',
			value: data.VI.I_0.value,
			uni: 'A',
			infoAdic: {
				month: {
					value: parseFloat((data.maxMonth?.RMS_Max_0?.value * CT_0) / CT_1) ?? 'sin datos',
					uni: 'A',
				},
				maxHistory: {
					value: parseFloat((data.maxHistory?.RMS_Max_0?.value * CT_0) / CT_1) ?? 'sin datos',
					uni: 'A',
				},
			},
		},
		{
			title: 'Corriente L2',
			ip: '1.1.51.7.0.255',
			value: data.VI.I_1.value,
			uni: 'A',
			infoAdic: {
				month: {
					value: parseFloat((data.maxMonth?.RMS_Max_2?.value * CT_0) / CT_1) ?? 'sin datos',
					uni: 'A',
				},
				maxHistory: {
					value: parseFloat((data.maxHistory?.RMS_Max_2?.value * CT_0) / CT_1) ?? 'sin datos',
					uni: 'A',
				},
			},
		},
		{
			title: 'Corriente L3',
			ip: '1.1.71.7.0.255',
			value: data.VI.I_2.value,
			uni: 'A',
			infoAdic: {
				month: {
					value: parseFloat((data.maxMonth?.RMS_Max_4?.value * CT_0) / CT_1) ?? 'sin datos',
					uni: 'A',
				},
				maxHistory: {
					value: parseFloat((data.maxHistory?.RMS_Max_4?.value * CT_0) / CT_1) ?? 'sin datos',
					uni: 'A',
				},
			},
		},
		{
			title: 'Corriente N',
			ip: '1.1.91.7.0.255',
			value: data.VI.I_3.value,
			uni: 'A',
		},
	]
	return dataCorriente
}
export const formatDataCosenoFi = (data) => {
	const dataCoseno = [
		{
			title: 'Cos ϕ L1',
			ip: '1.1.33.7.0.255',
			value: data.VI?.CFi_0?.value ?? 'sin datos',
			uni: '',
		},
		{
			title: 'Cos ϕ L2',
			ip: '1.1.53.7.0.255',
			value: data.VI?.CFi_1?.value ?? 'sin datos',
			uni: '',
		},
		{
			title: 'Cos ϕ L3',
			ip: '1.1.73.7.0.255',
			value: data.VI?.CFi_2?.value ?? 'sin datos',
			uni: '',
		},
		{
			title: 'Cos ϕ Total',
			ip: '1.1.13.7.0.255',
			value: data.VI?.CFi_3?.value ?? 'sin datos',
			uni: '',
		},
	]
	return dataCoseno
}
export const formatDataDemanda = (data) => {
	const dataDemanda = [
		{
			title: 'Actual',
			ip: '1.1.1.4.0.255',
			value: data.VI?.RDe_0?.value ?? 'sin datos',
			uni: 'kW',
		},
		{
			title: 'Último promedio',
			ip: '1.1.1.5.0.255',
			value: data.VI?.RDe_1?.value ?? 'sin datos',
			uni: 'kW',
		},
	]
	return dataDemanda
}
