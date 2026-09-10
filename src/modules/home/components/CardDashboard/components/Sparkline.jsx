/*
 * La curva de las ultimas lecturas del contador.
 *
 * El historial lo junta el propio panel entre pedidos (ver CardDashboard), asi
 * que arranca vacio en cada carga y la curva aparece con la segunda lectura. Con
 * un solo punto no se dibuja nada: una recta de un punto no dice nada y ademas
 * la interpolacion se divide por cero.
 */
const COLOR = {
	rojo: '#CF0927',
	naranja: '#DE6B00',
	// El amarillo pleno no se ve sobre el tinte claro de la tarjeta
	amarillo: '#B08600',
	ok: '#9AA4B0',
	dato: '#9AA4B0',
}

const ANCHO = 54
const ALTO = 15

function Sparkline({ serie, estado, className = '' }) {
	if (!serie || serie.length < 2) return null

	const min = Math.min(...serie)
	const max = Math.max(...serie)
	const rango = max - min
	// Una serie sin variacion se dibuja centrada. Escalarla como cualquier otra la
	// pegaba al borde de abajo, que se lee como "esta en el minimo" cuando lo que
	// pasa es que no se movio.
	const puntos = serie
		.map((valor, i) => {
			const x = (i / (serie.length - 1)) * ANCHO
			const y = rango === 0 ? ALTO / 2 : ALTO - ((valor - min) / rango) * ALTO
			return `${x.toFixed(1)},${y.toFixed(1)}`
		})
		.join(' ')

	return (
		<svg
			className={`block opacity-55 ${className}`}
			width={ANCHO}
			height={ALTO}
			viewBox={`0 0 ${ANCHO} ${ALTO}`}
			aria-hidden='true'
		>
			<polyline
				points={puntos}
				fill='none'
				stroke={COLOR[estado] ?? COLOR.ok}
				strokeWidth='1.4'
				strokeLinejoin='round'
				strokeLinecap='round'
			/>
		</svg>
	)
}

export default Sparkline
