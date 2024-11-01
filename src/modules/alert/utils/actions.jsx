import Swal from 'sweetalert2'
import { request } from '../../../utils/js/request'
import { backend } from '../../../utils/routes/app.routes'

export const checkAlert = async (table, rowCriticos) => {
	try {
		const eventCheck = []
		const { value: result } = await Swal.fire({
			title: 'Atención!',
			html: '¿Está seguro de que desea limpiar las alertas críticas?',
			icon: 'warning',
			showCancelButton: true,
			allowOutsideClick: false,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Si',
			cancelButtonText: 'No, cancelar',
		})
		if (result) {
			const { value: result2 } = await Swal.fire({
				title: 'Atención!',
				html: '¿Deseas limpiar toda la tabla o solo la pag actual?',
				icon: 'warning',
				showCancelButton: true,
				allowOutsideClick: false,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Actual',
				cancelButtonText: 'Toda la tabla',
			})
			const changeRows = await rowCriticos.alta.map((row, index) => {
				if (!result2 || table?.getRowModel()?.rows?.some((item) => item.index == index)) {
					if (row.statusAlert) {
						if (!eventCheck.some((item) => item.id_device == row.id_device)) {
							eventCheck.push({
								id_device: row.id_device,
								type: row.typeDevice,
								date_check: new Date(),
							})
						}
					}
					row.statusAlert = 0
				}
				return row
			})
			return { changeRows, eventCheck }
		}
		return false
	} catch (error) {
		throw error
	}
}

export const saveChecks = async (events) => {
	try {
		await request(`${backend.Reconecta}/saveLogsChecks`, 'POST', events)
		console.log(events)
		return true
	} catch (error) {
		throw error
	}
}
