import DiagramElectricity from '../components/DiagramElectricity'

const Diagrams = () => {
	return (
		<div className='w-full flex flex-row justify-center text-black dark:text-white relative pr-3'>
			<div className='w-full h-min flex-row flex flex-wrap justify-between rounded-md bg-slate-50 dark:bg-gray-800 p-4 pb-8'>
				<DiagramElectricity />
			</div>
		</div>
	)
}

export default Diagrams
