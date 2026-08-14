/*
 * Card de metrología: título + filas etiqueta/valor.
 * rows: [{ l, value, uni, obis, converted }]
 * El OBIS va como tooltip nativo (title) para no cargar la vista.
 */
const fmtValue = (value) => {
	const num = parseFloat(value)
	if (isNaN(num)) return value ?? 'sin datos'
	return num.toLocaleString('es-AR', { maximumFractionDigits: 3 })
}

// La unidad solo acompaña a valores numéricos ("sin datos" va solo)
const rowText = (row) => {
	const text = fmtValue(row.value)
	return isNaN(parseFloat(row.value)) || !row.uni ? text : `${text} ${row.uni}`
}

function MetricCard({ title, rows, full = false }) {
	return (
		<div
			className={`border-2 border-t-4 border-blue-600 rounded-xl px-4 py-4 bg-white dark:bg-zinc-700 shadow-sm min-w-0 ${
				full ? 'md:col-span-3' : ''
			}`}
		>
			<h4 className='text-lg font-semibold text-center mb-3'>{title}</h4>
			<div className='grid grid-cols-[max-content_max-content] justify-center gap-x-4 gap-y-1.5 items-baseline'>
				{rows.map((row) => (
					<div key={row.l} className='contents'>
						<span className='text-gray-600 dark:text-zinc-300 text-right text-[15px]'>{row.l}</span>
						<span
							className={`font-bold cursor-help ${
								row.converted ? 'text-blue-800 dark:text-blue-300' : ''
							}`}
							title={
								[row.obis && `OBIS ${row.obis}`, row.extra].filter(Boolean).join(' · ') ||
								undefined
							}
						>
							{rowText(row)}
						</span>
					</div>
				))}
			</div>
		</div>
	)
}

export default MetricCard
