import { useCallback, useEffect, useRef, useState } from 'react'

/*
 * El riel de chips del telefono.
 *
 * Diez tarjetas grandes no entran en 390px y los chips con el numero solo no
 * decian de que eran. Aca cada chip lleva su etiqueta corta al lado del numero y
 * el riel scrollea en horizontal, asi que la barra ocupa una sola fila sin
 * importar cuantos indicadores esten prendidos.
 *
 * El degradado de la derecha avisa que hay mas y se apaga al llegar al final:
 * sin eso un riel que scrollea parece una lista que termina ahi.
 */
/*
 * El fondo Y el color del texto van juntos en la misma entrada a proposito.
 *
 * Los tintes de alerta son claros en los dos temas —el mockup no define paleta
 * oscura— asi que el texto encima tiene que ser tinta fija, SIN variante `dark`.
 * Cuando la llevaba, en modo oscuro quedaba gris claro sobre rosa claro: 1.33:1,
 * ilegible. Solo el chip neutro sigue al tema, porque su fondo tambien lo hace.
 */
const CHIP = {
	rojo: 'bg-sev-rojo-bg text-tinta-2',
	naranja: 'bg-sev-naranja-bg text-tinta-2',
	amarillo: 'bg-sev-amarillo-bg text-tinta-2',
	ok: 'bg-[#F1F3F5] dark:bg-gray-700 text-tinta-2 dark:text-gray-300',
	dato: 'bg-[#F1F3F5] dark:bg-gray-700 text-tinta-2 dark:text-gray-300',
}
const PUNTO = {
	rojo: 'bg-sev-rojo',
	naranja: 'bg-sev-naranja',
	amarillo: 'bg-sev-amarillo',
	ok: 'bg-tinta-3',
	dato: 'bg-tinta-3',
}
const NUMERO = {
	rojo: 'text-sev-rojo',
	naranja: 'text-sev-naranja-tx',
	amarillo: 'text-sev-amarillo-tx',
	ok: 'text-tinta dark:text-white',
	dato: 'text-tinta dark:text-white',
}
const CHIP_BASE =
	'flex-none snap-start flex items-center gap-1.5 rounded-2xl border px-2.5 py-1.5 text-[13px] min-h-[33px] whitespace-nowrap'

function CardsChips({ cards, activo, onSelect }) {
	const riel = useRef(null)
	const [enElFinal, setEnElFinal] = useState(true)

	const revisarFinal = useCallback(() => {
		const el = riel.current
		if (!el) return
		setEnElFinal(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4)
	}, [])

	useEffect(() => {
		revisarFinal()
		window.addEventListener('resize', revisarFinal)
		return () => window.removeEventListener('resize', revisarFinal)
	}, [revisarFinal, cards.length])

	return (
		<div className='relative w-full'>
			<div
				ref={riel}
				onScroll={revisarFinal}
				className='flex items-center gap-1.5 overflow-x-auto pb-1 snap-x [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
			>
				{cards.map((card) => (
					<button
						key={card.key}
						type='button'
						onClick={() => onSelect(card.key)}
						aria-pressed={activo === card.key}
						className={`${CHIP_BASE} ${CHIP[card.estado]} ${
							activo === card.key ? 'border-acento !bg-[#EBEDF7] !text-acento' : 'border-transparent'
						}`}
					>
						{card.tono !== 'dato' && <span className={`w-[7px] h-[7px] rounded-sm flex-none ${PUNTO[card.estado]}`} />}
						<b className={`font-semibold tabular-nums ${NUMERO[card.estado]}`}>{card.info}</b>
						{card.corto}
					</button>
				))}
			</div>

			{!enElFinal && (
				<span className='pointer-events-none absolute right-0 top-0 bottom-1 w-8 bg-gradient-to-l from-white dark:from-zinc-500 to-transparent' />
			)}
		</div>
	)
}

export default CardsChips
