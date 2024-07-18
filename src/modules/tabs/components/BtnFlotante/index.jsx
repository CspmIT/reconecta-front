import { Add } from '@mui/icons-material'
import { IconButton } from '@mui/material'
import React, { useContext } from 'react'
import { MainContext } from '../../../../context/MainContext'
import { useLocation } from 'react-router-dom'

function BtnFlotante() {
	const location = useLocation()
	const { setTabs } = useContext(MainContext)
	const addTab = () => {
		setTabs((prevTabs) => [
			...prevTabs,
			{
				name: 'Hola Nuevo',
				component: (
					<>
						<h1 className='text-black'>Holaaa Nuevo</h1>
					</>
				),
			},
		])
	}
	return (
		<IconButton
			onClick={addTab}
			className={`!fixed !bottom-20 !p-4 !right-20 !z-[999]  !bg-blue-600 !text-white ${
				location.pathname == '/Home' ? '!hidden' : ''
			}`}
		>
			<Add />
		</IconButton>
	)
}

export default BtnFlotante
