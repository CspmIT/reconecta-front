// Programación de la placa desde el navegador con esptool-js (librería
// oficial de Espressif) — portado del Tablero Cooptech.
//
// Reglas que no se negocian:
//   · Modo "actualizar": se escriben SOLO los segmentos del manifiesto, sin
//     erase-all → NVS (configuración), LittleFS y el spool de mediciones
//     quedan intactos.
//   · Modo "fábrica": imagen merged en 0x0 con erase-all, doble confirmación.
//   · El chip detectado debe coincidir con el del release, y la flash física
//     debe alcanzar para lo declarado. Si no, se aborta SIN escribir.
//   · Todo se descarga y se verifica (tamaño + SHA-256 del manifiesto) ANTES de
//     tocar la placa. Después de escribir, verify MD5 (el mismo del esptool).
//   · Al terminar, pulso de reset a modo RUN (si no, la placa queda en el
//     bootloader y no publica MQTT hasta reiniciarla a mano).
import { useState } from 'react'
import { ESPLoader, Transport } from 'esptool-js'
import { md5 } from 'js-md5'
import { MODE_LABEL, FREQ_LABEL, normalizarChip } from '../constants'
import { autonomiaApi } from '../api/autonomiaApi'

export default function useFlasher({ log, pedirPuertoSerie, conectado, desconectar, pedirConfirmacion, onFin }) {
	const [flasheando, setFlasheando] = useState(false)
	const [flashProg, setFlashProg] = useState(null) // { seg, total, pct }
	const [flashFin, setFlashFin] = useState(null) // null | 'ok'

	const programar = async (fwSel, modo = 'actualizar') => {
		if (!fwSel || flasheando) return
		if (modo === 'fabrica' && !fwSel.merged?.key) return
		// El flasheo necesita el puerto para él solo.
		if (conectado) {
			log('sys', 'Cerrando la sesión del CLI para programar…')
			await desconectar()
		}
		let transport = null
		let chipNombre = ''
		let macPlaca = null
		let resultado = 'error'
		let detalle = ''
		try {
			const port = await pedirPuertoSerie()
			transport = new Transport(port, false)
			setFlasheando(true)
			setFlashFin(null)
			log('sys', 'Entrando al bootloader (921600, fallback 115200)…')
			const loader = new ESPLoader({
				transport,
				baudrate: 921600,
				romBaudrate: 115200,
				terminal: { clean() {}, writeLine: (l) => log('sys', '[flash] ' + l), write() {} },
			})
			chipNombre = await loader.main()
			const detectado = normalizarChip(chipNombre)
			try {
				// MAC de fábrica del chip: identifica la placa en el inventario.
				const mac = await loader.chip.readMac(loader)
				if (mac) macPlaca = String(mac).toUpperCase()
			} catch {
				/* opcional */
			}
			let sizePlaca = null
			try {
				sizePlaca = await loader.detectFlashSize()
			} catch {
				/* opcional */
			}
			let fwActual = null
			try {
				const hdr = await loader.readFlash(detectado === 'esp32' ? 0x1000 : 0x0, 4)
				if (hdr && hdr[0] === 0xe9) {
					// Orden del HEADER de imagen ESP32: 0=QIO 1=QOUT 2=DIO 3=DOUT.
					const modesHdr = ['qio', 'qout', 'dio', 'dout']
					const sizes = { 0: '1MB', 1: '2MB', 2: '4MB', 3: '8MB', 4: '16MB' }
					const freqs = { 0: '40m', 1: '26m', 2: '20m', 15: '80m' }
					fwActual = { mode: modesHdr[hdr[2]] || '?', size: sizes[hdr[3] >> 4] || '?', freq: freqs[hdr[3] & 0x0f] || '?' }
				}
			} catch {
				/* placa virgen o lectura no disponible */
			}
			log(
				'sys',
				`Placa: ${chipNombre}${macPlaca ? ` · MAC ${macPlaca}` : ''} · flash física: ${sizePlaca || '?'}${
					fwActual
						? ` · firmware actual: ${MODE_LABEL[fwActual.mode] || fwActual.mode} / ${FREQ_LABEL[fwActual.freq] || fwActual.freq} / ${fwActual.size}`
						: ' · sin firmware legible (¿placa virgen?)'
				}`
			)
			if (detectado !== fwSel.chip) {
				detalle = `chip ${chipNombre} ≠ ${fwSel.chip}`
				resultado = 'abortado'
				log('sys', `⛔ ABORTADO: el firmware "${fwSel.modelo} ${fwSel.version}" es para ${fwSel.chip.toUpperCase()} y la placa conectada es ${chipNombre}. Nada se escribió.`)
				return
			}
			const mb = (s) => Number(String(s || '').replace('MB', '')) || 0
			if (sizePlaca && fwSel.flash?.size && fwSel.flash.size !== 'keep' && mb(fwSel.flash.size) > mb(sizePlaca)) {
				detalle = `flash ${sizePlaca} < ${fwSel.flash.size}`
				resultado = 'abortado'
				log('sys', `⛔ ABORTADO: el release declara flash de ${fwSel.flash.size} y la placa tiene ${sizePlaca}. Nada se escribió.`)
				return
			}
			if (fwActual && fwSel.flash?.mode && fwSel.flash.mode !== 'keep' && fwActual.mode !== '?' && fwActual.mode !== fwSel.flash.mode) {
				log('sys', `⚠ Aviso: el firmware actual está en ${MODE_LABEL[fwActual.mode]} y el release usa ${MODE_LABEL[fwSel.flash.mode]} — manda el release.`)
			}

			const titulo = `${fwSel.modelo} · versión ${fwSel.version}${fwSel.nombre ? ` · ${fwSel.nombre}` : ''}`
			if (modo === 'fabrica') {
				const ok1 = await pedirConfirmacion({
					titulo: '🏭 Volver a fábrica',
					lineas: [
						titulo,
						'La placa conectada es la correcta ✓',
						'⚠ Esto borra TODO: la configuración, la red y las mediciones que todavía no se subieron. El equipo queda como recién salido de fábrica.',
					],
					boton: 'Continuar',
					peligro: true,
				})
				const ok2 =
					ok1 &&
					(await pedirConfirmacion({
						titulo: 'Última confirmación',
						lineas: ['¿Seguro que querés borrar todo y volver a fábrica?'],
						boton: 'Sí, borrar todo',
						peligro: true,
					}))
				if (!ok2) {
					resultado = 'cancelado'
					log('sys', 'Vuelta a fábrica cancelada.')
					return
				}
			} else {
				const ok = await pedirConfirmacion({
					titulo: '⬆ Actualizar firmware',
					lineas: [
						titulo,
						'La placa conectada es la correcta ✓',
						'La configuración y las mediciones del equipo se conservan.',
						'No desconectes el cable durante la actualización.',
					],
					boton: 'Actualizar',
					peligro: false,
				})
				if (!ok) {
					resultado = 'cancelado'
					log('sys', 'Programación cancelada por el usuario.')
					return
				}
			}

			const aBajar =
				modo === 'fabrica'
					? [{ key: fwSel.merged.key, nombre: fwSel.merged.nombre || 'merged.bin', offset: '0x0', tamano: fwSel.merged.tamano, sha256: fwSel.merged.sha256 }]
					: fwSel.segmentos
			// TODO se descarga y VERIFICA antes de tocar la placa: un microcorte de
			// internet corta acá (la placa queda intacta).
			const fileArray = []
			for (const seg of aBajar) {
				log('sys', `Descargando ${seg.nombre || seg.key} (${seg.offset})…`)
				const buf = await autonomiaApi.getBinario(seg.key)
				if (seg.tamano != null && buf.byteLength !== Number(seg.tamano)) {
					detalle = `tamaño ${seg.nombre}: ${buf.byteLength} ≠ ${seg.tamano}`
					resultado = 'abortado'
					log('sys', `⛔ ABORTADO antes de escribir: ${seg.nombre} bajó ${buf.byteLength} bytes y el manifiesto dice ${seg.tamano}. La placa NO se tocó — reintentá.`)
					return
				}
				if (seg.sha256) {
					const hex = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', buf)))
						.map((b) => b.toString(16).padStart(2, '0'))
						.join('')
					if (hex !== seg.sha256) {
						detalle = `SHA-256 ${seg.nombre} no coincide`
						resultado = 'abortado'
						log('sys', `⛔ ABORTADO antes de escribir: la huella SHA-256 de ${seg.nombre} NO coincide con la publicada. La placa NO se tocó.`)
						return
					}
				}
				fileArray.push({ data: new Uint8Array(buf), address: parseInt(seg.offset, 16) })
			}
			log('sys', '✓ Binarios completos y verificados bit a bit (SHA-256) contra el manifiesto publicado.')
			log('sys', modo === 'fabrica' ? 'Borrando flash completa y escribiendo imagen de fábrica…' : `Escribiendo ${fileArray.length} segmento(s)…`)
			await loader.writeFlash({
				fileArray,
				flashMode: fwSel.flash?.mode || 'keep',
				flashFreq: fwSel.flash?.freq || 'keep',
				flashSize: fwSel.flash?.size || 'keep',
				eraseAll: modo === 'fabrica',
				compress: true,
				reportProgress: (i, escrito, total) =>
					setFlashProg({ seg: i + 1, total: fileArray.length, pct: total ? Math.round((escrito / total) * 100) : 0 }),
				calculateMD5Hash: (image) => md5(image),
			})
			// Reinicio a modo RUN: IO0 suelto (DTR=0), pulso de EN (RTS).
			try {
				await transport.setDTR(false)
				await transport.setRTS(true)
				await new Promise((r) => setTimeout(r, 150))
				await transport.setRTS(false)
			} catch {
				/* adaptador sin señales: reiniciar a mano */
			}
			resultado = 'ok'
			log(
				'sys',
				modo === 'fabrica'
					? `✅ ${fwSel.modelo} ${fwSel.version} — vuelta a fábrica completa. El equipo arranca SIN configuración: pasá a «Configuración» para aprovisionarlo.`
					: `✅ ${fwSel.modelo} ${fwSel.version} actualizado (config y mediciones intactas). Reconectá en «Configuración» y verificá con "info".`
			)
			setFlashFin('ok')
			onFin?.(modo)
		} catch (e) {
			detalle = String(e?.message || e).slice(0, 250)
			log('sys', '⚠ Flasheo: ' + (e?.message || e) + ' — la placa puede reprogramarse sin problema, reintentá.')
		} finally {
			try {
				await transport?.disconnect()
			} catch {
				/* */
			}
			setFlasheando(false)
			setFlashProg(null)
			// Inventario: qué placa quedó con qué versión (RF-OT-09 / H-05).
			if (resultado !== 'cancelado' && chipNombre) {
				autonomiaApi.registrarEvento({
					tipo: 'flash',
					modo,
					modelo: fwSel.modelo,
					version: fwSel.version,
					chip: chipNombre,
					mac: macPlaca,
					resultado,
					detalle,
				})
			}
		}
	}

	return { flasheando, flashProg, flashFin, programar }
}
