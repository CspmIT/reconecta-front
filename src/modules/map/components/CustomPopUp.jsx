import { Modal } from "@mui/material"

function CustomPopUpRecloser({ content, open, handleClose }) {
	return (
		<div className='rounded-lg p-0 min-w-36 border-2 border-gray-900 overflow-hidden'>
			<div className='bg-slate-400 border-b-2 border-gray-900 p-1 row'>
				<p className='namePopUp !m-0 text-md text-white font-semibold'>{content.info.name}</p>
			</div>
			<div className='bg-slate-800 text-white pl-1 row items-center'>
				<p className='!m-0 font-bold !mr'>Equipos instalados: {content.equipments.length}</p>
			</div>
			<Modal open={open} onClose={handleClose}>
				<div className='bg-slate-800 text-white p-2'>
					{content.equipments.map((equipment, index) => (
						<div key={index} className='flex items-center'>
							<p className='!m-0 font-bold !mr'>Equipo {index + 1}: </p>
							<p className='!m-0'>{equipment.name}</p>
						</div>
					))}
				</div>
			</Modal>
		</div>
	)
}

export default CustomPopUpRecloser
