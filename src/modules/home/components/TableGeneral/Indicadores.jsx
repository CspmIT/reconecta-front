import { FaBolt, FaBatteryHalf } from 'react-icons/fa6'
import { MdSettingsRemote, MdPanTool } from 'react-icons/md'
import { SIN_DATO } from '../../utils/measures'

/*
 * Alimentacion y modo son dos estados binarios que antes ocupaban una columna de
 * texto cada uno ("Red Electrica" / "Batería", "Local" / "Remoto") repetido en
 * todas las filas. Van como icono: el estado normal queda gris y callado, y solo
 * el que condiciona la operacion — bateria, o local, que no admite telecomando —
 * se pinta en ambar y ademas escribe la palabra.
 */
const QUIETO = 'text-gray-400 dark:text-gray-300'
const ATENTO = 'text-amber-700 dark:text-amber-400'

function Indicador({ Icon, label, title, atento, conTexto, size = 18 }) {
    return (
        <span
            className={`inline-flex items-center gap-x-1.5 whitespace-nowrap ${atento ? ATENTO : QUIETO}`}
            title={title}
        >
            <Icon size={size} className='shrink-0' />
            {(atento || conTexto) && (
                <span className={`text-[13px] ${atento ? 'font-semibold' : 'text-gray-600 dark:text-gray-200'}`}>{label}</span>
            )}
        </span>
    )
}

function SinDato({ title }) {
    return <span className={QUIETO} title={title}>{SIN_DATO}</span>
}

// influxData.ac: 1 alimentado de la red, 0 andando solo con la bateria
export function Alimentacion({ value, conTexto }) {
    if (value === 1) return <Indicador Icon={FaBolt} label='Red' title='Alimentado desde la red' conTexto={conTexto} />
    if (value === 0) return <Indicador Icon={FaBatteryHalf} label='Batería' title='Sólo batería' atento conTexto={conTexto} />
    return <SinDato title='Alimentación desconocida' />
}

// influxData.local: 1 en sitio (no se puede telecomandar), 0 remoto
export function Modo({ value, conTexto }) {
    if (value === 0) return <Indicador Icon={MdSettingsRemote} label='Remoto' title='Remoto — admite telecomando' conTexto={conTexto} />
    if (value === 1) return <Indicador Icon={MdPanTool} label='Local' title='Local — sólo operación en sitio' atento conTexto={conTexto} />
    return <SinDato title='Modo desconocido' />
}
