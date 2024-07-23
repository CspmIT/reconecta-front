import { useEffect, useState } from 'react'
import TableCustom from '../../../components/TableCustom'
import { columns } from '../utils/dataTable'
import { useNavigate } from 'react-router-dom'
import { storage } from '../../../storage/storage'

function TableRecloser() {
	const [reclosers, setReclosers] = useState([])
	const navigate = useNavigate()
	const getdisplay = () => {
		setReclosers([
			{
				Nro_recloser: 0,
				Name: 'Marconi esq. Libertador',
				Nro_Serie: '01A1212030522',
				type_recloser: 1,
				status: 1,
				online: 0,
				alarm_recloser: 0,
			},
			{
				Nro_recloser: 10,
				Name: 'Maunier',
				Nro_Serie: '0311720010029',
				type_recloser: 1,
				status: 0,
				online: 1,
				alarm_recloser: 1,
			},
			{
				Nro_recloser: 102,
				Name: 'Adeco Agro',
				Nro_Serie: '18164214001',
				type_recloser: 1,
				status: 0,
				online: 1,
				alarm_recloser: 1,
			},
			{
				Nro_recloser: 11,
				Name: 'Blangetti',
				Nro_Serie: '0311720010019',
				type_recloser: 1,
				status: 0,
				online: 1,
				alarm_recloser: 1,
			},
			{
				Nro_recloser: 14,
				Name: 'Milessi',
				Nro_Serie: '03117191020611',
				type_recloser: 1,
				status: 0,
				online: 1,
				alarm_recloser: 1,
			},
			{
				Nro_recloser: 6,
				Name: 'Dos Hermanos',
				Nro_Serie: '03117191020647',
				type_recloser: 1,
				status: 0,
				online: 1,
				alarm_recloser: 1,
			},
			{
				Nro_recloser: 'SETA 1',
				Name: 'SETA 1',
				Nro_Serie: '36037636',
				type_recloser: 2,
				status: 0,
				online: 1,
				alarm_recloser: 1,
			},
			{
				Nro_recloser: 'POWERMETER 1',
				Name: 'Analizador interno',
				Nro_Serie: '00002114',
				type_recloser: 4,
				status: 0,
				online: 1,
				alarm_recloser: 1,
			},
		])
	}

	const changeAlarm = (Nro_Serie) => {
		setReclosers((prevReclosers) => prevReclosers.map((recloser) => (recloser.Nro_Serie === Nro_Serie ? { ...recloser, alarm_recloser: !recloser.alarm_recloser } : recloser)))
	}
	useEffect(() => {
		getdisplay()
	}, [])
	const [visibility, setVisibility] = useState(storage.get('visibility'))
	const handleColumnVisibilityChange = (newVisibility) => {
		const change = newVisibility()
		setVisibility((prevVisibility) => ({
			...prevVisibility,
			...change,
		}))
		const listVisibility = storage.get('visibility')
		storage.set('visibility', {
			...listVisibility,
			...change,
		})
	}

	return (
		<div className='pb-5'>
			<TableCustom
				data={reclosers}
				columns={columns(changeAlarm, navigate)}
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
				topToolbar
				copy
				grouping
				filter
				hide
				sort
				pagination
				columnVisibility={visibility}
				onColumnVisibilityChange={handleColumnVisibilityChange}
			/>
		</div>
	)
}

export default TableRecloser
