import React from 'react'
import TableCustom from '../../../../components/TableCustom'
import { ColumnsTasks } from '../../utils/columnsTasks'
import { dataManteinance } from '../../utils/objects'

const TableBoard = () => {
	return (
		<div className='w-full my-5'>
			<TableCustom data={dataManteinance} columns={ColumnsTasks()} />
		</div>
	)
}

export default TableBoard
