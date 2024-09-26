import React from 'react'
import CardCustom from '../../components/CardCustom'
import { FormLabel } from '@mui/material'

function Binnacle() {
	return (
		<CardCustom className={' text-black flex flex-col p-4 w-full'}>
			<FormLabel className='w-full text-center !text-3xl'>Bitácora</FormLabel>
			<FormLabel className='w-full text-center !text-xl mt-3'>En Desarrollo...</FormLabel>
		</CardCustom>
	)
}

export default Binnacle
