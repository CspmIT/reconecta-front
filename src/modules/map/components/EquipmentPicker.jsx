import { useEffect } from 'react'
import { useMapContext } from '../context/MapContext'
import { KIND_LABEL } from '../utils/js/pins'

/*
 * Un elemento puede tener varios equipos (una ET con 7 medidores, un
 * reconectador con dos controles), asi que "ir al tablero" no siempre tiene una
 * sola respuesta: aca se elige cual.
 *
 * Se dibuja DENTRO de `.rc-map` y no con un portal a document.body: en pantalla
 * completa el elemento a pantalla completa es `.rc-map`, y todo lo que quede
 * fuera de su subarbol no se ve.
 */

function EquipmentPicker() {
	const { equipChoice, setEquipChoice, elegirEquipo } = useMapContext()

	useEffect(() => {
		if (!equipChoice) return
		const onKey = (e) => e.key === 'Escape' && setEquipChoice(null)
		document.addEventListener('keydown', onKey)
		return () => document.removeEventListener('keydown', onKey)
	}, [equipChoice, setEquipChoice])

	if (!equipChoice) return null
	const { element, equipos } = equipChoice

	return (
		<div className='rc-modal' onClick={() => setEquipChoice(null)}>
			{/* El clic adentro no debe cerrar */}
			<div className='rc-modal-card' onClick={(e) => e.stopPropagation()}>
				<div className='rc-modal-h'>
					<div>
						<b>{element.name}</b>
						<span>
							{equipos.length} equipos instalados · elegí a cuál ir
						</span>
					</div>
					<button type='button' className='rc-modal-x' title='Cerrar' onClick={() => setEquipChoice(null)}>
						×
					</button>
				</div>
				<div className='rc-modal-list'>
					{equipos.map((eq) => (
						<button type='button' key={eq.id} className='rc-eqrow' onClick={() => elegirEquipo(eq)}>
							{/* Los equipos llegan con la forma de /map/live, no la de /Elements */}
							<span className='rc-eqtype'>{KIND_LABEL[eq.kind] || 'Equipo'}</span>
							<span className='rc-eqname'>{eq.description || `${eq.model} ${eq.version}`}</span>
							<span className='rc-eqserial'>{eq.serial || '—'}</span>
							<svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.2'>
								<path d='m9 6 6 6-6 6' />
							</svg>
						</button>
					))}
				</div>
			</div>
		</div>
	)
}

export default EquipmentPicker
