import { useCallback, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { MainContext } from '../../../context/MainContext'
import AnalyzerBoard from '../../analyzer/board/views'
import BoardMeter from '../../meter/views'
import Board from '../../recloser/views'
import SubstationRuralBoard from '../../substationRural/views'

/*
 * Abre (o enfoca, si ya existe) la pestana del tablero de un equipo y navega a
 * /tabs.
 *
 * El contrato de la pestana es EL MISMO que arma el Home (`home/views`), a
 * proposito: si el `typeEquipment` no coincidiera, abrir el mismo equipo desde
 * dos lugares distintos crearia dos pestanas para lo mismo. Por eso una
 * subestacion rural va con `typeEquipment: 0` (lo que da `type || 0` sobre el
 * equipo placeholder del Home) y no con el 3 que usaba el popup viejo del mapa.
 */

// Fabricas y no elementos ya creados: cada pestana se queda con su propio
// elemento, igual que hacia el `boardEquipment` del Home
const BOARDS = {
	0: () => <SubstationRuralBoard />,
	1: () => <Board />,
	2: () => <BoardMeter />,
	3: () => <AnalyzerBoard />,
}

/**
 * @typedef {Object} DatosTablero
 * @property {number} id id del equipo, o del elemento si es una subestacion
 * @property {string} elementName nombre del elemento, para el titulo
 * @property {number} elementType tipo de elemento (3 = subestacion rural)
 * @property {string} [observation] nombre que le puso el operador al equipo
 * @property {Object} [equipmentmodels] modelo del equipo ({id, name, brand, type})
 * @property {Array} [clients] clientes, solo para subestaciones rurales
 */

/** @returns {(data: DatosTablero) => void} */
export function useOpenBoard() {
	const { tabs, setTabs, setTabCurrent } = useContext(MainContext)
	const navigate = useNavigate()

	return useCallback(
		(data) => {
			const typeEquipment = data.equipmentmodels?.type || 0
			const modelo = data.equipmentmodels
			const name =
				data.elementType === 3
					? data.elementName
					: `${data.elementName} - ${data.observation || `${modelo?.name || ''} ${modelo?.brand || ''}`.trim()}`

			const existente = tabs.findIndex((tab) => tab.id === data.id && tab.typeEquipment === typeEquipment)
			if (existente !== -1) {
				setTabCurrent(existente)
			} else {
				setTabs((prev) => [
					...prev,
					{
						name,
						id: data.id,
						equipmentId: modelo?.id,
						typeEquipment,
						clients: data.clients,
						link: '/board',
						component: BOARDS[typeEquipment]?.(),
					},
				])
				// tabs es el array de ANTES de agregar: su largo es el indice de la nueva
				setTabCurrent(tabs.length)
			}
			navigate('/tabs')
		},
		[tabs, setTabs, setTabCurrent, navigate]
	)
}
