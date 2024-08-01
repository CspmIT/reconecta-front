import React from 'react'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import TableCustom from '../../../../../../components/TableCustom'
import { ColumnsTable, ColumnsTableModal, dataTable, dataTableModal } from './utils/DataTable'
import { IconButton, Modal } from '@mui/material'
import { FaFileInvoice } from 'react-icons/fa'
import { ImCross } from 'react-icons/im'
function Sobretension() {
	const [open, setOpen] = React.useState(false)
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

			<Modal
				open={open}
				onClose={handleClose}
				aria-labelledby='modal-modal-title'
				aria-describedby='modal-modal-description'
			>
				<div className='absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-white  rounded-md shadow-md'>
					<div className='p-4 bg-[#243f8c] rounded-t-md relative'>
						<h1 className='text-xl font-bold'>Resumen</h1>
						<IconButton onClick={handleClose} className='!absolute !top-4 !right-4'>
							<ImCross size={15} />
						</IconButton>
					</div>
					<div className='p-7'>
						<TableCustom
							data={dataTableModal}
							columns={ColumnsTableModal}
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
						/>
					</div>
				</div>
			</Modal>
		</>
	)
}

export default Sobretension
