import TableCustom from '../../../../components/TableCustom'

function TableDashboar() {
    const columns = [
        {
            header: 'Nº',
            accessorKey: 'Nro_recloser'
        },
        {
            header: 'Nombre',
            accessorKey: 'Name'
        },
        {
            header: 'Numero de Serie',
            accessorKey: 'Nro_Serie'
        },
        {
            header: 'Tipo',
            accessorKey: 'type_recloser'
        },
        {
            header: 'Estado',
            accessorKey: 'status'
        },
        {
            header: 'Alarma',
            accessorKey: 'alarm_recloser'
        }
    ]

    return (
        <div className='pb-3'>
            <TableCustom data={[]} columns={columns} />
        </div>
    )
}

export default TableDashboar
