import React from 'react'

const RowsValues = ({ ...props }) => {
	return (
		<div className={`w-full p-2 md:p-0 md:w-4/6 flex flex-row justify-center items-center ${props.bg}`}>
			<div className='w-1/4 text-center text-black'>
				<b>{...props.valueR || '-'}</b>
			</div>
			<div className='w-1/4 text-center text-black'>
				<b>{...props.valueS || '-'}</b>
			</div>
			<div className='w-1/4 text-center text-black'>
				<b>{...props.valueT || '-'}</b>
			</div>
			<div className='w-1/4 text-center text-black'>
				<b>{...props.valueTotal || '-'}</b>
			</div>
		</div>
	)
}

export default RowsValues
