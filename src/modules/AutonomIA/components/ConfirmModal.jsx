// Confirmación PROPIA (sin el confirm() nativo, que en Tauri mete el
// encabezado "tauri://localhost dice…" y asusta al usuario de campo).
// Mensaje simple; el detalle técnico queda en la tarjeta de la versión.
export default function ConfirmModal({ confirm, onRespuesta }) {
	if (!confirm) return null
	return (
		<div className='fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-[1300]' onMouseDown={(e) => e.target === e.currentTarget && onRespuesta(false)}>
			<div className='bg-white rounded-xl w-full max-w-sm p-5 text-slate-800' onClick={(e) => e.stopPropagation()}>
				<h3 className='font-semibold mb-2'>{confirm.titulo}</h3>
				{(confirm.lineas || []).map((l, i) => (
					<p key={i} className={`text-sm mb-1.5 ${i === 0 ? 'font-medium text-slate-700' : 'text-slate-500'}`}>
						{l}
					</p>
				))}
				<div className='flex justify-end gap-2 mt-4'>
					<button onClick={() => onRespuesta(false)} className='px-4 py-2 text-sm border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50'>
						Cancelar
					</button>
					<button
						onClick={() => onRespuesta(true)}
						className={`px-4 py-2 text-sm font-medium text-white rounded-lg hover:opacity-90 ${confirm.peligro ? 'bg-red-600' : 'bg-coop-naranja'}`}>
						{confirm.boton || 'Continuar'}
					</button>
				</div>
			</div>
		</div>
	)
}
