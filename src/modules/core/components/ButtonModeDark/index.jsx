import { WbSunny } from '@mui/icons-material'
import { IconButton } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import { FaMoon } from 'react-icons/fa'
import { MainContext } from '../../../../context/MainContext'
import { storage } from '../../../../storage/storage'

function ButtonModeDark() {
	const { darkMode, setDarkMode } = useContext(MainContext)

	const [iconMode, setIconMode] = useState(
		darkMode ? <WbSunny className='change  text-gray-700' /> : <FaMoon className='change text-gray-700' />
	)
	function handleClick() {
		if (!darkMode) {
			storage.set('dark', true)
			document.body.classList.add('dark')
		} else {
			storage.set('dark', false)
			document.body.classList.remove('dark')
		}
		setIconMode(
			darkMode ? <FaMoon className='change text-gray-700' /> : <WbSunny className='change  text-gray-700' />
		)
		setDarkMode(!darkMode)
	}
	useEffect(() => {
		storage.set('dark', darkMode)
	}, [])

	return (
		<IconButton size='medium' className='shadow-none !rounded-full' onClick={() => handleClick()}>
			{iconMode}
		</IconButton>
	)
}

export default ButtonModeDark
