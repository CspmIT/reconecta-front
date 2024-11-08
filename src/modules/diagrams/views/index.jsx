import DiagramElectricity from '../components/DiagramElectricity'
import GrafTensiones from '../components/GrafTensiones'

const Diagrams = () => {
	return (
		<div className='w-full flex flex-wrap justify-center text-black dark:text-white relative'>
			<div className='w-full shadow-md  overflow-hidden !h-[90vh] relative rounded-md bg-[#CFC4BE] dark:bg-[#303b41] '>
				<DiagramElectricity />
			</div>
			<div className='w-full flex flex-wrap'>
				<div className='p-2 w-full'>
					<div className='bg-white shadow-md dark:bg-gray-800 rounded-md h-full flex justify-center items-center p-2'>
						<GrafTensiones
							data={[
								{ value: 10140, date: '2024-11-08T08:29:00.000Z' },
								{ value: 10146, date: '2024-11-08T08:44:00.000Z' },
								{ value: 9966, date: '2024-11-08T08:59:00.000Z' },
								{ value: 9624, date: '2024-11-08T09:07:00.000Z' },
								{ value: 9402, date: '2024-11-08T09:22:00.000Z' },
								{ value: 8964, date: '2024-11-08T09:37:00.000Z' },
								{ value: 9090, date: '2024-11-08T09:52:00.000Z' },
								{ value: 9024, date: '2024-11-08T10:07:00.000Z' },
								{ value: 9108, date: '2024-11-08T10:22:00.000Z' },
								{ value: 8934, date: '2024-11-08T10:37:00.000Z' },
								{ value: 9144, date: '2024-11-08T10:52:00.000Z' },
								{ value: 9396, date: '2024-11-08T11:07:00.000Z' },
							]}
							title={'MVA Barra'}
							key={1}
						/>
					</div>
				</div>
				{/* <div className='p-2 md:w-1/2 w-full'>
					<div className='bg-white shadow-md dark:bg-gray-800 rounded-md h-full flex justify-center items-center p-2'>
						<GrafTensiones data={[3, 2, 3, 5, 10, 8, 9, 3, 5]} title={'Grafico 2'} key={2} />
					</div>
				</div> */}
			</div>
		</div>
	)
}

export default Diagrams
