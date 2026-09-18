// Solapa «Configuración»: la configuración guiada de la placa (leer → editar
// → grabar SOLO los cambios → releer y verificar), con el terminal como
// registro. Selector de firmware + botones USB/BT juntos en la sección 1.
// Sin firmware elegido, el formulario se ve bloqueado con los pasos a seguir.
import { useState } from 'react'
import { FaUsb, FaBluetoothB } from 'react-icons/fa'
import Terminal from './Terminal'
import MultivacConfigReconecta from './MultivacConfigReconecta.jsx'
import MultivacConfigItron from './MultivacConfigItron.jsx'
import { autonomiaApi } from '../api/autonomiaApi'

export default function ConfigTab({ cli }) {
	const [cfgModo, setCfgModo] = useState('')
	const [cmd, setCmd] = useState('')
	const { conectado, transporte, hayUsb, soportaBle, conectarSerial, conectarBle, desconectar, enviarLinea, rxSink, log } = cli

	const onGrabado = (fw) => (info) =>
		autonomiaApi.registrarEvento({
			tipo: 'config',
			modo: fw,
			modelo: fw === 'itron' ? 'DLMS Itron (medidores)' : 'Multivac',
			version: null,
			mac: info?.mac || null,
			nombre_equipo: info?.nombre || null,
			resultado: 'ok',
			detalle: `${info?.comandos || 0} comando(s)`,
		})

	const selectorFirmware = (
		<div>
			<label className='block text-xs text-slate-500 mb-0.5'>Firmware de la placa</label>
			<select value={cfgModo} onChange={(e) => setCfgModo(e.target.value)} className='border border-slate-300 rounded-lg px-2 py-1.5 text-sm min-w-[230px] bg-white text-slate-800'>
				<option value=''>— Seleccionar —</option>
				<option value='reconecta'>Reconecta — DNP3 Universal (guiado)</option>
				<option value='itron'>DLMS Itron — SL7000/ACE6000 (guiado)</option>
				<option value='libre'>Terminal libre (avanzado)</option>
			</select>
		</div>
	)

	const botonesConexion = (
		<>
			{!conectado && hayUsb && (
				<button
					onClick={conectarSerial}
					disabled={!cfgModo}
					title={cfgModo ? 'Conectar por cable USB (CLI serie)' : 'Primero elegí el firmware de la placa'}
					className='px-3 py-1.5 text-sm rounded-lg bg-coop-azul text-white hover:opacity-90 disabled:opacity-40 flex items-center gap-1.5'>
					<FaUsb size={16} /> USB
				</button>
			)}
			{!conectado && soportaBle && (
				<button
					onClick={conectarBle}
					disabled={!cfgModo}
					title={cfgModo ? 'Conectar por Bluetooth (BLE)' : 'Primero elegí el firmware de la placa'}
					className='p-2 rounded-lg border border-coop-azul text-coop-azul hover:bg-coop-azul/5 disabled:opacity-40'>
					<FaBluetoothB size={18} />
				</button>
			)}
			{conectado && (
				<button onClick={desconectar} className='px-3 py-1.5 text-sm rounded-lg border border-red-300 text-red-500 hover:bg-red-50'>
					Desconectar ({transporte === 'serial' ? 'USB' : 'BLE'})
				</button>
			)}
		</>
	)

	const enviar = async () => {
		const linea = cmd.trim()
		if (!linea) return
		setCmd('')
		await enviarLinea(linea)
	}

	return (
		<div className='text-slate-800'>
			{cfgModo !== 'libre' && cfgModo !== 'itron' && (
				<MultivacConfigReconecta
					habilitado={cfgModo === 'reconecta'}
					conectado={conectado && transporte === 'serial'}
					enviarLinea={enviarLinea}
					rxSink={rxSink}
					terminal={<Terminal cli={cli} altura='h-80' />}
					log={log}
					selectorFirmware={selectorFirmware}
					botonesConexion={botonesConexion}
					onGrabado={onGrabado('reconecta')}
				/>
			)}

			{cfgModo === 'itron' && (
				<MultivacConfigItron
					habilitado
					conectado={conectado && transporte === 'serial'}
					enviarLinea={enviarLinea}
					rxSink={rxSink}
					terminal={<Terminal cli={cli} altura='h-80' />}
					log={log}
					selectorFirmware={selectorFirmware}
					botonesConexion={botonesConexion}
					onGrabado={onGrabado('itron')}
				/>
			)}

			{cfgModo === 'libre' && (
				<div className='bg-white border border-slate-200 rounded-xl p-3'>
					<div className='flex items-end justify-between flex-wrap gap-3 mb-3'>
						<div className='flex items-end gap-3 flex-wrap'>
							{selectorFirmware}
							<div className='flex gap-2 pb-0.5'>{botonesConexion}</div>
						</div>
						<p className='text-sm text-slate-500 flex-1 min-w-[240px]'>
							Terminal del CLI del firmware: escribí «help» para ver los comandos. Para uso avanzado; el flujo normal es el guiado.
						</p>
					</div>
					<Terminal cli={cli} altura='h-96' vacio='— Conectá un equipo y escribí «help» —' />
					<div className='flex gap-2 mt-2'>
						<input
							value={cmd}
							onChange={(e) => setCmd(e.target.value)}
							onKeyDown={(e) => e.key === 'Enter' && enviar()}
							disabled={!conectado}
							placeholder={conectado ? 'Comando…' : 'Conectá primero'}
							className='flex-1 border border-slate-300 rounded-lg px-3 py-1.5 text-sm font-mono disabled:bg-slate-50 bg-white text-slate-800'
						/>
						<button onClick={enviar} disabled={!conectado} className='px-4 py-1.5 text-sm rounded-lg bg-coop-azul text-white hover:opacity-90 disabled:opacity-40'>
							Enviar
						</button>
					</div>
				</div>
			)}
		</div>
	)
}
