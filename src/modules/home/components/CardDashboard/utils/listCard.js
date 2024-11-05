class CardsDashboardClass {
	constructor(title = '', info = '', type = 'text', validation = null, colorTitle = 'black') {
		this.title = title
		this.info = info
		this.type = type
		this.colorTitle = colorTitle
		this.applyValidation(validation)
	}
	applyValidation(validation) {
		if (typeof validation === 'function') {
			const newColor = validation(this.info)
			if (newColor) {
				this.colorTitle = newColor
			}
		}
	}
}

export const cardDashboardClass = async (info) => {
	return [
		new CardsDashboardClass('Reconectadores abiertos', info.recoOpen),
		new CardsDashboardClass('Reconectadores en alarma', info.recoAlarm, 'text', (val) =>
			val > 0 ? 'yellow' : 'black'
		),
		new CardsDashboardClass('Equipos Offline', info.recoOffline, 'text', (val) => (val > 0 ? 'red' : 'green')),
		new CardsDashboardClass(
			'Equipos sin alimentacion AC',
			info.recoAlimAC >= 0 ? info.recoAlimAC : '',
			'text',
			(val) => (val > 0 ? 'yellow' : 'green')
		),
		new CardsDashboardClass('Cantidad total de activos', info.recoCant),
	]
}
