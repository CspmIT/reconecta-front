import TabsMeter from '../tabsMeter'
import CosenoFi from './components/CosenoFi'
import Curva from './components/Curva'
import Grafic from './components/Grafic'
import VoltageCurrent from './components/VoltageCurrent'

function LoadCurve() {
	const tabs = [
		{
			id: 1,
			title: 'Curva 1',
			component: <Curva />,
		},
		{
			id: 2,
			title: 'Tensiones y Corrientes',
			component: <VoltageCurrent />,
		},
		{
			id: 3,
			title: 'Coseno Fi',
			component: <CosenoFi />,
		},
		{
			id: 4,
			title: 'Gráficos',
			component: <Grafic />,
		},
	]
	return (
		<>
			<TabsMeter tabs={tabs} />
		</>
	)
}

export default LoadCurve
