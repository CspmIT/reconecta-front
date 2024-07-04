// Definimos los iconos personalizados
const redIcon = (nro) =>
	new L.divIcon({
		iconSize: [25, 41],
		iconAnchor: [12, 41],
		popupAnchor: [1, -34],
		shadowSize: [41, 41],
		className: 'leaflet-marker-icon-blue',
		html: `<span class="marcador_ubicacion_map" style="background: red;" ><span class="interior_marcador_map" ><a class="icono_marcador_user_map" style="font-size: 14px;"><i class="fas fa-wrench" style="color: black; font-size: 14px; margin-left: 4px;">${nro}</i></a></span></span>`,
	})

const blueIcon = (nro) =>
	new L.divIcon({
		iconSize: [25, 41],
		iconAnchor: [12, 41],
		popupAnchor: [1, -34],
		shadowSize: [41, 41],
		className: 'leaflet-marker-icon-blue',
		html: `<span class="marcador_ubicacion_map" style="background: blue;" ><span class="interior_marcador_map" ><a class="icono_marcador_user_map" style="font-size: 14px;"><i class="fas fa-wrench" style="color: black; font-size: 14px; margin-left: 4px;">${nro}</i></a></span></span>`,
	})
const greenIcon = (nro) =>
	new L.divIcon({
		iconSize: [25, 41],
		iconAnchor: [12, 41],
		popupAnchor: [1, -34],
		shadowSize: [41, 41],
		className: 'leaflet-marker-icon-green',
		html: `<span class="marcador_ubicacion_map" style="background: green;" ><span class="interior_marcador_map" ><a class="icono_marcador_user_map" style="font-size: 14px;"><i class="fas fa-wrench" style="color: black; font-size: 14px; margin-left: 4px;">${nro}</i></a></span></span>`,
	})

