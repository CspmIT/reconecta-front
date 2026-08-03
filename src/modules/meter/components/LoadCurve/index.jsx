import { useState } from 'react'
import TabsMeter from '../tabsMeter'
import CurvaTable from './components/CurvaTable'
import Grafic from './components/Grafic'
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
			title: 'Tabla',
			component: <CurvaTable info={info} enabledKeys={enabledKeys} />,
		},
		{
			id: 2,
			title: 'Gráficos',
			component: <Grafic info={info} enabledKeys={enabledKeys} />,
		},
		{
			id: 3,
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
