import TabsMeter from '../tabsMeter'
import Basic from './components/Basic'
import Energi from './components/Energi'
import Fasorial from './components/Fasorial'
import Power from './components/Power'

function Metrology({ info }) {
	const tabs = [
		{
			id: 1,
			title: 'Básicos',
			component: <Basic info={{ version: info.version, brand: info.brand, serial: info.serial }} />,
		},
		{
			id: 2,
			title: 'Potencia',
			component: <Power info={{ version: info.version, brand: info.brand, serial: info.serial }} />,
		},
		{
			id: 3,
			title: 'Energia',
			component: <Energi info={{ version: info.version, brand: info.brand, serial: info.serial }} />,
		},
		{
			id: 4,
			title: 'Diagrama Fasorial',
			component: (
				<div className='flex w-full  justify-center'>
					<Fasorial info={{ version: info.version, brand: info.brand, serial: info.serial }} />
				</div>
			),
		},
	]
	return (
		<>
			<TabsMeter tabs={tabs} />
		</>
	)
}

export default Metrology
