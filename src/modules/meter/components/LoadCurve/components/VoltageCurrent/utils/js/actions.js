import { formatStrToDate } from '../../../../../../../../utils/js/formatDate'

export const getTableVoltageCurrent = async (data) => {
	const dataFormatter = data.V_0.map((item, index) => {
		return {
			datePeriod: formatStrToDate(data.Date[index].value, 3),
			TensionL1: item.value,
			TensionL2: data.V_1[index].value,
			TensionL3: data.V_2[index].value,
			CorrienteL1: data.I_0[index].value,
			CorrienteL2: data.I_1[index].value,
			CorrienteL3: data.I_2[index].value,
		}
	})
	const dataReturn = dataFormatter.sort((a, b) => b.datePeriod - a.datePeriod)
	return dataReturn
}
