import { Button } from '@mui/material'
import React from 'react'

const AnalyzerBoard = () => {
	return (
		<div className='w-full flex flex-row justify-center text-black dark:text-white relative pr-3'>
			<div className='w-full h-min flex-row flex flex-wrap justify-between rounded-md bg-slate-50 dark:bg-gray-800 p-4 pb-8'>
				<div className='w-10/12'>
					<h1 className='text-left text-2xl'>Analizador de red </h1>
				</div>
				<div className='w-full'>
					<hr className='my-4'></hr>
				</div>
				<div className='w-full flex flex-row justify-center'></div>
			</div>
		</div>
	)
}

export default AnalyzerBoard
