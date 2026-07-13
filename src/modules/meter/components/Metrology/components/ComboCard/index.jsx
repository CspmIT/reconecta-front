/*
 * Card combinada Importada/Exportada (Potencia y Energía).
 * blocks: [{ sub, unit, rows: [{ l, imp:{value,obis}, exp:{value,obis}, total }] }]
 */
const fmtValue = (value, decimals = 2) => {
	const num = parseFloat(value)
	if (isNaN(num)) return 'sin datos'
	return num.toLocaleString('es-AR', { maximumFractionDigits: decimals })
}

function ComboCard({ title, note, blocks }) {
	return (
		<div className='md:col-span-3 border-2 border-t-4 border-blue-600 rounded-xl px-5 py-4 bg-white dark:bg-zinc-700 shadow-sm min-w-0'>
			<h4 className='text-lg font-semibold text-center mb-1'>{title}</h4>
			{note && (
				<p className='text-[11px] italic text-center text-gray-500 dark:text-zinc-300 mb-3'>{note}</p>
			)}
			<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
				{blocks.map((block) => (
					<div key={block.sub} className='min-w-0'>
						<div className='text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-300 text-center mb-2 pb-1.5 border-b border-gray-200 dark:border-zinc-500'>
							{block.sub}
						</div>
						<div className='grid grid-cols-[36px_1fr_1fr] gap-x-2.5 gap-y-1 items-center'>
							<span />
							<span className='text-[11px] uppercase tracking-wide font-semibold text-right pb-1 border-b border-gray-200 dark:border-zinc-500 text-blue-900 dark:text-blue-200'>
								Importada
							</span>
							<span className='text-[11px] uppercase tracking-wide font-semibold text-right pb-1 border-b border-gray-200 dark:border-zinc-500 text-emerald-700 dark:text-emerald-300'>
								Exportada
							</span>
							{block.rows.map((row) => (
								<div key={row.l} className='contents'>
									<span
										className={`text-xs text-gray-600 dark:text-zinc-300 ${
											row.total
												? 'font-bold text-[15px] text-gray-900 dark:text-zinc-100 border-t border-gray-200 dark:border-zinc-500 pt-1.5'
												: ''
										}`}
									>
										{row.l}
									</span>
									{[row.imp, row.exp].map((cell, i) => (
										<span
											key={i}
											className={`text-right whitespace-nowrap cursor-help ${
												row.total
													? 'font-bold text-[15px] border-t border-gray-200 dark:border-zinc-500 pt-1.5'
													: 'text-[13px] font-medium'
											}`}
											title={cell.obis ? `OBIS ${cell.obis}` : undefined}
										>
											{fmtValue(cell.value)}{block.unit ? ` ${block.unit}` : ''}
										</span>
									))}
								</div>
							))}
						</div>
					</div>
				))}
			</div>
		</div>
	)
}

export default ComboCard
