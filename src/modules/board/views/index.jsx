import DataBoard from '../components/dataBoard'

const Board = () => {
	return (
		<div className='w-full flex flex-row justify-center text-black dark:text-white relative pr-3'>
			<div className='w-full h-min flex-row flex flex-wrap justify-between rounded-md p-4 pb-8'>
				<div className='w-full flex flex-row justify-center'>
					<DataBoard />
				</div>
			</div>
		</div>
	)
}

export default Board
