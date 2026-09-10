import { createContext, useContext, useMemo, useState } from 'react'

/*
 * El indicador por el que esta filtrada la tabla del Home, o null.
 *
 * El panel de tarjetas y la tabla son hermanos —el panel lo dibuja la vista del
 * Home en escritorio y la barra de TabHome en el telefono, la tabla siempre
 * TabHome—, asi que no hay padre comun al que subir el estado sin pasarlo por
 * media docena de props. Un contexto chico provisto en la vista del Home los
 * conecta sin acoplarlos entre si.
 *
 * Guarda la CLAVE de la tarjeta y no un predicado: el predicado vive en el
 * catalogo (ver `matches` en listCard), que es lo que garantiza que el numero de
 * la tarjeta y las filas filtradas hablen de lo mismo.
 */
const DashboardFilterContext = createContext({ filtro: null, setFiltro: () => {} })

export function DashboardFilterProvider({ children }) {
	const [filtro, setFiltro] = useState(null)
	const valor = useMemo(() => ({ filtro, setFiltro }), [filtro])
	return <DashboardFilterContext.Provider value={valor}>{children}</DashboardFilterContext.Provider>
}

export const useDashboardFilter = () => useContext(DashboardFilterContext)
