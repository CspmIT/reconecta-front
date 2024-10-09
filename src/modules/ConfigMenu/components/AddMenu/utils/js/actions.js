import Swal from 'sweetalert2'
import { backend } from '../../../../../../utils/routes/app.routes'
import { request } from '../../../../../../utils/js/request'

export const createNewMenu = async (menu, sub) => {
	try {
		const { value: result } = await Swal.fire({
			title: 'Atención!',
			text: sub ? `¿Queres crear un nuevo sub menu de ${menu.name}?` : '¿Queres crear un nuevo menu?',
			icon: 'question',
			allowOutsideClick: false,
			showDenyButton: true,
			showCancelButton: false,
			confirmButtonText: 'Sí',
			denyButtonText: `No`,
		})

		if (result) {
			const { value: formValues } = await Swal.fire({
				title: `Crear Nuevo ${sub ? 'Sub' : ''} Menú`,
				html: `
					<label class="w-full flex justify-center text-xl mt-3 mb-2">Nombre</label>
					<input placeholder="Nombre del menu" id="swal-name" class="swal2-input m-0 w-full">
					<label class="w-full flex justify-center text-xl mt-3 mb-2">Link</label>
					<input placeholder="Link de la vista" id="swal-link" class="swal2-input m-0 w-full">
					<label class="w-full flex justify-center text-xl mt-3 mb-2">Icono</label>
					<input placeholder="Icono de react para el menu" id="swal-icon" class="swal2-input m-0 w-full">
				`,
				focusConfirm: false,
				showCancelButton: true,
				allowOutsideClick: false,
				preConfirm: () => {
					const name = document.getElementById('swal-name').value
					const link = document.getElementById('swal-link').value
					const icon = document.getElementById('swal-icon').value
					if (!validationInputs([{ name: 'name', value: name }])) {
						return false
					}
					const groupNro = sub
						? menu.group_menu
						: Math.max(...Object.values(menu).map((x) => parseInt(x.group_menu))) + 1
					const level = sub ? menu.level + 1 : 1
					const data = {
						id: 0,
						name,
						link,
						icon,
						group_menu: groupNro,
						level: level,
						sub_menu: sub ? menu.id : null,
						subMenus: [],
						status: 1,
					}

					// Retornar el objeto con los valores si son válidos
					return data
				},
			})

			if (formValues) {
				const result = await request(`${backend[import.meta.env.VITE_APP_NAME]}/saveMenu`, 'POST', formValues)
				if (result) {
					return formValues
				} else {
					throw new Error('Error al guardar el Menu')
				}
			}
		}
	} catch (error) {
		Swal.fire({
			title: '¡Atención!',
			text: error.message,
			icon: 'warning',
		})
	}
}
export const editMenu = async (menu) => {
	try {
		if (!menu) {
			throw new Error('Falta datos del menu a editar')
		}
		const { value: formValues } = await Swal.fire({
			title: `Editar Menú`,
			html: `
				<label class="w-full flex justify-center text-xl mt-3 mb-2">Nombre</label>
				<input placeholder="Nombre del menu" id="swal-name" class="swal2-input m-0 w-full" value=${menu.name}>
				<label class="w-full flex justify-center text-xl mt-3 mb-2">Link</label>
				<input placeholder="Link de la vista" id="swal-link" class="swal2-input m-0 w-full" value=${menu.link}>
				<label class="w-full flex justify-center text-xl mt-3 mb-2">Icono</label>
				<input placeholder="Icono de react para el menu" id="swal-icon" class="swal2-input m-0 w-full" value=${menu.icon}>
			`,
			focusConfirm: false,
			showCancelButton: true,
			allowOutsideClick: false,
			preConfirm: () => {
				const name = document.getElementById('swal-name').value
				const link = document.getElementById('swal-link').value
				const icon = document.getElementById('swal-icon').value
				if (!validationInputs([{ name: 'name', value: name }])) {
					return false
				}
				return {
					...menu,
					name,
					link,
					icon,
				}
			},
		})
		if (formValues) {
			const result = await request(`${backend[import.meta.env.VITE_APP_NAME]}/saveMenu`, 'POST', formValues)
			if (result) {
				return formValues
			} else {
				throw new Error('Error al guardar el Menu')
			}
		}
	} catch (error) {
		Swal.fire({
			title: '¡Atención!',
			text: error.message,
			icon: 'warning',
		})
	}
}
export const validationInputs = (inputs = []) => {
	inputs.map(
		(item) =>
			(document.getElementById(`swal-${item.name}`).style.borderColor = item.value.trim() === '' ? 'red' : '')
	)
	if (inputs.some((item) => item.value.trim() === '')) {
		Swal.showValidationMessage(`Por favor completa todos los campos obligatorios.`)
		return false
	}
	return true
}
