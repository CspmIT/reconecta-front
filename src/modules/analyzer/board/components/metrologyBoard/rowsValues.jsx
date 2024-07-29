import React from 'react'

const RowsValues = ({ ...props }) => {
	return (
		<div className='w-4/6 flex flex-row justify-center items-center'>
			<div className='w-1/4 text-center'>
				<b>{...props.valueR || '-'}</b>
			</div>
			<div className='w-1/4 text-center'>
				<b>{...props.valueS || '-'}</b>
			</div>
			<div className='w-1/4 text-center'>
				<b>{...props.valueT || '-'}</b>
			</div>
			<div className='w-1/4 text-center'>
				<b>{...props.valueTotal || '-'}</b>
			</div>
		</div>
	)
}

export default RowsValues
