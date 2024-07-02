import aperturaCFlecha from '../asset/img/electricity/aperturaCFlecha.png'
export const draw = (data, elem, context) => {
	const array = data
	const arrayObjetos = array.Objetos
	const arrayLineas = array.Lineas
	let maxX = 0
	let maxY = 0

	for (let i = 0; i < arrayLineas.length; i++) {
		const lineas = arrayLineas[i].points
		for (let j = 0; j < lineas.length; j += 2) {
			if (lineas[j] > maxX) {
				maxX = lineas[j]
			}
		}
		for (let j = 1; j < lineas.length; j += 2) {
			if (lineas[j] > maxY) {
				maxY = lineas[j]
			}
		}
	}

	elem.width = maxX + 10
	elem.height = maxY + 200
	context.clearRect(0, 0, elem.width, elem.height)

	arrayObjetos.forEach((item) => {
		if (item.type === 'img') {
			var img = new Image()
			if (item.color_object === 'red' && item.pic === 'aperturaCFlecha.png') {
				img.src = 'src/modules/diagrams/utils/asset/img/electricity/aperturaCFlecha.png'
			} else {
				img.src = 'src/modules/diagrams/utils/asset/img/electricity/' + item.pic
			}
			img.onload = () => {
				context.drawImage(img, item.left, item.top, item.width, item.heigth)
				context.font = '15px serif'
				let ancho, alto
				if (item.text_aling === 'button') {
					context.textAlign = 'center'
					ancho = item.left + item.width / 2
					alto = item.top + item.heigth + 20
				} else if (item.text_aling === 'top') {
					context.textAlign = 'center'
					ancho = item.left + item.width / 2
					alto = item.top
				} else if (item.text_aling === 'rigth') {
					context.textAlign = 'left'
					ancho = item.left + item.width
					alto = item.top + item.heigth / 2 + 10
				} else if (item.text_aling === 'left') {
					ancho = item.left - item.width
					alto = item.top + item.heigth / 2 + 10
				}

				const text = item.text.split('\n')
				let salto_linea = 0

				if (item.text_aling === 'top') {
					text.forEach((line) => {
						salto_linea -= 15
					})
					alto += salto_linea
					text.forEach((line) => {
						alto += 15
						if (line !== 'TI:') {
							context.fillText(line, ancho, alto)
						}
					})
				} else {
					text.forEach((line) => {
						if (line !== 'TI:') {
							alto += salto_linea
							context.fillText(line, ancho, alto)
							salto_linea += line === text[0] ? 15 : 5
						}
					})
				}
			}
		}
	})
}

export const select_color = (color) => {
	// if (!$('#UnifilarView').hasClass('darkmode')) {
	switch (color) {
		case 'red':
			return '#f00'
			break
		case 'green':
			return '#00ff1d'
			break
		case 'blue':
			return '#6ea5f8'
			break
		case 'pink':
			return '#faadc1'
			break

		case 'yellow':
			return '#ffff10'
			break
		case 'white':
			return '#ffff'
			break
	}
	// } else {
	// 	switch (color) {
	// 		case 'red':
	// 			return '#00ffff'
	// 			break
	// 		case 'green':
	// 			return '#ff00e2'
	// 			break
	// 		case 'blue':
	// 			return '#915906'
	// 			break
	// 		case 'pink':
	// 			return '#04513d'
	// 			break

	// 		case 'yellow':
	// 			return '#0000ef'
	// 			break
	// 		case 'white':
	// 			return '#000'
	// 			break
	// 	}
	// }
}

export const draw_line = (data, elem, context) => {
	const array = data
	const arrayObjetos = array.Objetos
	const arrayLineas = array.Lineas
	let color = 'red'
	let color2 = 'red'
	arrayLineas.forEach((item, i) => {
		if (item.text == 'Barra') {
			context.lineWidth = 15
		} else {
			context.lineWidth = 5
		}
		if (item.key_objet != '-1' && item.key_objet != '0') {
			arrayObjetos.forEach((item2, f) => {
				if (item2.key == item.key_objet) {
					color = item2.color_object
				}
			})
		} else {
			// var Barra = datosInflux.filter((item) => {
			// 	serieControl = item.meter ? item.meter.num_serie : 0
			// 	if (serieControl == '83786132') {
			// 		return item
			// 	}
			// })
			// if (Barra[0].status == 1) {
			// 	color = 'red'
			// }
		}
		color2 = select_color(color)
		context.lineCap = 'butt'
		context.lineJoin = 'round'
		context.strokeStyle = color2
		context.beginPath()
		var vueltas = item.points.length / 2
		var ubicacion = 0
		var U_x = 0
		var U_y = 0
		for (var i = 0; i < vueltas; i++) {
			U_x = parseInt(item.points[ubicacion])
			ubicacion++
			U_y = parseInt(item.points[ubicacion])
			ubicacion++
			if (i == 0) {
				context.moveTo(U_x, U_y)
			} else {
				context.lineTo(U_x, U_y)
			}
		}
		context.stroke()
	})
	arrayLineas.forEach((item, i) => {
		if (item.key_objet != '-1') {
			arrayObjetos.forEach((objetos, f) => {
				if (objetos.key == item.key_objet) {
					color = objetos.color_object
				}
			})
		} else {
			// var Barra = datosInflux.filter((item) => {
			// 	serieControl = item.meter ? item.meter.num_serie : 0
			// 	if (serieControl == '83786132') {
			// 		return item
			// 	}
			// })
			// if (Barra[0].status == 1) {
			// 	color = 'red'
			// }
		}
		if (
			color == 'red' &&
			item.id != 59 &&
			item.id != 64 &&
			item.id != 86 &&
			item.id != 57 &&
			item.id != 66 &&
			item.id != 85
		) {
			context.setLineDash([4, 16])
			context.lineWidth = 2
			context.lineCap = 'butt'
			context.lineJoin = 'round'
			context.strokeStyle = 'white'
			context.lineDashOffset = -offset
			context.beginPath()
			var vueltas = item.points.length / 2
			var ubicacion = 0
			var U_x = 0
			var U_y = 0
			for (var i = 0; i < vueltas; i++) {
				U_x = parseInt(item.points[ubicacion])
				ubicacion++
				U_y = parseInt(item.points[ubicacion])
				ubicacion++
				if (i == 0) {
					context.moveTo(U_x, U_y)
				} else {
					context.lineTo(U_x, U_y)
				}
			}
			context.stroke()
		} else {
			context.setLineDash([0])
		}
	})
}

// function loop_line() {
// 	if ($('#serial').val() != '') {
// 		stopAllIntervals()
// 	} else {
// 		if (id_loop != '' && offset == 0) {
// 			stopAllIntervals()
// 			id_loop = ''
// 		}
// 		offset++
// 		if (offset > 16) {
// 			offset = 0
// 		}
// 		draw_line()
// 		if (offset >= 1 && id_loop == '') {
// 			id_loop = setInterval(loop_line, 20)
// 			IntervalsID.push({ id: id_loop, name: 'loop_lineElectricity' })
// 		}
// 	}
// }
