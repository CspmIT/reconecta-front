import TabsMeter from '../tabsMeter'
import CorteTension from './components/CorteTension'
import InterrupcionTension from './components/InterripcionTension'
import Sobretension from './components/Sobretension'
import Subtension from './components/Subtension'
function QualityTension() {
	const tabs = [
		{
			id: 1,
			title: 'Sobretensiones',
			component: <Sobretension />,
		},
		{
			id: 2,
			title: 'Subtensiones',
			component: <Subtension />,
		},
		{
			id: 3,
			title: 'Cortes de tensión',
			component: <CorteTension />,
		},
		{
			id: 4,
			title: 'Interrupciones de tensión',
			component: <InterrupcionTension />,
		},
	]
	return (
		<>
			<TabsMeter tabs={tabs} />
		</>
	)
}

export default QualityTension
