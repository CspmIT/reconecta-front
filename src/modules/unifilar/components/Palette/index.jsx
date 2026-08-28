import { useContext } from 'react'
import { MainContext } from '../../../../context/MainContext'
import { CATALOG, GRUPOS, NOMINAL } from '../../utils/js/catalog'

// Paleta de símbolos IEC 60617.
//
// Es la única forma de que un elemento entre a la red, y eso es deliberado: el
// tipo lo elige el usuario, no un detector. Un clic acá y otro en el plano
// dicen, sin ambigüedad, "esto es un seccionador y va acá" — que es justo lo
// que ningún algoritmo podía deducir de un DWG cualquiera.

// Miniatura: el mismo cuerpo que se dibuja en el lienzo, en una caja fija.
const Miniatura = ({ tipo, activo, oscuro }) => {
	const def = CATALOG[tipo]
	if (!def?.cuerpo) return null
	const patas =
		def.term === 2
			? `M0 -${NOMINAL - 2}V-${def.h}M0 ${def.h}V${NOMINAL - 2}`
			: def.term === 1
				? `M0 -${NOMINAL - 2}V-${def.off}`
				: null
	return (
		<svg
			viewBox={`-${NOMINAL + 4} -${NOMINAL + 4} ${(NOMINAL + 4) * 2} ${(NOMINAL + 4) * 2}`}
			width="34" height="34" className="shrink-0"
			fill="none" stroke="currentColor" strokeWidth="2.1"
			strokeLinecap="round" strokeLinejoin="round"
			style={{ color: activo ? (oscuro ? '#b98ce8' : '#7c3aed') : oscuro ? '#8494a2' : '#64748b' }}
		>
			<style>{'.llena{fill:currentColor;stroke:none}'}</style>
			{patas && <path d={patas} />}
			<g dangerouslySetInnerHTML={{ __html: def.cuerpo({ estado: 'cerrado' }) }} />
		</svg>
	)
}

const Palette = ({ herramienta, onElegir }) => {
	const { darkMode } = useContext(MainContext)
	return (
	<aside className="w-52 shrink-0 flex flex-col min-h-0 select-none border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-[#171d24]">
		<div className="px-3 py-3 border-b border-gray-200 dark:border-gray-700">
			<h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100 m-0">Símbolos IEC 60617</h2>
			<p className="text-[11px] text-gray-500 dark:text-gray-500 mt-1 leading-snug">
				Elegí un símbolo y tocá el plano para colocarlo.
			</p>
		</div>
		<div className="flex-1 overflow-y-auto py-1">
			{Object.entries(GRUPOS).map(([grupo, tipos]) => (
				<div key={grupo}>
					<h3 className="px-3 pt-3 pb-1 m-0 text-[10px] font-semibold tracking-widest uppercase text-gray-500 dark:text-gray-500">
						{grupo}
					</h3>
					{tipos.map((tipo) => {
						const activo = herramienta === tipo
						return (
							<button
								key={tipo}
								onClick={() => onElegir(activo ? null : tipo)}
								aria-pressed={activo}
								className={`flex items-center gap-2.5 w-full px-3 py-1.5 text-left border-l-2 ${
									activo
										? 'bg-purple-100 dark:bg-purple-500/20 border-purple-500 hover:border-purple-500 dark:border-purple-400 dark:hover:border-purple-400'
										: 'bg-transparent border-transparent hover:border-transparent hover:bg-gray-100 dark:hover:bg-gray-700/50'
								}`}
							>
								<Miniatura tipo={tipo} activo={activo} oscuro={darkMode} />
								<span className="min-w-0">
									<b className={`block text-xs font-medium leading-tight ${activo ? 'text-purple-700 dark:text-purple-300' : 'text-gray-700 dark:text-gray-200'}`}>
										{CATALOG[tipo].nom}
									</b>
								</span>
							</button>
						)
					})}
				</div>
			))}
			{/* El conductor no es un símbolo que se coloque: se traza de nodo a nodo */}
			<h3 className="px-3 pt-3 pb-1 m-0 text-[10px] font-semibold tracking-widest uppercase text-gray-500 dark:text-gray-500">
				Unir
			</h3>
			<button
				onClick={() => onElegir(herramienta === 'cond' ? null : 'cond')}
				aria-pressed={herramienta === 'cond'}
				className={`flex items-center gap-2.5 w-full px-3 py-1.5 text-left border-l-2 ${
					herramienta === 'cond'
						? 'bg-purple-100 dark:bg-purple-500/20 border-purple-500 hover:border-purple-500 dark:border-purple-400 dark:hover:border-purple-400'
						: 'bg-transparent border-transparent hover:border-transparent hover:bg-gray-100 dark:hover:bg-gray-700/50'
				}`}
			>
				<svg viewBox="-28 -28 56 56" width="34" height="34" className="shrink-0" fill="none"
					stroke={herramienta === 'cond' ? (darkMode ? '#b98ce8' : '#7c3aed') : darkMode ? '#8494a2' : '#64748b'}
					strokeWidth="2.6" strokeLinecap="round">
					<path d="M-16 -18H8V18" />
					<circle cx="-16" cy="-18" r="4" fill={darkMode ? '#11161b' : '#ffffff'} />
					<circle cx="8" cy="18" r="4" fill={darkMode ? '#11161b' : '#ffffff'} />
				</svg>
				<span className="min-w-0">
					<b className={`block text-xs font-medium leading-tight ${herramienta === 'cond' ? 'text-purple-700 dark:text-purple-300' : 'text-gray-700 dark:text-gray-200'}`}>
						Conductor
					</b>
					<small className="block text-[10px] text-gray-500 dark:text-gray-500 leading-tight">nodo a nodo</small>
				</span>
			</button>
		</div>
	</aside>
	)
}

export default Palette
