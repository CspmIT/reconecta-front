import DiagramElectricity from '../components/DiagramElectricity'
import GrafTensiones from '../components/GrafTensiones'

const Diagrams = () => {
	return (
		<div className='w-full flex flex-row justify-center text-black dark:text-white relative mt-2 gap-2'>
			<div className='w-9/12 shadow-md h-min flex-row flex flex-wrap justify-between rounded-md bg-[#CFC4BE] dark:bg-[#303b41] pt-4'>
				<DiagramElectricity />
			</div>
			<div className='w-3/12 flex flex-col'>
				<div className='bg-white shadow-md dark:bg-gray-800 rounded-md mb-2 h-full flex justify-center items-center p-2'>
					<GrafTensiones data={[13, 5, 7, 9, 0, 11, 9, 8, 15]} title={'Grafico 1'} key={1} />
				</div>

				<div className='bg-white shadow-md dark:bg-gray-800 rounded-md h-full flex justify-center items-center p-2'>
					<GrafTensiones data={[3, 2, 3, 5, 10, 8, 9, 3, 5]} title={'Grafico 2'} key={2} />
				</div>
			</div>
		</div>
	)
}

export default Diagrams
