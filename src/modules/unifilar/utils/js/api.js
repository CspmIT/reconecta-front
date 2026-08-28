import axios from 'axios'
import { request } from '../../../../utils/js/request'
import { backend } from '../../../../utils/routes/app.routes'
import { storage } from '../../../../storage/storage'
import { getData } from '../../../../storage/cookies-store'

const base = () => backend[`${import.meta.env.VITE_APP_NAME}`]

export const getPlans = async () => {
	const { data } = await request(`${base()}/unifilarPlans`, 'GET')
	return data
}

export const getPlan = async (id) => {
	const { data } = await request(`${base()}/unifilarPlan/${id}`, 'GET')
	return data
}

// Snapshot de datos en vivo de los equipos vinculados del plano
export const getPlanLive = async (id) => {
	const { data } = await request(`${base()}/unifilarPlan/${id}/live`, 'GET')
	return data
}

export const reprocessPlan = async (id) => {
	const { data } = await request(`${base()}/unifilarPlan/${id}/process`, 'POST')
	return data
}

// Guarda la red que armó el usuario: { model: { escala, nodos, elementos } }.
// El DWG no se edita — es el calco y queda como vino.
export const updatePlan = async (id, payload) => {
	const { data } = await request(`${base()}/unifilarPlan/${id}`, 'PUT', payload)
	return data
}

export const deletePlan = async (id) => {
	const { data } = await request(`${base()}/unifilarPlan/${id}`, 'DELETE')
	return data
}

// Upload aparte de request(): multipart necesita que axios arme solo el
// Content-Type con el boundary.
export const uploadPlan = async (file, name) => {
	let token = await getData('token')
	if (!token) {
		token = storage.get('tokenCooptech')
	}
	const formData = new FormData()
	formData.append('file', file)
	if (name) formData.append('name', name)
	const { data } = await axios.post(`${base()}/unifilarPlan`, formData, {
		withCredentials: true,
		headers: { Authorization: 'Bearer ' + token },
	})
	return data
}
