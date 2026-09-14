import { Button, Portal } from '@mui/material'

/*
 * Barra de guardado, fija abajo a la derecha. Antes el boton vivia al final de
 * la pantalla y con el scroll quedaba fuera de vista: el usuario tocaba las
 * tarjetas y se iba creyendo que se guardaba solo. Por eso se muestra siempre,
 * incluso sin cambios, y avisa en que estado esta.
 *
 * Va en un portal al body porque el contenedor del Outlet (modules/core/views)
 * crea su propio contexto de apilado con z-10: desde adentro, ningun z-index
 * alcanza para pasarle al footer, que es hermano con z-50. El valor queda arriba
 * del footer y debajo de los 1060 de SweetAlert, para no cruzarse con los
 * dialogos de confirmacion.
 */
const SaveBar = ({ dirty, saving, onSave }) => {
	return (
		<Portal>
			<div
				style={{ zIndex: 1050 }}
				className={`fixed bottom-4 right-4 left-4 sm:left-auto flex items-center justify-between sm:justify-start gap-3 rounded-2xl border shadow-lg px-4 py-3 bg-white dark:bg-zinc-800 ${
					dirty ? 'border-amber-400 dark:border-amber-500' : 'border-zinc-200 dark:border-gray-700'
				}`}
			>
				<span className={`text-sm ${dirty ? 'text-amber-600 dark:text-amber-400' : 'text-slate-500 dark:text-gray-400'}`}>
					{dirty ? 'Hay cambios sin guardar' : 'Todo guardado'}
				</span>
				<Button variant='contained' onClick={onSave} disabled={saving || !dirty}>
					{saving ? 'Guardando…' : 'Guardar'}
				</Button>
			</div>
		</Portal>
	)
}

export default SaveBar
