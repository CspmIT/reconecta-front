import Sparkline from './Sparkline'

/*
 * La tarjeta grande del escritorio.
 *
 * El tinte, el borde y la barra de la izquierda salen del tono EFECTIVO y no del
 * declarado: un indicador en cero no pinta nada, aunque su tono sea rojo (ver
 * `estado` en buildCards). El informativo no colorea nunca.
 *
 * Es un boton porque al tocarla la tabla queda filtrada por ese indicador.
 */
const TARJETA = {
	rojo: 'bg-sev-rojo-bg border-sev-rojo-bd',
	naranja: 'bg-sev-naranja-bg border-sev-naranja-bd',
	amarillo: 'bg-sev-amarillo-bg border-sev-amarillo-bd',
	ok: 'bg-white dark:bg-gray-800 border-linea dark:border-gray-700',
	dato: 'bg-white dark:bg-gray-800 border-linea dark:border-gray-700',
}
const BARRA = {
	rojo: 'bg-sev-rojo w-[3px]',
	naranja: 'bg-sev-naranja w-[3px]',
	amarillo: 'bg-sev-amarillo w-[4px]',
	ok: 'w-0',
	dato: 'w-0',
}
const VALOR = {
	rojo: 'text-sev-rojo',
	naranja: 'text-sev-naranja-tx',
	amarillo: 'text-sev-amarillo-tx',
	// En cero el numero se apaga; el informativo se lee en tinta plena
	ok: 'text-tinta-3',
	dato: 'text-tinta dark:text-white',
}
const ROTULO = {
	ok: 'text-tinta-2 dark:text-gray-300',
	dato: 'text-tinta-2 dark:text-gray-300',
}
const ROTULO_ALERTA = 'text-tinta'

const CHIP_DELTA = 'text-[11.5px] font-semibold tabular-nums px-1.5 py-px rounded'

/*
 * La variacion contra la lectura anterior. `null` es "todavia no hay con que
 * comparar", que se lee igual que "sin cambios": las dos dicen que no hay
 * novedad, y distinguirlas con otro texto solo confundiria.
 *
 * Que un contador de problemas suba es malo y que baje es bueno, sea el
 * indicador que sea.
 */
function Delta({ delta }) {
	if (!delta) return <span className={`${CHIP_DELTA} bg-[#EFF1F4] text-tinta-2`}>sin cambios</span>
	const clase = delta > 0 ? 'bg-[#FBE7EA] text-sev-rojo' : 'bg-[#E6F3EB] text-sev-normal'
	return (
		<span className={`${CHIP_DELTA} ${clase}`}>
			{delta > 0 ? '+' : ''}
			{delta}
		</span>
	)
}

function CardsInfo({ card, activo, onSelect }) {
	const alerta = card.estado !== 'ok' && card.estado !== 'dato'

	return (
		<button
			type='button'
			onClick={() => onSelect(card.key)}
			aria-pressed={activo}
			className={`relative overflow-hidden text-left rounded-md border px-3.5 pt-3 pb-2.5 pl-[15px] transition-colors ${
				TARJETA[card.estado]
			} ${activo ? '!border-acento ring-1 ring-acento' : ''}`}
		>
			<span className={`absolute left-0 top-0 bottom-0 ${BARRA[card.estado]}`} />

			<span
				className={`block text-[13px] font-medium leading-[1.25] min-h-[2.5em] ${
					alerta ? ROTULO_ALERTA : ROTULO[card.estado]
				}`}
			>
				{card.rotulo}
			</span>

			<span className='flex items-end gap-2 mt-1.5'>
				<span className={`text-[38px] font-semibold leading-[.92] tracking-[-.03em] tabular-nums ${VALOR[card.estado]}`}>
					{card.info}
				</span>
				{card.unidad && <span className='text-[12.5px] text-tinta-2 dark:text-tinta-3 pb-1.5'>{card.unidad}</span>}
			</span>

			{/*
			  * Tinta-2 y no tinta-3: la nota vive sobre el tinte de alerta, donde el
			  * gris claro daba 2.75:1
			  */}
			{card.nota && <span className='block text-[11.5px] text-tinta-2 mt-1.5 leading-[1.3]'>{card.nota}</span>}

			<span className='flex items-center gap-2 mt-2.5 h-[17px]'>
				{card.tono !== 'dato' && <Delta delta={card.delta} />}
				<Sparkline serie={card.serie} estado={card.estado} className='ml-auto' />
			</span>
		</button>
	)
}

export default CardsInfo
