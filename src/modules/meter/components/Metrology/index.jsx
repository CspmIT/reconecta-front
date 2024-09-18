import TabsMeter from '../tabsMeter'
import Basic from './components/Basic'
import Energi from './components/Energi'
import Fasorial from './components/Fasorial'
import Power from './components/Power'

function Metrology() {
	const tabs = [
		{
			id: 1,
			title: 'Básicos',
			component: <Basic />,
		},
		{
			id: 2,
			title: 'Potencia',
			component: <Power />,
		},
		{
			id: 3,
			title: 'Energia',
			component: <Energi />,
		},
		{
			id: 4,
			title: 'Diagrama Fasorial',
			component: (
				<div className='flex w-full  justify-center'>
					<Fasorial />
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
