// Transporte hacia el CLI del firmware Multivac — portado del módulo
// AutonomIA del Tablero Cooptech (Multivac.jsx) a un hook reutilizable.
//
// Dos transportes con la misma terminal encima:
//   · USB serie: Web Serial en PC (Chrome/Edge). En Chrome de Android el
//     picker de Web Serial solo lista Bluetooth, así que el cable va por
//     WebUSB con driver propio (CP210x / CH34x) que expone la MISMA interfaz
//     que un SerialPort (utils/cp210x.js).
//   · Bluetooth BLE (Web Bluetooth + UART/NUS) para cuando el firmware lo exponga.
//
// Todo lo aprendido en campo viaja acá: el reset a modo RUN al abrir el
// puerto (si no, la placa queda en bootloader), el lector robusto que
// sobrevive al glitch de línea del reset, y el cierre ordenado del puerto
// (si no, Chrome lo retiene y Arduino dice "Port Busy").
import { useEffect, useRef, useState } from 'react'
import { soportaWebUsb, pedirPuertoUsbSerie } from '../utils/cp210x.js'

// Servicios UART-BLE candidatos: se prueban en orden.
const SERVICIOS_UART = [
	'6e400001-b5a3-f393-e0a9-e50e24dcca9e', // Nordic UART (NUS)
	0xffe0, // HM-10 y clones
	0xabf0, // BLE-SPP de ejemplos Espressif
]

