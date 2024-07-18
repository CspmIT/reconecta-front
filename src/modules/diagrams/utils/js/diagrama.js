import { storage } from '../../../../storage/storage'
import { datosInflux } from '../objects/datosInflux'

export const draw = (data, elem, context) => {
	const arrayObjetos = data.Objetos
	const arrayLineas = data.Lineas
	let maxX = 0
	let maxY = 0

	for (const linea of arrayLineas) {
		for (let j = 0; j < linea.points.length; j += 2) {
			maxX = Math.max(maxX, linea.points[j])
			maxY = Math.max(maxY, linea.points[j + 1])
		}
	}

	elem.width = maxX + 100
	elem.height = maxY + 250
	context.clearRect(0, 0, elem.width, elem.height)
	const darkMode = storage.get('dark')
	arrayObjetos.forEach((item) => {
		if (item.type === 'img') {
			const img = new Image()
			img.src =
				item.color_object === 'red' && item.pic === 'aperturaCFlecha.png'
					? 'src/modules/diagrams/utils/asset/img/electricity/aperturaCFlecha.png'
					: `src/modules/diagrams/utils/asset/img/electricity/${item.pic}`

			img.onload = () => {
				if (!darkMode) {
					context.filter = 'none'
				} else {
					context.filter = 'invert(0.9)'
				}
				context.drawImage(img, item.left, item.top, item.width, item.heigth)
				context.filter = 'none'
			}
		}
	})
}

export const select_color = (color) => {
	switch (color) {
		case 'red':
			return '#f00'
		case 'green':
			return '#00ff1d'
		case 'blue':
			return '#6ea5f8'
		case 'pink':
			return '#faadc1'
		case 'yellow':
			return '#ffff10'
		case 'white':
			return '#ffff'
		default:
			return '#000'
	}
}

