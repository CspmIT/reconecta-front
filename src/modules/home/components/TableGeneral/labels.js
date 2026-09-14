/*
 * Texto con el que se nombra un equipo fuera de su celda (el tooltip de la fila,
 * por ejemplo). La descripcion va primero porque es lo que identifica al equipo
 * en campo; el modelo queda atras para desempatar entre equipos parecidos.
 */
export const equipmentLabel = (equipment) =>
	[equipment?.observation, equipment?.equipmentmodels?.name].filter(Boolean).join(' - ')
