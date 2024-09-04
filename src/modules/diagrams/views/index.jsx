import DiagramElectricity from '../components/DiagramElectricity'
import GrafTensiones from '../components/GrafTensiones'

const Diagrams = () => {
	return (
		<div className='w-full flex flex-wrap justify-center text-black dark:text-white relative mt-2'>
			<div className='w-full shadow-md  overflow-hidden !h-[100vh] relative rounded-md bg-[#CFC4BE] dark:bg-[#303b41] pt-4'>
				<DiagramElectricity />
			</div>
			<div className='w-full flex flex-wrap'>
				<div className='p-2 md:w-1/2 w-full'>
					<div className='bg-white shadow-md dark:bg-gray-800 rounded-md h-full flex justify-center items-center p-2'>
						<GrafTensiones data={[13, 5, 7, 9, 0, 11, 9, 8, 15]} title={'Grafico 1'} key={1} />
					</div>
				</div>
				<div className='p-2 md:w-1/2 w-full'>
					<div className='bg-white shadow-md dark:bg-gray-800 rounded-md h-full flex justify-center items-center p-2'>
						<GrafTensiones data={[3, 2, 3, 5, 10, 8, 9, 3, 5]} title={'Grafico 2'} key={2} />
					</div>
				</div>
			</div>
		</div>
	)
}

export default Diagrams
