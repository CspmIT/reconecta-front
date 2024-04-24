import React from 'react'
import { Outlet } from 'react-router-dom'
import Footer from '../components/Footer'
import style from '../utils/style.module.css'
import NavBarCustom from '../../NavBarCustom/views'
const MainContent = () => {
    // const authUser = storage.get('usuario')
    // console.log(authUser)
    // if (!authUser) {
    //     return <Navigate to='/Dashboard' />
    // }
    return (
        <div className='pt-16 !min-h-screen relative bg-gray-200 dark:bg-gray-600 '>
            <NavBarCustom />
            <div className={`pl-20 pt-4 pb-32 !min-h-[92vh]  flex relative w-full ${style.boxMain}`}>
                <Outlet />
            </div>
            <Footer />
        </div>
    )
}

export default MainContent
