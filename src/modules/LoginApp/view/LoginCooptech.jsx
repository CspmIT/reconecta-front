import { useNavigate, useParams } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import { requestLogin } from '../utils/requesLogin'
import { storage } from '../utils/storage'
import Swal from 'sweetalert2'
import { backend } from '../../../utils/routes/app.routes'
import { removeData, saveData } from '../../../storage/cookies-store'

const LoginCooptech = () => {
	const navigate = useNavigate()
	const { token } = useParams(['token'])
	const validateUserCooptech = async () => {
		try {
			if (token === 'null') {
				await removeData('token')
				storage.remove('usuario')
				storage.remove('tokenCooptech')
				navigate('/login')
			}
			storage.set('tokenCooptech', token)
			const decodedToken = jwtDecode(token)
			const url = backend[`${import.meta.env.VITE_APP_NAME}`] + '/loginCooptech'
			const info = {
				email: decodedToken.email,
				tokenCooptech: decodedToken.token,
				schemaName: decodedToken.iss.slice(4),
				influx_name: decodedToken.influx_name,
			}
			const responseData = await requestLogin(url, 'POST', info)
			const decoded = jwtDecode(responseData.token)
			// Obtengo la fecha de expiracion del token y la guardo en una cookie
			const expirationDate = new Date(decoded.exp)
			await saveData('token', token, {
				expires: expirationDate,
				secure: true,
				sameSite: 'Lax',
			})
			localStorage.setItem('usuario', JSON.stringify(decoded))
			navigate('/')
		} catch (error) {
			Swal.fire('Atencion', error.response?.data?.error || error.response?.data || error.message, 'error')
			await removeData('token')
			storage.remove('usuario')
			storage.remove('tokenCooptech')
			navigate('/login')
			return false
		}
	}
	validateUserCooptech()
	return <></>
}

export default LoginCooptech
