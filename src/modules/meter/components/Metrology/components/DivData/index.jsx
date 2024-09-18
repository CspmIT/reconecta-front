import { useState } from 'react'

function DivData({ data }) {
	const [see, setSee] = useState(false)
	return (
		<div className='relative flex m-1  justify-center'>
			<div
				className='w-full flex flex-col justify-center items-center'
				onMouseEnter={() => setSee(true)}
				onMouseLeave={() => setSee(false)}
			>
				<p className='md:text-lg'>{data.title}</p>
				<p className='text-sm md:text-base'>{data.ip}</p>
				<p className='text-lg md:text-2xl font-bold'>
					{data.value} {data.uni}
				</p>
			</div>
			{data.infoAdic && (
				<div
					className={`absolute bg-[#585ca6] p-4 z-20 top-full rounded-xl shadow-md shadow-slate-600 text-white ${
						see ? '' : 'hidden'
					}`}
				>
					<p className='text-lg'>
						Max. Mes Anterior: {data.infoAdic.month.value} {data.infoAdic.month.uni}
					</p>
					<p className='text-lg'>
						Max. Histórico: {data.infoAdic.maxHistory.value} {data.infoAdic.maxHistory.uni}
					</p>
				</div>
			)}
			{data.infoAdicEnergy && (
				<div
					className={`absolute bg-[#585ca6] p-4 z-20 grid gap-3 grid-cols-3 top-full rounded-xl shadow-md shadow-slate-600 text-white ${
						see ? '' : 'hidden'
					}`}
				>
					{data.infoAdicEnergy.map((item, index) => (
						<div key={index} className='w-full flex flex-col justify-center items-center p-1 gap-1'>
							<p className='text-base'>{item.title}</p>
							<p className='text-sm'>{item.ip}</p>
							<p className='text-xl'>
								<span className='font-bold'>{item.value}</span> {item.uni}
							</p>
						</div>
					))}
				</div>
			)}
		</div>
	)
}

export default DivData
