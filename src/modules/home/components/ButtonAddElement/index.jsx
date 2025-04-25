import { Divider, Fab, IconButton, MenuItem, Popper } from '@mui/material'
import React, { useContext, useState } from 'react'
import { BiPlus } from 'react-icons/bi'
import { MainContext } from '../../../../context/MainContext'
import { useNavigate } from 'react-router-dom'
import { Add, Minimize } from '@mui/icons-material'

function ButtonAddElement() {
	const [anchorEl, setAnchorEl] = useState(null)
	const [openSub, setOpenSub] = useState(false)
	const { setInfoNav } = useContext(MainContext)
	const navigate = useNavigate()
	const changeView = (nameView) => {
		setInfoNav(nameView)
		navigate(`${nameView}`)
	}
	const handleOpen = (evento) => {
		setOpenSub(!openSub)
		setAnchorEl(evento.currentTarget)
	}
	return (
		<>
			<Fab
				onClick={handleOpen}
				className='!flex !justify-center !items-center'
				size='small'
				color='primary'
				aria-label='add'
			>
				{openSub ? <Minimize className='!-top-0 absolute' /> : <Add />}
			</Fab>
			<Popper
				className='bg-slate-100 z-40 gap-1 p-2 rounded-lg shadow-md flex flex-col justify-start'
				placement='left-start'
				open={openSub}
				anchorEl={anchorEl}
			>
				<div className='ml-3'>
					<MenuItem onClick={() => changeView('/addElement')} className='hover:!bg-slate-300 !rounded-lg'>
						<p className='text-black font-semibold'>Nuevo Nodo</p>
					</MenuItem>
				</div>
				<Divider sx={{ my: 0.5 }} />
				<div className='ml-3'>
					<MenuItem
						onClick={() => changeView('/Equipment')}
						className='hover:!bg-slate-300 !rounded-lg'
					>
						<p className='text-black font-semibold'>Nuevo Equipo</p>
					</MenuItem>
				</div>
			</Popper>
		</>
	)
}

export default ButtonAddElement
