import { useEffect, useState } from 'react'
import CardCustom from '../../../components/CardCustom'
import TableCustom from '../../../components/TableCustom'
import { columnsCriticos } from '../utils/columnTbl'
import { FormLabel } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { request } from '../../../utils/js/request'
import { backend } from '../../../utils/routes/app.routes'
import { checkAlert, saveChecks } from '../utils/actions'
import Swal from 'sweetalert2'
import LoaderComponent from '../../../components/Loader'
function Alert() {
	const [isLoading, setIsLoading] = useState(true)
	const [rowCriticos, setRowCriticos] = useState({ alta: [], baja: [] })
	const [bottonCheck, setBottonCheck] = useState(false)
	const ChangeColorRow = (row) => {
		return row.original.statusAlert === 1
	}
	const checkAlertCriticas = async (table) => {
		try {
			const { changeRows, eventCheck } = await checkAlert(table, rowCriticos)
			if (changeRows && eventCheck) {
				await saveChecks(eventCheck)
				setBottonCheck(false)
				getEvents()
			}
		} catch (error) {
			console.error(error)
			Swal.fire({
				title: 'Atención!',
				text: 'Ocurrio un error al checkear los eventos',
				icon: 'warning',
			})
		}
	}
	const getEvents = async () => {
		const event = await request(`${backend.Reconecta}/AllEvents`, 'GET')
		setRowCriticos(event.data)
		setIsLoading(false)
	}
	useEffect(() => {
		if (rowCriticos.alta.some((row) => row.statusAlert === 1)) {
			setBottonCheck(true)
		}
	}, [rowCriticos])
	useEffect(() => {
		getEvents()
	}, [])
	return (
		<>
			<LocalizationProvider dateAdapter={AdapterDayjs}>
				<div className={'flex flex-col w-full gap-4'}>
					{isLoading ? (
						<LoaderComponent />
					) : (
						<>
							<CardCustom className={' text-black  p-4 w-full'}>
								<div className='relative flex justify-between items-center mb-4'>
									<FormLabel className='w-full text-center !text-2xl'>Evento Criticos</FormLabel>
								</div>
								<TableCustom
									getPage={checkAlertCriticas}
									data={rowCriticos.alta}
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
									data={rowCriticos.baja}
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
						</>
					)}
				</div>
			</LocalizationProvider>
		</>
	)
}

export default Alert
