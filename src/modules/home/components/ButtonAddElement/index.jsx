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
		<div className='flex flex-col w-full relative'>
			<Fab
				onClick={handleOpen}
				className='!absolute right-6 !flex !justify-center !items-center'
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
				<em className='!text-black ml-3 underline'>Nomenclatura Catastral</em>
				<div className='ml-3'>
					<MenuItem onClick={() => changeView('/Abm/node')} className='hover:!bg-slate-300 !rounded-lg'>
						<p className='text-black font-semibold'>Nodo de Infraestructura</p>
					</MenuItem>
				</div>
				<Divider sx={{ my: 0.5 }} />
				<em className='!text-black ml-3 underline'>Dispositivos</em>
				<div className='ml-3'>
					<MenuItem
						onClick={() => changeView('/AbmDevice/recloser')}
						className='hover:!bg-slate-300 !rounded-lg'
					>
						<p className='text-black font-semibold'>Reconectador</p>
					</MenuItem>
					{/* <MenuItem onClick={() => changeView('/AbmDevice/meter')} className='hover:!bg-slate-300 !rounded-lg'>
					<p className='text-black font-semibold'>Medidor</p>
				</MenuItem>
				<MenuItem
					onClick={() => changeView('/AbmDevice/netAnalyzer')}
					className='hover:!bg-slate-300 !rounded-lg'
				>
					<p className='text-black font-semibold'>Analizador de Red</p>
				</MenuItem> */}
				</div>
			</Popper>
		</div>
	)
}

export default ButtonAddElement
