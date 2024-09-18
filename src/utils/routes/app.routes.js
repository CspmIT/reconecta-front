export const front = {
	Cooptech: 'https://cooptech.com.ar',
	'Oficina Virtual': 'https://oficinainterna.cooptech.com.ar',
	Reconecta: 'https://reconecta.cooptech.com.ar',
	'Mas Agua': 'http://localhost:8082',
	Centinela: 'http://localhost:8082',
	Cloud: 'http://localhost:8082',
	Provision: 'http://localhost:8082',
}
export const backend = {
	Cooptech: `${front.Cooptech}/api`,
	'Oficina Virtual': `${front['Oficina Virtual']}/api`,
	Reconecta: `${front.Reconecta}/api`,
	'Mas Agua': `${front['Mas Agua']}/api`,
	Centinela: `${front.Centinela}/api`,
	Cloud: `${front.Cloud}/api`,
	Provision: `${front.Provision}/api`,
}
