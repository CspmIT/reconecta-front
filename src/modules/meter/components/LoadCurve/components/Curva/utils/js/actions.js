import { formatStrToDate } from '../../../../../../../../utils/js/formatDate'

export const getTableCurva = async (data) => {
	const dataFormatter = data.V_0.map((item, index) => {
		return {
			datePeriod: formatStrToDate(data.Date[index].value, 3),
			Canal1: item.value,
			Canal2: data.V_1[index].value,
			Canal3: data.V_2[index].value,
			Canal4: data.CFi[index].value,
			Canal5: data.AcP_0[index].value,
			Canal6: data.AcP_1[index].value,
			Canal7: data.AcP_2[index].value,
			Canal8: data.AIP_1[index].value,
			Event: data.Ev[index].value ?? '-',
		}
	})
	const dataReturn = dataFormatter.sort((a, b) => b.datePeriod - a.datePeriod)
	return dataReturn
}
