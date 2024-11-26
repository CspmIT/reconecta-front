import TabsMeter from '../tabsMeter'
import CorteTension from './components/CorteTension'
import InterrupcionTension from './components/InterripcionTension'
import Surge from './components/Surge'
import Subtension from './components/Subtension'
function QualityTension({ info }) {
	const tabs = [
		{
			id: 1,
			title: 'Sobretensiones',
			component: <Surge info={info} />,
		},
		{
			id: 2,
			title: 'Subtensiones',
			component: <Subtension info={info} />,
		},
		{
			id: 3,
			title: 'Cortes de tensión',
			component: <CorteTension info={info} />,
		},
		{
			id: 4,
			title: 'Interrupciones de tensión',
			component: <InterrupcionTension info={info} />,
		},
	]
	return (
		<>
			<TabsMeter tabs={tabs} />
		</>
	)
}

export default QualityTension
