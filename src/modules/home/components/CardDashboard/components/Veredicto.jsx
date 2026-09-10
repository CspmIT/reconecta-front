/*
 * La franja de veredicto: el pulso, el titular y el detalle.
 *
 * Es la respuesta a "¿tengo algo que atender?" antes de leer un solo numero. El
 * titular y el detalle los arma buildVeredicto a partir de las tarjetas
 * visibles, asi que lo que dice y lo que se ve en la grilla no pueden
 * discrepar.
 *
 * En el telefono va sin la linea de detalle: el titular ya nombra lo mas grave y
 * el detalle completo esta en los chips de abajo.
 */
const PULSO = {
	rojo: 'bg-sev-rojo shadow-[0_0_0_4px_rgba(207,9,39,0.14)] animate-latir motion-reduce:animate-none',
	naranja: 'bg-sev-naranja shadow-[0_0_0_4px_rgba(222,107,0,0.16)]',
	amarillo: 'bg-sev-amarillo shadow-[0_0_0_4px_rgba(247,207,6,0.24)]',
	sinDato: 'bg-tinta-3 shadow-[0_0_0_4px_rgba(139,149,161,0.18)]',
	normal: 'bg-sev-normal shadow-[0_0_0_4px_rgba(0,147,59,0.14)]',
}

function Veredicto({ veredicto, actualizado, compact = false, children }) {
	const pulso = `rounded-full flex-none ${PULSO[veredicto.tono] ?? PULSO.normal}`
	const hora = actualizado
		? actualizado.toLocaleTimeString('es-AR', compact ? { hour: '2-digit', minute: '2-digit', hour12: false } : { hour12: false })
		: '--:--'

	if (compact) {
		return (
			<div className='w-full flex items-center gap-2 pb-2'>
				<span className={`${pulso} w-[9px] h-[9px]`} />
				<b className='text-[15px] font-semibold leading-tight text-tinta dark:text-white'>{veredicto.titular}</b>
				<span className='ml-auto flex items-center gap-2 flex-none'>
					{/* Blanco y no gris: la barra de filtros usa zinc-500 como fondo
					    oscuro, donde el gris-200 daba 3.9:1 */}
					<span className='text-[11.5px] text-tinta-2 dark:text-white tabular-nums'>{hora}</span>
					{children}
				</span>
			</div>
		)
	}

	return (
		<div className='flex items-baseline gap-3.5 flex-wrap pb-3 mb-3.5 border-b border-linea dark:border-gray-700'>
			<span className={`${pulso} w-[11px] h-[11px] self-center`} />
			<div className='min-w-0'>
				<div className='text-[23px] font-semibold leading-[1.1] tracking-tight text-tinta dark:text-white'>
					{veredicto.titular}
				</div>
				<div className='text-[14.5px] text-tinta-2 dark:text-gray-300'>{veredicto.detalle}</div>
			</div>
			<div className='ml-auto self-center flex items-center gap-3.5 text-[13px] text-tinta-2 dark:text-tinta-3 tabular-nums'>
				<span>
					Actualizado <span>{hora}</span>
				</span>
				{children}
			</div>
		</div>
	)
}

export default Veredicto
