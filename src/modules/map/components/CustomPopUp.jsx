function CustomPopUp({ content }) {
	return (
		<div className='rounded-lg p-0 min-w-36 border-2 border-gray-900 overflow-hidden'>
			<div className='bg-slate-400 border-b-2 border-gray-900 p-1 row'>
				<p className='namePopUp !m-0 text-md text-white font-semibold'>{content.name}</p>
			</div>
			<div className='bg-slate-800  text-green-400 pl-1 row items-center'>
				<p className='!m-0 font-bold  !mr textoPopUp'>R</p>
				<p className='!m-0 w-full font-bold  text-end !mr-3 textoPopUp'>{content.VL1}</p>
				<p className='!m-0 font-bold  !mr-2 textoPopUp'>A</p>
			</div>
			<div className='bg-slate-800 text-green-400  pl-1 row items-center'>
				<p className='!m-0 font-bold  !mr-2 textoPopUp'>S</p>
				<p className='!m-0 w-full font-bold  text-end !mr-3 textoPopUp'>{content.VL2}</p>
				<p className='!m-0 font-bold  !mr-2 textoPopUp'>A</p>
			</div>
			<div className='bg-slate-800 text-green-400 pl-1 flex justify-between items-center'>
				<p className='!m-0 font-bold  !mr-2 textoPopUp'>T</p>
				<p className='!m-0 w-full font-bold  text-end !mr-3 textoPopUp'>{content.VL3}</p>
				<p className={`textoPopUp !m-0 font-bold  !mr-2 textoPopUp`}>A</p>
			</div>
		</div>
	)
}

export default CustomPopUp
