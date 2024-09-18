import React, { useContext, useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import style from '../utils/style.module.css'
import NavBarCustom from '../../NavBarCustom/views'
import { MainContext } from '../../../context/MainContext'
import Footer from '../components/Footer'
import { userPermisos } from '../utils/js/PermisosUser'
import Swal from 'sweetalert2'
import { storage } from '../../../storage/storage'
import Cookies from 'js-cookie'
const MainContent = () => {
	const { user, setInfoNav } = useContext(MainContext)
	const location = useLocation()
	const navigate = useNavigate()
	const authUser = storage.get('usuario')

	useEffect(() => {
		if (!authUser || !Cookies.get('token')) {
			localStorage.clear()
			Cookies.remove('token')
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
	}, [location])
	return (
		<>
			<div className='pt-16 !min-h-screen absolute w-full bg-gray-200 dark:bg-gray-700 '>
				<NavBarCustom />
				<div className={`sm:pl-20 pl-4 pr-4 pt-4 pb-20 z-10 flex relative ${style.boxMain}`}>
					<Outlet />
				</div>
				<Footer />
			</div>
		</>
	)
}

export default MainContent
