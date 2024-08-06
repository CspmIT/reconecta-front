import React, { useContext, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import style from '../utils/style.module.css'
import NavBarCustom from '../../NavBarCustom/views'
import { MainContext } from '../../../context/MainContext'
import Footer from '../components/Footer'
const MainContent = () => {
	const { user, setInfoNav } = useContext(MainContext)
	const location = useLocation()
	// const authUser = storage.get('usuario')
	// console.log(authUser)
	// if (user) {
	// 	return <Navigate to='/login' />
	// }
	console.log(user)
	useEffect(() => {
		if (!location.pathname.includes('/Abm/')) {
			setInfoNav('')
		}
	}, [location])
	return (
		<>
			<div className='pt-16 !min-h-screen absolute w-full bg-gray-200 dark:bg-gray-700 '>
				<NavBarCustom />
				<div className={`pl-20 pr-4 pt-4 pb-20 z-10 flex relative ${style.boxMain}`}>
					<Outlet />
				</div>
				<Footer />
			</div>
		</>
	)
}

export default MainContent
