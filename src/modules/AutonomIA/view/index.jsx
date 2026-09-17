// AutonomIA dentro de Reconecta — aprovisionamiento de Multivac para el
// instalador: «Actualizaciones de firmware» y «Configuración». Las solapas
// de ingeniería (Sniffer, Documentación, Gestión de versiones) quedan en el
// Tablero Cooptech, que es donde se publican y aprueban los releases.
//
// Ruta: /config/hardware (menú Configuración → AutonomIA).
import { useCallback, useEffect, useState } from 'react'
import { Tab, Tabs } from '@mui/material'
import useCli from '../hooks/useCli'
import useFlasher from '../hooks/useFlasher'
import FirmwareTab from '../components/FirmwareTab'
import ConfigTab from '../components/ConfigTab'
import ConfirmModal from '../components/ConfirmModal'
import { autonomiaApi } from '../api/autonomiaApi'

// Mismo estilo de solapas que Auditoría de acciones.
const tabsSx = {
	minHeight: 42,
	borderBottom: '1px solid rgba(148,163,184,0.25)',
	'& .MuiTabs-indicator': { height: 3, borderRadius: '3px 3px 0 0', backgroundColor: '#edbf36' },
	'& .MuiTab-root': { minHeight: 42, fontWeight: 600, fontSize: '0.9rem', textTransform: 'none', color: '#64748b' },
	'body.dark &': { '& .MuiTab-root': { color: '#9ca3af' } },
	'& .Mui-selected': { color: '#edbf36 !important' },
}

const AutonomIA = () => {
	const [tab, setTab] = useState(0)
	const cli = useCli()

	// Confirmaciones propias (modal) que el flasher espera como promesa.
	const [confirm, setConfirm] = useState(null)
	const pedirConfirmacion = (opts) => new Promise((resolve) => setConfirm({ ...opts, resolve }))
	const responderConfirm = (ok) =>
		setConfirm((c) => {
			c?.resolve(ok)
			return null
		})

	const flasher = useFlasher({
		log: cli.log,
		pedirPuertoSerie: cli.pedirPuertoSerie,
		conectado: cli.conectado,
		desconectar: cli.desconectar,
		pedirConfirmacion,
		// Tras volver a fábrica la placa queda en blanco: directo a Configuración.
		onFin: (modo) => modo === 'fabrica' && setTab(1),
	})

	// Catálogo (filtrado por el backend: aprobados + Reconecta/General).
	const [firmwares, setFirmwares] = useState([])
	const [cargando, setCargando] = useState(true)
	const [errorCatalogo, setErrorCatalogo] = useState('')
	const cargarCatalogo = useCallback(async () => {
		setCargando(true)
		setErrorCatalogo('')
		try {
			const r = await autonomiaApi.getFirmwares()
			setFirmwares(Array.isArray(r?.firmwares) ? r.firmwares : [])
		} catch (e) {
			setErrorCatalogo(e?.message || String(e))
		} finally {
			setCargando(false)
		}
	}, [])
	useEffect(() => {
		cargarCatalogo()
	}, [cargarCatalogo])

	return (
		<div className='w-full min-w-0 flex flex-col gap-3 pb-4'>
			<div>
				<h1 className='text-xl font-semibold text-slate-800 dark:text-gray-100'>
					AutonomIA <span className='text-sm font-normal text-slate-400'>· aprovisionamiento Multivac</span>
				</h1>
				<p className='text-sm text-slate-500 dark:text-gray-400'>
					Actualizá el firmware y configurá las placas Multivac por cable USB (Chrome/Edge en PC, Chrome en Android con cable OTG).
				</p>
			</div>

			<Tabs value={tab} onChange={(_, value) => setTab(value)} variant='scrollable' scrollButtons={false} sx={tabsSx}>
				<Tab label='Actualizaciones de firmware' />
				<Tab label='Configuración' />
			</Tabs>

			{tab === 0 ? (
				<FirmwareTab cli={cli} flasher={flasher} firmwares={firmwares} cargando={cargando} errorCatalogo={errorCatalogo} recargar={cargarCatalogo} />
			) : (
				<ConfigTab cli={cli} />
			)}

			<ConfirmModal confirm={confirm} onRespuesta={responderConfirm} />
		</div>
	)
}

export default AutonomIA
