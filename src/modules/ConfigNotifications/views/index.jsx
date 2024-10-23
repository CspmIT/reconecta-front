import { useState } from 'react'
import TableCustom from '../../../components/TableCustom'
import { ColumnsNot } from '../utils/DataTable/ColumnsNot'
import { dataNot } from '../utils/DataTable/dataNot'
import { Card } from '@mui/material'
import { ArrowDownward } from '@mui/icons-material'

function ConfigNotifications() {
	const [active, setActive] = useState(null)
	const arraydevice = [
		{ name: 'Reconectador/NOJA/RC01' },
		{ name: 'Reconectador/NOJA/RC10' },
		{ name: 'Reconectador/COOPER/F5' },
		{ name: 'Reconectador/COOPER/F6' },
	]
	return (
		<Card
			className={
				'w-full h-full flex flex-col items-center justify-center text-black dark:text-white relative p-3 rounded-md'
			}
		>
			<div className='w-full  md:p-5'>
				<h1 className='text-2xl mb-3'>Configuración de eventos y notificaciones</h1>
				<div className='flex flex-col gap-3'>
					{arraydevice.map((item, index) => {
						return (
							<Card
								className='w-full p-3 !bg-gray-200 '
								onClick={() => {
									active == index ? setActive(null) : setActive(index)
								}}
							>
								<ArrowDownward /> {item.name}
								{active == index ? (
									<TableCustom
										data={dataNot}
										columns={ColumnsNot()}
										density='compact'
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
									/>
								) : null}
							</Card>
						)
					})}
				</div>
			</div>
		</Card>
	)
}

export default ConfigNotifications
