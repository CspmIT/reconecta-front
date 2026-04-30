import { Typography, useMediaQuery } from '@mui/material'

const COLOR_CLASSES = {
	yellow: 'text-yellow-400',
	red: 'text-red-500',
	blue: 'text-blue-500',
	green: 'text-green-500'
}
const COLOR_CLASSES_MOBILE = {
	yellow: 'text-yellow-400 bg-yellow-200 border-yellow-400',
	red: 'text-red-500 bg-red-200 border-red-500',
	blue: 'text-blue-500 bg-blue-200 border-blue-500',
	green: 'text-green-500 bg-blue-200 border-green-500'
}
const DEFAULT_COLOR = 'text-black dark:text-white'
const DEFAULT_COLOR_MOBILE = 'text-black dark:text-white border-black dark:border-white-400 bg-gray-300'

function CardsInfo({ title, infoData, colorTitle }) {
	const colorClass = COLOR_CLASSES[colorTitle] ?? DEFAULT_COLOR
	const colorClassMobile = COLOR_CLASSES_MOBILE[colorTitle] ?? DEFAULT_COLOR_MOBILE
	const isMobile = useMediaQuery('(max-width: 600px)')
	if (isMobile) {
		return (
			<div title={infoData} className={`flex justify-center items-center border ${colorClassMobile} py-2 px-3 rounded-md`}>
				{infoData}
			</div>
		)
	}
	return (
		<div className='flex flex-col justify-center items-center chartContainer bg-white dark:bg-gray-800 rounded-lg shadow-gray-500 shadow-md drop-shadow-md p-3 h-28 w-full sm:w-[48%] lg:w-[19%] mb-4'>
			<Typography variant='p' className={`text-base font-bold w-full flex justify-center items-center ${colorClass}`}>
				{title}
			</Typography>
			<div className='flex justify-center items-center'>
				<Typography variant='h4' className={`font-bold w-full flex justify-center items-center ${colorClass}`}>
					{infoData}
				</Typography>
			</div>
		</div>
	)
}

export default CardsInfo
