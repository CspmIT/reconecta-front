// Símbolos eléctricos para la paleta del editor. Cada uno se dibuja en un
// cuadrado unitario centrado en (0,0) (coordenadas -0.5 a 0.5); la entidad
// 'symbol' lo posiciona/escala/rota con un transform.

const SW = 0.05 // grosor de trazo en coordenadas unitarias

export const SYMBOLS = {
	seccionador: {
		label: 'Seccionador',
		render: () => (
			<g strokeWidth={SW}>
				<line x1='0' y1='-0.5' x2='0' y2='-0.28' />
				<circle cx='0' cy='-0.25' r='0.035' fill='currentColor' stroke='none' />
				<line x1='0' y1='-0.25' x2='0.28' y2='0.22' />
				<circle cx='0' cy='0.25' r='0.035' fill='currentColor' stroke='none' />
				<line x1='0' y1='0.25' x2='0' y2='0.5' />
			</g>
		),
	},
	interruptor: {
		label: 'Interruptor',
		render: () => (
			<g strokeWidth={SW}>
				<line x1='0' y1='-0.5' x2='0' y2='-0.28' />
				<line x1='-0.09' y1='-0.34' x2='0.09' y2='-0.22' />
				<line x1='-0.09' y1='-0.22' x2='0.09' y2='-0.34' />
				<line x1='0' y1='-0.25' x2='0.28' y2='0.22' />
				<circle cx='0' cy='0.25' r='0.035' fill='currentColor' stroke='none' />
				<line x1='0' y1='0.25' x2='0' y2='0.5' />
			</g>
		),
	},
	trafo: {
		label: 'Transformador',
		render: () => (
			<g strokeWidth={SW}>
				<line x1='0' y1='-0.5' x2='0' y2='-0.38' />
				<circle cx='0' cy='-0.14' r='0.24' />
				<circle cx='0' cy='0.14' r='0.24' />
				<line x1='0' y1='0.38' x2='0' y2='0.5' />
			</g>
		),
	},
	ti: {
		label: 'Transf. de intensidad',
		render: () => (
			<g strokeWidth={SW}>
				<line x1='0' y1='-0.5' x2='0' y2='0.5' />
				<circle cx='0' cy='0' r='0.2' />
			</g>
		),
	},
	relay: {
		label: 'Relay',
		render: () => (
			<g strokeWidth={SW}>
				<rect x='-0.35' y='-0.2' width='0.7' height='0.4' />
				<text
					x='0'
					y='0.005'
					fontSize='0.24'
					textAnchor='middle'
					dominantBaseline='central'
					fill='currentColor'
					stroke='none'
				>
					Relay
				</text>
			</g>
		),
	},
	capacitor: {
		label: 'Capacitor',
		render: () => (
			<g strokeWidth={SW}>
				<line x1='0' y1='-0.5' x2='0' y2='-0.08' />
				<line x1='-0.25' y1='-0.08' x2='0.25' y2='-0.08' />
				<line x1='-0.25' y1='0.08' x2='0.25' y2='0.08' />
				<line x1='0' y1='0.08' x2='0' y2='0.5' />
			</g>
		),
	},
	tierra: {
		label: 'Puesta a tierra',
		render: () => (
			<g strokeWidth={SW}>
				<line x1='0' y1='-0.5' x2='0' y2='0.1' />
				<line x1='-0.3' y1='0.1' x2='0.3' y2='0.1' />
				<line x1='-0.19' y1='0.25' x2='0.19' y2='0.25' />
				<line x1='-0.08' y1='0.4' x2='0.08' y2='0.4' />
			</g>
		),
	},
	flecha: {
		label: 'Flecha (salida)',
		render: () => (
			<g strokeWidth={SW}>
				<line x1='0' y1='-0.5' x2='0' y2='0.3' />
				<path d='M -0.14 0.16 L 0 0.5 L 0.14 0.16 Z' fill='currentColor' stroke='none' />
			</g>
		),
	},
	barra: {
		label: 'Barra',
		render: () => (
			<g strokeWidth={SW * 2.4}>
				<line x1='-0.5' y1='0' x2='0.5' y2='0' />
			</g>
		),
	},
}