export const draw_line = (data, context, offset) => {
	const { Objetos, Lineas } = data
	const getColor = (key) => {
		const objeto = Objetos.find((item) => item.key === key)
		if (objeto) {
			return select_color(objeto.color_object)
		} else {
			const Barra = datosInflux.find((item) => item.meter?.num_serie === '83786132')
			return Barra?.status === 1 ? select_color('red') : select_color('black')
		}
	}
	Lineas.forEach((item) => {
		context.lineWidth = item.text === 'Barra' ? 15 : 5
		const color2 = getColor(item.key_objet)
		context.lineCap = 'butt'
		context.lineJoin = 'round'
		context.strokeStyle = color2
		context.beginPath()
		for (let i = 0; i < item.points.length; i += 2) {
			const U_x = parseInt(item.points[i])
			const U_y = parseInt(item.points[i + 1])
			if (i === 0) {
				context.moveTo(U_x, U_y)
			} else {
				context.lineTo(U_x, U_y)
			}
		}
		context.stroke()
	})
	Lineas.forEach((item) => {
		const color = getColor(item.key_objet)
		if (color === select_color('red') && ![59, 64, 86, 57, 66, 85].includes(item.id)) {
			context.setLineDash([4, 16])
			context.lineWidth = 2
			context.lineCap = 'butt'
			context.lineJoin = 'round'
			context.strokeStyle = select_color('white')
			context.lineDashOffset = -offset
			context.beginPath()
			for (let i = 0; i < item.points.length; i += 2) {
				const U_x = parseInt(item.points[i])
				const U_y = parseInt(item.points[i + 1])
				if (i === 0) {
					context.moveTo(U_x, U_y)
				} else {
					context.lineTo(U_x, U_y)
				}
			}
			context.stroke()
		} else {
			context.setLineDash([])
		}
	})
}
const nameElement = (description) => {
	let name = ''
	let number = ''
	switch (description) {
		case 'D1O':
			number = 2
			name = 'D1o'
			break
		case 'D2O':
			number = 2
			name = 'D2o'
			break
		case 'D3O':
			number = 2
			name = 'D3o'
			break
		case 'D1E':
			number = 4
			name = 'D1e'
			break
		case 'D2E':
			number = 5
			name = 'D2e'
			break
		case 'D3E':
			number = 6
			name = 'D3e'
			break
		case 'D4E':
			number = 7
			name = 'D4e'
			break
	}
	return { name, number }
}
export const getDataDetail = (data) => {
	if (datosInflux.length > 0) {
		const arrayObjetos = data.Objetos
		const Barra = datosInflux.filter((item) => item.meter && item.meter.num_serie == '83786132')
		const ALim2 = datosInflux.find((item) => item.meter && item.meter.num_serie == '83786119')
		let dataDetail = [
			{
				position: { x: 65, y: 90 },
				data: {
					name: 'BARRA',
					R: (Barra[0].instantaneos.find((item) => item.field == 'I_0').valor / 1000).toFixed(2) + ' A',
					S: (Barra[0].instantaneos.find((item) => item.field == 'I_1').valor / 1000).toFixed(2) + ' A',
					T: (Barra[0].instantaneos.find((item) => item.field == 'I_2').valor / 1000).toFixed(2) + ' A',
					Mva:
						parseFloat(Barra[0].instantaneos.find((item) => item.field == 'IApP_3').valor / 1000).toFixed(
							2
						) + ' MVA',
					description: 'Barra',
					object: Barra[0],
				},
			},
			{
				position: { x: 405, y: 280 },
				data: {
					name: 'A2O ',
					R: (ALim2.instantaneos.find((item) => item.field == 'I_0').valor / 1000).toFixed(2) + ' A',
					S: (ALim2.instantaneos.find((item) => item.field == 'I_1').valor / 1000).toFixed(2) + ' A',
					T: (ALim2.instantaneos.find((item) => item.field == 'I_2').valor / 1000).toFixed(2) + ' A',
					Mva:
						parseFloat(ALim2.instantaneos.find((item) => item.field == 'IApP_3').valor / 1000).toFixed(2) +
						' MVA',
					description: ALim2.caption,
					object: ALim2,
				},
			},
		]
		arrayObjetos.forEach((objetos) => {
			let number = nameElement(objetos.description).number
			let name = nameElement(objetos.description).name
			const item = datosInflux.find((item) => item.id_station == number && item.instantaneos[0] != 'sin datos')
			let IApP_3 = ''
			let I_0 = ''
			let I_1 = ''
			let I_2 = ''
			if (item) {
				IApP_3 = item.instantaneos.find((item) => item.field == 'IApP_3').valor
				IApP_3 =
					(IApP_3 > 20000 ? parseFloat(IApP_3 / 10000000).toFixed(2) : parseFloat(IApP_3 / 1000).toFixed(2)) +
					' MVA'
				I_0 = (item.instantaneos.find((insta) => insta.field == 'I_0').valor / 1000).toFixed(2) + ' A'
				I_1 = (item.instantaneos.find((insta) => insta.field == 'I_1').valor / 1000).toFixed(2) + ' A'
				I_2 = (item.instantaneos.find((insta) => insta.field == 'I_2').valor / 1000).toFixed(2) + ' A'
				dataDetail = [
					...dataDetail,
					{
						position: { x: objetos.left - 35, y: objetos.top + 70 },
						data: {
							name,
							R: I_0,
							S: I_1,
							T: I_2,
							Mva: IApP_3,
							description: item.caption,
							object: item,
						},
					},
				]
			}
		})
		return dataDetail
	}
}
export const textosAdd = (data, context) => {
	const darkMode = storage.get('dark')
	context.fillStyle = darkMode ? 'white' : 'Black'
	context.font = '150px'
	context.textAlign = 'start'
	context.textAlign = 'center'
	context.fillText('Tension de', 620, 20)
	context.fillText('entrada 132 kV', 620, 40)
	context.fillText('Tension de', 620, 100)
	context.fillText('salida 13,2 kV', 620, 120)
}
