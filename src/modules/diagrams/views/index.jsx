import DiagramElectricity from '../components/DiagramElectricity'
import GrafTensiones from '../components/GrafTensiones'

const Diagrams = () => {
	return (
		<div className='flex flex-col w-full'>
			{/* <div className='flex w-full h-36 bg-gray-200 gap-3'>
				<div className='w-1/2 flex'>
					<GrafTensiones />
				</div>
				<div className='w-1/2 flex'>
					<GrafTensiones />
				</div>
			</div> */}
			<div className='w-full flex flex-row justify-center text-black dark:text-white relative mt-2'>
				<div className='w-full h-min flex-row flex flex-wrap justify-between rounded-md bg-slate-50 dark:bg-gray-800 p-4 pb-8'>
					<DiagramElectricity />
				</div>
			</div>
		</div>
	)
}

export default Diagrams
