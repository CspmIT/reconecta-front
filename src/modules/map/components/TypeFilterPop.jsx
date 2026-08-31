import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useMapContext } from '../context/MapContext'
import { shapeOf } from '../utils/js/pins'

/*
 * Filtro por tipo de elemento. Se persiste por usuario en UserChecksHome
 * (type 4) desde el contexto; aca solo se dibuja.
 */
function TypeFilterPop({ anchorRef, open, onClose, side = 'below' }) {
	const { types, counts, visibleTypes, toggleType, setAllTypes } = useMapContext()
	const popRef = useRef(null)
	const [pos, setPos] = useState({ left: -9999, top: -9999 })

	useLayoutEffect(() => {
		if (!open || !anchorRef.current || !popRef.current) return
		const r = anchorRef.current.getBoundingClientRect()
		const { offsetWidth: w, offsetHeight: h } = popRef.current
		const left = side === 'right' ? r.right + 8 : r.left
		setPos({
			left: Math.max(10, Math.min(left, window.innerWidth - w - 10)),
			top: Math.min(r.bottom + 6, window.innerHeight - h - 10),
		})
	}, [open, anchorRef, side])

	useEffect(() => {
		if (!open) return
		const onDocClick = (e) => {
			if (popRef.current?.contains(e.target) || anchorRef.current?.contains(e.target)) return
			onClose()
		}
		const onKey = (e) => e.key === 'Escape' && onClose()
		document.addEventListener('click', onDocClick)
		document.addEventListener('keydown', onKey)
		return () => {
			document.removeEventListener('click', onDocClick)
			document.removeEventListener('keydown', onKey)
		}
	}, [open, onClose, anchorRef])

	if (!open || !visibleTypes) return null
	const todos = visibleTypes.size === types.length

	return (
		<div className='rc-pop' ref={popRef} style={{ left: pos.left, top: pos.top }}>
			<div className='rc-pop-h'>
				<b>Tipos de equipo</b>
				<button type='button' onClick={() => setAllTypes(!todos)}>
					{todos ? 'Ninguno' : 'Todos'}
				</button>
			</div>
			{types.map((t) => (
				<div
					key={t.id}
					className={`rc-opt${visibleTypes.has(t.id) ? ' on' : ''}`}
					onClick={() => toggleType(t.id)}
				>
					<span className='box'>
						<svg width='11' height='11' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='3.4'>
							<path d='m5 12 5 5 9-10' />
						</svg>
					</span>
					<span className={`rc-shape sh-${shapeOf(t.id)}`} style={{ background: 'var(--rc-txt3)' }} />
					<span className='lbl'>{t.name}</span>
					<span className='n'>{counts[t.id] || 0}</span>
				</div>
			))}
		</div>
	)
}

export default TypeFilterPop
