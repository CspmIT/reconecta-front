import React from 'react';
import { MenuItem, Select } from '@mui/material';

export const ColumnsNot = (handlePriority, handleCheck) => [
    {
        header: 'ID',
        accessorKey: 'id',
    },
    {
        header: 'Evento',
        accessorKey: 'event',
    },
    {
        header: 'Prioridad',
        accessorKey: 'prioridad',
        Cell: ({ row }) => {
            const handleChange = (event) => {
                handlePriority(row.original.id, event.target.value);
            };

            return (
                <Select
                    id="priority"
                    value={row.original.prioridad || ''}
                    onChange={handleChange}
                >
                    <MenuItem value={1}>ALTA</MenuItem>
                    <MenuItem value={2}>SIN MODIFICAR</MenuItem>
                    <MenuItem value={3}>BAJA</MenuItem>
                </Select>
            );
        },
    },
    {
        header: 'Destello en Pantalla',
        accessorKey: 'destello',
        Cell: ({ row }) => {
            const handleChange = () => {
                handleCheck(row.original.id, 'destello');
            };

            return <input type="checkbox" checked={row.original.destello === 1} onChange={handleChange} />;
        },
    },
    {
        header: 'Notificación',
        accessorKey: 'notifications',
        Cell: ({ row }) => {
            const handleChange = () => {
                handleCheck(row.original.id, 'notifications');
            };

            return <input type="checkbox" checked={row.original.notifications === 1} onChange={handleChange} />;
        },
    },
];
