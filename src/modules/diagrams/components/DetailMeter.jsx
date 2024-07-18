import { useState } from 'react'
import '../utils/css/styleDiagram.modules.css'
import ModalDetail from './ModalDetail'
import { Button, IconButton } from '@mui/material'
import { BiWindowOpen } from 'react-icons/bi'
// import ModalDetail from './ModalDetail'
function DetailMeter({ position, data }) {
	const { x, y } = position
	const { name, R, S, T, Mva, object } = data
	const [modalData, setModalData] = useState(null)

	const handleShowModal = () => {
		setModalData({ object })
	}
	const closeModal = () => {
		setModalData(null)
	}
	return (
		<>
			<div
				className='absolute rounded-lg p-0 w-36 border-2 border-gray-900 overflow-hidden'
				style={{ left: `${x}px`, top: `${y}px` }}
			>
				<div className='bg-slate-400 border-b-2 border-gray-900 p-2 flex justify-between'>
					<p className='nameDetail !m-0 text-lg text-white text-center !lowercase font-semibold'>{name}</p>
					<IconButton
						onClick={handleShowModal}
						size='small'
						className=' !bg-[#bce1fc] hover:!bg-[#74bdf2] !text-black !shadow-md'
					>
						<BiWindowOpen />
					</IconButton>
				</div>
				<div className='bg-slate-800 flex text-green-400 pl-1 justify-between items-center'>
					<p className='!m-0 w-full font-bold text-center !mr-3 textoMva'>{Mva}</p>
				</div>
				<div className='bg-slate-800 flex text-green-400 pl-1'>
					<p className='!m-0 font-bold !mr-2 textoDetail'>R</p>
					<p className='!m-0 w-full font-bold text-end !mr-3 textoDetail'>{R}</p>
				</div>
				<div className='bg-slate-800 flex text-green-400 border-y-2 border-gray-900 pl-1'>
					<p className='!m-0 font-bold !mr-2 textoDetail'>S</p>
					<p className='!m-0 w-full font-bold text-end !mr-3 textoDetail'>{S}</p>
				</div>
				<div className='bg-slate-800 flex text-green-400 pl-1 justify-between items-center'>
					<p className='!m-0 font-bold !mr-2 textoDetail'>T</p>
					<p className='!m-0 w-full font-bold text-end !mr-3 textoDetail'>{T}</p>
				</div>
			</div>
			{<ModalDetail data={modalData} close={closeModal} />}
		</>
	)
}

export default DetailMeter
