import React, { useEffect, useState } from 'react'
import TableCustom from '../../../../../components/TableCustom'
//import { rowsTable } from '../../utils/objects'
import { columnsTableCoseno, columnsTableCurve, columnsTableTension, columnsTableEnergia } from '../../utils/ColumnsTable'
import { request } from '../../../../../utils/js/request'
import { backend } from '../../../../../utils/routes/app.routes'

const TableBoard = ({ tab, analyzer }) => {
	const [rowsTable, setRowsTable] = useState([])
	const [columns, setColumns] = useState([])
	const getData = async () => {
		const dateCurrent = new Date()
		const dateStart = new Date(dateCurrent)
		dateStart.setHours(dateCurrent.getHours() - 12)
		const body = {
			brand: analyzer?.equipmentmodels?.name.toLowerCase(),
			version: analyzer?.equipmentmodels?.brand.toLowerCase(),
			serial: analyzer?.serial,
		}
		const { data } = await request(`${backend[`${import.meta.env.VITE_APP_NAME}`]}/AnalyzerHistory`, 'POST', body)
		setRowsTable(data)
	}
	useEffect(() => {
		getData()
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
			case 3:
				setColumns(columnsTableEnergia)
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
