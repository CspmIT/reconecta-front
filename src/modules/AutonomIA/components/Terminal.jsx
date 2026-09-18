// Caja de terminal del CLI: una sola para todo el módulo (mismo log). En
// «Actualizaciones de firmware» muestra el paso a paso del flasheo; en
// «Configuración» es el registro de lo que se lee y se graba en la placa.
export default function Terminal({ cli, altura = 'h-64', vacio }) {
	const { lineas, finLog, autoScroll, setAutoScroll, limpiarLog } = cli
	return (
		<div>
			<div ref={finLog} className={`bg-slate-900 text-slate-100 rounded-xl p-3 ${altura} overflow-y-auto font-mono text-[12.5px] leading-relaxed`}>
				{lineas.length === 0 && <p className='text-slate-500'>{vacio || '— Conectá un equipo para ver el registro —'}</p>}
				{lineas.map((l, i) => (
					<div key={i} className={l.t === 'out' ? 'text-emerald-300' : l.t === 'sys' ? 'text-amber-300' : 'text-slate-100'}>
						{l.t === 'out' ? '› ' : ''}
						{l.txt}
					</div>
				))}
			</div>
			<div className='flex items-center justify-between mt-1'>
				{/* Como en Arduino: desmarcado, el log queda quieto para analizarlo. */}
				<label className='flex items-center gap-1.5 text-[11px] text-slate-400 cursor-pointer select-none w-fit'>
					<input type='checkbox' checked={autoScroll} onChange={(e) => setAutoScroll(e.target.checked)} className='accent-coop-azul' />
					Autoscroll
				</label>
				<button onClick={limpiarLog} className='text-[11px] text-slate-400 hover:text-coop-azul'>
					Limpiar
				</button>
			</div>
		</div>
	)
}
