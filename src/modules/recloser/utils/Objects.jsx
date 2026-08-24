export const boardStatus = [
	{ id: 1, field: 'alarm', name: 'Alarma' },
	{ id: 2, field: 'advr', name: 'Alerta' },
	{ id: 3, field: 'fail', name: 'Malfunción' },
	{ id: 4, field: 'blck', name: 'Bloqueo' },
	{ id: 5, field: 'malf', name: 'Malfunción' },
]

export const boardFields = [
	{ id: 1, field: 'name', name: 'Nombre' },
	{ id: 2, field: 'number', name: 'Número' },
	{ id: 3, field: 'serial', name: 'Nro de serie' },
	{ id: 4, field: 'brand', name: 'Fabricante' },
	{ id: 5, field: 'version', name: 'Versión' },
	{
		id: 6,
		field: 'ac',
		name: 'Alimentación',
		options: {
			0: <b className='text-green-500 text-xl'> Batería</b>,
			1: <b className='text-red-500 text-xl'> Red Electrica</b>,
		},
	},
	{
		id: 7,
		field: 'local',
		name: 'Modo',
		options: {
			0: <b className='text-black text-xl'> Remoto</b>,
			1: <b className='text-black bg-yellow-400 text-xl p-1 px-2 ml-1 rounded-md'>Local</b>,
		},
	},
]

export const boardMetrology = [
	{
		id: 1,
		name: 'Corrientes',
		children: [
			{ name: 'A', field: 'I_f_0', unit: 'A' },
			{ name: 'B', field: 'I_f_1', unit: 'A' },
			{ name: 'C', field: 'I_f_2', unit: 'A' },
			{ name: 'N', field: 'I_n', unit: 'A' },
		],
	},
	{
		id: 2,
		name: 'Tensión ABC',
		children: [
			{ name: 'A', field: 'V_f_ABC_0', unit: 'V' },
			{ name: 'AB', field: 'V_L_ABC_0', unit: 'V' },
			{ name: 'B', field: 'V_f_ABC_1', unit: 'V' },
			{ name: 'BC', field: 'V_L_ABC_1', unit: 'V' },
			{ name: 'C', field: 'V_f_ABC_2', unit: 'V' },
			{ name: 'CA', field: 'V_L_ABC_2', unit: 'V' },
		],
	},
	{
		id: 3,
		name: 'Tensión RST',
		children: [
			{ name: 'R', field: 'V_f_SRT_0', unit: 'V' },
			{ name: 'RS', field: 'V_L_SRT_0', unit: 'V' },
			{ name: 'S', field: 'V_f_SRT_1', unit: 'V' },
			{ name: 'ST', field: 'V_L_SRT_1', unit: 'V' },
			{ name: 'T', field: 'V_f_SRT_2', unit: 'V' },
			{ name: 'TR', field: 'V_L_SRT_2', unit: 'V' },
		],
	},
	{
		id: 4,
		name: 'Potencia',
		children: [
			{ name: 'Aparente (S)', field: 'W_0', unit: 'kVA' },
			{ name: 'FP A', field: 'FP_f_0', unit: '' },
			{ name: 'Activa (P)', field: 'W_1', unit: 'kW' },
			{ name: 'FP B', field: 'FP_f_1', unit: '' },
			{ name: 'Reactiva (Q)', field: 'W_2', unit: 'kVAr' },
			{ name: 'FP C', field: 'FP_f_2', unit: '' },
		],
	},
	{
		id: 5,
		name: 'UPS',
		children: [
			{ name: 'Tensión de batería', field: 'bat_0', unit: 'V' },
			{ name: 'Corriente de carga', field: 'bat_1', unit: 'A' },
			{ name: 'Carga efectiva', field: 'bat_2', unit: '%' },
		],
	},
	{
		id: 6,
		name: 'Frecuencia',
		children: [{ name: 'Frecuencia', field: 'F_ABC', unit: 'Hz' }],
	},
]
