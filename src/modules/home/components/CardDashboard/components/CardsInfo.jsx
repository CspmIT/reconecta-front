import { Typography } from '@mui/material'

function CardsInfo({ title, infoData, colorTitle }) {
	return (
		<div className='flex flex-col justify-center items-center chartContainer bg-white dark:bg-gray-800 rounded-lg shadow-gray-500 shadow-md drop-shadow-md p-3 h-28 w-full sm:w-[48%] lg:w-[19%] mb-4'>
			<Typography
				key={1}
				variant='p'
				className={`text-base font-bold w-full flex justify-center items-center ${
					colorTitle === 'yellow'
						? 'text-yellow-400'
						: colorTitle === 'red'
						? 'text-red-500'
						: colorTitle === 'blue'
						? 'text-blue-500'
						: colorTitle === 'green'
						? 'text-green-500'
						: 'text-black dark:text-white'
				}`}
			>
				{title}
			</Typography>
			<div className='flex justify-center items-center'>
				<Typography
					key={2}
					variant='h4'
					className={`font-bold  w-full flex justify-center items-center ${
						colorTitle === 'yellow'
							? 'text-yellow-400'
							: colorTitle === 'red'
							? 'text-red-500'
							: colorTitle === 'blue'
							? 'text-blue-500'
							: colorTitle === 'green'
							? 'text-green-500'
							: 'text-black dark:text-white'
					}`}
				>
					{infoData}
				</Typography>
			</div>
		</div>
	)
}

export default CardsInfo
