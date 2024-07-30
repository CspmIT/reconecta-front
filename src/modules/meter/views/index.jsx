import DataBoardMeter from '../components/DataBoardMeter'

function BoardMeter() {
	return (
		<div className='w-full flex flex-row justify-center text-black dark:text-white relative'>
			<div className='w-full h-min flex-row flex flex-wrap justify-between rounded-md p-3 pb-8'>
				<div className='w-full flex flex-row justify-center'>
					<DataBoardMeter />
				</div>
			</div>
		</div>
	)
}

export default BoardMeter
