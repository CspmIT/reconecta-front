import { powerRows, voltageRows, currentRows } from '../../utils/measures'

const ROWS = {
    power: powerRows,
    voltage: voltageRows,
    current: currentRows
}

/*
 * Las tres fases apiladas dentro de una celda.
 *
 * Va en letra chica y con el interlineado justo a proposito: son tres lineas por
 * celda y con el cuerpo del resto de la tabla estirarian todas las filas. Asi
 * las tres entran en menos alto que la celda del equipo, que ya trae nombre y
 * observacion, y la fila no crece por estas columnas.
 *
 * La etiqueta tiene ancho fijo para que los numeros de las tres fases arranquen
 * en la misma columna y se puedan comparar de un vistazo.
 */
export default function PhaseValues({ measures, magnitude, title }) {
    const rows = ROWS[magnitude](measures)
    return (
        <div
            className='grid grid-cols-[1.7em_auto] gap-x-1 items-baseline leading-[1.25] text-[13px] tabular-nums w-fit'
            title={title}
        >
            {rows.map(({ label, text }, index) => (
                <div key={label ?? index} className='contents'>
                    <span className='text-[10px] text-gray-500 dark:text-gray-200'>{label}</span>
                    <span className='whitespace-nowrap text-right'>{text}</span>
                </div>
            ))}
        </div>
    )
}
