// Servicio API del ABM de Tipos de Elemento.
//
// Endpoints (back-reconecta / routes/ElementType.routes.js):
//   GET    /ElementTypes   → listar (con sus abreviaturas)
//   POST   /ElementType    → crear  { name, abrevs: string[] }
//   PATCH  /ElementType    → editar { id, name, abrevs: string[] }
//   DELETE /ElementType    → eliminar { id }  (rechaza si el tipo está en uso)

import { request } from '../../../utils/js/request'
import { backend } from '../../../utils/routes/app.routes'

// Mapea un tipo del backend al shape consumido por el front.
// Expone `abrev` como array plano de strings para mantener compatibilidad
// con el ABM de elementos (Abm/views), y `abrevs` crudo para edición.
export const mapTypeFromBackend = (t) => ({
	id: t.id,
	name: t.name,
	status: t.status,
	abrev: (t.abrevs || []).map((a) => a.abrev),
})

export const listElementTypes = async () => {
	const { data } = await request(`${backend.Reconecta}/ElementTypes`, 'GET')
	return data.map(mapTypeFromBackend)
}

export const createElementType = async ({ name, abrevs }) => {
	const { data } = await request(`${backend.Reconecta}/ElementType`, 'POST', { name, abrevs })
	return data
}

export const updateElementType = async ({ id, name, abrevs }) => {
	const { data } = await request(`${backend.Reconecta}/ElementType`, 'PATCH', { id, name, abrevs })
	return data
}

export const removeElementType = async (id) => {
	const { data } = await request(`${backend.Reconecta}/ElementType`, 'DELETE', { id })
	return data
}
