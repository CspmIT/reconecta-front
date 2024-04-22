import { WbSunny } from '@mui/icons-material'
import { IconButton } from '@mui/material'
import React, { useState } from 'react'
import { FaMoon } from 'react-icons/fa'

function ButtonModeDark() {
    const [darkMode, setDarkMode] = useState(true)
    const [iconMode, setIconMode] = useState(<WbSunny className='change  text-gray-700' />)
    function handleClick() {
        if (darkMode) {
            document.body.classList.add('dark')
        } else {
            document.body.classList.remove('dark')
        }
        setIconMode(darkMode ? <FaMoon className='change text-gray-700' /> : <WbSunny className='change  text-gray-700' />)
        setDarkMode(!darkMode)
    }
    return (
        <IconButton size='medium' className='shadow-none !rounded-full' onClick={() => handleClick()}>
            {iconMode}
        </IconButton>
    )
}

export default ButtonModeDark
