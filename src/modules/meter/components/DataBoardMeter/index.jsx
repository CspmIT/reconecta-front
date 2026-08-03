import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { MainContext } from '../../../../context/MainContext'
import { backend } from '../../../../utils/routes/app.routes'
import { request } from '../../../../utils/js/request'
import LoaderComponent from '../../../../components/Loader'
import { DataInsta } from '../../utils/actions'
import { MeterProvider } from '../../context/MeterContext'
import MainCard from '../MainCard'
import TxBar from '../TxBar'
import VerticalTabs from '../VerticalTabs'
import Metrology from '../Metrology'
import LoadCurve from '../LoadCurve'
import QualityTension from '../QualityTension'
import HistoryMeter from '../HistoryMeter'
import EventsMeter from '../EventsMeter'

function DataBoardMeter() {
	const navigate = useNavigate()
	const { tabCurrent, tabs, setInfoNav } = useContext(MainContext)
	const [data] = useState(tabs[tabCurrent] || null)
	const [info, setInfo] = useState(null)
	const [insta, setInsta] = useState(null)
	const [energy, setEnergy] = useState(null)
	const [power, setPower] = useState(null)
	const [isLoading, setIsLoading] = useState(true)

	const getDataMeter = async (id) => {
		try {
			setIsLoading(true)
			const meter = await request(
				`${backend[`${import.meta.env.VITE_APP_NAME}`]}/getDataMeter?id=${id}`,
				'GET'
			)
			setInfo(meter.data)
			setIsLoading(false)
			loadLiveData(meter.data)
		} catch (error) {
			console.error(error)
			Swal.fire({
				title: 'Atención!',
				html: `Hubo un problema con la carga de los datos del Medidor.</br>Intente nuevamente...`,
				icon: 'error',
			})
		}
	}

	// Datos en vivo (VI + energía para KPIs). Si fallan, la vista sigue con "sin datos".
	const loadLiveData = async (meterInfo) => {
		try {
			const insta = await DataInsta(meterInfo)
			setInsta(insta)
			if (!insta?.VI?.V_0) {
				Swal.fire({
					title: 'Atención!',
					html: 'No se obtuvieron datos instantáneos del medidor.</br>Se muestra la última información disponible.',
					icon: 'warning',
				})
			}
		} catch (error) {
			console.error(error)
			setInsta(null)
		}
		const base = backend[`${import.meta.env.VITE_APP_NAME}`]
		const query = `serial=${meterInfo.serial}&version=${meterInfo.version}&brand=${meterInfo.brand}`
		try {
			const energy = await request(`${base}/getMetrologyEnergy?${query}`, 'GET')
			setEnergy(energy.data)
		} catch (error) {
			console.error(error)
			setEnergy(null)
		}
		try {
			// Trae ademas DeM_Ta_0..5 (demanda maxima por tarifa de /status/P_imp) para los KPIs
			const power = await request(`${base}/getMetrologyPower?${query}`, 'GET')
			setPower(power.data)
		} catch (error) {
			console.error(error)
			setPower(null)
		}
	}

	useEffect(() => {
		if (!data) {
			Swal.fire({
				title: 'Atención!',
				html: `Hubo un problema con la carga de los datos del Medidor.</br>Intente nuevamente...`,
				icon: 'error',
			})
			navigate('/Home')
		} else {
			getDataMeter(data.id)
		}
	}, [data])

	const editMeter = () => {
		setInfoNav([info])
		navigate('/Equipment/' + info.id)
	}

	if (isLoading || !info) {
		return (
			<div className='w-full p-5'>
				<LoaderComponent image={false} />
			</div>
		)
	}

	const vi = insta?.VI ?? null
	const panels = [
		{ key: 'metr', label: 'METROLOGÍA', component: <Metrology info={info} insta={insta} /> },
		{ key: 'curva', label: 'CURVA DE CARGA (LP)', component: <LoadCurve info={info} /> },
		{ key: 'cal', label: 'CALIDAD DE TENSIÓN (VQD)', component: <QualityTension info={info} /> },
		{ key: 'ener', label: 'ENERGÍA (EOB)', component: <HistoryMeter info={info} /> },
		{ key: 'even', label: 'EVENTOS', component: <EventsMeter info={info} /> },
	]

	return (
		<MeterProvider info={info} vi={vi}>
			<div className='w-full flex flex-col gap-4'>
				<MainCard
					info={info}
					vi={vi}
					energy={energy}
					power={power}
					onRefresh={() => getDataMeter(info.id)}
					onEdit={editMeter}
				/>
				<TxBar />
				<VerticalTabs tabs={panels} />
			</div>
		</MeterProvider>
	)
}

export default DataBoardMeter
