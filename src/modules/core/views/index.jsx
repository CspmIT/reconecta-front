import React, { useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import style from '../utils/style.module.css'
import NavBarCustom from '../../NavBarCustom/views'
import { MainContext } from '../../../context/MainContext'
import Footer from '../components/Footer'
const MainContent = () => {
	const { user } = useContext(MainContext)
	// const authUser = storage.get('usuario')
	// console.log(authUser)
	// if (user) {
	// 	return <Navigate to='/login' />
	// }

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
