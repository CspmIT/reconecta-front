import React, { useEffect, useState } from 'react'
import TableCustom from '../../../../../components/TableCustom'
import { rowsTable } from '../../utils/objects'
import { columnsTableCoseno, columnsTableCurve, columnsTableTension } from '../../utils/ColumnsTable'

const TableBoard = ({ tab }) => {
	const [columns, setColumns] = useState([])
	useEffect(() => {
		switch (tab) {
			case 0:
				setColumns(columnsTableCurve)
				break
			case 1:
				setColumns(columnsTableTension)
				break
			case 2:
				setColumns(columnsTableCoseno)
				break
			default:
				break
		}
	}, [tab])
	return (
		<div>
			<TableCustom
				data={rowsTable}
				columns={columns}
				density='comfortable'
				header={{
					background: 'rgb(190 190 190)',
					fontSize: '18px',
					fontWeight: 'bold',
				}}
				toolbarClass={{ background: 'rgb(190 190 190)' }}
				body={{ backgroundColor: 'rgba(209, 213, 219, 0.31)' }}
				footer={{ background: 'rgb(190 190 190)' }}
				pageSize={10}
				topToolbar
				hide
				sort
				pagination
			/>
		</div>
	)
}

export default TableBoard
