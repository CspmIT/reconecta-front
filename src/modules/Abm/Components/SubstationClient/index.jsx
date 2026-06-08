import { TextField } from '@mui/material'
import React from 'react'
import { FaMinusCircle } from 'react-icons/fa'

const SubstationClient = ({ data, onChange, handleDeleteClient }) => {
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
                className='w-full md:w-1/4'
                label='Medidor'
                value={data.meter}
                onChange={(e) => onChange('meter', e.target.value)}
            />
            <TextField
                className='w-full md:w-1/4'
                label='Cuenta'
                type='number'
                value={data.account ?? ''}
                onChange={(e) => onChange('account', e.target.value)}
            />
            {!data.bd_id && (
                <button type='button' onClick={handleDelete} className='text-red-500'>
                    <FaMinusCircle size={25} />
                </button>
            )}
        </div>
    )
}

export default SubstationClient
