import React, { useContext, useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import style from '../utils/style.module.css'
import NavBarCustom from '../../NavBarCustom/views'
import { MainContext } from '../../../context/MainContext'
import Footer from '../components/Footer'
import { userPermisos } from '../utils/js/PermisosUser'
import Swal from 'sweetalert2'
import { storage } from '../../../storage/storage'
import { getData, removeData } from '../../../storage/cookies-store'
import LoaderComponent from '../../../components/Loader'
import { getPermissionDb } from '../../NavBarCustom/utils/js'
/*
 * Vistas que usan todo el alto de la ventana. En ellas el footer no se pega al
 * fondo ni reserva su lugar (pb-20): va en el flujo, abajo del pliegue, y los
 * 64px que ocupaba quedan para el contenido. El mapa es una pantalla de
 * monitoreo que muchos usuarios dejan abierta todo el dia en un monitor.
 */
const RUTAS_ALTO_COMPLETO = ['/map']

const MainContent = () => {
	const { user, setInfoNav } = useContext(MainContext)
	const location = useLocation()
	const altoCompleto = RUTAS_ALTO_COMPLETO.includes(location.pathname.toLowerCase())
	const navigate = useNavigate()
	const authUser = storage.get('usuario')
	const validationUser = async () => {
		const token = await getData('token')
		if (!authUser || !token) {
			localStorage.clear()
			await removeData('token')
			navigate('/login')
			return
		}
		if (userPermisos.find((perm) => perm.path == location.pathname && perm.status == 0)) {
			Swal.fire({ title: 'Atención!', icon: 'warning', text: 'No tenes accesso para esta vista', timer: 2000 })
			navigate('/Home')
		}
		if (!location.pathname.includes('/Abm/') && !location.pathname.includes('/AbmDevice/')) {
			setInfoNav('')
		}
	}
	// const [permissionDb, setPermissionDb] = useState(null)
	// const getPermisson = async () => {
	// 	const permiso = await getPermissionDb()
	// 	setPermissionDb(permiso)
	// }
	const [loading, setLoading] = useState(false)
	useEffect(() => {
		validationUser()
	}, [location])
	// useEffect(() => {
	// 	getPermisson()
	// }, [])
	return (
		<>
			{/*
			 * `rc-shell-full` hace que el contenedor mida la ventana y recorte, para
			 * que el footer que va en el flujo justo debajo quede fuera de lo que se
			 * ve y la pagina no scrollee. Sin el recorte la pagina scrollearia esos
			 * 64px y el mapa se meteria abajo del AppBar, que es fixed. La clase la
			 * define operational.css, que la limita a >=900px: abajo de eso el mapa
			 * se apila y recortar dejaria el panel inalcanzable.
			 */}
			<div
				className={`pt-16 !min-h-screen absolute w-full bg-gray-200 dark:bg-gray-700 ${
					altoCompleto ? 'rc-shell-full' : ''
				}`}
			>
				<NavBarCustom setLoading={setLoading} />
				{!loading ? (
					<LoaderComponent />
				) : (
					<>
						<div
							className={`sm:pl-20 pl-4 pr-4 pt-4 ${
								altoCompleto ? '' : 'pb-20'
							} z-10 flex relative ${style.boxMain}`}
						>
							<Outlet />
						</div>
						<Footer enFlujo={altoCompleto} />
					</>
				)}
			</div>
		</>
	)
}

export default MainContent
