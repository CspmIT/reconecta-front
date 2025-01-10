import { IconButton, MenuItem, Popper, Typography } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { HiSwitchHorizontal } from 'react-icons/hi'

function BtnChangeTable({ fnClick, table }) {
	const dropdownRef = useRef(null)
	const divRef = useRef(null)
	const [anchorEl, setAnchorEl] = useState(null)
	const [openSub, setOpenSub] = useState(false)

	const handleOpen = (event) => {
		setOpenSub(true)
		setAnchorEl(event.currentTarget)
	}

	const handleClose = () => {
		setOpenSub(false)
		setAnchorEl(null)
	}

	const handleClick = (option) => {
		fnClick(option) // Ejecuta la función pasada como prop
		handleClose() // Cierra el Popper
	}

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target) &&
				divRef.current &&
				!divRef.current.contains(event.target)
			) {
				handleClose()
			}
		}
		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [])

	return (
		<div className='flex justify-center items-center absolute left-5 ' ref={dropdownRef}>
			<Typography variant='h6' className='text-white !font-bold'>
				{table ? 'Registros' : 'Modo Avanzado'}
			</Typography>
			<IconButton onClick={!openSub ? handleOpen : handleClose} className={`${openSub ? '!bg-[#5252522f]' : ''}`}>
				<HiSwitchHorizontal />
			</IconButton>

			<Popper
				className='bg-slate-100 z-40 gap-1 p-2 rounded-lg shadow-md flex flex-col justify-start'
				placement='bottom-start'
				open={openSub}
				ref={divRef}
				anchorEl={anchorEl}
			>
				<MenuItem onClick={() => handleClick('reg')} className='hover:!bg-slate-300 !rounded-lg'>
					<p className='text-black font-semibold'>Ver registros</p>
				</MenuItem>

				<MenuItem onClick={() => handleClick('adv')} className='hover:!bg-slate-300 !rounded-lg'>
					<p className='text-black font-semibold'>Ver modo avanzado</p>
				</MenuItem>
			</Popper>
		</div>
	)
}

export default BtnChangeTable
