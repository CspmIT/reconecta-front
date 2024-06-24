import imgAgua from '../assets/img/MasAgua_Full.png'
import imgCentinela from '../assets/img/Centinela_Full.png'
import imgCloud from '../assets/logos/Cloud.png'
import imgOfcicina from '../assets/img/Oficina_Full.png'
import imgReconecta from '../assets/img/Reconecta_Full.png'
import imgProVision from '../assets/img/ProVision_Full.png'
import logoAgua from '../assets/logos/MasAgua.png'
import logoCentinela from '../assets/logos/Centinela.png'
import logoOfcicina from '../assets/logos/Oficina.png'
import logoReconecta from '../assets/logos/Reconecta.png'
import logoProVision from '../assets/logos/ProVision.png'
export const getImgApp = () => {
	const urlMap = {
		'Oficina Virtual': imgOfcicina,
		Reconecta: imgReconecta,
		'Mas Agua': imgAgua,
		Centinela: imgCentinela,
		Cloud: imgCloud,
		Provision: imgProVision,
	}
	const url = urlMap[import.meta.env.VITE_APP_NAME]
	return url
}
export const getLogo = (name) => {
	const urlMap = {
		'Oficina Virtual': logoOfcicina,
		Reconecta: logoReconecta,
		'Mas Agua': logoAgua,
		Centinela: logoCentinela,
		Cloud: imgCloud,
		Provision: logoProVision,
	}
	const url = urlMap[name]
	return url
}
