import CardCustom from '../../../components/CardCustom'
import TableCustom from '../../../components/TableCustom'
import { ColumnsNot } from '../utils/DataTable/ColumnsNot'
import {dataNot} from '../utils/DataTable/dataNot'

function ConfigNotifications() {
	return (
		<CardCustom className={'w-full h-full flex flex-col items-center justify-center text-black dark:text-white relative p-3 rounded-md'}>
			<div className='w-full  md:p-5'>
				<h1 className='text-2xl mb-3'>Configuración de eventos y notificaciones</h1>
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
			</div>
		</CardCustom>
	)
}

export default ConfigNotifications
