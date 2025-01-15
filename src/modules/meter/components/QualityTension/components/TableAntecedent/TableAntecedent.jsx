import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { IconButton, Modal } from '@mui/material'
import { FaFileInvoice } from 'react-icons/fa'
import { ImCross } from 'react-icons/im'
import TableCustom from '../../../../../../components/TableCustom'
import { useState } from 'react'
import ModalSummary from '../ModalSummary/ModalSummary'
function TableAntecedent({ dataTable, ColumnsTable, dataTableModal, ColumnsTableModal }) {
	const [open, setOpen] = useState()
	const handleOpen = () => setOpen(true)
	const handleClose = () => setOpen(false)
	return (
		<>
			<div className='relative w-full mb-4'>
				<h1 className='text-2xl'>Antecedentes</h1>
				<IconButton className='!absolute !top-0 !right-0 !bg-blue-800 !text-white' onClick={handleOpen}>
					<FaFileInvoice size={20} />
				</IconButton>
			</div>
			<div className='w-full'>
				<LocalizationProvider dateAdapter={AdapterDayjs}>
					<TableCustom
						data={dataTable}
						columns={ColumnsTable}
						density='compact'
						header={{
							background: 'rgb(190 190 190)',
							fontSize: '18px',
							fontWeight: 'bold',
						}}
						card={{
							boxShadow: `1px 1px 8px 0px #00000046`,
							borderRadius: '0.25rem',
						}}
						toolbarClass={{ background: 'rgb(190 190 190)' }}
						body={{ backgroundColor: 'rgba(209, 213, 219, 0.31)' }}
						footer={{ background: 'rgb(190 190 190)' }}
						pageSize={10}
						topToolbar
						filter
						pagination
					/>
				</LocalizationProvider>
			</div>
			<ModalSummary
				ColumnsTableModal={ColumnsTableModal}
				open={open}
				handleClose={handleClose}
				dataTableModal={dataTableModal}
			/>
		</>
	)
}

export default TableAntecedent
