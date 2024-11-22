import { IconButton, Modal } from '@mui/material'
import { ImCross } from 'react-icons/im'
import TableCustom from '../../../../../../components/TableCustom'

function ModalSummary({ open, handleClose, dataTableModal, ColumnsTableModal }) {
	return (
		<Modal
			open={open}
			onClose={handleClose}
			aria-labelledby='modal-modal-title'
			aria-describedby='modal-modal-description'
		>
			<div className='w-full md:w-10/12 !absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 p-2'>
				<div className='bg-white rounded-md shadow-md w-full'>
					<div className='p-4 bg-[#243f8c] rounded-t-md relative'>
						<h1 className='text-xl font-bold'>Resumen</h1>
						<IconButton onClick={handleClose} className='!absolute !top-4 !right-4 !text-white'>
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
			</div>
		</Modal>
	)
}

export default ModalSummary
