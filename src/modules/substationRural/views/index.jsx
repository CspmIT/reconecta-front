import React, { useContext, useEffect, useState } from 'react'
import DataBoard from '../components/DataBoard'
import TableBoard from '../components/TableBoard'
import { MainContext } from '../../../context/MainContext'
import { dataUser, substation } from '../utils/objects'

const SubstationRuralBoard = () => {
	const { tabCurrent, tabs } = useContext(MainContext)
	const [info, setInfo] = useState([])
	const [data] = useState(tabs[tabCurrent] || null)
	const loadData = (data) => {
		if (!data) {
			Swal.fire({
				title: 'Atención!',
				html: `Hubo un problema con la carga de los datos de la subestación.</br>Intente nuevamente...`,
				icon: 'error',
			})
			navigate('/Home')
		} else {
			const subStation = substation.filter((item) => item.id == data.id)[0]
			subStation.user = dataUser.filter((item) => item.id_user_recloser == data.id)[0].name_user_recloser
			const powers = ['No definida', 'Monofásica', 'Trifásica']
			subStation.power = powers[subStation.type_power]
			setInfo(subStation)
		}
	}
	useEffect(() => {
		loadData(data)
	}, [data])
	return (
		<div className='w-full flex flex-row justify-center text-black dark:text-white relative pr-3'>
			<div className='w-full h-min flex-row flex flex-wrap justify-between rounded-md bg-slate-50 dark:bg-gray-800 p-4 pb-8'>
				<div className='w-full items-center rounded-xl p-3 bg-gray-200 dark:bg-gray-600'>
					<div className='flex flex-row relative justify-between mb-8'>
						<div className='flex-grow flex justify-center'>
							<h2 className='text-2xl'>Registro de eventos</h2>
						</div>
					</div>
					<DataBoard info={info} />
					<TableBoard />
				</div>
			</div>
		</div>
	)
}

export default SubstationRuralBoard
