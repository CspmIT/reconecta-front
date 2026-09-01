// Sin dato: el backend devuelve null cuando no pudo resolver el contador
const SIN_DATO = '-'

class CardsDashboardClass {
	constructor(title = '', info = '', type = 'text', validation = null, colorTitle = 'black') {
		this.title = title
		this.info = info === null || info === undefined ? SIN_DATO : info
		this.type = type
		this.colorTitle = colorTitle
		this.applyValidation(validation)
	}
	applyValidation(validation) {
		// Un contador sin dato no se pinta: no dice ni que esta bien ni que esta mal
		if (typeof validation === 'function' && this.info !== SIN_DATO) {
			const newColor = validation(this.info)
			if (newColor) {
				this.colorTitle = newColor
			}
		}
	}
}

/**
 * Las cinco tarjetas, a partir de los contadores que devuelve /dashboard.
 *
 * "Equipos Offline" y "Cantidad total de activos" cuentan reconectadores,
 * medidores y analizadores, que es lo que sus titulos dicen; las otras tres son
 * de reconectadores, que son los unicos con polos y con alimentacion AC.
 */
export const cardDashboardClass = (info) => [
	new CardsDashboardClass('Reconectadores abiertos', info.open),
	new CardsDashboardClass('Reconectadores en alarma', info.alarm, 'text', (val) => (val > 0 ? 'yellow' : 'black')),
	new CardsDashboardClass('Equipos Offline', info.offline, 'text', (val) => (val > 0 ? 'red' : 'green')),
	new CardsDashboardClass('Equipos sin alimentacion AC', info.withoutAc, 'text', (val) => (val > 0 ? 'yellow' : 'green')),
	new CardsDashboardClass('Cantidad total de activos', info.total),
]
