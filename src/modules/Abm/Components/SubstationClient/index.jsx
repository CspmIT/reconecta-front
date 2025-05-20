import { MenuItem, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { FaMinusCircle } from 'react-icons/fa'
import { request } from '../../../../utils/js/request'
import { backend } from '../../../../utils/routes/app.routes'

const SubstationClient = ({ data, onChange, type, handleDeleteClient }) => {
    const handleDelete = () => {
        handleDeleteClient(data.id)
    }

    return (
        <div className='flex w-full gap-3 justify-start mb-3'>

            <TextField
                className='w-full md:w-1/4'
                label='Nombre del cliente'
                value={data.name}
                onChange={(e) => onChange('name', e.target.value)}
            />
            <TextField
                select
                className='w-full md:w-1/4'
                label='Tipo de alimentación'
                value={data.feed}
                onChange={(e) => onChange('feed', e.target.value)}
            >
                <MenuItem key={1} value='1'>
                    Monofásica
                </MenuItem>
                <MenuItem key={2} value='2'>
                    Trifásica
                </MenuItem>
            </TextField>
            <TextField
                className='w-full md:w-1/4'
                label='Potencia del transformador'
                value={data.power}
                onChange={(e) => onChange('power', e.target.value)}
                type='number'
            />
            <TextField
                className='w-full md:w-1/4'
                label='Medición PAT'
                value={data.pat}
                onChange={(e) => onChange('pat', e.target.value)}
                type='number'
            />
            <button type='button' onClick={handleDelete} className='text-red-500'>
                <FaMinusCircle size={25} />
            </button>
        </div>
    )
}

export default SubstationClient
