import React from 'react'
import { Outlet } from 'react-router-dom'
import NavBarCustom from '../components/NavBarCustom'
import Footer from '../components/Footer'
import style from '../utils/style.module.css'
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
