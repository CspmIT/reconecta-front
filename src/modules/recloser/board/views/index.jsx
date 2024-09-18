import DataBoard from '../components/dataBoard'

const Board = () => {
	return (
		<div className='w-full flex flex-row justify-center text-black dark:text-white relative'>
			<div className='w-full h-min flex-row flex flex-wrap justify-between rounded-md md:p-4 p-0 pb-8'>
				<div className='w-full flex flex-row justify-center'>
					<DataBoard />
				</div>
			</div>
		</div>
	)
}

export default Board
