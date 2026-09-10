/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			colors: {
				primary: '#edbf36',
				secondary: '#1D4ED8',
				accent: '#10B981',
				/*
				 * Escala de severidad del panel del Home, tal como llego en el
				 * mockup: rojo > naranja > amarillo, y el gris para el contador
				 * informativo. `-tx` es la variante legible del amarillo sobre
				 * blanco, que en su tono pleno no se lee.
				 */
				sev: {
					rojo: '#CF0927',
					'rojo-bg': '#FCF1F2',
					'rojo-bd': '#F0CFD4',
					naranja: '#DE6B00',
					/*
					 * Variante para el DIGITO, igual que `amarillo-tx`: el naranja
					 * pleno sobre su propio tinte da 3.16:1, que alcanza para el
					 * numero grande de la tarjeta (38px) pero no para el chip del
					 * telefono (13px, minimo 4.5:1). El valor sale del mismo mockup,
					 * que ya lo usa para sus etiquetas naranjas.
					 */
					'naranja-tx': '#A85200',
					'naranja-bg': '#FFF6EC',
					'naranja-bd': '#F2D9BC',
					amarillo: '#F7CF06',
					'amarillo-tx': '#8A6800',
					'amarillo-bg': '#FFFBE3',
					'amarillo-bd': '#EADFA4',
					normal: '#00933B',
				},
				// Neutros y acento del mockup
				tinta: '#17202A',
				'tinta-2': '#5A6472',
				'tinta-3': '#8B95A1',
				linea: '#D5DAE0',
				'linea-fuerte': '#BFC6CE',
				acento: '#283080',
			},
			// El latido del pulso del veredicto cuando hay algo en rojo
			keyframes: {
				latir: {
					'0%, 100%': { boxShadow: '0 0 0 4px rgba(207,9,39,.14)' },
					'50%': { boxShadow: '0 0 0 9px rgba(207,9,39,0)' },
				},
			},
			animation: {
				latir: 'latir 2.4s ease-in-out infinite',
			},
		},
	},
	darkMode: 'selector',
	plugins: [],
}
