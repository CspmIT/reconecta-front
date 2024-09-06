import { Circle } from '@mui/icons-material'
import { MenuItem, Select } from '@mui/material'
import React from 'react';
import { FaCheck } from "react-icons/fa";
import MenuListComposition from '../../components/MenuListComposition';

export const ColumnsNot = () => [
    {
        header: 'ID',
        accessorKey: 'id',
        Cell: ({ row }) => {
            return <p className='m-0 p-0 ml-2 text-base'>{`${row.original?.id}`}</p>
        },
    },
    {
        header: 'Evento',
        accessorKey: 'event',
    },
    {
        header: 'Prioridad',
        accessorKey: 'prioridad',
        Cell: ({ row }) => {
            return (
                <Select className=' !text-black !shadow-md'>
                    <MenuItem selected value={0}>Seleccionar...</MenuItem>
                </Select>
            )
        },
    },
    {
        header: 'Destello en Pantalla',
        accessorKey: 'destello',
        Cell: ({ row }) => {
            return (row.original?.destello == 1 ? <FaCheck className='text-green-800  text-3xl' /> : '')
        },
    },
    {
        header: 'Notificación',
        accessorKey: 'notifications',
        Cell: ({ row }) => {
            return (row.original?.notifications == 1 ? <FaCheck className='text-green-800  text-3xl' /> : '')
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

