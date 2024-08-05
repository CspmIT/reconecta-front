import React from 'react'
import CardCustom from '../../../components/CardCustom'
import TableCustom from '../../../components/TableCustom'
import { dataPerfils } from './utils/DataTable/Profiles'
import { ColumnsProfile } from './utils/DataTable/ColumnsProfile'
import { IconButton } from '@mui/material'
import { Add } from '@mui/icons-material'

function Perfils() {
	return (
		<CardCustom
			className={'w-full h-full flex flex-col justify-center text-black dark:text-white relative p-3 rounded-md'}
		>
			<h1>Perfiles</h1>
			<TableCustom
				data={dataPerfils}
				columns={ColumnsProfile()}
				density='comfortable'
				header={{
					background: 'rgb(190 190 190)',
					fontSize: '18px',
					fontWeight: 'bold',
				}}
				toolbarClass={{ background: 'rgb(190 190 190)' }}
				body={{ backgroundColor: 'rgba(209, 213, 219, 0.31)' }}
				footer={{ background: 'rgb(190 190 190)' }}
				card={{
					boxShadow: `1px 1px 8px 0px #00000046`,
					borderRadius: '0.75rem',
				}}
				btnCustomToolbar={
					<IconButton id='basic-button' onClick={() => changeView('networkAnalyzer')}>
						<Add />
					</IconButton>
				}
				topToolbar
				copy
				grouping
				hide
				sort
				pagination
			/>
		</CardCustom>
	)
}

export default Perfils
