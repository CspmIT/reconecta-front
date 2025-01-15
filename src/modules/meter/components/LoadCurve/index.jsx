import TabsMeter from '../tabsMeter'
import CosenoFi from './components/CosenoFi'
import Curva from './components/Curva'
import Grafic from './components/Grafic'
import VoltageCurrent from './components/VoltageCurrent'

function LoadCurve({ info }) {
	const tabs = [
		{
			id: 1,
			title: 'Curva 1',
			component: <Curva info={info} />,
		},
		{
			id: 2,
			title: 'Tensiones y Corrientes',
			component: <VoltageCurrent info={info} />,
		},
		{
			id: 3,
			title: 'Coseno Fi',
			component: <CosenoFi info={info} />,
		},
		{
			id: 4,
			title: 'Gráficos',
			component: <Grafic info={info} />,
		},
	]
	return (
		<>
			<TabsMeter tabs={tabs} />
		</>
	)
}

export default LoadCurve
