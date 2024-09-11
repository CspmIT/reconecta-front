import React from 'react';
import { FaCheck } from "react-icons/fa";
import MenuListComposition from '../../components/MenuListComposition';

export const ColumnsNot = () => [
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
            const priorityMap = {
                1: { color: 'text-red-500', value: 'ALTA' },
                2: { color: '', value: 'SIN MODIFICAR' },
                3: { color: 'text-green-500', value: 'BAJA' },
            };
        
            const { color, value } = priorityMap[row.original?.prioridad] || { color: '', value: '' };
        
            return <b className={`m-0 p-0 ml-2 text-base ${color}`}>{value}</b>;
        },
    },
    {
        header: 'Destello en Pantalla',
        accessorKey: 'destello',
        Cell: ({ row }) => {
            return (row.original?.destello == 1 ? <FaCheck className='text-green-800 dark:text-green-500  text-3xl' /> : '')
        },
    },
    {
        header: 'Notificación',
        accessorKey: 'notifications',
        Cell: ({ row }) => {
            return (row.original?.notifications == 1 ? <FaCheck className='text-green-800 dark:text-green-500  text-3xl' /> : '')
        },
    },
    {
        header: '',
        accessorKey: 'actions',
        size: 20,
        Cell: ({ row }) => {
            return (
                <div className='flex items-center w-full'>
                    <MenuListComposition id={row.original?.id} />
                </div>
            );
        },
    },
]

