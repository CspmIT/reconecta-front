import { Checklist } from '@mui/icons-material'
import { IconButton, Popper } from '@mui/material'
import React, { useState } from 'react'

const FilterNodesButton = ({ filters, handleFilter, indexMap }) => {
    const [anchorEl, setAnchorEl] = useState(null)
    const [open, setOpen] = useState(false)
    const handleOpen = (event) => {
        setOpen(!open)
        setAnchorEl(event.currentTarget)
    }
    return (
        <>
            <IconButton
                className={`!absolute !top-16 !left-4 z-[9999] !bg-slate-300`}
                onClick={handleOpen}
            >
                <Checklist />
            </IconButton>
            <Popper
                className='bg-slate-100 z-40 gap-1 p-2 rounded-lg shadow-md flex flex-col justify-start'
                placement='right-start'
                open={open}
                anchorEl={anchorEl}
            >
                <label className='flex items-center my-2'>
                    <input type='checkbox' className='mr-2 !w-6 !h-6' checked={filters[4]} onClick={() => handleFilter(4, indexMap)} />
                    <b className='text-black dark:text-white'>ET</b>
                </label>
                <label className='flex items-center my-2'>
                    <input type='checkbox' className='mr-2 !w-6 !h-6' checked={filters[1]} onClick={() => handleFilter(1, indexMap)} />
                    <b className='text-black dark:text-white'>Reconexión</b>
                </label>
                <label className='flex items-center my-2'>
                    <input type='checkbox' className='mr-2 !w-6 !h-6' checked={filters[2]} onClick={() => handleFilter(2, indexMap)} />
                    <b className='text-black dark:text-white'>Subestacion urbana</b>
                </label>
                <label className='flex items-center my-2'>
                    <input type='checkbox' className='mr-2 !w-6 !h-6' checked={filters[3]} onClick={() => handleFilter(3, indexMap)} />
                    <b className='text-black dark:text-white'>Subestacion rural</b>
                </label>
                <label className='flex items-center my-2'>
                    <input type='checkbox' className='mr-2 !w-6 !h-6' checked={filters[5]} onClick={() => handleFilter(5, indexMap)} />
                    <b className='text-black dark:text-white'>Consumos puntuales</b>
                </label>
            </Popper>

        </>
    )
}

export default FilterNodesButton