export const markersRecloser = [
	{
		id: 1,
		icon: redIcon(2),
		alert: true,
		info: {
			name: 'San Juan',
			number: 2,
			VL1: 1045,
			VL2: 200,
			VL3: 30,
		},
		lat: -30.71780041956656,
		lng: -61.97250366210938,
	},

	{
		id: 1,
		icon: redIcon(18),
		alert: false,
		info: {
			name: 'San Juan',
			number: 18,
			VL1: 1045,
			VL2: 200,
			VL3: 30,
		},
		lat: -30.723412027021855,
		lng: -61.96580886840821,
	},
	{
		id: 1,
		icon: redIcon(19),
		alert: false,
		info: {
			name: 'San Juan',
			number: 19,
			VL1: 1045,
			VL2: 200,
			VL3: 30,
		},
		lat: -30.736701373344456,
		lng: -61.981945037841804,
	},

	{
		id: 1,
		icon: redIcon(1),
		alert: false,
		info: {
			name: 'San Juan',
			number: 1,
			VL1: 1045,
			VL2: 200,
			VL3: 30,
		},
		lat: -30.75412240639962,
		lng: -61.8911361694336,
	},

	{
		id: 1,
		icon: redIcon(15),
		alert: true,
		info: {
			name: 'San Juan',
			number: 15,
			VL1: 1045,
			VL2: 200,
			VL3: 30,
		},
		lat: -30.77257345329417,
		lng: -62.05696105957032,
	},

	{
		id: 1,
		icon: greenIcon(17),
		alert: false,
		info: {
			name: 'San Juan',
			number: 17,
			VL1: 1045,
			VL2: 200,
			VL3: 30,
		},
		lat: -30.782811426647328,
		lng: -62.13917613029481,
	},

	{
		id: 1,
		icon: redIcon(16),
		alert: false,
		info: {
			name: 'San Juan',
			number: 16,
			VL1: 1045,
			VL2: 200,
			VL3: 30,
		},
		lat: -30.74848106070742,
		lng: -62.1005791425705,
	},

	{
		id: 1,
		icon: redIcon(14),
		alert: false,
		info: {
			name: 'San Juan',
			number: 14,
			VL1: 1045,
			VL2: 200,
			VL3: 30,
		},
		lat: -30.720392758863003,
		lng: -62.04554557800294,
	},

	{
		id: 1,
		icon: redIcon(6),
		alert: false,
		info: {
			name: 'San Juan',
			number: 6,
			VL1: 1045,
			VL2: 200,
			VL3: 30,
		},
		lat: -30.70082037102123,
		lng: -62.04228401184083,
	},

	{
		id: 1,
		icon: redIcon(10),
		alert: false,
		info: {
			name: 'San Juan',
			number: 10,
			VL1: 1045,
			VL2: 200,
			VL3: 30,
		},
		lat: -30.708722220838705,
		lng: -62.05799102783204,
	},

	{
		id: 1,
		icon: redIcon(11),
		alert: false,
		info: {
			name: 'San Juan',
			number: 11,
			VL1: 1045,
			VL2: 200,
			VL3: 30,
		},
		lat: -30.69554515785425,
		lng: -62.120475769042976,
	},

	{
		id: 1,
		icon: redIcon(12),
		alert: false,
		info: {
			name: 'San Juan',
			number: 12,
			VL1: 1045,
			VL2: 200,
			VL3: 30,
		},
		lat: -30.636499952792608,
		lng: -62.12905883789063,
	},

	{
		id: 1,
		icon: redIcon(20),
		alert: false,
		info: {
			name: 'San Juan',
			number: 20,
			VL1: 1045,
			VL2: 200,
			VL3: 30,
		},
		lat: -30.60752631860329,
		lng: -62.090263366699226,
	},

	{
		id: 1,
		icon: redIcon(8),
		alert: false,
		info: {
			name: 'San Juan',
			number: 8,
			VL1: 1045,
			VL2: 200,
			VL3: 30,
		},
		lat: -30.59522349527484,
		lng: -62.05816268920899,
	},

	{
		id: 1,
		icon: redIcon(7),
		alert: false,
		info: {
			name: 'San Juan',
			number: 7,
			VL1: 1045,
			VL2: 200,
			VL3: 30,
		},
		lat: -30.6350219161173,
		lng: -62.0339584350586,
	},

	{
		id: 1,
		icon: redIcon(9),
		alert: false,
		info: {
			name: 'San Juan',
			number: 9,
			VL1: 1045,
			VL2: 200,
			VL3: 30,
		},
		lat: -30.56049656819399,
		lng: -62.08648681640626,
	},

	{
		id: 1,
		icon: greenIcon(13),
		alert: false,
		info: {
			name: 'San Juan',
			number: 13,
			VL1: 1045,
			VL2: 200,
			VL3: 30,
		},
		lat: -30.56123615801266,
		lng: -62.14476585388184,
	},
]

export const markersSubStation = [
	// {
	// 	id: 4,
	// 	lat: -30.71,
	// 	lng: -62.032,
	// 	icon: blueIcon(4),
	// 	info: {
	// 		name: 'SubStation 1',
	// 		number: 1,
	// 		VL1: 10,
	// 		VL2: 20,
	// 		VL3: 30,
	// 	},
	// },
	// {
	// 	id: 5,
	// 	lat: -30.715,
	// 	lng: -62.038,
	// 	icon: blueIcon(5),
	// 	info: {
	// 		name: 'SubStation 2',
	// 		number: 2,
	// 		VL1: 40,
	// 		VL2: 50,
	// 		VL3: 60,
	// 	},
	// },
	// {
	// 	id: 6,
	// 	lat: -30.72,
	// 	lng: -62.032,
	// 	icon: blueIcon(6),
	// 	info: {
	// 		name: 'SubStation 3',
	// 		number: 3,
	// 		VL1: 70,
	// 		VL2: 80,
	// 		VL3: 90,
	// 	},
	// },
]
