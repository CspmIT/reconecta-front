import { Fab } from '@mui/material'
import { FaCheckCircle, FaCircle, FaTimes } from 'react-icons/fa'
import { FaPen, FaTableCellsLarge } from 'react-icons/fa6'
import { useNavigate } from 'react-router-dom'

const BORDER_CLASSES = {
    0: 'border-l-green-600',
    1: 'border-l-amber-600',
    2: 'border-l-red-600',
    3: 'border-l-purple-600'
}

function Field({ label, children }) {
    return (
        <div className='text-sm flex items-center gap-x-1'>
            <span className='font-semibold'>{label}:</span>
            <span>{children}</span>
        </div>
    )
}

function ConexionIndicator({ influxData }) {
    return influxData?.['d/c'] ? (
        <span className='flex items-center gap-x-1'>
            <FaCheckCircle size={16} className='text-green-700' /> Online
        </span>
    ) : (
        <span className='flex items-center gap-x-1'>
            <FaTimes size={16} className='text-red-700' /> Sin señal
        </span>
    )
}

function EquipmentCard({ equipment, row, filtersColumns, handleSelected }) {
    const value = equipment.influxData?.['d/c']?.[0]?.value
    const ac = equipment.influxData?.['ac']?.[0]?.value
    const local = equipment.influxData?.['local']?.[0]?.value
    return (
        <div className={`${BORDER_CLASSES[equipment.equipmentmodels.type]} border-l-8 p-3 border-b border-gray-400 my-1`}>
            <div className='flex justify-between items-center mb-2 gap-2'>
                <div className='flex-1 min-w-0'>
                    <div className='font-semibold truncate'>
                        {equipment.equipmentmodels.name} {equipment.equipmentmodels.brand}
                    </div>
                    {equipment.observation && (
                        <div className='text-xs text-gray-600 dark:text-gray-300'>{equipment.observation}</div>
                    )}
                </div>
                <Fab size='small' className='!bg-blue-300 !z-0 !shrink-0' onClick={() => handleSelected(equipment, row)}>
                    <FaTableCellsLarge />
                </Fab>
            </div>
            <div className='grid grid-cols-1 gap-y-2'>
                {filtersColumns[2] && <Field label='Nro de serie'>{equipment.serial}</Field>}
                {filtersColumns[3] && equipment.equipmentmodels.type === 1 && (
                    <Field label='Estado'>
                        <span className='flex items-center gap-x-1'>
                            <FaCircle className={`${value === 1 ? 'text-red-500' : value === 0 ? 'text-green-500' : 'text-yellow-500'}`} />
                            {value === 1 ? 'Cerrado' : value === 0 ? 'Abierto' : 'Desconocido'}
                        </span>
                    </Field>
                )}
                {filtersColumns[4] && (
                    <Field label='Conexión'><ConexionIndicator influxData={equipment.influxData} /></Field>
                )}
                {filtersColumns[8] && equipment.equipmentmodels.type === 1 && (
                    <Field label='Alimentación'>
                        {ac === 1 ? 'Red Electrica' : ac === 0 ? 'Batería' : 'Desconocido'}
                    </Field>
                )}
                {filtersColumns[9] && equipment.equipmentmodels.type === 1 && (
                    <Field label='Modo'>
                        {local === 1 ? 'Local' : local === 0 ? 'Remoto' : 'Desconocido'}
                    </Field>
                )}
            </div>
        </div>
    )
}

function ClientCard({ client, row, filtersColumns, handleSelected, showButton }) {
    return (
        <div className={`${BORDER_CLASSES[0]} border-l-8 p-3 border-b border-gray-200 dark:border-gray-700`}>
            <div className='flex justify-between items-center mb-2 gap-2'>
                <div className='flex-1 min-w-0 font-semibold truncate'>{client.name}</div>
                {showButton && (
                    <Fab size='small' className='!bg-blue-300 !z-0 !shrink-0' onClick={() => handleSelected({}, row)}>
                        <FaTableCellsLarge />
                    </Fab>
                )}
            </div>
            <div className='grid grid-cols-1 gap-x-3 gap-y-1'>
                {filtersColumns[2] && <Field label='Nro de serie'>{client.meter}</Field>}
                {filtersColumns[3] && (
                    <Field label='Estado'>
                        <span className='flex items-center gap-x-1'>
                            <FaCircle className={`${client.status ? 'text-red-500' : 'text-green-500'}`} />
                            {client.status ? 'En servicio' : 'Fuera de servicio'}
                        </span>
                    </Field>
                )}
            </div>
        </div>
    )
}

export default function MobileList({ elementsFiltered, filtersColumns, handleSelected }) {
    const navigate = useNavigate()
    const showLocation = filtersColumns[5] || filtersColumns[6] || filtersColumns[7]
    return (
        <div className='w-full flex flex-col bg-white dark:bg-zinc-500 rounded-md'>
            {elementsFiltered.map((row) => {
                const isClientGroup = row.type === 3
                const count = isClientGroup ? row.clients.length : row.equipments.length
                const countLabel = `${count} equipos`
                return (
                    <div key={row.id} className='flex flex-col mt-3'>
                        <div className='rounded-lg sticky top-0 bg-amber-200 dark:bg-amber-700 p-3 flex justify-between items-center border-b-2 border-gray-400 dark:border-gray-700'>
                            <div className='flex flex-col flex-1 min-w-0'>
                                <div className='flex items-center gap-x-2'>
                                    <span className='font-bold text-base truncate'>{row.name}</span>
                                    {count > 1 && (
                                        <span className='text-xs px-2 py-0.5 rounded-full bg-gray-500 text-white shrink-0'>{countLabel}</span>
                                    )}
                                </div>
                                {row.description && (
                                    <span className='text-sm truncate'>{row.description}</span>
                                )}
                                {showLocation && (
                                    <div className='flex flex-wrap gap-x-3 mt-1 text-xs'>
                                        {filtersColumns[5] && <span><strong>Lat:</strong> {row.lat}</span>}
                                        {filtersColumns[6] && <span><strong>Lon:</strong> {row.lon}</span>}
                                        {filtersColumns[7] && <span><strong>Pot:</strong> {row.power}</span>}
                                    </div>
                                )}
                            </div>
                            <Fab title='Editar nodo' size='small' className='!bg-yellow-400 !z-0 !shrink-0' onClick={() => navigate(`/editElement/${row.id}`)}>
                                <FaPen />
                            </Fab>
                        </div>
                        <div className='relative flex flex-col pl-4'>
                            <div className='absolute left-2 top-0 bottom-0 border-l-2 border-dashed border-amber-300 dark:border-amber-700' />
                            {!isClientGroup
                                ? row.equipments.map((equipment, idx) => (
                                    <EquipmentCard
                                        key={`${row.id}-${idx}`}
                                        equipment={equipment}
                                        row={row}
                                        filtersColumns={filtersColumns}
                                        handleSelected={handleSelected}
                                    />
                                ))
                                : row.clients.map((client, idx) => (
                                    <ClientCard
                                        key={`${row.id}-${idx}`}
                                        client={client}
                                        row={row}
                                        filtersColumns={filtersColumns}
                                        handleSelected={handleSelected}
                                        showButton={idx === 0}
                                    />
                                ))
                            }
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
