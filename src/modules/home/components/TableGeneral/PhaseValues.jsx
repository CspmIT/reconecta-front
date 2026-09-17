import { powerRows, voltageRows, currentRows, hayDesbalance } from '../../utils/measures'

const ROWS = {
    power: powerRows,
    voltage: voltageRows,
    current: currentRows
}

// La potencia son tres magnitudes distintas (S, P, Q): no tiene sentido
// compararlas entre si, asi que el desbalance se mira solo en fases
const VALUES = {
    voltage: (measures) => measures?.vPhase,
    current: (measures) => measures?.i
}

/*
 * Las tres fases apiladas dentro de una celda.
 *
 * Va en letra chica y con el interlineado justo a proposito: son tres lineas por
 * celda y con el cuerpo del resto de la tabla estirarian todas las filas. Asi
 * las tres entran en menos alto que la celda del equipo, que ya trae nombre y
 * observacion, y la fila no crece por estas columnas.
 *
 * Tres sub-columnas: etiqueta | valor | unidad. El valor va alineado a la
 * derecha y la unidad arranca despues, en su propia columna: asi la unidad no
 * empuja al numero y los tres quedan con el borde derecho parejo, aunque una
 * fase venga en kV y otra sin dato. Las unidades no se pueden subir al
 * encabezado porque no son las mismas para todos los equipos: el reconectador
 * publica kV y el analizador V (ver measures.js).
 */
export default function PhaseValues({ measures, magnitude, title }) {
    const rows = ROWS[magnitude](measures)
    const desbalanceada = VALUES[magnitude] ? hayDesbalance(VALUES[magnitude](measures)) : false
    return (
        <div
            className='grid grid-cols-[auto_1fr_auto] gap-x-[6px] items-baseline leading-[1.35] text-[13px] tabular-nums w-fit'
            title={desbalanceada ? `${title ?? ''}${title ? ' · ' : ''}Fases desbalanceadas` : title}
        >
            {rows.map(({ label, value, unit }, index) => (
                <div key={label ?? index} className='contents'>
                    <span className='text-[10px] text-gray-500 dark:text-gray-300'>{label}</span>
                    <span
                        className={`whitespace-nowrap text-right font-semibold tracking-[-0.01em] ${desbalanceada ? 'text-amber-700 dark:text-amber-400' : ''}`}
                    >
                        {value}
                    </span>
                    <span className='text-[10.5px] text-gray-500 dark:text-gray-300'>{unit}</span>
                </div>
            ))}
        </div>
    )
}
