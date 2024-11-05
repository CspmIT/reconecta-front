import GrafAreaHome from './GrafAreaHome'

function Grafs() {
	return (
		<>
			<div className='chartContainer bg-white dark:bg-gray-800 rounded-lg shadow-gray-500 shadow-md drop-shadow-md p-3 h-44 w-full sm:w-[48%] lg:w-[19%] mb-4'>
				<GrafAreaHome
					numVal={4}
					alert
					title={'Reconectadores abiertos'}
					data={[8, 9, 3, 5, 3, 2, 3, 5, 10]}
					colorStatus={'#0e8703'}
				/>
			</div>
			<div className='chartContainer bg-white dark:bg-gray-800 rounded-lg shadow-gray-500 shadow-md drop-shadow-md p-3 h-44 w-full sm:w-[48%] lg:w-[19%] mb-4'>
				<GrafAreaHome
					numVal={1}
					title={'Reconectadores en alarma'}
					data={[8, 9, 3, 5, 3, 2, 3, 5, 10]}
					colorStatus={'#FFC107'}
				/>
			</div>
			<div className='chartContainer bg-white dark:bg-gray-800 rounded-lg shadow-gray-500 shadow-md drop-shadow-md p-3 h-44 w-full sm:w-[48%] lg:w-[19%] mb-4'>
				<GrafAreaHome
					numVal={5}
					title={'Equipos Offline'}
					data={[8, 9, 3, 5, 3, 2, 3, 5, 10]}
					colorStatus={'#ff0707'}
				/>
			</div>
			<div className='chartContainer bg-white dark:bg-gray-800 rounded-lg shadow-gray-500 shadow-md drop-shadow-md p-3 h-44 w-full sm:w-[48%] lg:w-[19%] mb-4'>
				<GrafAreaHome
					numVal={4}
					title={'Equipos sin alimentacion AC'}
					data={[8, 9, 3, 5, 3, 2, 3, 5, 10]}
					colorStatus={'#ff0707'}
				/>
			</div>
			<div className='chartContainer bg-white dark:bg-gray-800 rounded-lg shadow-gray-500 shadow-md drop-shadow-md p-3 h-44 w-full sm:w-[48%] lg:w-[19%] mb-4'>
				<GrafAreaHome
					numVal={3}
					title={'Cantidad total de activos'}
					data={[8, 9, 3, 5, 3, 2, 3, 5, 10]}
					colorStatus={'#0e8703'}
				/>
			</div>
		</>
	)
}
export default Grafs