export default function useCli() {
	const [transporte, setTransporte] = useState(null) // null | 'serial' | 'ble'
	const [conectado, setConectado] = useState(false)
	const [lineas, setLineas] = useState([]) // { t: 'in'|'out'|'sys', txt }
	const [autoScroll, setAutoScroll] = useState(true)

	const conexion = useRef({}) // { port, reader, writer, lector, vivo } | { device, rxChar }
	const bufferRx = useRef('')
	const finLog = useRef(null)
	// Sink de RX para la configuración guiada: cada línea recibida le llega
	// también al formulario (además del terminal).
	const rxSink = useRef(null)

	const soportaSerial = typeof navigator !== 'undefined' && 'serial' in navigator
	const soportaBle = typeof navigator !== 'undefined' && 'bluetooth' in navigator
	const esAndroid = typeof navigator !== 'undefined' && /android/i.test(navigator.userAgent || '')
	const usarWebUsb = esAndroid && soportaWebUsb()
	const hayUsb = usarWebUsb || soportaSerial

	const log = (t, txt) => setLineas((ls) => [...ls.slice(-500), { t, txt }])
	const limpiarLog = () => setLineas([])

	useEffect(() => {
		const el = finLog.current
		if (autoScroll && el) el.scrollTop = el.scrollHeight
	}, [lineas, autoScroll])

	// ÚNICO punto de pedido de puerto por cable: PC → Web Serial nativo;
	// Android → WebUSB + driver según puente. Con diagnóstico de campo si el
	// picker sale vacío (problema físico) o falla al elegir (falta driver).
	const pedirPuertoSerie = async () => {
		if (!usarWebUsb) return navigator.serial.requestPort()
		try {
			return await pedirPuertoUsbSerie()
		} catch (e) {
			if (e?.name === 'NotFoundError') {
				let autorizados = []
				try {
					autorizados = await navigator.usb.getDevices()
				} catch {
					/* sin datos */
				}
				log('sys', '⚠ No se eligió ningún dispositivo USB.')
				log(
					'sys',
					'Si la lista salió VACÍA con la placa enchufada, Android no la está viendo: probá otro cable/adaptador OTG, revisá el conector y que la placa encienda.'
				)
				if (autorizados.length) {
					const hex = (n) => '0x' + n.toString(16).toUpperCase().padStart(4, '0')
					log(
						'sys',
						`Dispositivos USB ya autorizados en este celular: ${autorizados
							.map((d) => `${d.productName || 'sin nombre'} (VID ${hex(d.vendorId)}/PID ${hex(d.productId)})`)
							.join(' · ')}`
					)
				}
				log('sys', 'Si la placa SÍ aparece pero al elegirla da error, avisá a ingeniería con el VID/PID del mensaje para agregar su driver.')
			}
			throw e
		}
	}

	const procesarEntrada = (chunk) => {
		bufferRx.current += chunk
		let corte
		while ((corte = bufferRx.current.indexOf('\n')) >= 0) {
			const linea = bufferRx.current.slice(0, corte).replace(/\r$/, '')
			bufferRx.current = bufferRx.current.slice(corte + 1)
			if (linea) {
				log('in', linea)
				try {
					rxSink.current?.(linea)
				} catch {
					/* el sink nunca frena el terminal */
				}
			}
		}
	}

	// ---------- USB (Web Serial o WebUSB con interfaz SerialPort) ----------
	const conectarSerial = async () => {
		try {
			const port = await pedirPuertoSerie()
			await port.open({ baudRate: 115200 })
			// Reset a modo RUN: al abrir, el navegador puede dejar DTR/RTS en un
			// estado que resetea la placa con IO0 a masa → arranca en bootloader
			// y el CLI nunca corre. Secuencia esptool: EN abajo con IO0 suelto,
			// esperar, EN arriba.
			try {
				await port.setSignals({ dataTerminalReady: false, requestToSend: true })
				await new Promise((r) => setTimeout(r, 120))
				await port.setSignals({ dataTerminalReady: false, requestToSend: false })
			} catch {
				/* adaptador sin señales cableadas: seguir */
			}
			const writer = port.writable.getWriter()
			conexion.current = { port, writer, vivo: true }
			setTransporte('serial')
			setConectado(true)
			log('sys', 'Conectado por USB (115200).')
			try {
				const info = port.getInfo?.() || {}
				if (info.usbVendorId != null) {
					const hex = (n) => '0x' + n.toString(16).toUpperCase().padStart(4, '0')
					log('sys', `Puente USB detectado: VID ${hex(info.usbVendorId)} / PID ${hex(info.usbProductId ?? 0)}${usarWebUsb ? ' (driver WebUSB propio)' : ''}`)
				}
			} catch {
				/* solo informativo */
			}
			// Lector robusto: tras un framing error (glitch del reset) el puerto
			// expone un stream nuevo y se sigue leyendo; si se cierra de verdad,
			// readable queda null y el loop termina.
			const lector = (async () => {
				const dec = new TextDecoder()
				while (conexion.current.port === port && conexion.current.vivo && port.readable) {
					const reader = port.readable.getReader()
					conexion.current.reader = reader
					try {
						for (;;) {
							const { value, done } = await reader.read()
							if (done) break
							if (value) procesarEntrada(dec.decode(value, { stream: true }))
						}
					} catch {
						/* glitch de línea: reintentar */
					} finally {
						try {
							reader.releaseLock()
						} catch {
							/* */
						}
					}
					if (!conexion.current.vivo || conexion.current.port !== port) break
				}
				if (conexion.current.port === port) setConectado(false)
				log('sys', 'Conexión USB cerrada.')
			})()
			conexion.current.lector = lector
		} catch (e) {
			if (e?.name !== 'NotFoundError') log('sys', 'USB: ' + (e.message || e))
		}
	}

	// ---------- BLE (Web Bluetooth + UART) ----------
	const conectarBle = async () => {
		try {
			const device = await navigator.bluetooth.requestDevice({
				acceptAllDevices: true,
				optionalServices: SERVICIOS_UART,
			})
			const server = await device.gatt.connect()
			let rxChar = null
			let txChar = null
			for (const sv of SERVICIOS_UART) {
				try {
					const service = await server.getPrimaryService(sv)
					const chars = await service.getCharacteristics()
					const tx = chars.find((c) => c.properties.notify || c.properties.indicate)
					const rx = chars.find((c) => c.properties.writeWithoutResponse || c.properties.write)
					if (tx && rx) {
						txChar = tx
						rxChar = rx
						break
					}
				} catch {
					/* probar el siguiente */
				}
			}
			if (!txChar || !rxChar) {
				try {
					device.gatt.disconnect()
				} catch {
					/* */
				}
				log('sys', 'Conecté por Bluetooth pero el equipo no expone un servicio UART conocido.')
				return
			}
			await txChar.startNotifications()
			const dec = new TextDecoder()
			txChar.addEventListener('characteristicvaluechanged', (ev) => procesarEntrada(dec.decode(ev.target.value)))
			device.addEventListener('gattserverdisconnected', () => {
				setConectado(false)
				log('sys', 'BLE desconectado.')
			})
			conexion.current = { device, rxChar }
			setTransporte('ble')
			setConectado(true)
			log('sys', `Conectado por Bluetooth a ${device.name || 'Multivac'}.`)
		} catch (e) {
			if (e?.name !== 'NotFoundError') log('sys', 'BLE: ' + (e.message || e))
		}
	}

	const desconectar = async () => {
		const c = conexion.current
		conexion.current = {}
		setConectado(false)
		setTransporte(null)
		// Cierre ordenado y ESPERANDO cada paso: si se llama port.close() con los
		// streams bloqueados, Chrome retiene el puerto ("Port Busy").
		c.vivo = false
		try {
			await c.reader?.cancel()
		} catch {
			/* */
		}
		try {
			await c.lector
		} catch {
			/* */
		}
		try {
			c.writer?.releaseLock()
		} catch {
			/* */
		}
		try {
			await c.port?.close()
		} catch {
			/* */
		}
		try {
			c.device?.gatt?.disconnect()
		} catch {
			/* */
		}
	}

	const enviarLinea = async (linea) => {
		const c = conexion.current
		const data = linea + '\n'
		try {
			if (c.writer) {
				await c.writer.write(new TextEncoder().encode(data))
			} else if (c.rxChar) {
				const bytes = new TextEncoder().encode(data)
				const sinResp = c.rxChar.properties.writeWithoutResponse
				for (let i = 0; i < bytes.length; i += 20) {
					const trozo = bytes.slice(i, i + 20)
					if (sinResp) await c.rxChar.writeValueWithoutResponse(trozo)
					else await c.rxChar.writeValue(trozo)
				}
			} else {
				log('sys', 'Sin conexión.')
				return
			}
			log('out', linea)
		} catch (e) {
			log('sys', 'Error al enviar: ' + (e.message || e))
		}
	}

	// Al desmontar la vista, soltar el puerto.
	useEffect(() => () => {
		desconectar()
	}, []) // eslint-disable-line react-hooks/exhaustive-deps

	return {
		transporte,
		conectado,
		lineas,
		autoScroll,
		setAutoScroll,
		finLog,
		rxSink,
		hayUsb,
		soportaBle,
		usarWebUsb,
		log,
		limpiarLog,
		pedirPuertoSerie,
		conectarSerial,
		conectarBle,
		desconectar,
		enviarLinea,
	}
}
