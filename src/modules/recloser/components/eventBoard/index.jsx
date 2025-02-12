import { useEffect, useState } from 'react'
import TableCustom from '../../../../components/TableCustom'

import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { request } from '../../../../utils/js/request'
import { ColumnsEvent } from './ColumnsEvent'
import { backend } from '../../../../utils/routes/app.routes'
import LoaderComponent from '../../../../components/Loader'
import { Tab, Tabs } from '@mui/material'
import { FaTachometerAlt } from 'react-icons/fa'
import { BsFiles } from 'react-icons/bs'

const EventBoard = ({ idRecloser }) => {
	const [rowCriticos, setRowCriticos] = useState(null)

	const getEvents = async (id) => {
		const data = await request(
			`${backend[`${import.meta.env.VITE_APP_NAME}`]}/eventsDevices?id=${id}&type=Reconectador`,
			'GET'
		)
		const rows = data.data.reduce(
			(acc, item) => {
				const dateFormated = new Date(item.dateAlert)
				item.dateAlert = dateFormated.toLocaleString()
				const month = dateFormated.getMonth() + 1
				const day = dateFormated.getDate()
				const year = dateFormated.getFullYear()
				const hours = dateFormated.getHours()
				const minutes = dateFormated.getMinutes()
				const seconds = dateFormated.getSeconds()
				item.dateAlert = `${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year} 
				${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`
				if (item.priority === 3) return acc
				if (item.priority === 1) {
					acc.critico.push({
						dateAlert: item.dateAlert,
						event: item.event,
						infoAdd: item.infoAdd,
						statusAlert: 0,
					})
				}
				acc.all.push({
					dateAlert: item.dateAlert,
					event: item.event,
					infoAdd: item.infoAdd,
					statusAlert: 0,
				})
				return acc
			},
			{ critico: [], all: [] }
		)
		setRowCriticos(rows)
	}

	useEffect(() => {
		if (idRecloser) {
			getEvents(idRecloser)
		}
	}, [idRecloser])

	const [selectedCardId, setSelectedCardId] = useState(1)
	const boardCards = [
		{ id: 1, name: 'REGISTROS', icon: <FaTachometerAlt /> },
		{ id: 2, name: 'AVANZADOS', icon: <BsFiles /> },
	]

	const handleCard = (id) => {
		if (id !== selectedCardId) {
			setSelectedCardId(id)
		}
	}
	const classTabs =
		'!border-solid !border-gray-200 !rounded-t-xl !text-base !text-black !font-bold dark:!text-zinc-200 dark:!border-gray-700'
	return (
		<>
			{rowCriticos ? (
				<div className='w-full h-full flex flex-col rounded-xl overflow-hidden'>
					<Tabs
						className='flex border-r border-r-gray-100 dark:border-r-slate-500'
						value={1}
						orientation='horizontal'
						indicatorColor='transparent'
						aria-label='horizontal tabs example'
					>
						{boardCards.map((item) => (
							<Tab
								key={item.id}
								className={`w-full ${selectedCardId == item.id
										? '!bg-gray-100 dark:!bg-zinc-500 '
										: '!bg-gray-300  dark:!bg-zinc-800 '
									}   !border-t-2 !border-l-2 !border-r-2 ${classTabs} min-w-0 relative`}
								onClick={() => handleCard(item.id)}
								label={
									<div className='flex items-center justify-center '>
										<span>{item.name}</span>
									</div>
								}
							/>
						))}
					</Tabs>
					<LocalizationProvider dateAdapter={AdapterDayjs}>
						<div className='w-full h-full bg-gray-100 dark:bg-zinc-500  flex justify-center items-start md:p-4 p-3 rounded-r-2xl'>
							{selectedCardId === 1 && (
								<div className='w-full'>
									<TableCustom
										data={rowCriticos.critico}
										columns={ColumnsEvent()}
										density='comfortable'
										header={{
											background: 'rgb(91 151 248);',
											fontSize: '18px',
											fontWeight: 'bold',
										}}
										toolbarClass={{ background: 'rgb(91 151 248)' }}
										bodyContent={{ fontSize: '16px' }}
										footer={{ background: 'rgb(223 233 249)' }}
										// btnCustomToolbar={<BtnChangeTable fnClick={change} table={register} />}
										pageSize={10}
										topToolbar
										hide
										filter
										sort
										pagination
									/>
								</div>
							)}
							{selectedCardId === 2 && (
								<div className='w-full'>
									<TableCustom
										data={rowCriticos.all}
										columns={ColumnsEvent()}
										density='comfortable'
										header={{
											background: 'rgb(91 151 248);',
											fontSize: '18px',
											fontWeight: 'bold',
										}}
										toolbarClass={{ background: 'rgb(91 151 248)' }}
										bodyContent={{ fontSize: '16px' }}
										footer={{ background: 'rgb(223 233 249)' }}
										// btnCustomToolbar={<BtnChangeTable fnClick={change} table={register} />}
										pageSize={10}
										topToolbar
										hide
										filter
										sort
										pagination
									/>
								</div>
							)}
						</div>
					</LocalizationProvider>
				</div>
			) : (
				<LoaderComponent />
			)}
		</>
	)
}

export default EventBoard
