import { useState } from 'react'
import TabsMeter from '../tabsMeter'
import CosenoFi from './components/CosenoFi'
import Curva from './components/Curva'
import Grafic from './components/Grafic'
import VoltageCurrent from './components/VoltageCurrent'
import Variables from './components/Variables'
import { loadCurvaConfig, saveCurvaConfig } from './utils/curvaConfig'

function LoadCurve({ info }) {
	const [enabledKeys, setEnabledKeys] = useState(() => loadCurvaConfig(info?.serial))

	const handleVariablesChange = (keys) => {
		setEnabledKeys(keys)
		saveCurvaConfig(info?.serial, keys)
	}

	const tabs = [
		{
			id: 1,
			title: 'Curva 1',
			component: <Curva info={info} enabledKeys={enabledKeys} />,
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
			component: <Grafic info={info} enabledKeys={enabledKeys} />,
		},
		{
			id: 5,
			title: 'Variables',
			component: (
				<Variables serial={info?.serial} enabled={enabledKeys} onChange={handleVariablesChange} />
			),
		},
	]
	return (
		<>
			<TabsMeter tabs={tabs} />
		</>
	)
}

export default LoadCurve
