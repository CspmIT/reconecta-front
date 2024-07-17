import { useEffect, useState } from 'react'
import CardCustom from '../../../components/CardCustom'
import TableCustom from '../../../components/TableCustom'
import { columnsCriticos } from '../utils/columnTbl'
import { dataCriticos, dataOtros } from '../utils/datosTbl'
import { FormLabel } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import Swal from 'sweetalert2'
function Alert() {
	const [rowCriticos, setRowCriticos] = useState(dataCriticos)
	const [bottonCheck, setBottonCheck] = useState(false)
	const ChangeColorRow = (row) => {
		return row.original.statusAlert === 1
	}
	const checkAlertCriticas = (table) => {
		Swal.fire({
			title: 'Atención!',
			html: '¿Está seguro de que desea limpiar las alertas críticas?',
			icon: 'warning',
			showCancelButton: true,
			allowOutsideClick: false,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Si',
			cancelButtonText: 'No, cancelar',
		}).then((result) => {
			if (result.isConfirmed) {
				Swal.fire({
					title: 'Atención!',
					html: '¿Deseas limpiar toda la tabla o solo la pag actual?',
					icon: 'warning',
					showCancelButton: true,
					allowOutsideClick: false,
					confirmButtonColor: '#3085d6',
					cancelButtonColor: '#d33',
					confirmButtonText: 'Actual',
					cancelButtonText: 'Toda la tabla',
				}).then((result) => {
					const changeRows = rowCriticos.map((row, index) => {
						if (!result.isConfirmed || table.getRowModel().rows.some((item) => item.index == index)) {
							row.statusAlert = 0
						}
						return row
					})

					setBottonCheck(false)
					setRowCriticos(changeRows)
				})
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
						</div>
						<TableCustom
							getPage={checkAlertCriticas}
							data={rowCriticos}
							columns={columnsCriticos}
							density='comfortable'
							header={{
								background: 'rgb(190 190 190)',
								fontSize: '18px',
								fontWeight: 'bold',
							}}
							toolbarClass={{ background: 'rgb(190 190 190)' }}
							body={{ backgroundColor: 'rgba(209, 213, 219, 0.31)' }}
							footer={{ background: 'rgb(190 190 190)' }}
							ChangeColorRow={ChangeColorRow}
							pageSize={10}
							checkAlert={bottonCheck}
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
								background: 'rgb(190 190 190)',
								fontSize: '18px',
								fontWeight: 'bold',
							}}
							toolbarClass={{ background: 'rgb(190 190 190)' }}
							body={{ backgroundColor: 'rgba(209, 213, 219, 0.31)' }}
							footer={{ background: 'rgb(190 190 190)' }}
							pageSize={10}
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
