import { useEffect, useState } from 'react'
import CardCustom from '../../../components/CardCustom'
import TableCustom from '../../../components/TableCustom'
import { columnsCriticos } from '../utils/columnTbl'
import { dataCriticos, dataOtros } from '../utils/datosTbl'
import { Button, FormLabel } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { Check } from '@mui/icons-material'
import Swal from 'sweetalert2'
function Alert() {
	const [rowCriticos, setRowCriticos] = useState(dataCriticos)
	const [bottonCheck, setBottonCheck] = useState(false)
	const ChangeColorRow = (row) => {
		return row.original.statusAlert === 1
	}
	const checkAlertCriticas = () => {
		Swal.fire({
			title: 'Atención!',
			html: '¿Está seguro de que desea desactivar las alertas críticas?',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Si',
			cancelButtonText: 'No, cancelar',
		}).then((result) => {
			if (result.isConfirmed) {
				const changeRows = rowCriticos.map((row) => {
					if (row.statusAlert) {
						row.statusAlert = 0
					}
					return row
				})
				setBottonCheck(false)
				setRowCriticos(changeRows)
			}
		})
	}
	useEffect(() => {
		if (rowCriticos.some((row) => row.statusAlert === 1)) {
			setBottonCheck(true)
		}
	}, [rowCriticos])

	return (
		<>
			<LocalizationProvider dateAdapter={AdapterDayjs}>
				<div className={'flex flex-col w-full gap-4'}>
					<CardCustom className={' text-black  p-4 w-full'}>
						<div className='relative flex justify-between items-center mb-4'>
							<FormLabel className='w-full text-center !text-2xl'>Evento Criticos</FormLabel>
							{bottonCheck && (
								<Button
									className='!absolute !right-2'
									variant='contained'
									color='warning'
									onClick={() => checkAlertCriticas()}
								>
									<Check /> check
								</Button>
							)}
						</div>
						<TableCustom
							data={rowCriticos}
							columns={columnsCriticos}
							density='comfortable'
							header={{
								background: 'rgba(152, 152, 152, 0.631)',
								fontSize: '18px',
								fontWeight: 'bold',
							}}
							toolbarClass={{ background: 'rgba(152, 152, 152, 0.631)' }}
							body={{ backgroundColor: 'rgba(209, 213, 219, 0.31)' }}
							footer={{ background: 'rgba(152, 152, 152, 0.631)' }}
							ChangeColorRow={ChangeColorRow}
							topToolbar
							hide
							sort
							pagination
						/>
					</CardCustom>
					<CardCustom className={' text-black  p-4 w-full'}>
						<div className='relative flex justify-between items-center mb-4'>
							<FormLabel className='w-full text-center !text-2xl'>Otros Eventos</FormLabel>
						</div>
						<TableCustom
							data={dataOtros}
							columns={columnsCriticos}
							density='comfortable'
							header={{
								background: 'rgba(152, 152, 152, 0.631)',
								fontSize: '18px',
								fontWeight: 'bold',
							}}
							toolbarClass={{ background: 'rgba(152, 152, 152, 0.631)' }}
							body={{ backgroundColor: 'rgba(209, 213, 219, 0.31)' }}
							footer={{ background: 'rgba(152, 152, 152, 0.631)' }}
							topToolbar
							sort
							pagination
						/>
					</CardCustom>
				</div>
			</LocalizationProvider>
		</>
	)
}

export default Alert
