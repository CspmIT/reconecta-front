import axios from 'axios'

export async function getImage(fileName) {
	const urlImage = `https://storageov.cooptech.com.ar/minio/getImg/reconecta/${fileName}`
	const image = await axios({
		method: 'GET',
		url: urlImage,
		withCredentials: true,
		headers: {
			accesskey: import.meta.env.VITE_MINIO_ACCESS,
			secretkey: import.meta.env.VITE_MINIO_SECRET,
			Accept: 'image/*',
		},
		responseType: 'blob',
	})

	return URL.createObjectURL(image.data)
}

export async function saveImage(image) {
	const formData = new FormData()
	formData.append('image', image)
	formData.append('bucketName', 'reconecta')
	const urlImage = `https://storageov.cooptech.com.ar/minio/uploadImg`
	const response = await axios({
		method: 'POST',
		url: urlImage,
		data: formData,
		headers: {
			accesskey: import.meta.env.VITE_MINIO_ACCESS,
			secretkey: import.meta.env.VITE_MINIO_SECRET,
			'Content-Type': 'multipart/form-data',
		},
	})
	return response.data.fileName
}
