import { formatStrToDate } from '../../../../../../../../utils/js/formatDate'

export const getTableCosenoFi = async (data) => {
	const dataFormatter = data.CFi_0.map((item, index) => {
		return {
			datePeriod: formatStrToDate(data.Date[index].value, 3),
			Cos1: item.value,
			Cos2: data.CFi_1[index].value,
			Cos3: data.CFi_2[index].value,
		}
	})
	const dataReturn = dataFormatter.sort((a, b) => b.datePeriod - a.datePeriod)
	return dataReturn
}
