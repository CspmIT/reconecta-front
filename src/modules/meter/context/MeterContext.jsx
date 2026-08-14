import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import Swal from 'sweetalert2'
import { request } from '../../../utils/js/request'
import { backend } from '../../../utils/routes/app.routes'

/*
 * Contexto del medidor: relación de transformación (VT/CT) y toggle Medido/Convertido.
 * - La relación "leída del equipo" sale de los fields VT_0/VT_1 y CT_0/CT_1 (topic Fasorial/VI).
 * - El override "manual" se usa cuando el equipo reporta 1:1 (típico gran consumidor)
 *   y se persiste en el backend (tabla MeterTransformRatios, por serial).
 */
const MeterContext = createContext(null)

export function MeterProvider({ info, vi, children }) {
	// Relación reportada por el equipo (secundario por defecto 1 para evitar división por 0)
	const equipmentReport = useMemo(
		() => ({
			vt: { primary: vi?.VT_0?.value ?? 1, secondary: vi?.VT_1?.value || 1 },
			ct: { primary: vi?.CT_0?.value ?? 1, secondary: vi?.CT_1?.value || 1 },
		}),
		[vi]
	)

	const [txOn, setTxOn] = useState(true) // por defecto: Convertido (valores físicos)
	const [txSource, setTxSource] = useState('equipment')
	const [manualTx, setManualTx] = useState(null) // {vt:{primary,secondary}, ct:{primary,secondary}}

	useEffect(() => {
		if (!info?.id) return
		const loadRatio = async () => {
			try {
				const response = await request(
					`${backend[`${import.meta.env.VITE_APP_NAME}`]}/getMeterTxRatio?id=${info.id}`,
					'GET'
				)
				const { source, ratio } = response.data ?? {}
				if (source === 'manual' && ratio) {
					setTxSource('manual')
					setManualTx({
						vt: { primary: ratio.vt_primary, secondary: ratio.vt_secondary },
						ct: { primary: ratio.ct_primary, secondary: ratio.ct_secondary },
					})
				} else {
					setTxSource('equipment')
					setManualTx(null)
				}
			} catch (error) {
				// Sin backend disponible: se usa la relación leída del equipo
				console.error(error)
			}
		}
		loadRatio()
	}, [info?.id])

	const saveTx = async (source, vt, ct) => {
		try {
			await request(
				`${backend[`${import.meta.env.VITE_APP_NAME}`]}/saveMeterTxRatio`,
				'POST',
				{
					id_equipment: info.id,
					source,
					vt_primary: vt.primary,
					vt_secondary: vt.secondary,
					ct_primary: ct.primary,
					ct_secondary: ct.secondary,
				}
			)
			setTxSource(source)
			setManualTx(source === 'manual' ? { vt, ct } : null)
			return true
		} catch (error) {
			console.error(error)
			Swal.fire({
				title: 'Atención!',
				html: 'No se pudo guardar la relación de transformación.</br>Intente nuevamente...',
				icon: 'error',
			})
			return false
		}
	}

	const vt = txSource === 'manual' && manualTx ? manualTx.vt : equipmentReport.vt
	const ct = txSource === 'manual' && manualTx ? manualTx.ct : equipmentReport.ct
	const vtFactor = vt.secondary ? vt.primary / vt.secondary : 1
	const ctFactor = ct.secondary ? ct.primary / ct.secondary : 1

	const toNumber = (value) => {
		const num = parseFloat(value)
		return isNaN(num) ? null : num
	}
	// Solo tensiones (VT) y corrientes (CT) se convierten: energía/potencia ya vienen primarias del medidor
	const convertV = (value) => {
		const num = toNumber(value)
		if (num === null) return value
		return txOn ? +(num * vtFactor).toFixed(2) : num
	}
	const convertI = (value) => {
		const num = toNumber(value)
		if (num === null) return value
		return txOn ? +(num * ctFactor).toFixed(3) : num
	}

	const value = {
		info,
		vi,
		txOn,
		setTxOn,
		txSource,
		vt,
		ct,
		vtFactor,
		ctFactor,
		vtLabel: `${vt.primary}:${vt.secondary}`,
		ctLabel: `${ct.primary}:${ct.secondary}`,
		equipmentReport,
		saveTx,
		convertV,
		convertI,
	}

	return <MeterContext.Provider value={value}>{children}</MeterContext.Provider>
}

export function useMeter() {
	const ctx = useContext(MeterContext)
	if (!ctx) {
		// Permite usar componentes fuera del provider sin romper (sin conversión)
		return {
			info: null,
			vi: null,
			txOn: false,
			setTxOn: () => {},
			txSource: 'equipment',
			vt: { primary: 1, secondary: 1 },
			ct: { primary: 1, secondary: 1 },
			vtFactor: 1,
			ctFactor: 1,
			vtLabel: '1:1',
			ctLabel: '1:1',
			equipmentReport: { vt: { primary: 1, secondary: 1 }, ct: { primary: 1, secondary: 1 } },
			saveTx: async () => false,
			convertV: (v) => v,
			convertI: (v) => v,
		}
	}
	return ctx
}

export default MeterContext
