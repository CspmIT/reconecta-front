import Swal from 'sweetalert2'
import { request } from '../../../utils/js/request'
import { backend } from '../../../utils/routes/app.routes'

export const checkAlert = async (table, rowCriticos) => {
	try {
		const eventCheck = []
		const { value: result } = await Swal.fire({
			title: 'Atención!',
			html: `¿Está seguro de que desea limpiar ${
				!table.getState().globalFilter ? 'todas las alertas' : 'las alertas filtradas'
			}  ?`,
			icon: 'warning',
			showCancelButton: true,
			allowOutsideClick: false,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Si',
			cancelButtonText: 'No, cancelar',
		})
		if (result) {
			const changeRows = await rowCriticos.alta.map((row, index) => {
				if (!table.getState().globalFilter || table?.getRowModel()?.rows?.some((item) => item.index == index)) {
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
