import { arcPath, polylinePath } from '../../utils/js/geometry'
import { SYMBOLS } from './symbols'

// Renderiza una entidad del documento como elemento SVG. El id se conserva
// (viene del handle del DWG) para poder animar/mapear por entidad.
// Con bare=true no emite id ni data-eid (clones de hit-test y previews).
//
// `filled` marca los rellenos macizos del plano (bornes, puntas de flecha):
// vienen de los HATCH del DWG y pintan en vez de trazar.
const EntityRenderer = ({ entity, bare = false }) => {
	const common = bare ? {} : { id: entity.id, 'data-eid': entity.id }
	const fill = entity.filled ? { fill: 'currentColor', stroke: 'none' } : null
	switch (entity.type) {
		case 'line':
			return <line {...common} x1={entity.x1} y1={entity.y1} x2={entity.x2} y2={entity.y2} />
		case 'circle':
			return <circle {...common} {...fill} cx={entity.cx} cy={entity.cy} r={entity.r} />
		case 'arc':
			return <path {...common} d={arcPath(entity)} />
		case 'polyline':
			return <path {...common} {...fill} d={polylinePath(entity)} />
		case 'text':
			return (
				<text
					{...common}
					x={entity.x}
					y={entity.y}
					fontSize={entity.size}
					textAnchor={entity.anchor}
					dominantBaseline={entity.baseline}
				>
					{entity.lines.map((line, i) => (
						<tspan key={i} x={entity.x} dy={i === 0 ? 0 : entity.size * 1.12}>
							{line}
						</tspan>
					))}
				</text>
			)
		case 'symbol': {
			const symbol = SYMBOLS[entity.symbol]
			if (!symbol) return null
			return (
				<g
					{...common}
					transform={`translate(${entity.x} ${entity.y}) rotate(${entity.rot || 0}) scale(${entity.scale || 1})`}
				>
					{symbol.render()}
				</g>
			)
		}
		default:
			return null
	}
}

export default EntityRenderer
