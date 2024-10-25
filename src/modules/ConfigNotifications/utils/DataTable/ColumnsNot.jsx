import React from 'react';

export const ColumnsNot = (handlePriority, handleCheck) => [
    {
        header: 'ID',
        accessorKey: 'id',
        muiTableHeadCellProps: {
            style: { minWidth: '3ch', maxWidth: '3ch' },
        },
        muiTableBodyCellProps: {
            style: { minWidth: '3ch', maxWidth: '3ch' },
        },
    },
    {
        header: 'Evento',
        accessorKey: 'event',
    },
    {
        header: 'Prioridad',
        accessorKey: 'prioridad',
        muiTableBodyCellProps: {
			align: 'center',
		},
		muiTableHeadCellProps: {
			align: 'center',
		},
        Cell: ({ row }) => {
            const handleChange = (event) => {
                handlePriority(row.original.id, event.target.value);
            };

            return (
                <select
                    value={row.original.prioridad || ''}
                    onChange={handleChange}
                    style={{
                        padding: '3px',
                        fontSize: '0.75rem',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        background: 'white'
                    }}
                >
                    <option value={1}>ALTA</option>
                    <option value={2}>SIN MODIFICAR</option>
                    <option value={3}>BAJA</option>
                </select>
            );
        },
    },
    {
        header: 'Destello en Pantalla',
        accessorKey: 'destello',
        muiTableBodyCellProps: {
			align: 'center',
		},
		muiTableHeadCellProps: {
			align: 'center',
		},
        Cell: ({ row }) => {
            const handleChange = () => {
                handleCheck(row.original.id, 'destello');
            };

            return <input type="checkbox" style={{height: '18px', width: '18px'}} checked={row.original.destello === 1} onChange={handleChange} />;
        },
    },
    {
        header: 'Notificación',
        accessorKey: 'notifications',
        muiTableBodyCellProps: {
			align: 'center',
		},
		muiTableHeadCellProps: {
			align: 'center',
		},
        Cell: ({ row }) => {
            const handleChange = () => {
                handleCheck(row.original.id, 'notifications');
            };

            return <input type="checkbox" style={{height: '18px', width: '18px'}} checked={row.original.notifications === 1} onChange={handleChange} />;
        },
    },
];
